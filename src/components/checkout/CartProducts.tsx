import { Island } from "@/components/core/Island";
import { QuantitySelect } from "@/components/products/QuantitySelect";
import { formatPrice } from "@/misc/currencies";
import { UseProductUpdateReturn } from "@/misc/hooks/useProductUpdate";
import { classNames } from "@/misc/styles";
import { CheckoutProduct } from "@/queries/checkout/data";
import { ProductVariant, generateProductUrl } from "@/queries/products/data";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const priceFallback = "-";

export type CartProduct = {
  id: string;
  variant: ProductVariant;
  product: CheckoutProduct;
  quantity: number;
};

type Props = {
  products: Array<CartProduct>;
  onProductUpdate?: UseProductUpdateReturn["updateProduct"];
  compact?: boolean;
};

/**
 *
 */
export const CartProducts: React.FC<Props> = ({
  products,
  onProductUpdate,
  compact,
}) => {
  const imageSize = useMemo(
    () => (compact ? "sm:h-28 sm:w-28" : "sm:h-40 sm:w-40"),
    [compact]
  );

  const paddingTopIndexGap = useMemo(
    () => (compact ? "pt-6" : "pt-10"),
    [compact]
  );
  const paddingBottomIndexGap = useMemo(
    () => (compact ? "pb-6" : "pb-10"),
    [compact]
  );

  if (products.length === 0)
    return (
      <div>
        <p className="text-gray-400">Your cart is empty.</p>
      </div>
    );

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {products.map((line, index) => {
        const imageUrl = line.variant.images[0]?.url ?? null;
        const imageAlt = line.variant.images[0]?.alt ?? "";

        return (
          <li
            key={line.id}
            className={classNames(
              "flex",
              index > 0 ? paddingTopIndexGap : "",
              index < products.length - 1 ? paddingBottomIndexGap : ""
            )}
          >
            <div className="flex-shrink-0">
              {imageUrl ? (
                <Link
                  href={generateProductUrl({
                    product: line.product,
                    variantId: line.variant.id,
                  })}
                >
                  <Island variant="solid-darker" noPadding>
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      className={classNames(
                        imageSize,
                        "h-24 w-24 object-cover object-center"
                      )}
                      width={150}
                      height={150}
                    />
                  </Island>
                </Link>
              ) : undefined}
            </div>

            <div className="ml-4 flex flex-1 flex-row gap-4 justify-between sm:ml-6">
              <div className="grow-0 basis-full overflow-hidden">
                <Link
                  href={generateProductUrl({
                    product: line.product,
                    variantId: line.variant.id,
                  })}
                >
                  <div>
                    <span
                      className={classNames(
                        compact ? "block text-sm truncate" : "text-md",
                        "font-medium"
                      )}
                    >
                      {line.product.name}
                    </span>
                  </div>

                  {line.variant.attributes.map(({ attribute, values }) => (
                    <p
                      key={attribute.id}
                      className="mt-2 text-sm font-medium text-gray-400"
                    >
                      {`${attribute.name}: ${values
                        .map((value) => value.name)
                        .join(", ")}`}
                    </p>
                  ))}
                </Link>

                <div className="mt-2 flex flex-row items-center">
                  <p
                    className={classNames(
                      compact ? "text-sm" : "",
                      "font-semibold text-gray-900"
                    )}
                  >
                    {line.variant.price
                      ? formatPrice(
                          line.variant.price.amount,
                          line.variant.price.currency
                        )
                      : priceFallback}
                  </p>

                  {compact ? (
                    <div className="ml-1">
                      <p className="text-sm">× {line.quantity}</p>
                    </div>
                  ) : undefined}
                </div>
              </div>

              {!compact ? (
                <div className="basis-auto shrink-0 grow-0 flex flex-col  justify-between items-end mt-4 sm:mt-0">
                  <div>
                    <QuantitySelect
                      value={line.quantity}
                      onChange={(value) =>
                        onProductUpdate?.(line.variant.id, value)
                      }
                      variant={line.variant}
                    />
                  </div>
                </div>
              ) : undefined}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
