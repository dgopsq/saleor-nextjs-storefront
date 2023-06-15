"use client";

import {
  GetCheckoutInfoDocument,
  UpdateProductInCartDocument,
} from "@/__generated__/graphql";
import { Button } from "@/components/core/Button";
import { formatPrice } from "@/misc/currencies";
import { useCheckoutToken } from "@/misc/hooks/useCheckoutToken";
import { classNames } from "@/misc/styles";
import {
  parseCheckoutInfo,
  parseCheckoutProductVariant,
} from "@/queries/checkout/data";
import { generateProductUrl, parseVariant } from "@/queries/products/data";
import { useMutation, useQuery } from "@apollo/client";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
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

  const { data, loading: checkoutInfoLoading } = useQuery(
    GetCheckoutInfoDocument,
    {
      variables: { checkoutToken },
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

  if (!parsedCheckout) return null;

  // This will be `true` while re-fetching the checkout
  // after a change in a product.
  const checkoutRefreshing = checkoutInfoLoading || updateProductLoading;

  return (
    <div className="bg-white w-full">
      <div>
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-gray-200 -mt-6"
            >
              {parsedLines.map((line, productIdx) => {
                const imageUrl = line.variant.images[0]?.url ?? null;
                const imageAlt = line.variant.images[0]?.alt ?? "";

                return (
                  <li key={line.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      {imageUrl ? (
                        <Link href={generateProductUrl(line.product)}>
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-40 sm:w-40 bg-gray-200"
                            width={150}
                            height={150}
                          />
                        </Link>
                      ) : undefined}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <Link href={generateProductUrl(line.product)}>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <a
                                  href="#"
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {line.product.name}
                                </a>
                              </h3>
                            </div>

                            <p className="mt-1 text-xs font-medium text-gray-400">
                              {line.variant.name}
                            </p>
                          </Link>

                          {line.variant.price ? (
                            <p className="mt-4 text-sm font-medium text-gray-900">
                              {formatPrice(
                                line.variant.price.amount,
                                line.variant.price.currency
                              )}
                            </p>
                          ) : undefined}
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label
                            htmlFor={`quantity-${productIdx}`}
                            className="sr-only"
                          >
                            Quantity, {line.variant.name}
                          </label>

                          <select
                            id={`quantity-${productIdx}`}
                            name={`quantity-${productIdx}`}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            value={line.quantity}
                            onChange={(e) =>
                              handleUpdateProduct(
                                line.variant.id,
                                parseInt(e.target.value)
                              )
                            }
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                          </select>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Order summary */}
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

            <dl className="mt-6 space-y-4">
              {parsedCheckout.subtotalPrice ? (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatPrice(
                      parsedCheckout.subtotalPrice.amount,
                      parsedCheckout.subtotalPrice.currency
                    )}
                  </dd>
                </div>
              ) : undefined}

              {parsedCheckout.shippingPrice ? (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Learn more about how shipping is calculated
                      </span>
                      <QuestionMarkCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatPrice(
                      parsedCheckout.shippingPrice.amount,
                      parsedCheckout.shippingPrice.currency
                    )}
                  </dd>
                </div>
              ) : undefined}

              {parsedCheckout.totalPrice ? (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {formatPrice(
                      parsedCheckout.totalPrice.amount,
                      parsedCheckout.totalPrice.currency
                    )}
                  </dd>
                </div>
              ) : undefined}
            </dl>

            <div className="mt-6">
              <Button
                type="button"
                variant="primary"
                size="large"
                text="Checkout"
                isLoading={checkoutRefreshing}
              />
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
