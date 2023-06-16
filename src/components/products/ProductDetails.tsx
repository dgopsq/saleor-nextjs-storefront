"use client";

import { ProductDescription } from "@/components/products/ProductDescription";
import { ProductImages } from "@/components/products/ProductImages";
import { parseProduct } from "@/queries/products/data";
import { formatSingleProductPrice } from "@/misc/currencies";
import { useMemo } from "react";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { GetSingleProductDocument } from "@/__generated__/graphql";
import { useQuery } from "@apollo/client";

type Props = {
  slug: string;
};

/**
 *
 */
export const ProductDetails: React.FC<Props> = ({ slug }) => {
  const { data } = useQuery(GetSingleProductDocument, { variables: { slug } });

  const product = useMemo(
    () => (data?.product ? parseProduct(data.product) : null),
    [data]
  );

  const formattedPrice = useMemo(
    () => (product ? formatSingleProductPrice(product?.prices) : null),
    [product]
  );

  const variantId = product?.variants[0]?.id ?? null;

  if (!product) return null;

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
                {variantId ? (
                  <AddToCartButton variantId={variantId} />
                ) : undefined}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
