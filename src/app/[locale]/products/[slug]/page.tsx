import { GetProductMetaDocument } from "@/__generated__/graphql";
import { ProductDetails } from "@/components/products/ProductDetails";
import { getApolloClient } from "@/misc/apollo/apollo";
import { publicConfig } from "@/misc/config";
import { Metadata, ResolvingMetadata } from "next";

type Params = {
  slug: string;
};

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function SingleProductPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const rawVariantId = searchParams[publicConfig.variantIdQueryParam];
  const parsedVariantId = Array.isArray(rawVariantId)
    ? rawVariantId[0]
    : rawVariantId;

  return (
    <ProductDetails slug={params.slug} selectedVariant={parsedVariantId} />
  );
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Params;
    searchParams: SearchParams;
  },
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const client = getApolloClient();

  const { data } = await client.query({
    query: GetProductMetaDocument,
    variables: { slug: params.slug },
  });

  const title = data?.product?.seoTitle || data?.product?.name || undefined;
  const description = data?.product?.seoDescription || undefined;

  return {
    title,
    description,
  };
}
