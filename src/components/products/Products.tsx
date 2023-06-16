"use client";

import {
  GetProductsDocument,
  GetProductsQueryVariables,
} from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import {
  Product,
  generateProductUrl,
  parseProduct,
} from "@/queries/products/data";
import { useLazyQuery } from "@apollo/client";
import Link from "next/link";
import { useCallback, useState } from "react";

type Props = {
  products: Array<Product>;
  initialVariables: GetProductsQueryVariables;
  initialCursor: string | null;
};

/**
 * This component is used to render a list of products.
 *
 * N.B. This list will be pre-populated with the products
 * that are passed in the `products` prop. This because we want
 * the server to actually handle the first rendering.
 */
export const Products: React.FC<Props> = ({
  products,
  initialVariables,
  initialCursor,
}) => {
  const [productsQueue, setProductsQueue] = useState<Array<Product>>(products);
  const [cursor, setCursor] = useState(initialCursor);
  const [getProducts] = useLazyQuery(GetProductsDocument);

  const handleShowMore = useCallback(() => {
    getProducts({
      variables: {
        after: cursor ?? undefined,

        // FIXME: is this safe?
        ...(initialVariables as GetProductsQueryVariables),
      },

      onCompleted: (data) => {
        // FIXME: This should not happen, and it
        // should be logged.
        if (!data?.products) return;

        const { products } = data;

        const parsedProducts =
          products.edges?.map(({ node }) => {
            return parseProduct(node);
          }) ?? [];

        setProductsQueue((currentQueue) => currentQueue.concat(parsedProducts));

        const hasNextPage = products.pageInfo?.hasNextPage ?? false;
        const newCursor = products.pageInfo?.endCursor ?? null;

        setCursor(hasNextPage ? newCursor : null);
      },
    });
  }, [cursor, getProducts, initialVariables]);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:gap-x-8">
      {productsQueue.map((product) => {
        const productUrl = generateProductUrl(product);

        return (
          <Link key={product.id} href={productUrl}>
            <SingleProduct product={product} />
          </Link>
        );
      })}

      {cursor ? <button onClick={handleShowMore}>Show more</button> : undefined}
    </div>
  );
};
