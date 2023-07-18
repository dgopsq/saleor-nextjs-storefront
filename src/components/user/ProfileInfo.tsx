"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Checkbox } from "@/components/core/Checkbox";
import { Button } from "@/components/core/Button";
import { useMutation } from "@apollo/client";
import {
  AddressTypeEnum,
  GenericAddressFragmentDoc,
  GenericUserFragmentDoc,
  UserSetDefaultAddressDocument,
  UserUpdateDocument,
} from "@/__generated__/graphql";
import { addressToAddressForm } from "@/queries/user/data";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { errorToast, successToast } from "@/components/core/Notifications";
import { logger } from "@/misc/logger";
import {
  ChangeInfoForm,
  ChangeInfoFormRef,
} from "@/components/core/ChangeInfoForm";
import { getFragmentData } from "@/__generated__";

export const ProfileInfo: React.FC = () => {
  const [updateUser, { loading: updateUserLoading, data: updateData }] =
    useMutation(UserUpdateDocument);
  const [setDefaultAddress, { loading: setDefaultAddressLoading }] =
    useMutation(UserSetDefaultAddressDocument);

  const user = useUserInfo();

  const changeInfoRef = useRef<ChangeInfoFormRef>(null);
  const shippingAddressRef = useRef<AddressFormRef>(null);
  const billingAddressRef = useRef<AddressFormRef>(null);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const handleSubmit = useCallback(async () => {
    const infoData = (await changeInfoRef.current?.getValues()) ?? null;

    const shippingData =
      (await shippingAddressRef.current?.getValues()) ?? null;

    const billingData = (await billingAddressRef.current?.getValues()) ?? null;

    if (!shippingData) return;
    if (!billingData && !billingSameAsShipping) return;

    updateUser({
      variables: {
        userInfo: {
          ...infoData,
          defaultShippingAddress: shippingData,
          defaultBillingAddress: billingData,
        },
      },
      onCompleted: (data) => {
        if (!billingData) return;

        logger.debug(
          "Updating shipping address in order to be the default billing address too."
        );

        const userFragment = getFragmentData(
          GenericUserFragmentDoc,
          data.accountUpdate?.user
        );

        const shippingAddressFragment = getFragmentData(
          GenericAddressFragmentDoc,
          userFragment?.defaultShippingAddress
        );

        const shippingAddressId = shippingAddressFragment?.id ?? null;

        if (shippingAddressId)
          setDefaultAddress({
            variables: {
              addressType: AddressTypeEnum.Billing,
              addressId: shippingAddressId,
            },
          });
      },
    });
  }, [billingSameAsShipping, updateUser, setDefaultAddress]);

  const userInfoInitialValues = useMemo<Partial<ChangeInfoForm>>(() => {
    return {
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
    };
  }, [user]);

  const shippingInitialValues = useMemo(
    () =>
      user?.defaultShippingAddress
        ? addressToAddressForm(user?.defaultShippingAddress)
        : undefined,
    [user]
  );

  const billingInitialValues = useMemo(
    () =>
      user?.defaultBillingAddress
        ? addressToAddressForm(user.defaultBillingAddress)
        : undefined,
    [user]
  );

  // Manage the `billingSameAsShipping` state from the remote
  // user info data.
  useEffect(() => {
    const shippingAddressId = user?.defaultShippingAddress?.id ?? null;
    const billingAddressId = user?.defaultBillingAddress?.id ?? null;

    if (!billingAddressId || !shippingAddressId) return;
    if (billingAddressId === shippingAddressId) return;

    setBillingSameAsShipping(false);
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

      <div className="mt-16 border-b border-gray-100 pb-16">
        <h3 className="text-xl font-semibold">Shipping Address</h3>
        <div className="mt-8">
          <AddressForm
            ref={shippingAddressRef}
            initialValues={shippingInitialValues}
          />
        </div>
      </div>

      <div className="mt-16 border-b border-gray-100 pb-16">
        <h3 className="text-xl font-semibold">Billing Address</h3>
        <div className="mt-8">
          <Checkbox
            id="billingSameAsShipping"
            label="Same as shipping address."
            value={billingSameAsShipping}
            onClick={() => setBillingSameAsShipping((value) => !value)}
          />

          {!billingSameAsShipping ? (
            <div className="mt-8">
              <AddressForm
                ref={billingAddressRef}
                initialValues={billingInitialValues}
              />
            </div>
          ) : undefined}
        </div>
      </div>

      <div className="mt-16 flex justify-end">
        <div className="w-48">
          <Button
            size="medium"
            variant="primary"
            text="Save"
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};
