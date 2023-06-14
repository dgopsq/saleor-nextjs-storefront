import { FragmentType, getFragmentData } from "@/__generated__";
import { GenericProductFragmentDoc } from "@/__generated__/graphql";

type ProductImage = {
  url: string;
  alt?: string;
};

type ProductPrice = {
  amount: number;
  currency: string;
};

/**
 *
 */
export type Product = {
  id: string;
  name: string;
  images: Array<ProductImage>;
  prices: {
    from: ProductPrice;
    to: ProductPrice;
  };
};

/**
 *
 */
export function parseProduct(
  input: FragmentType<typeof GenericProductFragmentDoc>
): Product {
  const { id, name, media, pricing } = getFragmentData(
    GenericProductFragmentDoc,
    input
  );

  return {
    id: id,
    name: name,
    images:
      media?.map((media) => ({
        url: media?.url ?? "",
        alt: media?.alt ?? "",
      })) ?? [],
    prices: {
      from: {
        amount: pricing?.priceRange?.start?.gross?.amount ?? 0,
        currency: pricing?.priceRange?.start?.gross?.currency ?? "EUR",
      },
      to: {
        amount: pricing?.priceRange?.stop?.gross?.amount ?? 0,
        currency: pricing?.priceRange?.stop?.gross?.currency ?? "EUR",
      },
    },
  };
}
