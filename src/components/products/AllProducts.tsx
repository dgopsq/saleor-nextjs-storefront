"use client";

import { GetProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import {
  getAllProductsVariables,
  parseAllProducts,
} from "@/queries/products/data";
import { refreshAuthToken } from "@/queries/user/token";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useEffect, useMemo } from "react";

const baseVariables = getAllProductsVariables();

type Props = Record<string, never>;

/**
 *
 */
export const AllProducts: React.FC<Props> = () => {
  const { data } = useSuspenseQuery(GetProductsDocument, {
    variables: baseVariables,
  });

  const products = useMemo(() => (data ? parseAllProducts(data) : []), [data]);

  useEffect(() => {
    refreshAuthToken();
  }, []);

  return <Products products={products} />;
};
