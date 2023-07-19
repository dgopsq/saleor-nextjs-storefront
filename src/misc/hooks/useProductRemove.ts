import { RemoveProductFromCartDocument } from "@/__generated__/graphql";
import { useCheckoutInfo } from "@/misc/hooks/useCheckoutInfo";
import { useMutation } from "@apollo/client";
import { useCallback, useMemo } from "react";

export type UseProductRemoveReturn = {
  removeProduct: (lineId: string) => void;
  loading: boolean;
};

/**
 *
 */
export function useProductRemove(): UseProductRemoveReturn {
  const [removeProducts, { loading }] = useMutation(
    RemoveProductFromCartDocument
  );

  const { data } = useCheckoutInfo();

  const action = useCallback(
    (lineId: string) => {
      removeProducts({
        variables: {
          checkoutToken: data?.token ?? "",
          linesIds: [lineId],
        },
      });
    },
    [data, removeProducts]
  );

  const api = useMemo<UseProductRemoveReturn>(
    () => ({
      removeProduct: action,
      loading,
    }),
    [action, loading]
  );

  return api;
}
