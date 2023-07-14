"use client";

import React, { useCallback, useRef, useState } from "react";
import { AddressForm, AddressFormRef } from "@/components/core/AddressForm";
import { Checkbox } from "@/components/core/Checkbox";
import { Button } from "@/components/core/Button";

export const Profile = () => {
  const shippingAddressRef = useRef<AddressFormRef>(null);
  const billingAddressRef = useRef<AddressFormRef>(null);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const handleSubmit = useCallback(async () => {
    const shippingData =
      (await shippingAddressRef.current?.getValues()) ?? null;

    const billingData = (await billingAddressRef.current?.getValues()) ?? null;

    console.log({ shippingData, billingData, billingSameAsShipping });
  }, [billingSameAsShipping]);

  return (
    <>
      <div className="border-b border-gray-100 pb-16">
        <h3 className="text-xl font-semibold">Shipping Address</h3>
        <div className="mt-8">
          <AddressForm ref={shippingAddressRef} />
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
              <AddressForm ref={billingAddressRef} />
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
          />
        </div>
      </div>
    </>
  );
};
