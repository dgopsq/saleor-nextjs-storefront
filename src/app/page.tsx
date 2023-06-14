import { GetProductsDocument } from "@/__generated__/graphql";
import { Products } from "@/components/products/Products";
import { getApolloClient } from "@/misc/apollo";

export default async function Home() {
  const client = getApolloClient();

  const res = await client.query({
    query: GetProductsDocument,
    variables: { first: 10 },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Products prefetchedData={res.data} />
    </main>
  );
}
