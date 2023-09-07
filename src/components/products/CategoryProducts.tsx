"use client";

import { GetCategoryProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import {
  getCategoryProductsVariables,
  parseAllCategoryProducts,
} from "@/queries/categories/data";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useMemo } from "react";

type Props = {
  slug: string;
};

/**
 * Renders all products from a specific category.
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
