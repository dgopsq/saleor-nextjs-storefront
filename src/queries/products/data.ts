import { FragmentType, getFragmentData } from "@/__generated__";
import {
  GenericProductFragmentDoc,
  GenericProductVariantFragmentDoc,
  GetProductsQuery,
  GetProductsQueryVariables,
  OrderDirection,
  PreviewProductFragmentDoc,
  ProductOrderField,
} from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";

/**
 *
 */
type ProductImage = {
  id: string;
  url: string;
  alt?: string;
};

/**
 *
 */
type ProductPrice = {
  amount: number;
  currency: string;
};

/**
 *
 */
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

/**
 *
 */
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
  slug: string;
  name: string;
  description: string | null;
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
export type PreviewProduct = {
  id: string;
  slug: string;
  name: string;
  images: Array<ProductImage>;
  prices: {
    from: ProductPrice | null;
    to: ProductPrice | null;
  };
};

/**
 *
 */
export type ProductListItem = {
  id: string;
  slug: string;
};

/**
 *
 */
export function parseVariant(
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
    images: media
      ? media.map((media) => ({
          id: media.id,
          url: media.url,
          alt: media.alt,
        }))
      : [],
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
  const {
    id,
    name,
    description,
    slug,
    media,
    pricing,
    defaultVariant,
    variants,
  } = getFragmentData(GenericProductFragmentDoc, input);

  return {
    id,
    name,
    slug,
    description: description ?? null,
    images: media
      ? media?.map((media) => ({
          id: media.id,
          url: media.url,
          alt: media.alt,
        }))
      : [],
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

/**
 *
 */
export function parsePreviewProduct(
  input: FragmentType<typeof PreviewProductFragmentDoc>
): PreviewProduct {
  const { id, name, slug, media, pricing } = getFragmentData(
    PreviewProductFragmentDoc,
    input
  );

  return {
    id,
    name,
    slug,
    images: media
      ? media?.map((media) => ({
          id: media.id,
          url: media.url,
          alt: media.alt,
        }))
      : [],
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
  };
}

/**
 *
 */
export function parseAllProducts(
  input: GetProductsQuery
): Array<ProductListItem> {
  return input.products?.edges
    ? input.products.edges.map((edge) => ({
        id: edge.node.id,
        slug: edge.node.slug,
      }))
    : [];
}

/**
 *
 */
export const getAllProductsVariables = (): GetProductsQueryVariables => ({
  first: publicConfig.productsPageSize,
  sortBy: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
});

/**
 *
 */
export const getCategoryProductsVariables = (
  categorySlug: string
): GetProductsQueryVariables => ({
  first: publicConfig.productsPageSize,
  filters: { categories: [categorySlug] },
  sortBy: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
});

/**
 *
 */
export const getSingleProductVariables = (
  slug: string
): GetProductsQueryVariables => ({
  first: 1,
  filters: { slugs: [slug] },
  sortBy: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
});

/**
 *
 */
export function generateProductUrl(product: Pick<Product, "slug">): string {
  return `/products/${product.slug}`;
}
