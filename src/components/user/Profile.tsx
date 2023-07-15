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

export const Profile: React.FC = () => {
  const [updateUser, { loading: updateUserLoading }] =
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
          defaultBillingAddress: billingData ? billingData : shippingData,
        },
      },
    });
  }, [billingSameAsShipping, updateUser]);

  const shippingInitialValues = useMemo(
    () =>
      user?.defaultShippingAddress
        ? addressToAddressForm(user?.defaultShippingAddress)
        : undefined,
    [user?.defaultShippingAddress]
  );

  const billingInitialValues = useMemo(
    () =>
      user?.defaultBillingAddress
        ? addressToAddressForm(user.defaultBillingAddress)
        : undefined,
    [user?.defaultBillingAddress]
  );

  useEffect(() => {
    if (billingInitialValues) setBillingSameAsShipping(false);
  }, [billingInitialValues, setBillingSameAsShipping]);

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
            onChange={setBillingSameAsShipping}
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
            isLoading={updateUserLoading}
          />
        </div>
      </div>
    </>
  );
};
