import { ProductDescription } from "@/components/products/ProductDescription";
import { ProductImages } from "@/components/products/ProductImages";
import { Product } from "@/components/products/data";
import { formatSingleProductPrice } from "@/misc/currencies";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  product: Product;
};

/**
 *
 */
export const ProductDetails: React.FC<Props> = ({ product }) => {
  const formattedPrice = useMemo(
    () => formatSingleProductPrice(product.prices),
    [product]
  );

  return (
    <div className="bg-white w-screen max-w-full">
      <div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div>
            <ProductImages images={product.images} />
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {formattedPrice}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              {product.description ? (
                <ProductDescription description={product.description} />
              ) : null}
            </div>

            <form className="mt-6">
              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Add to bag
                </button>

                <button
                  type="button"
                  className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon
                    className="h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
