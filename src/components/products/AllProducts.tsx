"use client";

import { GetProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import {
  getAllProductsVariables,
  parseAllProducts,
} from "@/queries/products/data";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useMemo, useTransition } from "react";

const baseVariables = getAllProductsVariables();

type Props = Record<string, never>;

/**
 *
 */
export const AllProducts: React.FC<Props> = () => {
  const [nextDataLoading, nextDataTransition] = useTransition();

  const { data, fetchMore } = useSuspenseQuery(GetProductsDocument, {
    variables: baseVariables,
  });

  const parsedProducts = useMemo(() => {
    return parseAllProducts(data);
  }, [data]);

  const handleShowMore = useMemo(() => {
    const hasNextPage = data?.products?.pageInfo?.hasNextPage ?? false;
    const nextCursor = data?.products?.pageInfo?.endCursor ?? null;

    return hasNextPage && nextCursor
      ? () =>
          nextDataTransition(() => {
            fetchMore({
              variables: getAllProductsVariables({ cursor: nextCursor }),
            });
          })
      : undefined;
  }, [data, fetchMore, nextDataTransition]);

  return (
    <Products
      products={parsedProducts}
      onShowMore={handleShowMore}
      showMoreLoading={nextDataLoading}
    />
  );
};
