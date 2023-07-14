"use client";

import React, { useState } from "react";
import { AddressForm } from "@/components/core/AddressForm";
import { CheckboxField } from "@/components/core/CheckboxField";
import { Button } from "@/components/core/Button";

export const Profile = () => {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  return (
    <>
      <div className="border-b border-gray-100 pb-16">
        <h3 className="text-xl font-semibold">Shipping Address</h3>
        <div className="mt-8">
          <AddressForm />
        </div>
      </div>

      <div className="mt-16 border-b border-gray-100 pb-16">
        <h3 className="text-xl font-semibold">Billing Address</h3>
        <div className="mt-8">
          <CheckboxField
            id="billingSameAsShipping"
            label="Same as shipping address."
            value={billingSameAsShipping}
            onChange={setBillingSameAsShipping}
          />

          {!billingSameAsShipping ? (
            <div className="mt-8">
              <AddressForm />
            </div>
          ) : undefined}
        </div>
      </div>

      <div className="mt-16 flex justify-end">
        <div className="w-48">
          <Button size="medium" variant="primary" text="Save" />
        </div>
      </div>
    </>
  );
};
