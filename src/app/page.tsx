import { GetProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import { getAllProductsVariables } from "@/components/products/data";
import { getApolloClient } from "@/misc/apollo";

export default async function HomePage() {
  const client = getApolloClient();

  const res = await client.query({
    query: GetProductsDocument,
    variables: getAllProductsVariables(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Products prefetchedData={res.data} />
    </main>
  );
}
