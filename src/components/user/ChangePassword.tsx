"use client";

import { UserPasswordChangeDocument } from "@/__generated__/graphql";
import { ChangePasswordForm } from "@/components/core/ChangePasswordForm";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";

/**
 *
 */
export const ChangePassword: React.FC = () => {
  const [changePassword, { loading, data }] = useMutation(
    UserPasswordChangeDocument
  );

  const handleSubmit = useCallback(
    (data: ChangePasswordForm) => {
      changePassword({
        variables: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        errorPolicy: "ignore",
      });
    },
    [changePassword]
  );

  useEffect(() => {
    if (data?.passwordChange?.user)
      successToast("Password changed successfully");
    else if (data?.passwordChange?.errors.length) {
      logger.error("Password change errors", data.passwordChange.errors);
      errorToast("Something went wrong while changing your password");
    }
  }, [data]);

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold">Password</h3>

      <div className="mt-8">
        <ChangePasswordForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};
