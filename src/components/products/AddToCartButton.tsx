"use client";

import { AddProductToCartDocument } from "@/__generated__/graphql";
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
    <button
      type="button"
      className={classNames(
        loading ? "opacity-75 cursor-not-allowed" : "hover:bg-indigo-700",
        "max-w-xs sm:w-full h-12 flex flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
      )}
      onClick={handleAddToCart}
    >
      {loading ? <Spinner /> : "Add to cart"}
    </button>
  );
};
