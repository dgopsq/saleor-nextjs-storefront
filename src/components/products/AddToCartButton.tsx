"use client";

import { AddProductToCartDocument } from "@/__generated__/graphql";
import { Button } from "@/components/core/Button";
import { useCheckoutId } from "@/misc/states/checkoutIdStore";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";

type Props = {
  variantId: string;
};

/**
 *
 */
export const AddToCartButton: React.FC<Props> = ({ variantId }) => {
  const checkoutId = useCheckoutId();
  const [addToCart, { loading }] = useMutation(AddProductToCartDocument);

  const handleAddToCart = useCallback(() => {
    if (!loading && checkoutId !== null)
      addToCart({
        variables: {
          checkoutId,
          variantId,
        },
        refetchQueries: ["GetCheckoutInfo"],
      });
  }, [addToCart, checkoutId, variantId, loading]);

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      text="Add to cart"
      variant="primary"
      size="large"
      isLoading={loading}
    />
  );
};
