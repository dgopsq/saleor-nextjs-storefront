"use client";

import { CartProducts } from "@/components/checkout/CartProducts";
import { CartSummary } from "@/components/checkout/CartSummary";
import { Button } from "@/components/core/Button";
import { PageHeading, SectionHeading } from "@/components/core/Headings";
import { Island } from "@/components/core/Island";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useProductUpdate } from "@/misc/hooks/useProductUpdate";
import { checkoutInformationsRoute } from "@/misc/navigation";
import { classNames } from "@/misc/styles";
import { useRouter } from "next/navigation";

/**
 *
 */
export const Cart: React.FC = () => {
  const router = useRouter();
  const { updateProduct, loading: updateProductLoading } = useProductUpdate();
  const { data, loading: checkoutInfoLoading } = useCheckoutInfo();

  const canContinue = data && data.lines.length > 0;

  if (!data) return <LoadingSpinner />;

  // This will be `true` while re-fetching the checkout
  // after a change in a product.
  const checkoutRefreshing = checkoutInfoLoading || updateProductLoading;

  return (
    <div className="bg-white w-full">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <PageHeading>Cart</PageHeading>

          <div className="mt-8">
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
            <SectionHeading>Total</SectionHeading>

            <div>
              <CartSummary checkout={data} />
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="primary"
                size="large"
                text="Checkout"
                isLoading={checkoutRefreshing}
                isDisabled={!canContinue}
                onClick={() => router.push(checkoutInformationsRoute)}
              />
            </div>
          </Island>
        </section>
      </div>
    </div>
  );
};
