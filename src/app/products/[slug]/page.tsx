import { ProductDetails } from "@/components/products/ProductDetails";

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
