"use client";

import { CreateAccountDocument } from "@/__generated__/graphql";
import { ErrorAlert, SuccessAlert } from "@/components/core/Alert";
import { SignupForm } from "@/components/core/SignupForm";
import { publicConfig } from "@/misc/config";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { P, match } from "ts-pattern";

/**
 *
 */
export const Signup: React.FC = () => {
  const [createAccount, { loading, error, data }] = useMutation(
    CreateAccountDocument
  );

  const handleSubmit = useCallback(
    (values: SignupForm) => {
      createAccount({
        variables: {
          account: { ...values, redirectUrl: publicConfig.signupRedirectUrl },
        },
      });
    },
    [createAccount]
  );

  const signupErrors = data?.accountRegister?.errors ?? [];

  return (
    <div>
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
            <SuccessAlert text="Signup successful!" />
          </div>
        ))
        .otherwise(() => null)}

      <div>
        <SignupForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};
