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
import { UserUpdateDocument } from "@/__generated__/graphql";
import { addressToAddressForm } from "@/queries/user/data";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { errorToast, successToast } from "@/components/core/Notifications";

export const Profile: React.FC = () => {
  const [updateUser, { loading, data: updateData }] =
    useMutation(UserUpdateDocument);

  const user = useUserInfo();

  const shippingAddressRef = useRef<AddressFormRef>(null);
  const billingAddressRef = useRef<AddressFormRef>(null);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const handleSubmit = useCallback(async () => {
    const shippingData =
      (await shippingAddressRef.current?.getValues()) ?? null;

    const billingData = (await billingAddressRef.current?.getValues()) ?? null;

    if (!shippingData) return;
    if (!billingData && !billingSameAsShipping) return;

    updateUser({
      variables: {
        userInfo: {
          defaultShippingAddress: shippingData,
          defaultBillingAddress: billingData,
        },
      },
    });
  }, [billingSameAsShipping, updateUser]);

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

  useEffect(() => {
    if (billingInitialValues) setBillingSameAsShipping(false);
  }, [billingInitialValues]);

  useEffect(() => {
    if (updateData?.accountUpdate?.user)
      successToast("Your profile has been updated.");
    else if (updateData?.accountUpdate?.errors)
      errorToast("There was an error updating your profile.");
  }, [updateData]);

  return (
    <>
      <div className="border-b border-gray-100 pb-16">
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
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};
