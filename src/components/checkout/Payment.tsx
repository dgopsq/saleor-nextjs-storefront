"use client";

import { CartProducts } from "@/components/checkout/CartProducts";
import { CartSummary } from "@/components/checkout/CartSummary";
import { CheckoutPaymentGateways } from "@/components/checkout/CheckoutPaymentGateway";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { Button } from "@/components/core/Button";
import { Island } from "@/components/core/Island";
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
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Payment method
              </h2>

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
            <Island variant="solid">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <div className="mt-8">
                <CartProducts products={data.lines} condensed />
              </div>

              <div className="mt-8">
                <CartSummary checkout={data} />
              </div>

              <div className="mt-8">
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  text="Buy now"
                  isLoading={checkoutRefreshing}
                />
              </div>
            </Island>
          </section>
        </form>
      </div>
    </div>
  );
};
