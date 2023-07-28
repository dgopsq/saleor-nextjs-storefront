"use client";

import { UpdateCheckoutDeliveryMethodDocument } from "@/__generated__/graphql";
import { CheckoutDeliveryMethod } from "@/components/checkout/CheckoutDeliveryMethods";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { classNames } from "@/misc/styles";
import {
  DeliveryMethod,
  validateInformationsStep,
} from "@/queries/checkout/data";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

/**
 *
 */
export const Shipping: React.FC = () => {
  const router = useRouter();
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  const [updateDeliveryMethod, { loading: loadingUpdateDeliveryMethod }] =
    useMutation(UpdateCheckoutDeliveryMethodDocument);

  const checkoutRefreshing = checkoutInfoLoading || loadingUpdateDeliveryMethod;

  const canContinue = !!data?.deliveryMethod;

  const handleUpdateDeliveryMethod = useCallback(
    ({ id }: DeliveryMethod) => {
      if (data)
        updateDeliveryMethod({
          variables: {
            checkoutId: data.id,
            deliveryMethodId: id,
          },
        });
    },
    [data, updateDeliveryMethod]
  );

  const informationsStepValid = useMemo(
    () => (data ? validateInformationsStep(data) : false),
    [data]
  );

  useEffect(() => {
    if (!informationsStepValid) router.push("/checkout");
  }, [router, informationsStepValid]);

  if (!data || !informationsStepValid) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={1} />

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <SectionHeading>Shipping methods</SectionHeading>

          <div className="mt-8">
            <CheckoutDeliveryMethod
              value={data.deliveryMethod ?? undefined}
              deliveryMethods={data.shippingMethods}
              onChange={handleUpdateDeliveryMethod}
            />
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
            ctaText="Continue to payment"
            isLoading={checkoutRefreshing}
            isDisabled={!canContinue}
            onCtaClick={() => router.push("/checkout/payment")}
            onCartEditClick={() => router.push("/cart")}
          />
        </section>
      </div>
    </div>
  );
};
