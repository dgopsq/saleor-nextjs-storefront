import { GetCategoryProductsDocument } from "@/__generated__/graphql";
import { getApolloClient } from "@/misc/apollo";
import { Products } from "@/components/products/Products";
import { parseProduct } from "@/queries/products/data";

export async function generateStaticParams() {
  return [];
}

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
    query: GetCategoryProductsDocument,
    variables: { slug: params.slug, first: 10 },
  });

  const parsedProducts =
    res.data.category?.products?.edges?.map(({ node }) => {
      return parseProduct(node);
    }) ?? [];

  return <Products products={parsedProducts} />;
}
