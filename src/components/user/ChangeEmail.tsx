"use client";

import { UserEmailChangeDocument } from "@/__generated__/graphql";
import { ChangeEmailForm } from "@/components/core/ChangeEmailForm";
import { errorToast, successToast } from "@/components/core/Notifications";
import { publicConfig } from "@/misc/config";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { logger } from "@/misc/logger";
import { useMutation } from "@apollo/client";
import { useCallback, useEffect } from "react";

/**
 *
 */
export const ChangeEmail: React.FC = () => {
  const [changeEmail, { loading, data }] = useMutation(UserEmailChangeDocument);
  const userInfo = useUserInfo();

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
      <h3 className="text-xl font-semibold">Email</h3>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Current email
            </label>
            <div className="mt-2">
              <input
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 bg-gray-100 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="email"
                value={userInfo?.email || ""}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ChangeEmailForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};
