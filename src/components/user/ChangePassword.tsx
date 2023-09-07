"use client";

import { UserPasswordChangeDocument } from "@/__generated__/graphql";
import { ChangePasswordForm } from "@/components/core/ChangePasswordForm";
import { SectionHeading } from "@/components/core/Headings";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

/**
 * Renders the page to change the user's password.
 */
export const ChangePassword: React.FC = () => {
  const t = useTranslations("User");
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
      successToast(t("Password changed successfully"));
    else if (data?.passwordChange?.errors.length) {
      logger.error("Password change errors", data.passwordChange.errors);
      errorToast(t("Something went wrong while changing your password"));
    }
  }, [data, t]);

  return (
    <div className="w-full">
      <SectionHeading>{t("Password")}</SectionHeading>

      <div className="mt-8">
        <ChangePasswordForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};
