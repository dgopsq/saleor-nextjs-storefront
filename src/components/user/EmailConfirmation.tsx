"use client";

import { UserConfirmEmailChangeDocument } from "@/__generated__/graphql";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { getStoredAuthToken } from "@/queries/user/token";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

/**
 * Controller component used to handle the email change confirmation.
 * This won't render anything but it will handle the confirmation logic
 * and show a toast with the result.
 */
export const EmailConfirmation: React.FC = () => {
  const t = useTranslations("User");
  const [confirmEmail, { data }] = useMutation(UserConfirmEmailChangeDocument);
  const authToken = useMemo(getStoredAuthToken, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token || !authToken) return;

    confirmEmail({ variables: { token }, errorPolicy: "ignore" });
  }, [confirmEmail, authToken]);

  useEffect(() => {
    if (data?.confirmEmailChange?.user)
      successToast(t("Email changed successfully"));
    else if (data?.confirmEmailChange?.errors.length) {
      logger.error("Email confirmation errors", data.confirmEmailChange.errors);
      errorToast(t("Something went wrong while changing your email"));
    }
  }, [data, t]);

  return null;
};
