import { publicConfig } from "@/misc/config";
import { Product } from "@/queries/products/data";
import Link from "next/link";
import { PropsWithChildren, useMemo } from "react";

type Props = PropsWithChildren<{
  product: Pick<Product, "slug">;
  variantId?: string;
}>;

/**
 * Component used to display a link to a product.
 */
export const ProductLink: React.FC<Props> = ({
  product,
  variantId,
  children,
}) => {
  const qs = useMemo(() => {
    const queryParams = new URLSearchParams();

    if (variantId) queryParams.set(publicConfig.variantIdQueryParam, variantId);

    const queryString = queryParams.toString();

    return queryString ? `?${queryString}` : "";
  }, [variantId]);

  return <Link href={`/products/${product.slug}${qs}`}>{children}</Link>;
};
