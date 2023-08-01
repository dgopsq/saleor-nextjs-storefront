"use client";

import { AddProductToCartDocument } from "@/__generated__/graphql";
import { Button } from "@/components/core/Button";
import { errorToast } from "@/components/core/Notifications";
import { useCheckoutId } from "@/misc/states/checkoutIdStore";
import { useMutation } from "@apollo/client";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

const addToCartErrorsMap: Record<string, string> = {
  INSUFFICIENT_STOCK: "There is not enough stock for this product.",
};

type Props = {
  variantId: string;
  qty: number;
};

/**
 *
 */
export const AddToCartButton: React.FC<Props> = ({ variantId, qty }) => {
  const t = useTranslations("Products");
  const checkoutId = useCheckoutId();
  const [addToCart, { loading }] = useMutation(AddProductToCartDocument);

  const handleAddToCart = useCallback(() => {
    if (!loading && checkoutId !== null)
      addToCart({
        variables: {
          checkoutId,
          variantId,
          quantity: qty,
        },
        refetchQueries: ["GetCheckoutInfo"],
        onCompleted: (data) => {
          const errors = data.checkoutLinesAdd?.errors ?? [];

          errors.forEach((error) => {
            const message = error?.code
              ? addToCartErrorsMap[error?.code] ?? null
              : null;

            if (message) errorToast(message);
          });
        },
      });
  }, [addToCart, checkoutId, variantId, loading, qty]);

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      text={t("Add to cart")}
      variant="primary"
      size="large"
      isLoading={loading}
    />
  );
};
