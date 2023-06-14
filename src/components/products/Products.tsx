"use client";

import { GetProductsDocument, GetProductsQuery } from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import {
  Product,
  generateProductUrl,
  getAllProductsVariables,
  parseProduct,
} from "@/queries/products/data";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  products: Array<Product>;
};

export const Products: React.FC<Props> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:gap-x-8">
      {products.map((product) => {
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
