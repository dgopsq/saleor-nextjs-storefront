"use client";

import {
  UpdateCheckoutBillingAddressDocument,
  UpdateCheckoutShippingAddressDocument,
} from "@/__generated__/graphql";
import { CheckoutAddressUser } from "@/components/checkout/CheckoutAddressUser";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { TextButton } from "@/components/core/Button";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { classNames } from "@/misc/styles";
import {
  Address,
  User,
  addressToAddressInput,
  areAddressEqual,
} from "@/queries/user/data";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cartRoute, checkoutShippingRoute } from "@/misc/navigation";
import { useTranslations } from "next-intl";

type Props = {
  userInfo: User;
};

/**
 *
 */
export const InformationsUser: React.FC<Props> = ({ userInfo }) => {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [addShippingAddress, setAddShippingAddress] = useState(false);
  const [addBillingAddress, setAddBillingAddress] = useState(false);
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  const [updateShippingAddress, { loading: loadingUpdateShippingAddress }] =
    useMutation(UpdateCheckoutShippingAddressDocument);

  const [updateBillingAddress, { loading: loadingUpdateBillingAddress }] =
    useMutation(UpdateCheckoutBillingAddressDocument);

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

  const canContinue = userInfo
    ? !!data?.billingAddress && !!data?.shippingAddress && !!data?.email
    : true;

  const checkoutRefreshing =
    checkoutInfoLoading ||
    loadingUpdateShippingAddress ||
    loadingUpdateBillingAddress;

  useEffect(() => {
    const billingAddress = data?.billingAddress ?? null;
    const shippingAddress = data?.shippingAddress ?? null;

    if (!billingAddress || !shippingAddress) return;

    const isSameAddress = areAddressEqual(billingAddress, shippingAddress);

    if (!isSameAddress) setBillingSameAsShipping(false);
  }, [data, setBillingSameAsShipping]);

  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.addresses.length === 0) setAddShippingAddress(true);
  }, [userInfo]);

  if (!data) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={0} />

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <div className="border-b border-gray-100 pb-12">
            <div className="flex flex-row items-center gap-4">
              <SectionHeading>{t("Shipping address")}</SectionHeading>

              {!addShippingAddress ? (
                <div>
                  <TextButton
                    text={t("Add new address")}
                    onClick={() => setAddShippingAddress(true)}
                    variant="primary"
                  />
                </div>
              ) : undefined}
            </div>

            <div className="mt-8">
              <CheckoutAddressUser
                addresses={userInfo.addresses}
                value={data.shippingAddress ?? undefined}
                onChange={handleShippingAddressUpdate}
                isLoading={loadingUpdateShippingAddress}
                addAddress={addShippingAddress}
                onCancelAddAddress={() => setAddShippingAddress(false)}
              />
            </div>
          </div>

          <div className="mt-12">
            <div className="flex flex-row items-center gap-4">
              <SectionHeading>{t("Billing address")}</SectionHeading>

              {!addBillingAddress && !billingSameAsShipping ? (
                <div>
                  <TextButton
                    text={t("Add new address")}
                    onClick={() => setAddBillingAddress(true)}
                    variant="primary"
                  />
                </div>
              ) : undefined}
            </div>

            <div className="mt-8">
              {billingSameAsShipping ? (
                <div className="flex flex-row items-center gap-4">
                  <span>{t("Same as the shipping address")}</span>

                  <div>
                    <TextButton
                      text={t("Change")}
                      onClick={() => setBillingSameAsShipping(false)}
                      variant="primary"
                    />
                  </div>
                </div>
              ) : (
                <CheckoutAddressUser
                  addresses={userInfo.addresses}
                  value={data.billingAddress ?? undefined}
                  onChange={handleBillingAddressUpdate}
                  isLoading={loadingUpdateBillingAddress}
                  addAddress={addBillingAddress}
                  onCancelAddAddress={() => setAddBillingAddress(false)}
                />
              )}
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
          <CheckoutSummary
            checkout={data}
            isLoading={checkoutRefreshing}
            isDisabled={!canContinue}
            ctaText={t("Continue to shipping")}
            onCtaClick={() => router.push(checkoutShippingRoute)}
            onCartEditClick={() => router.push(cartRoute)}
          />
        </section>
      </div>
    </div>
  );
};
