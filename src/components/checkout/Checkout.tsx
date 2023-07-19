import { Button } from "@/components/core/Button";
import { Island } from "@/components/core/Island";
import { classNames } from "@/misc/styles";
import Link from "next/link";

/**
 *
 */
export const Checkout: React.FC = () => {
  const checkoutRefreshing = false;

  return (
    <div className="bg-white w-full">
      <div>
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <div>Products</div>
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

              <div>Summary</div>

              <div className="mt-6">
                <Link href="/checkout">
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    text="Checkout"
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
