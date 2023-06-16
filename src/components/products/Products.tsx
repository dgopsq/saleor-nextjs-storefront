"use client";

import {
  GetProductsDocument,
  GetProductsQueryVariables,
} from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import {
  Product,
  generateProductUrl,
  getAllProductsVariables,
  parseAllProducts,
  parseProduct,
} from "@/queries/products/data";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

const baseVariables = getAllProductsVariables();

type Props = {};

/**
 * This component is used to render a list of products.
 *
 * N.B. This list will be pre-populated with the products
 * that are passed in the `products` prop. This because we want
 * the server to actually handle the first rendering.
 */
export const Products: React.FC<Props> = () => {
  const { data } = useSuspenseQuery(GetProductsDocument, {
    variables: baseVariables,
  });

  const products = useMemo(() => (data ? parseAllProducts(data) : []), [data]);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:gap-x-8">
      {products.map(({ id, slug }) => {
        const productUrl = generateProductUrl({ slug });

        return (
          <Link key={id} href={productUrl}>
            <SingleProduct slug={slug} />
          </Link>
        );
      })}
    </div>
  );
};
