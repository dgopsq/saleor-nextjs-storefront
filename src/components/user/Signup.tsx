"use client";

import { CreateAccountDocument } from "@/__generated__/graphql";
import { PageHeading } from "@/components/core/Headings";
import { Link } from "@/components/core/Link";
import { errorToast, successToast } from "@/components/core/Notifications";
import { SignupForm } from "@/components/core/SignupForm";
import { publicConfig } from "@/misc/config";
import { useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";

type Props = {
  hideLoginLink?: boolean;
  initialValues?: Partial<SignupForm>;
};

/**
 *
 */
export const Signup: React.FC<Props> = ({ hideLoginLink, initialValues }) => {
  const [createAccount, { loading, data }] = useMutation(CreateAccountDocument);

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

  useEffect(() => {
    if (!data?.accountRegister) return;

    if (data?.accountRegister.errors.length > 0)
      errorToast("Something went wrong, please try again.");
    else successToast("Account created successfully, check your email.");
  }, [data]);

  return (
    <div className="w-full">
      <PageHeading>Signup</PageHeading>

      <div className="mt-10">
        <SignupForm
          onSubmit={handleSubmit}
          isLoading={loading}
          initialValues={initialValues}
        />
      </div>

      {!hideLoginLink ? (
        <div className="mt-8 flex flex-row justify-center">
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link href="/account/login">Login here</Link>
          </p>
        </div>
      ) : undefined}
    </div>
  );
};
