"use client";

import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { classNames } from "@/misc/styles";
import { useRouter } from "next/navigation";

/**
 *
 */
export const Shipping: React.FC = () => {
  const router = useRouter();
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  const checkoutRefreshing = checkoutInfoLoading;

  const canContinue = !!data?.deliveryMethod;

  if (!data) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={1} />

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <div>
            <SectionHeading>Payment method</SectionHeading>

            <div className="mt-8">...</div>
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
          />
        </section>
      </div>
    </div>
  );
};
