import { CategoryProducts } from "@/components/products/CategoryProducts";

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
