import { parsePreviewProduct } from "@/queries/products/data";
import { formatSingleProductPrice } from "@/misc/currencies";
import Image from "next/image";
import React, { useMemo } from "react";
import {
  PreviewProductFragment,
  PreviewProductFragmentDoc,
} from "@/__generated__/graphql";
import { useApolloClient, useFragment } from "@apollo/client";

type Props = {
  slug: string;
};

/**
 *
 */
export const SingleProduct: React.FC<Props> = ({ slug }) => {
  const { data } = useFragment({
    fragment: PreviewProductFragmentDoc,
    from: {
      __typename: "Product",
      slug,
    },
  });

  const product = useMemo(
    () => (data ? parsePreviewProduct(data as PreviewProductFragment) : null),
    [data]
  );

  const imageSrc = product?.images[0]?.url ?? null;
  const imageAlt = product?.images[0]?.alt ?? null;
  const name = product?.name;

  const formattedPrice = useMemo(
    () => (product ? formatSingleProductPrice(product?.prices) : null),
    [product]
  );

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            width={200}
            height={200}
          />
        ) : undefined}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-900">{formattedPrice}</p>
      </div>
    </div>
  );
};
