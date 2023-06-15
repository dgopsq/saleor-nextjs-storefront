"use client";

import { AddProductToCartDocument } from "@/__generated__/graphql";
import { Button } from "@/components/core/Button";
import { Spinner } from "@/components/core/Spinner";
import { useCheckoutToken } from "@/misc/hooks/useCheckoutToken";
import { classNames } from "@/misc/styles";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";

type Props = {
  variantId: string;
};

/**
 *
 */
export const AddToCartButton: React.FC<Props> = ({ variantId }) => {
  const checkoutToken = useCheckoutToken();
  const [addToCart, { loading }] = useMutation(AddProductToCartDocument);

  const handleAddToCart = useCallback(() => {
    if (!loading)
      addToCart({
        variables: {
          checkoutToken,
          variantId,
        },
        refetchQueries: ["GetCheckoutInfo"],
      });
  }, [addToCart, checkoutToken, variantId, loading]);

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
