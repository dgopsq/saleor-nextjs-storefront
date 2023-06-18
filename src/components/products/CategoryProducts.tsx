"use client";

import { GetCategoryProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import {
  getCategoryProductsVariables,
  parseAllCategoryProducts,
} from "@/queries/categories/data";
import { parseAllProducts } from "@/queries/products/data";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useMemo } from "react";

type Props = {
  slug: string;
};

/**
 *
 */
export const CategoryProducts: React.FC<Props> = ({ slug }) => {
  const variables = useMemo(() => getCategoryProductsVariables(slug), [slug]);

  const { data } = useSuspenseQuery(GetCategoryProductsDocument, {
    variables,
  });

  const products = useMemo(
    () => (data ? parseAllCategoryProducts(data) : []),
    [data]
  );

  return <Products products={products} />;
};
