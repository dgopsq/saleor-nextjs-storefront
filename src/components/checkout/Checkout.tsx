"use client";

import {
  UpdateCheckoutBillingAddressDocument,
  UpdateCheckoutEmailDocument,
  UpdateCheckoutShippingAddressDocument,
} from "@/__generated__/graphql";
import { CartProducts } from "@/components/checkout/CartProducts";
import { CartSummary } from "@/components/checkout/CartSummary";
import { CheckoutAddressUser } from "@/components/checkout/CheckoutAddressUser";
import { CheckoutEmail } from "@/components/checkout/CheckoutEmail";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Island } from "@/components/core/Island";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useProductUpdate } from "@/misc/hooks/useProductUpdate";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { classNames } from "@/misc/styles";
import { Address, addressToAddressInput } from "@/queries/user/data";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useCallback, useState } from "react";

/**
 *
 */
export const Checkout: React.FC = () => {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const userInfo = useUserInfo();
  const { updateProduct, loading: updateProductLoading } = useProductUpdate();
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();
  const [updateEmail, { loading: loadingUpdateEmail }] = useMutation(
    UpdateCheckoutEmailDocument
  );
  const [updateShippingAddress, { loading: loadingUpdateShippingAddress }] =
    useMutation(UpdateCheckoutShippingAddressDocument);
  const [updateBillingAddress, { loading: loadingUpdateBillingAddress }] =
    useMutation(UpdateCheckoutBillingAddressDocument);

  const handleEmailUpdate = useCallback(
    (email: string) => {
      if (data)
        updateEmail({
          variables: {
            checkoutToken: data.token,
            email,
          },
        });
    },
    [updateEmail, data]
  );

  const handleBillingAddressUpdate = useCallback(
    (address: Address) => {
      if (data)
        updateBillingAddress({
          variables: {
            checkoutToken: data.token,
            address: addressToAddressInput(address),
          },
        });
    },
    [updateBillingAddress, data]
  );

  const handleShippingAddressUpdate = useCallback(
    (address: Address) => {
      if (!data) return;

      updateShippingAddress({
        variables: {
          checkoutToken: data.token,
          address: addressToAddressInput(address),
        },
      });

      // If the billing address is the same as the shipping address,
      // we update it as well.
      if (billingSameAsShipping) handleBillingAddressUpdate(address);
    },
    [
      updateShippingAddress,
      data,
      handleBillingAddressUpdate,
      billingSameAsShipping,
    ]
  );

  const canBuy =
    data?.billingAddress &&
    data?.shippingAddress &&
    data?.email &&
    data?.deliveryMethod;

  const checkoutRefreshing =
    checkoutInfoLoading ||
    updateProductLoading ||
    loadingUpdateEmail ||
    loadingUpdateShippingAddress ||
    loadingUpdateBillingAddress;

  if (!data) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <div>
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <div className="border-b border-gray-100 pb-12">
              <CheckoutEmail
                checkoutToken={data.token}
                email={data.email ?? undefined}
                onChange={handleEmailUpdate}
                isLoading={loadingUpdateEmail}
              />
            </div>

            <div className="mt-12 border-b border-gray-100 pb-12">
              {userInfo ? (
                <>
                  <h2
                    id="summary-heading"
                    className="text-lg font-medium text-gray-900"
                  >
                    Shipping address
                  </h2>

                  <div className="mt-8">
                    <CheckoutAddressUser
                      addresses={userInfo.addresses}
                      value={data.shippingAddress ?? undefined}
                      onChange={handleShippingAddressUpdate}
                      isLoading={loadingUpdateShippingAddress}
                    />
                  </div>
                </>
              ) : undefined}
            </div>

            <div className="mt-12 border-b border-gray-100 pb-12">
              {userInfo ? (
                <>
                  <h2
                    id="summary-heading"
                    className="text-lg font-medium text-gray-900"
                  >
                    Billing address
                  </h2>

                  <div className="mt-8">
                    <Checkbox
                      id="billingSameAsShipping"
                      label="Same as the shipping address"
                      value={billingSameAsShipping}
                      onClick={() => setBillingSameAsShipping((prev) => !prev)}
                    />
                  </div>

                  {!billingSameAsShipping ? (
                    <div className="mt-8">
                      <CheckoutAddressUser
                        addresses={userInfo.addresses}
                        value={data.billingAddress ?? undefined}
                        onChange={handleBillingAddressUpdate}
                        isLoading={loadingUpdateBillingAddress}
                      />
                    </div>
                  ) : undefined}
                </>
              ) : undefined}
            </div>

            <div className="mt-12 border-b border-gray-100 pb-12">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Delivery method
              </h2>
            </div>
          </section>

          <section
            aria-labelledby="summary-heading"
            className={classNames(
              "mt-16 lg:col-span-5 lg:mt-0",
              checkoutRefreshing ? "opacity-50" : ""
            )}
          >
            <Island variant="solid">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <div className="mt-8">
                <CartProducts
                  products={data.lines}
                  onProductUpdate={updateProduct}
                  condensed
                />
              </div>

              <div className="mt-8">
                <CartSummary checkout={data} />
              </div>

              <div className="mt-8">
                <Link href="/checkout">
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    text="Buy now"
                    isLoading={checkoutRefreshing}
                    isDisabled={!canBuy}
                  />
                </Link>
              </div>
            </Island>
          </section>
        </form>
      </div>
    </div>
  );
};
