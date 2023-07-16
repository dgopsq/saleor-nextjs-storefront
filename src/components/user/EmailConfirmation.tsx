"use client";

import { UserConfirmEmailChangeDocument } from "@/__generated__/graphql";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";

/**
 *
 */
export const EmailConfirmation: React.FC = () => {
  const [confirmEmail, { data }] = useMutation(UserConfirmEmailChangeDocument);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) return;

    confirmEmail({ variables: { token }, errorPolicy: "ignore" });
  }, [confirmEmail]);

  useEffect(() => {
    if (data?.confirmEmailChange?.user)
      successToast("Email changed successfully");
    else if (data?.confirmEmailChange?.errors.length) {
      logger.error("Email confirmation errors", data.confirmEmailChange.errors);
      errorToast("Something went wrong while changing your email");
    }
  }, [data]);

  return null;
};
