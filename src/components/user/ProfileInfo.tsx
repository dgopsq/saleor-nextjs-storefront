"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { UserUpdateDocument } from "@/__generated__/graphql";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import { ChangeInfoForm } from "@/components/core/ChangeInfoForm";
import { SectionHeading } from "@/components/core/Headings";

export const ProfileInfo: React.FC = () => {
  const [updateUser, { loading: updateUserLoading, data: updateData }] =
    useMutation(UserUpdateDocument);

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
      successToast("Your profile has been updated.");
    else if (updateData?.accountUpdate?.errors.length) {
      logger.error("Profile update errors", updateData.accountUpdate.errors);
      errorToast("There was an error updating your profile.");
    }
  }, [updateData]);

  return (
    <>
      <div>
        <SectionHeading>Personal informations</SectionHeading>

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
