"use client";

import {
  GetProductsDocument,
  OrderDirection,
  ProductOrderField,
} from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import { parseProduct } from "@/components/products/data";
import { useQuery } from "@apollo/client";

export const Products: React.FC = () => {
  const { loading, error, data } = useQuery(GetProductsDocument, {
    variables: {
      first: 10,
      filters: { categories: ["Q2F0ZWdvcnk6Mjc="] },
      sortBy: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
    },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8">
      {data?.products?.edges?.map(({ node }) => {
        const product = parseProduct(node);
        return <SingleProduct key={product.id} product={product} />;
      })}
    </div>
  );
};
