"use client";

import {
  GetCheckoutInfoDocument,
  RemoveProductFromCartDocument,
  UpdateProductInCartDocument,
} from "@/__generated__/graphql";
import { CartProducts } from "@/components/checkout/CartProducts";
import { CartSummary } from "@/components/checkout/CartSummary";
import { Button } from "@/components/core/Button";
import { useCheckoutToken } from "@/misc/states/checkoutTokenStore";
import { classNames } from "@/misc/styles";
import {
  parseCheckoutInfo,
  parseCheckoutProductVariant,
} from "@/queries/checkout/data";
import { parseVariant } from "@/queries/products/data";
import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useCallback, useMemo } from "react";

/**
 *
 */
export const Cart: React.FC = () => {
  const checkoutToken = useCheckoutToken();
  const [updateProducts, { loading: updateProductLoading }] = useMutation(
    UpdateProductInCartDocument
  );
  const [removeProducts, { loading: deleteProductLoading }] = useMutation(
    RemoveProductFromCartDocument
  );

  const { data, loading: checkoutInfoLoading } = useQuery(
    GetCheckoutInfoDocument,
    {
      variables: { checkoutToken },
      skip: !checkoutToken,
    }
  );

  const parsedCheckout = useMemo(
    () => (data ? parseCheckoutInfo(data) : null),
    [data]
  );

  const parsedLines = useMemo(() => {
    return (
      data?.checkout?.lines.map(({ id, variant, quantity }) => ({
        id,
        variant: parseVariant(variant),
        product: parseCheckoutProductVariant(variant),
        quantity,
      })) ?? []
    );
  }, [data]);

  const handleUpdateProduct = useCallback(
    (variantId: string, quantity: number) => {
      updateProducts({
        variables: {
          checkoutToken,
          lines: parsedLines.map((line) => ({
            variantId: line.variant.id,
            quantity: line.variant.id === variantId ? quantity : line.quantity,
          })),
        },
        refetchQueries: ["GetCheckoutInfo"],
      });
    },
    [parsedLines, checkoutToken, updateProducts]
  );

  const handleRemoveProduct = useCallback(
    (lineId: string) => {
      removeProducts({
        variables: {
          checkoutToken,
          linesIds: [lineId],
        },
        refetchQueries: ["GetCheckoutInfo"],
      });
    },
    [checkoutToken, removeProducts]
  );

  if (!parsedCheckout) return null;

  // This will be `true` while re-fetching the checkout
  // after a change in a product.
  const checkoutRefreshing =
    checkoutInfoLoading || updateProductLoading || deleteProductLoading;

  return (
    <div className="bg-white w-full">
      <div>
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <div>
              <CartProducts
                products={parsedLines}
                onProductUpdate={handleUpdateProduct}
                onProductRemove={handleRemoveProduct}
              />
            </div>
          </section>

          <section
            aria-labelledby="summary-heading"
            className={classNames(
              "mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8",
              checkoutRefreshing ? "opacity-50" : ""
            )}
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <div>
              <CartSummary checkout={parsedCheckout} />
            </div>

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
          </section>
        </form>
      </div>
    </div>
  );
};
