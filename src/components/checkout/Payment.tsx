"use client";

import { CheckoutCartSummary } from "@/components/checkout/CheckoutCartSummary";
import { CheckoutPaymentGateways } from "@/components/checkout/CheckoutPaymentGateway";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { SectionHeading } from "@/components/core/Headings";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { classNames } from "@/misc/styles";
import { PaymentGatewayConfig } from "@/queries/checkout/data";

type Props = {
  paymentGateways: Array<PaymentGatewayConfig>;
};

/**
 *
 */
export const Payment: React.FC<Props> = ({ paymentGateways }) => {
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  const checkoutRefreshing = checkoutInfoLoading;

  if (!data) return <LoadingSpinner />;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={2} />

      <div className="mt-12">
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <div className="mt-12">
              <SectionHeading>Payment method</SectionHeading>

              <div className="mt-8">
                <CheckoutPaymentGateways
                  paymentGateways={paymentGateways}
                  checkoutId={data.id}
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
            <CheckoutCartSummary
              checkout={data}
              ctaText="Place order"
              isLoading={checkoutRefreshing}
              isDisabled={false}
            />
          </section>
        </form>
      </div>
    </div>
  );
};
