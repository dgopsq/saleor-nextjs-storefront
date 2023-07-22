"use client";

import {
  UpdateCheckoutBillingAddressDocument,
  UpdateCheckoutDeliveryMethodDocument,
  UpdateCheckoutEmailDocument,
  UpdateCheckoutShippingAddressDocument,
} from "@/__generated__/graphql";
import { CartProducts } from "@/components/checkout/CartProducts";
import { CartSummary } from "@/components/checkout/CartSummary";
import { CheckoutAddAddress } from "@/components/checkout/CheckoutAddAddress";
import { CheckoutAddressUser } from "@/components/checkout/CheckoutAddressUser";
import { CheckoutDeliveryMethod } from "@/components/checkout/CheckoutDeliveryMethods";
import { CheckoutEmail } from "@/components/checkout/CheckoutEmail";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { Button, TextButton } from "@/components/core/Button";
import { Island } from "@/components/core/Island";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useProductUpdate } from "@/misc/hooks/useProductUpdate";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { classNames } from "@/misc/styles";
import { DeliveryMethod } from "@/queries/checkout/data";
import { Address, addressToAddressInput } from "@/queries/user/data";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useCallback, useState } from "react";
import { P, match } from "ts-pattern";

/**
 *
 */
export const Shipping: React.FC = () => {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [addShippingAddress, setAddShippingAddress] = useState(false);
  const [addBillingAddress, setAddBillingAddress] = useState(false);

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
  const [updateDeliveryMethod, { loading: loadingUpdateDeliveryMethod }] =
    useMutation(UpdateCheckoutDeliveryMethodDocument);

  const handleEmailUpdate = useCallback(
    (email: string) => {
      if (data)
        updateEmail({
          variables: {
            checkoutId: data.id,
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
            checkoutId: data.id,
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
          checkoutId: data.id,
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

  const handleDeliveryMethodUpdate = useCallback(
    (deliveryMethod: DeliveryMethod) => {
      if (data)
        updateDeliveryMethod({
          variables: {
            checkoutId: data.id,
            deliveryMethodId: deliveryMethod.id,
          },
        });
    },
    [updateDeliveryMethod, data]
  );

  const handleBuyNow = useCallback(() => {
    if (!data) return;
  }, [data]);

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
      <CheckoutSteps currentStep={1} />

      <div className="mt-12">
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            {!userInfo ? (
              <div className="border-b border-gray-100 pb-12">
                <CheckoutEmail
                  email={data.email ?? undefined}
                  onChange={handleEmailUpdate}
                  isLoading={loadingUpdateEmail}
                />
              </div>
            ) : undefined}

            <div
              className={classNames(
                "border-b border-gray-100 pb-12",
                !userInfo ? "mt-12" : ""
              )}
            >
              {userInfo ? (
                <>
                  <div className="flex flex-row items-center gap-4">
                    <h2
                      id="summary-heading"
                      className="text-lg font-medium text-gray-900"
                    >
                      Shipping address
                    </h2>

                    {!addShippingAddress ? (
                      <div>
                        <TextButton
                          text="Add new address"
                          onClick={() => setAddShippingAddress(true)}
                          variant="primary"
                        />
                      </div>
                    ) : undefined}
                  </div>

                  <div className="mt-8">
                    {addShippingAddress ? (
                      <CheckoutAddAddress
                        onCancel={() => setAddShippingAddress(false)}
                      />
                    ) : (
                      <CheckoutAddressUser
                        addresses={userInfo.addresses}
                        value={data.shippingAddress ?? undefined}
                        onChange={handleShippingAddressUpdate}
                        isLoading={loadingUpdateShippingAddress}
                      />
                    )}
                  </div>
                </>
              ) : undefined}
            </div>

            <div className="mt-12 border-b border-gray-100 pb-12">
              {userInfo ? (
                <>
                  <div className="flex flex-row items-center gap-4">
                    <h2
                      id="summary-heading"
                      className="text-lg font-medium text-gray-900"
                    >
                      Billing address
                    </h2>

                    {!addBillingAddress && !billingSameAsShipping ? (
                      <div>
                        <TextButton
                          text="Add new address"
                          onClick={() => setAddBillingAddress(true)}
                          variant="primary"
                        />
                      </div>
                    ) : undefined}
                  </div>

                  <div className="mt-8">
                    {match([billingSameAsShipping, addBillingAddress])
                      .with([true, P._], () => (
                        <div className="flex flex-row items-center gap-4">
                          <span>Same as the shipping address.</span>

                          <div>
                            <TextButton
                              text="Change"
                              onClick={() => setBillingSameAsShipping(false)}
                              variant="primary"
                            />
                          </div>
                        </div>
                      ))
                      .with([false, false], () => (
                        <CheckoutAddressUser
                          addresses={userInfo.addresses}
                          value={data.billingAddress ?? undefined}
                          onChange={handleBillingAddressUpdate}
                          isLoading={loadingUpdateBillingAddress}
                        />
                      ))
                      .with([false, true], () => (
                        <CheckoutAddAddress
                          onCancel={() => setAddBillingAddress(false)}
                        />
                      ))
                      .otherwise(() => null)}
                  </div>
                </>
              ) : undefined}
            </div>

            <div className="mt-12">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Delivery method
              </h2>

              <div className="mt-8">
                <CheckoutDeliveryMethod
                  deliveryMethods={data.shippingMethods ?? []}
                  value={data.deliveryMethod ?? undefined}
                  onChange={handleDeliveryMethodUpdate}
                  isLoading={loadingUpdateDeliveryMethod}
                />
              </div>
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
                <Link href="/checkout/payment">
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    text="Continue to payment"
                    isLoading={checkoutRefreshing}
                    isDisabled={!canBuy}
                    onClick={handleBuyNow}
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
