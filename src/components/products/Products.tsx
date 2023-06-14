"use client";

import { GetProductsDocument, GetProductsQuery } from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import {
  generateProductUrl,
  getAllProductsVariables,
  parseProduct,
} from "@/queries/products/data";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  prefetchedData?: GetProductsQuery;
};

export const Products: React.FC<Props> = ({ prefetchedData }) => {
  const { data } = useQuery(GetProductsDocument, {
    variables: getAllProductsVariables(),
    skip: !!prefetchedData,
  });

  const computedData = useMemo(
    () => prefetchedData ?? data,
    [prefetchedData, data]
  );

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:gap-x-8">
      {computedData?.products?.edges?.map(({ node }) => {
        const product = parseProduct(node);
        const productUrl = generateProductUrl(product);

        return (
          <Link key={product.id} href={productUrl}>
            <SingleProduct product={product} />
          </Link>
        );
      })}
    </div>
  );
};
