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
type ProductPrice = {
  amount: number;
  currency: string;
};

/**
 *
 */
export type ProductVariant = {
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
    attributes: parseAttributes(attributes),
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

  const { description, defaultVariant, variants, attributes } =
    detailedProductFragment;

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
export const getAllProductsVariables = (): GetProductsQueryVariables => ({
  first: publicConfig.productsPageSize,
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
export function generateProductUrl(params: {
  product: Pick<Product, "slug">;
  variantId?: string;
}): string {
  const baseProductUrl = `/products/${params.product.slug}`;
  const queryParams = new URLSearchParams();

  if (params.variantId)
    queryParams.set(publicConfig.variantIdQueryParam, params.variantId);

  const queryString = queryParams.toString();
  const computedQs = queryString ? `?${queryString}` : "";

  return `${baseProductUrl}${computedQs}`;
}
