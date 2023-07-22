"use client";

import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { CheckoutPaymentGateway } from "@/components/checkout/CheckoutPaymentGateway";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { classNames } from "@/misc/styles";

/**
 *
 */
export const Payment: React.FC = () => {
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  const checkoutRefreshing = checkoutInfoLoading;

  if (!data) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={2} />

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <SectionHeading>Payment method</SectionHeading>

          <div className="mt-8">
            <CheckoutPaymentGateway
              paymentGateways={data.availablePaymentGateways}
              checkoutId={data.id}
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
          <CheckoutSummary checkout={data} />
        </section>
      </div>
    </div>
  );
};
