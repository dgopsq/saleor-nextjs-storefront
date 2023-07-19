import { Island } from "@/components/core/Island";
import { Select } from "@/components/core/Select";
import { formatPrice } from "@/misc/currencies";
import { UseProductUpdateReturn } from "@/misc/hooks/useProductUpdate";
import { classNames } from "@/misc/styles";
import { CheckoutProduct } from "@/queries/checkout/data";
import { ProductVariant, generateProductUrl } from "@/queries/products/data";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const qtyRange = Array.from({ length: 20 }, (_, index) => index);

export type CartProduct = {
  id: string;
  variant: ProductVariant;
  product: CheckoutProduct;
  quantity: number;
};

type Props = {
  products: Array<CartProduct>;
  onProductUpdate: UseProductUpdateReturn["updateProduct"];
  condensed?: boolean;
};

/**
 *
 */
export const CartProducts: React.FC<Props> = ({
  products,
  onProductUpdate,
  condensed,
}) => {
  const imageSize = useMemo(
    () => (condensed ? "sm:h-28 sm:w-28" : "sm:h-40 sm:w-40"),
    [condensed]
  );

  const paddingTopIndexGap = useMemo(
    () => (condensed ? "pt-6" : "pt-10"),
    [condensed]
  );
  const paddingBottomIndexGap = useMemo(
    () => (condensed ? "pb-6" : "pb-10"),
    [condensed]
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

            <div className="ml-4 flex flex-1 flex-row justify-between sm:ml-6">
              <div>
                <Link
                  href={generateProductUrl({
                    product: line.product,
                    variantId: line.variant.id,
                  })}
                >
                  <div className="flex justify-between">
                    <h3
                      className={classNames(
                        condensed ? "text-sm truncate" : "text-md",
                        "font-medium"
                      )}
                    >
                      {line.product.name}
                    </h3>
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

                {line.variant.price ? (
                  <p
                    className={classNames(
                      condensed ? "text-sm" : "",
                      "mt-2 font-semibold text-gray-900"
                    )}
                  >
                    {formatPrice(
                      line.variant.price.amount,
                      line.variant.price.currency
                    )}
                  </p>
                ) : undefined}
              </div>

              <div className="flex flex-col justify-between items-end mt-4 sm:mt-0">
                <div>
                  <Select
                    value={line.quantity}
                    onChange={(value) =>
                      onProductUpdate(line.variant.id, value)
                    }
                    options={qtyRange.map((value) => ({
                      id: value.toString(),
                      label: value.toString(),
                      value,
                    }))}
                    parseValue={parseInt}
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
