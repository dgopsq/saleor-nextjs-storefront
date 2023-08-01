"use client";

import { UserConfirmAccountDocument } from "@/__generated__/graphql";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

/**
 *
 */
export const AccountConfirmation: React.FC = () => {
  const t = useTranslations("User");
  const [confirmAccount, { data }] = useMutation(UserConfirmAccountDocument);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    if (!token || !email) return;

    confirmAccount({ variables: { token, email }, errorPolicy: "ignore" });
  }, [confirmAccount]);

  useEffect(() => {
    if (data?.confirmAccount?.user)
      successToast(t("Account confirmed successfully, you can now login!"));
    else if (data?.confirmAccount?.errors.length) {
      logger.error("Account confirmation errors", data.confirmAccount.errors);
      errorToast(t("Something went wrong while confirming your account"));
    }
  }, [data, t]);

  return null;
};
