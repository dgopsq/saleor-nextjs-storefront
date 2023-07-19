import { UpdateProductInCartDocument } from "@/__generated__/graphql";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useMutation } from "@apollo/client";
import { useCallback, useMemo } from "react";

type UseProductsUpdateReturn = {
  updateProduct: (variantId: string, quantity: number) => void;
  loading: boolean;
};

/**
 *
 */
export function useProductUpdate(): UseProductsUpdateReturn {
  const [updateProducts, { loading }] = useMutation(
    UpdateProductInCartDocument
  );

  const { data } = useCheckoutInfo();

  const action = useCallback(
    (variantId: string, quantity: number) => {
      updateProducts({
        variables: {
          checkoutToken: data?.token ?? "",
          lines:
            data?.lines.map((line) => ({
              variantId: line.variant.id,
              quantity:
                line.variant.id === variantId ? quantity : line.quantity,
            })) ?? [],
        },
      });
    },
    [data, updateProducts]
  );

  const api = useMemo<UseProductsUpdateReturn>(
    () => ({
      updateProduct: action,
      loading,
    }),
    [action, loading]
  );

  return api;
}
