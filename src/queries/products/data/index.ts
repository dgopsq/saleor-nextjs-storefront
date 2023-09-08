import { FragmentType, getFragmentData } from "@/__generated__";
import {
  DetailedProductFragment,
  GenericProductVariantFragmentDoc,
  GetProductsQuery,
  GetProductsQueryVariables,
  OrderDirection,
  PreviewProductFragment,
  PreviewProductFragmentDoc,
  ProductOrderField,
} from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";
import { Price, parsePrice } from "@/queries/common/data/price";
import {
  ProductAttribute,
  parseAttributes,
} from "@/queries/products/data/attributes";

export * from "./attributes";

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
export type ProductVariant = {
  id: string;
  sku: string | null;
  name: string;
  images: Array<ProductImage>;
  price: Price | null;
  discount: Price | null;
  attributes: Array<ProductAttribute>;
  quantityAvailable: number | null;
  quantityLimitPerCustomer: number | null;
};

/**
 *
 */
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  images: Array<ProductImage>;
  prices: {
    from: Price | null;
    to: Price | null;
  };
  defaultVariant: ProductVariant | null;
  variants: Array<ProductVariant>;
  attributes: Array<ProductAttribute>;
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
    from: Price | null;
    to: Price | null;
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
  const {
    id,
    sku,
    name,
    media,
    pricing,
    attributes,
    quantityAvailable,
    quantityLimitPerCustomer,
  } = getFragmentData(GenericProductVariantFragmentDoc, input);

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
    price: pricing?.price?.gross ? parsePrice(pricing.price.gross) : null,
    discount: pricing?.discount?.gross
      ? parsePrice(pricing.discount.gross)
      : null,
    attributes: parseAttributes(attributes),
    quantityAvailable: quantityAvailable ?? null,
    quantityLimitPerCustomer: quantityLimitPerCustomer ?? null,
  };
}

/**
 *
 */
export function parseProduct(
  detailedProductFragment: DetailedProductFragment,
  previewProductFragment: PreviewProductFragment
): Product {
  const { id, name, slug, media, pricing } = previewProductFragment;

  const {
    description,
    defaultVariant,
    variants,
    attributes,
    seoTitle,
    seoDescription,
  } = detailedProductFragment;

  return {
    id,
    name,
    slug,
    description: description ?? null,
    seoTitle: seoTitle ?? null,
    seoDescription: seoDescription ?? null,
    images: media
      ? media?.map((media) => ({
          id: media.id,
          url: media.url,
          alt: media.alt,
        }))
      : [],
    prices: {
      from: pricing?.priceRange?.start?.gross
        ? parsePrice(pricing.priceRange.start.gross)
        : null,
      to: pricing?.priceRange?.stop?.gross
        ? parsePrice(pricing.priceRange.stop.gross)
        : null,
    },
    defaultVariant: defaultVariant ? parseVariant(defaultVariant) : null,
    variants: variants?.map(parseVariant) ?? [],
    attributes: parseAttributes(attributes),
  };
}

/**
 *
 */
export function parsePreviewProduct(
  input: PreviewProductFragment
): PreviewProduct {
  const { id, name, slug, media, pricing } = input;

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
        ? parsePrice(pricing.priceRange.start.gross)
        : null,
      to: pricing?.priceRange?.stop?.gross
        ? parsePrice(pricing.priceRange.stop.gross)
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
  const products = input.products?.edges ?? [];

  return products.map((edge) => {
    const { id, slug } = getFragmentData(PreviewProductFragmentDoc, edge.node);

    return {
      id: id,
      slug: slug,
    };
  });
}

/**
 *
 */
export const getAllProductsVariables = (
  options: {
    cursor?: string;
  } = {
    cursor: undefined,
  }
): GetProductsQueryVariables => ({
  first: publicConfig.productsPageSize,
  after: options.cursor,
  sortBy: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
  channel: publicConfig.defaultChannel,
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
  channel: publicConfig.defaultChannel,
});
