"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/core/Button";
import { useMutation } from "@apollo/client";
import {
  UserSetDefaultAddressDocument,
  UserUpdateDocument,
} from "@/__generated__/graphql";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import {
  ChangeInfoForm,
  ChangeInfoFormRef,
} from "@/components/core/ChangeInfoForm";

export const ProfileInfo: React.FC = () => {
  const [updateUser, { loading: updateUserLoading, data: updateData }] =
    useMutation(UserUpdateDocument);
  const [setDefaultAddress, { loading: setDefaultAddressLoading }] =
    useMutation(UserSetDefaultAddressDocument);

  const user = useUserInfo();

  const changeInfoRef = useRef<ChangeInfoFormRef>(null);

  const userInfoInitialValues = useMemo<Partial<ChangeInfoForm>>(() => {
    return {
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
    };
  }, [user]);

  useEffect(() => {
    if (updateData?.accountUpdate?.user)
      successToast("Your profile has been updated.");
    else if (updateData?.accountUpdate?.errors.length) {
      logger.error("Profile update errors", updateData.accountUpdate.errors);
      errorToast("There was an error updating your profile.");
    }
  }, [updateData]);

  const isLoading = updateUserLoading || setDefaultAddressLoading;

  return (
    <>
      <div className="border-b border-gray-100 pb-16">
        <h3 className="text-xl font-semibold">Personal informations</h3>
        <div className="mt-8">
          <ChangeInfoForm
            ref={changeInfoRef}
            initialValues={userInfoInitialValues}
          />
        </div>
      </div>

      <div className="mt-16 flex justify-end">
        <div className="w-48">
          <Button
            size="medium"
            variant="primary"
            text="Save"
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};
