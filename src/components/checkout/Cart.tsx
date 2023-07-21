"use client";

import { CartProducts } from "@/components/checkout/CartProducts";
import { CartSummary } from "@/components/checkout/CartSummary";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { Button } from "@/components/core/Button";
import { Island } from "@/components/core/Island";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useProductUpdate } from "@/misc/hooks/useProductUpdate";
import { classNames } from "@/misc/styles";
import Link from "next/link";

/**
 *
 */
export const Cart: React.FC = () => {
  const { updateProduct, loading: updateProductLoading } = useProductUpdate();
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  if (!data) return <LoadingSpinner />;

  // This will be `true` while re-fetching the checkout
  // after a change in a product.
  const checkoutRefreshing = checkoutInfoLoading || updateProductLoading;

  return (
    <div className="bg-white w-full">
      <CheckoutSteps currentStep={0} />

      <div className="mt-12">
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <div>
              <CartProducts
                products={data.lines}
                onProductUpdate={updateProduct}
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
            <Island variant="solid">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Total
              </h2>

              <div>
                <CartSummary checkout={data} />
              </div>

              <div className="mt-6">
                <Link href="/checkout/shipping">
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    text="Continue to shipping"
                    isLoading={checkoutRefreshing}
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
