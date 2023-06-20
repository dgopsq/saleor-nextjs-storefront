import { CategoryProducts } from "@/components/products/CategoryProducts";
import { Products } from "@/components/products/Products";

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
  return <CategoryProducts slug={params.slug} />;
}
