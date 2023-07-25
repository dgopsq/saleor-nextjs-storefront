"use client";

import { getFragmentData } from "@/__generated__";
import {
  CreateTokenDocument,
  GenericUserFragmentDoc,
} from "@/__generated__/graphql";
import { ErrorAlert, SuccessAlert } from "@/components/core/Alert";
import { LoginForm } from "@/components/core/LoginForm";
import { publicConfig } from "@/misc/config";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import Link from "next/link";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

/**
 *
 */
export const Login: React.FC = () => {
  const [createAccount, { loading, error, data }] =
    useMutation(CreateTokenDocument);

  const handleSubmit = useCallback(
    (values: LoginForm) => {
      logger.debug("Executing user authentication.");

      createAccount({
        variables: {
          email: values.email,
          password: values.password,
        },
        onCompleted: (data) => {
          logger.debug("Token creaded successfully, user authenticated.");

          const maybeToken = data.tokenCreate?.token ?? null;
          const maybeRefreshToken = data.tokenCreate?.refreshToken ?? null;
          const maybeUserFragment =
            getFragmentData(GenericUserFragmentDoc, data.tokenCreate?.user) ??
            null;
          const maybeCheckoutId: string | null =
            maybeUserFragment?.checkouts?.edges[0]?.node.id ?? null;

          if (maybeToken && maybeRefreshToken) {
            logger.debug("Auth and Refresh Token found, creating cookies.");

            Cookies.set(publicConfig.userTokenStorageKey, maybeToken);
            Cookies.set(
              publicConfig.userRefreshTokenStorageKey,
              maybeRefreshToken
            );
          }

          if (maybeCheckoutId) {
            logger.debug("Checkout Token found, creating the cookie.");

            Cookies.set(publicConfig.checkoutIdStorageKey, maybeCheckoutId);
          }

          window.location.href = "/account";
        },
      });
    },
    [createAccount]
  );

  const signupErrors = data?.tokenCreate?.errors ?? [];

  return (
    <div className="w-full">
      {match([signupErrors, error, data])
        .with(
          P.union([P.not([]), P._, P._], [P._, P.not(P.nullish), P._]),
          () => (
            <div className="mb-10">
              <ErrorAlert
                text={`Something went wrong, our team is investigatint the issue.`}
              />
            </div>
          )
        )
        .with([[], P.nullish, P.not(P.nullish)], () => (
          <div className="mb-10">
            <SuccessAlert text="Login successful!" />
          </div>
        ))
        .otherwise(() => null)}

      <div>
        <LoginForm onSubmit={handleSubmit} isLoading={loading} />
      </div>

      <div className="mt-2">
        <Link href="/account/signup">Signup</Link>
      </div>
    </div>
  );
};
