"use client";

import {
  UpdateCheckoutBillingAddressDocument,
  UpdateCheckoutEmailDocument,
  UpdateCheckoutShippingAddressDocument,
} from "@/__generated__/graphql";
import { CheckoutAddAddress } from "@/components/checkout/CheckoutAddAddress";
import { CheckoutAddressUser } from "@/components/checkout/CheckoutAddressUser";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutEmail } from "@/components/checkout/CheckoutEmail";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { TextButton } from "@/components/core/Button";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { classNames } from "@/misc/styles";
import {
  Address,
  addressToAddressInput,
  areAddressEqual,
} from "@/queries/user/data";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { P, match } from "ts-pattern";

/**
 *
 */
export const Informations: React.FC = () => {
  const router = useRouter();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [addShippingAddress, setAddShippingAddress] = useState(false);
  const [addBillingAddress, setAddBillingAddress] = useState(false);

  const userInfo = useUserInfo();
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

  const canContinue =
    !!data?.billingAddress && !!data?.shippingAddress && !!data?.email;

  const checkoutRefreshing =
    checkoutInfoLoading ||
    loadingUpdateEmail ||
    loadingUpdateShippingAddress ||
    loadingUpdateBillingAddress;

  useEffect(() => {
    const billingAddress = data?.billingAddress ?? null;
    const shippingAddress = data?.shippingAddress ?? null;

    if (!billingAddress || !shippingAddress) return;

    const isSameAddress = areAddressEqual(billingAddress, shippingAddress);

    if (!isSameAddress) setBillingSameAsShipping(false);
  }, [data, setBillingSameAsShipping]);

  if (!data) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={0} />

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
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
                  <SectionHeading>Shipping address</SectionHeading>

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
                      onAddressCreated={handleShippingAddressUpdate}
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

          <div className="mt-12">
            {userInfo ? (
              <>
                <div className="flex flex-row items-center gap-4">
                  <SectionHeading>Billing address</SectionHeading>

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
                        onAddressCreated={handleBillingAddressUpdate}
                      />
                    ))
                    .otherwise(() => null)}
                </div>
              </>
            ) : undefined}
          </div>
        </section>

        <section
          aria-labelledby="summary-heading"
          className={classNames(
            "mt-16 lg:col-span-5 lg:mt-0",
            checkoutRefreshing ? "opacity-50" : ""
          )}
        >
          <CheckoutSummary
            checkout={data}
            isLoading={checkoutRefreshing}
            isDisabled={!canContinue}
            ctaText="Continue to shipping"
            onCtaClick={() => router.push("/checkout/shipping")}
            onCartEditClick={() => router.push("/checkout")}
          />
        </section>
      </div>
    </div>
  );
};
