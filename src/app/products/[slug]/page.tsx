import { ProductDetails } from "@/components/products/ProductDetails";
import { publicConfig } from "@/misc/config";

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
