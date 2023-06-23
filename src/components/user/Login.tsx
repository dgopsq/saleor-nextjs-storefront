"use client";

import {
  CreateAccountDocument,
  CreateTokenDocument,
} from "@/__generated__/graphql";
import { ErrorAlert, SuccessAlert } from "@/components/core/Alert";
import { LoginForm } from "@/components/core/LoginForm";
import { SignupForm } from "@/components/core/SignupForm";
import { publicConfig } from "@/misc/config";
import { useMutation } from "@apollo/client";
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
      createAccount({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
    },
    [createAccount]
  );

  const signupErrors = data?.tokenCreate?.errors ?? [];

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
            <SuccessAlert text="Login successful!" />
          </div>
        ))
        .otherwise(() => null)}

      <div>
        <LoginForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};
