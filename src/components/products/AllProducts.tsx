"use client";

import { GetProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import {
  ProductListItem,
  getAllProductsVariables,
  parseAllProducts,
} from "@/queries/products/data";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useMemo } from "react";

const baseVariables = getAllProductsVariables();

type Props = {};

/**
 *
 */
export const AllProducts: React.FC<Props> = () => {
  const { data } = useSuspenseQuery(GetProductsDocument, {
    variables: baseVariables,
  });

  const products = useMemo(() => (data ? parseAllProducts(data) : []), [data]);

  return <Products products={products} />;
};
