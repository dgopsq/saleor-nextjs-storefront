import { GetProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import { getAllProductsVariables } from "@/queries/products/data";
import { getApolloClient } from "@/misc/apollo";

export default async function ProductsPage() {
  const client = getApolloClient();

  const res = await client.query({
    query: GetProductsDocument,
    variables: getAllProductsVariables(),
  });

  return <Products prefetchedData={res.data} />;
}
