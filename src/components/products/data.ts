import { FragmentType, getFragmentData } from "@/__generated__";
import {
  GenericProductFragmentDoc,
  GenericProductVariantFragmentDoc,
} from "@/__generated__/graphql";

type ProductImage = {
  url: string;
  alt?: string;
};

type ProductPrice = {
  amount: number;
  currency: string;
};

type ProductAttribute = {
  attribute: {
    id: string;
    name: string | null;
  };

  values: Array<{
    id: string;
    name: string | null;
  }>;
};

type ProductVariant = {
  id: string;
  sku: string | null;
  name: string;
  images: Array<ProductImage>;
  price: ProductPrice | null;
  discount: ProductPrice | null;
  attributes: Array<ProductAttribute>;
};

/**
 *
 */
export type Product = {
  id: string;
  name: string;
  images: Array<ProductImage>;
  prices: {
    from: ProductPrice | null;
    to: ProductPrice | null;
  };
  defaultVariant: ProductVariant | null;
  variants: Array<ProductVariant>;
};

/**
 *
 */
function parseVariant(
  input: FragmentType<typeof GenericProductVariantFragmentDoc>
): ProductVariant {
  const { id, sku, name, media, pricing, attributes } = getFragmentData(
    GenericProductVariantFragmentDoc,
    input
  );

  return {
    id,
    name,
    sku: sku ?? null,
    images:
      media?.map((media) => ({
        url: media?.url ?? "",
        alt: media?.alt ?? "",
      })) ?? [],
    price: pricing?.price?.gross
      ? {
          amount: pricing.price.gross.amount,
          currency: pricing.price.gross.currency,
        }
      : null,
    discount: pricing?.discount?.gross
      ? {
          amount: pricing.discount.gross.amount,
          currency: pricing.discount.gross.currency,
        }
      : null,
    attributes:
      attributes?.map((attribute) => ({
        attribute: {
          id: attribute.attribute.id,
          name: attribute.attribute.name ?? null,
        },

        values: attribute.values.map((value) => ({
          id: value.id,
          name: value.name ?? null,
        })),
      })) ?? [],
  };
}

/**
 *
 */
export function parseProduct(
  input: FragmentType<typeof GenericProductFragmentDoc>
): Product {
  const { id, name, media, pricing, defaultVariant, variants } =
    getFragmentData(GenericProductFragmentDoc, input);

  return {
    id,
    name,
    images:
      media?.map((media) => ({
        url: media?.url ?? "",
        alt: media?.alt ?? "",
      })) ?? [],
    prices: {
      from: pricing?.priceRange?.start?.gross
        ? {
            amount: pricing.priceRange.start.gross.amount,
            currency: pricing.priceRange.start.gross.currency,
          }
        : null,
      to: pricing?.priceRange?.stop?.gross
        ? {
            amount: pricing.priceRange.stop.gross.amount,
            currency: pricing.priceRange.stop.gross.currency,
          }
        : null,
    },
    defaultVariant: defaultVariant ? parseVariant(defaultVariant) : null,
    variants: variants?.map(parseVariant) ?? [],
  };
}
