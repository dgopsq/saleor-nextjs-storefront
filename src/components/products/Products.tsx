import { Button } from "@/components/core/Button";
import { SingleProduct } from "@/components/products/SingleProduct";
import { ProductListItem, generateProductUrl } from "@/queries/products/data";
import Link from "next/link";

type Props = {
  products: Array<ProductListItem>;
  onShowMore?: () => void;
  showMoreLoading?: boolean;
};

/**
 * This component is used to render a list of products.
 */
export const Products: React.FC<Props> = ({
  products,
  onShowMore,
  showMoreLoading,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:gap-x-8">
        {products.map(({ id, slug }) => {
          const productUrl = generateProductUrl({ product: { slug: slug } });

          return (
            <Link key={id} href={productUrl}>
              <SingleProduct slug={slug} />
            </Link>
          );
        })}
      </div>

      {onShowMore ? (
        <div className="w-full mt-24 flex flex-row justify-center">
          <div>
            <Button
              variant="secondary"
              size="large"
              text="Show more"
              onClick={onShowMore}
              isLoading={showMoreLoading}
            />
          </div>
        </div>
      ) : undefined}
    </>
  );
};
