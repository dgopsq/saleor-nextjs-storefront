import { ProductLink } from "@/components/core/ProductLink";
import { ShowMoreButton } from "@/components/products/ShowMoreButton";
import { SingleProduct } from "@/components/products/SingleProduct";
import { ProductListItem } from "@/queries/products/data";

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
        {products.map(({ id, slug }) => (
          <ProductLink key={id} product={{ slug }}>
            <SingleProduct slug={slug} />
          </ProductLink>
        ))}
      </div>

      {onShowMore ? (
        <div className="w-full mt-24 flex flex-row justify-center">
          <div>
            <ShowMoreButton
              onClick={onShowMore}
              isLoading={showMoreLoading}
              triggerOnVisible
            />
          </div>
        </div>
      ) : undefined}
    </>
  );
};
