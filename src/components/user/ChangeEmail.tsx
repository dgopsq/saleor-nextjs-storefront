"use client";

import { UserEmailChangeDocument } from "@/__generated__/graphql";
import { ChangeEmailForm } from "@/components/core/ChangeEmailForm";
import { errorToast, successToast } from "@/components/core/Notifications";
import { publicConfig } from "@/misc/config";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";

/**
 *
 */
export const ChangeEmail: React.FC = () => {
  const [changeEmail, { loading, data }] = useMutation(UserEmailChangeDocument);

  const handleSubmit = useCallback(
    (data: ChangeEmailForm) => {
      changeEmail({
        variables: {
          password: data.oldPassword,
          newEmail: data.newEmail,
          redirectUrl: publicConfig.emailChangeRedirectUrl,
        },
        errorPolicy: "ignore",
      });
    },
    [changeEmail]
  );

  useEffect(() => {
    if (data?.requestEmailChange?.user)
      successToast("Request sent successfully, check your email");
    else if (data?.requestEmailChange?.errors.length) {
      logger.error("Password change errors", data.requestEmailChange.errors);
      errorToast("Something went wrong while changing your email");
    }
  }, [data]);

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold">Change email</h3>

      <div className="mt-8">
        <ChangeEmailForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};
