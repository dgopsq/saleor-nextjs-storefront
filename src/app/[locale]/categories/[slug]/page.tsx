import { GetCategoryMetaDocument } from "@/__generated__/graphql";
import { CategoryProducts } from "@/components/products/CategoryProducts";
import { getApolloClient } from "@/misc/apollo/apollo";
import { Metadata } from "next";

type Params = {
  slug: string;
};

export default async function SingleProductPage({
  params,
}: {
  params: Params;
}) {
  return <CategoryProducts slug={params.slug} />;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = getApolloClient();

  const { data } = await client.query({
    query: GetCategoryMetaDocument,
    variables: { slug: params.slug },
  });

  const title = data?.category?.seoTitle || data?.category?.name || undefined;
  const description = data?.category?.seoDescription || undefined;

  return {
    title,
    description,
  };
}
