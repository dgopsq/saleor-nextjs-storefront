import { GetProductsDocument } from "@/__generated__/graphql";
import { SingleProduct } from "@/components/products/SingleProduct";
import {
  getSingleProductVariables,
  parseProduct,
} from "@/components/products/data";
import { getApolloClient } from "@/misc/apollo";

type Params = {
  slug: string;
};

export default async function SingleProductPage({
  params,
}: {
  params: Params;
}) {
  const client = getApolloClient();

  const res = await client.query({
    query: GetProductsDocument,
    variables: getSingleProductVariables(params.slug),
  });

  const retrievedProduct = res.data.products?.edges?.[0]?.node ?? null;
  const parsedProduct = retrievedProduct
    ? parseProduct(retrievedProduct)
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {parsedProduct ? <SingleProduct product={parsedProduct} /> : null}
    </main>
  );
}
