import { getFragmentData } from "@/__generated__";
import {
  GetCategoryProductsQuery,
  GetCategoryProductsQueryVariables,
  OrderDirection,
  PreviewProductFragmentDoc,
  ProductCountableConnection,
  ProductOrderField,
} from "@/__generated__/graphql";
import { Category as BaseCategory } from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";
import { ProductListItem } from "@/queries/products/data";
import { Maybe } from "graphql/jsutils/Maybe";

type CategoryQueryBase = Pick<BaseCategory, "name" | "slug">;

type CategoryQueryProducts = {
  products?: Maybe<Pick<ProductCountableConnection, "totalCount">>;
};

type CategoryQueryResult = {
  node: CategoryQueryBase &
    CategoryQueryProducts & {
      children?: Maybe<{
        edges: Array<{
          node: CategoryQueryBase & CategoryQueryProducts;
        }>;
      }>;
    };
};

/**
 *
 */
export type Category = {
  name: string;
  slug: string;
  productsNum: number;
  children: Array<Category>;
};

/**
 *
 */
export function parseCategory({
  node: category,
}: CategoryQueryResult): Category {
  return {
    name: category.name,
    slug: category.slug,
    productsNum: category.products?.totalCount ?? 0,
    children: category.children?.edges.map(parseCategory) ?? [],
  };
}

/**
 *
 */
export function parseAllCategoryProducts(
  input: GetCategoryProductsQuery
): Array<ProductListItem> {
  const products = input.category?.products?.edges ?? [];

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
export function parsePopulatedCategories(
  categories: Array<CategoryQueryResult>
): Array<Category> {
  const result: Array<Category> = [];

  for (const category of categories) {
    const productsNum = category.node.products?.totalCount ?? 0;
    if (productsNum > 0) result.push(parseCategory(category));
  }

  return result;
}

/**
 *
 */
export function generateCategoryUrl(category: Category): string {
  return `/categories/${category.slug}`;
}

/**
 *
 */
export const getCategoryProductsVariables = (
  categorySlug: string
): GetCategoryProductsQueryVariables => ({
  slug: categorySlug,
  first: publicConfig.productsPageSize,
  sortBy: { field: ProductOrderField.Price, direction: OrderDirection.Asc },
});
