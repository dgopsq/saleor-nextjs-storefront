import { ProductCountableConnection } from "@/__generated__/graphql";
import { Category as BaseCategory } from "@/__generated__/graphql";
import { Maybe } from "graphql/jsutils/Maybe";

type CategoryQueryBase = Pick<BaseCategory, "name" | "slug">;

type CategoryQueryProducts = {
  products?: Maybe<Pick<ProductCountableConnection, "totalCount">>;
};

type CategoryQueryResult = CategoryQueryBase &
  CategoryQueryProducts & {
    children?: Maybe<{
      edges: Array<{
        node: CategoryQueryBase & CategoryQueryProducts;
      }>;
    }>;
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
export function parseCategory(category: CategoryQueryResult): Category {
  return {
    name: category.name,
    slug: category.slug,
    productsNum: category.products?.totalCount ?? 0,
    children:
      category.children?.edges.map(({ node }) => parseCategory(node)) ?? [],
  };
}
