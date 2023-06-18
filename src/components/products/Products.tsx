"use client";

import { GetProductsDocument } from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import {
  ProductListItem,
  generateProductUrl,
  getAllProductsVariables,
  parseAllProducts,
} from "@/queries/products/data";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Link from "next/link";
import { useMemo } from "react";

const baseVariables = getAllProductsVariables();

type Props = {
  products: Array<ProductListItem>;
};

/**
 * This component is used to render a list of products.
 */
export const Products: React.FC<Props> = ({ products }) => {
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
