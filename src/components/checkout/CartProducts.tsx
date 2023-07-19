import { formatPrice } from "@/misc/currencies";
import { UseProductRemoveReturn } from "@/misc/hooks/useProductRemove";
import { UseProductUpdateReturn } from "@/misc/hooks/useProductUpdate";
import { CheckoutProduct } from "@/queries/checkout/data";
import { ProductVariant, generateProductUrl } from "@/queries/products/data";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export type CartProduct = {
  id: string;
  variant: ProductVariant;
  product: CheckoutProduct;
  quantity: number;
};

type Props = {
  products: Array<CartProduct>;
  onProductUpdate: UseProductUpdateReturn["updateProduct"];
  onProductRemove: UseProductRemoveReturn["removeProduct"];
};

/**
 *
 */
export const CartProducts: React.FC<Props> = ({
  products,
  onProductUpdate,
  onProductRemove,
}) => {
  return (
    <ul role="list" className="divide-y divide-gray-100 -mt-6">
      {products.map((line, productIdx) => {
        const imageUrl = line.variant.images[0]?.url ?? null;
        const imageAlt = line.variant.images[0]?.alt ?? "";

        return (
          <li key={line.id} className="flex py-6 sm:py-10">
            <div className="flex-shrink-0">
              {imageUrl ? (
                <Link
                  href={generateProductUrl({
                    product: line.product,
                    variantId: line.variant.id,
                  })}
                >
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
                  <Link
                    href={generateProductUrl({
                      product: line.product,
                      variantId: line.variant.id,
                    })}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-sm">{line.product.name}</h3>
                    </div>

                    {line.variant.attributes.map(({ attribute, values }) => (
                      <p
                        key={attribute.id}
                        className="mt-1 text-xs font-medium text-gray-400"
                      >
                        {`${attribute.name}: ${values
                          .map((value) => value.name)
                          .join(", ")}`}
                      </p>
                    ))}
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
                  <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                    Quantity, {line.variant.name}
                  </label>

                  <select
                    id={`quantity-${productIdx}`}
                    name={`quantity-${productIdx}`}
                    className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    value={line.quantity}
                    onChange={(e) =>
                      onProductUpdate(line.variant.id, parseInt(e.target.value))
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
                      onClick={() => onProductRemove(line.id)}
                    >
                      <span className="sr-only">Remove</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
