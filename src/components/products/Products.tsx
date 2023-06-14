"use client";

import {
  GetProductsDocument,
  GetProductsQuery,
  OrderDirection,
  ProductOrderField,
} from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import { Product, parseProduct } from "@/components/products/data";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

type Props = {
  prefetchedData?: GetProductsQuery;
};

export const Products: React.FC<Props> = ({ prefetchedData }) => {
  const { data } = useQuery(GetProductsDocument, {
    variables: {
      first: 10,
      filters: { categories: ["Q2F0ZWdvcnk6Mjc="] },
      sortBy: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
    },
    skip: !!prefetchedData,
  });

  const computedData = useMemo(
    () => prefetchedData ?? data,
    [prefetchedData, data]
  );

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8">
      {computedData?.products?.edges?.map(({ node }) => {
        const product = parseProduct(node);
        return <SingleProduct key={product.id} product={product} />;
      })}
    </div>
  );
};
