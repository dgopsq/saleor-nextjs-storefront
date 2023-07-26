"use client";

import { ProductImages } from "@/components/products/ProductImages";
import { parseProduct } from "@/queries/products/data";
import { formatPrice, formatSingleProductPrice } from "@/misc/currencies";
import { useEffect, useMemo, useState } from "react";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import {
  DetailedProductFragmentDoc,
  GetProductDocument,
  PreviewProductFragmentDoc,
} from "@/__generated__/graphql";
import {
  useFragment,
  useSuspenseQuery,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ProductVariants } from "@/components/products/ProductVariants";
import { useRouter } from "next/navigation";
import { publicConfig } from "@/misc/config";
import { EditorJSRenderer } from "@/components/core/EditorJSRenderer";
import { Label } from "@/components/core/Label";
import { QuantitySelect } from "@/components/products/QuantitySelect";

/**
 *
 */
function appendVariantToUrl(params: {
  variantId: string;
  url: string;
  defaultVariantId?: string;
}): string {
  const parsedUrl = new URL(params.url);
  const isDefaultVariant = params.variantId === params.defaultVariantId;

  if (isDefaultVariant)
    parsedUrl.searchParams.delete(publicConfig.variantIdQueryParam);
  else
    parsedUrl.searchParams.set(
      publicConfig.variantIdQueryParam,
      params.variantId
    );

  return parsedUrl.toString();
}

type Props = {
  slug: string;
  selectedVariant?: string;
};

/**
 *
 */
export const ProductDetails: React.FC<Props> = ({ slug, selectedVariant }) => {
  useSuspenseQuery(GetProductDocument, { variables: { slug } });
  const [qty, setQty] = useState(1);

  const router = useRouter();

  const { data: detailedData, complete: detailedComplete } = useFragment({
    fragment: DetailedProductFragmentDoc,
    fragmentName: "DetailedProduct",
    from: {
      __typename: "Product",
      slug,
    },
  });

  const { data: previewData, complete: previewComplete } = useFragment({
    fragment: PreviewProductFragmentDoc,
    fragmentName: "PreviewProduct",
    from: {
      __typename: "Product",
      slug,
    },
  });

  const product = useMemo(
    () =>
      detailedData && previewData && detailedComplete && previewComplete
        ? parseProduct(detailedData, previewData)
        : null,
    [detailedData, previewData, detailedComplete, previewComplete]
  );

  const defaultVariantId = useMemo(
    () => product?.defaultVariant?.id ?? null,
    [product]
  );

  const [currentVariantId, setCurrentVariantId] = useState(
    selectedVariant ?? defaultVariantId ?? null
  );

  const productVariant = useMemo(() => {
    if (!product || !currentVariantId) return null;

    return product.variants.find((variant) => variant.id === currentVariantId);
  }, [product, currentVariantId]);

  const formattedPrice = useMemo(() => {
    if (productVariant?.price)
      return formatPrice(
        productVariant.price.amount,
        productVariant.price.currency
      );
    else if (product?.prices) return formatSingleProductPrice(product.prices);
    else return null;
  }, [productVariant, product]);

  // Append the variant id to the URL.
  useEffect(() => {
    if (!currentVariantId) return;

    const newUrl = appendVariantToUrl({
      variantId: currentVariantId,
      url: window.location.href,
      defaultVariantId: defaultVariantId ?? undefined,
    });

    router.replace(newUrl);
  }, [currentVariantId, router, defaultVariantId]);

  if (!product || !currentVariantId) return null;

  return (
    <div className="bg-white w-screen max-w-full">
      <div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div>
            <ProductImages images={productVariant?.images || product.images} />
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
                <EditorJSRenderer data={product.description} />
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
              {publicConfig.showProductQuantitySelect && productVariant ? (
                <div>
                  <Label htmlFor="quantitySelect">Quantity</Label>

                  <div className="mt-2">
                    <QuantitySelect
                      id="quantitySelect"
                      variant={productVariant}
                      value={qty}
                      onChange={setQty}
                    />
                  </div>
                </div>
              ) : undefined}

              {currentVariantId ? (
                <div className="mt-6">
                  <AddToCartButton qty={qty} variantId={currentVariantId} />
                </div>
              ) : undefined}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
