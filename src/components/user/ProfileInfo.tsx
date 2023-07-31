"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { UserUpdateDocument } from "@/__generated__/graphql";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { ChangeInfoForm } from "@/components/core/ChangeInfoForm";
import { SectionHeading } from "@/components/core/Headings";
import { useTranslations } from "next-intl";

export const ProfileInfo: React.FC = () => {
  const [updateUser, { loading: updateUserLoading, data: updateData }] =
    useMutation(UserUpdateDocument);

  const t = useTranslations("User");

  const user = useUserInfo();

  const userInfoInitialValues = useMemo<Partial<ChangeInfoForm>>(() => {
    return {
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
    };
  }, [user]);

  const handleUpdate = useCallback(
    (data: ChangeInfoForm) => {
      updateUser({
        variables: {
          userInfo: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      });
    },
    [updateUser]
  );

  useEffect(() => {
    if (updateData?.accountUpdate?.user)
      successToast(t("Your profile has been updated."));
    else if (updateData?.accountUpdate?.errors.length) {
      logger.error("Profile update errors", updateData.accountUpdate.errors);
      errorToast(t("There was an error updating your profile."));
    }
  }, [updateData, t]);

  return (
    <>
      <div>
        <SectionHeading>{t("Personal informations")}</SectionHeading>

        <div className="mt-8">
          <ChangeInfoForm
            onSubmit={handleUpdate}
            initialValues={userInfoInitialValues}
            isLoading={updateUserLoading}
          />
        </div>
      </div>
    </>
  );
};
