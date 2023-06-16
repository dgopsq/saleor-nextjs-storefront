import { GetProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import { getAllProductsVariables, parseProduct } from "@/queries/products/data";
import { getApolloClient } from "@/misc/apollo";

export default async function ProductsPage() {
  const client = getApolloClient();
  const variables = getAllProductsVariables();

  const { data } = await client.query({
    query: GetProductsDocument,
    variables,
  });

  const parsedProducts =
    data?.products?.edges?.map(({ node }) => {
      return parseProduct(node);
    }) ?? [];

  const hasMoreItems = data.products?.pageInfo?.hasNextPage ?? false;
  const cursor = data.products?.pageInfo?.endCursor ?? null;

  return (
    <Products
      products={parsedProducts}
      initialVariables={variables}
      initialCursor={hasMoreItems ? cursor : null}
    />
  );
}
