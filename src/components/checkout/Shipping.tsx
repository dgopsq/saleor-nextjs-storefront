"use client";

import { UpdateCheckoutDeliveryMethodDocument } from "@/__generated__/graphql";
import { CheckoutDeliveryMethod } from "@/components/checkout/CheckoutDeliveryMethods";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutGuard } from "@/misc/hooks/useCheckoutGuard";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import {
  cartRoute,
  checkoutPaymentRoute,
  checkoutRoute,
} from "@/misc/navigation";
import { classNames } from "@/misc/styles";
import {
  DeliveryMethod,
  validateInformationsStep,
} from "@/queries/checkout/data";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

/**
 *
 */
export const Shipping: React.FC = () => {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();
  const { showCheckout } = useCheckoutGuard();

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
    if (!informationsStepValid) router.push(checkoutRoute);
  }, [router, informationsStepValid]);

  if (!data || !informationsStepValid || !showCheckout)
    return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={1} />

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <SectionHeading>{t("Shipping methods")}</SectionHeading>

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
            ctaText={t("Continue to payment")}
            isLoading={checkoutRefreshing}
            isDisabled={!canContinue}
            onCtaClick={() => router.push(checkoutPaymentRoute)}
            onCartEditClick={() => router.push(cartRoute)}
          />
        </section>
      </div>
    </div>
  );
};
