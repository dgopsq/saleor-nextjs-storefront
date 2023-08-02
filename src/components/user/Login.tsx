"use client";

import { getFragmentData } from "@/__generated__";
import {
  CheckoutAttachDocument,
  CreateTokenDocument,
  GenericUserFragmentDoc,
} from "@/__generated__/graphql";
import { PageHeading } from "@/components/core/Headings";
import { Link } from "@/components/core/Link";
import { LoginForm } from "@/components/core/LoginForm";
import { errorToast, successToast } from "@/components/core/Notifications";
import { AccountConfirmation } from "@/components/user/AccountConfirmations";
import { publicConfig } from "@/misc/config";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { logger } from "@/misc/logger";
import { signupRoute } from "@/misc/navigation";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

/**
 *
 */
export const Login: React.FC = () => {
  const t = useTranslations("User");
  const [createToken, { loading, data }] = useMutation(CreateTokenDocument);
  const [checkoutAttach] = useMutation(CheckoutAttachDocument);
  const checkout = useCheckoutInfo();

  const handleSubmit = useCallback(
    async (values: LoginForm) => {
      logger.debug("Executing user authentication.");

      const createTokenRes = await createToken({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      const createTokenData = createTokenRes.data ?? null;

      if (!createTokenData) {
        logger.error("Error while creating the account", createTokenRes.errors);
        return;
      }

      logger.debug("Token creaded successfully, user authenticated.");

      const maybeToken = createTokenData.tokenCreate?.token ?? null;
      const maybeRefreshToken =
        createTokenData.tokenCreate?.refreshToken ?? null;
      const maybeUserFragment =
        getFragmentData(
          GenericUserFragmentDoc,
          createTokenData.tokenCreate?.user
        ) ?? null;
      const maybeUserLastCheckoutId: string | null =
        maybeUserFragment?.checkouts?.edges[0]?.node.id ?? null;

      if (!maybeToken || !maybeRefreshToken) {
        logger.warn(
          "Token or RefreshToken not found, probably a login with wrong credentials."
        );

        return;
      }

      logger.debug("Auth and Refresh Token found, creating cookies.");

      Cookies.set(publicConfig.userTokenStorageKey, maybeToken);
      Cookies.set(publicConfig.userRefreshTokenStorageKey, maybeRefreshToken);

      if (checkout.data?.lines?.length) {
        logger.debug(
          "There are items in the current checkout, assigning to user."
        );

        // FIXME: What happens if this fails?
        // We should probably set the `maybeUserLastCheckoutId`
        // as the new checkout in that specific case.
        await checkoutAttach({
          variables: {
            checkoutId: checkout.data.id,
          },
          context: {
            headers: {
              // Here the client could not yet have the token.
              Authorization: `Bearer ${maybeToken}`,
            },
          },
        });
      } else if (maybeUserLastCheckoutId) {
        logger.debug("Checkout Token found, creating the cookie.");

        Cookies.set(publicConfig.checkoutIdStorageKey, maybeUserLastCheckoutId);
      }

      window.location.href = "/account";
    },
    [createToken, checkout, checkoutAttach]
  );

  useEffect(() => {
    if (!data?.tokenCreate) return;

    if (data.tokenCreate.errors.length)
      errorToast(t("Something went wrong, please try again"));
    else successToast(t("Login successful, redirecting to your account"));
  }, [data, t]);

  return (
    <>
      <div className="w-full">
        <PageHeading>{t("Login")}</PageHeading>

        <div className="mt-10">
          <LoginForm onSubmit={handleSubmit} isLoading={loading} />
        </div>

        <div className="mt-2">
          <div className="mt-8 flex flex-row justify-center">
            <p className="text-sm text-gray-600 text-center">
              {t("Don't have an account yet?") + " "}
              <Link href={signupRoute}>{t("Signup here")}</Link>
            </p>
          </div>
        </div>
      </div>

      <AccountConfirmation />
    </>
  );
};
