"use client";

import { ProductDescription } from "@/components/products/ProductDescription";
import { ProductImages } from "@/components/products/ProductImages";
import { parseProduct, parseVariantsAttributes } from "@/queries/products/data";
import { formatSingleProductPrice } from "@/misc/currencies";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { useQuery } from "@apollo/client";
import {
  DetailedProductFragment,
  DetailedProductFragmentDoc,
  GetProductDocument,
  PreviewProductFragment,
  PreviewProductFragmentDoc,
} from "@/__generated__/graphql";
import {
  useFragment,
  useSuspenseQuery,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ProductVariants } from "@/components/products/ProductVariants";

type Props = {
  slug: string;
};

/**
 *
 */
export const ProductDetails: React.FC<Props> = ({ slug }) => {
  useSuspenseQuery(GetProductDocument, { variables: { slug } });

  const { data: detailedData } = useFragment({
    fragment: DetailedProductFragmentDoc,
    fragmentName: "DetailedProduct",
    from: {
      __typename: "Product",
      slug,
    },
  });

  const { data: previewData } = useFragment({
    fragment: PreviewProductFragmentDoc,
    fragmentName: "PreviewProduct",
    from: {
      __typename: "Product",
      slug,
    },
  });

  const product = useMemo(
    () =>
      detailedData && previewData
        ? parseProduct(
            detailedData as DetailedProductFragment,
            previewData as PreviewProductFragment
          )
        : null,
    [detailedData, previewData]
  );

  const formattedPrice = useMemo(
    () => (product ? formatSingleProductPrice(product?.prices) : null),
    [product]
  );

  const [currentVariantId, setCurrentVariantId] = useState(
    product?.defaultVariant?.id ?? null
  );

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

            {product.variants.length > 0 && currentVariantId ? (
              <div className="mt-6">
                <ProductVariants
                  variants={product.variants}
                  value={currentVariantId}
                  onChange={setCurrentVariantId}
                />
              </div>
            ) : undefined}

            <form className="mt-6">
              <div className="mt-10 flex">
                {currentVariantId ? (
                  <AddToCartButton variantId={currentVariantId} />
                ) : undefined}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
