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
  return <Products />;
}
