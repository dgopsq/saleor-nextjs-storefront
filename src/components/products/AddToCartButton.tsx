"use client";

import { AddProductToCartDocument } from "@/__generated__/graphql";
import { useCheckoutToken } from "@/misc/hooks/useCheckoutToken";
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
  const [addToCart] = useMutation(AddProductToCartDocument);

  const handleAddToCart = useCallback(() => {
    addToCart({
      variables: {
        checkoutToken,
        variantId,
      },
      refetchQueries: ["GetCheckoutInfo"],
    });
  }, [addToCart, checkoutToken, variantId]);

  return (
    <button
      type="button"
      className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
      onClick={handleAddToCart}
    >
      Add to cart
    </button>
  );
};
