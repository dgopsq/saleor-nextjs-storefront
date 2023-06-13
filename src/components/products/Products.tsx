"use client";

import { GetHomepageProductsDocument } from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import { useQuery } from "@apollo/client";

export const Products: React.FC = () => {
  const { loading, error, data } = useQuery(GetHomepageProductsDocument, {
    variables: { first: 10 },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {data?.products?.edges?.map(({ node: product }) => (
        <SingleProduct
          key={product.id}
          id={product.id}
          name={product.name}
          priceStartAmount={
            product.pricing?.priceRange?.start?.gross?.amount ?? 0
          }
          priceStartCurrency={
            product.pricing?.priceRange?.start?.gross?.currency ?? "EUR"
          }
          imageSrc={product.media?.[0]?.url}
        />
      ))}
    </div>
  );
};
