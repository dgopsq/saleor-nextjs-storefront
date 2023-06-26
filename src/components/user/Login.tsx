"use client";

import { CreateTokenDocument } from "@/__generated__/graphql";
import { setUserTokensCookies } from "@/app/account/@auth/login/actions";
import { ErrorAlert, SuccessAlert } from "@/components/core/Alert";
import { LoginForm } from "@/components/core/LoginForm";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { P, match } from "ts-pattern";
import { useIsFirstRender, useUpdateEffect } from "usehooks-ts";

/**
 *
 */
export const Login: React.FC = () => {
  const [transitionPending, startTransition] = useTransition();
  const [createAccount, { loading, error, data }] =
    useMutation(CreateTokenDocument);
  const router = useRouter();

  const handleSubmit = useCallback(
    (values: LoginForm) => {
      createAccount({
        variables: {
          email: values.email,
          password: values.password,
        },
        onCompleted: (data) => {
          const maybeToken = data.tokenCreate?.token ?? null;
          const maybeRefreshToken = data.tokenCreate?.refreshToken ?? null;

          if (maybeToken && maybeRefreshToken) {
            startTransition(() =>
              setUserTokensCookies(maybeToken, maybeRefreshToken)
            );
          }
        },
      });
    },
    [createAccount, startTransition]
  );

  useUpdateEffect(() => {
    if (!transitionPending) router.push("/account");
  }, [transitionPending, router]);

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
