import { GetProductsDocument } from "@/__generated__/graphql";
import { ProductDetails } from "@/components/products/ProductDetails";
import {
  getSingleProductVariables,
  parseProduct,
} from "@/queries/products/data";
import { getApolloClient } from "@/misc/apollo";

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
  return <ProductDetails slug={params.slug} />;
}
