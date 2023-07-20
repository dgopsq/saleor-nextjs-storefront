import {
  GenericCheckoutInfoFragmentDoc,
  GetCheckoutInfoDocument,
} from "@/__generated__/graphql";
import { useCheckoutId } from "@/misc/states/checkoutIdStore";
import { Checkout, parseGenericCheckoutInfo } from "@/queries/checkout/data";
import { useFragment, useQuery } from "@apollo/client";
import { useMemo } from "react";

type UseCheckoutInfoReturn = { data: Checkout | null; loading: boolean };

/**
 *
 */
export function useCheckoutInfo(): UseCheckoutInfoReturn {
  const checkoutId = useCheckoutId();

  const { data, complete } = useFragment({
    fragment: GenericCheckoutInfoFragmentDoc,
    fragmentName: "GenericCheckoutInfo",
    from: {
      __typename: "Checkout",
      id: checkoutId ?? Symbol(),
    },
  });

  const { loading } = useQuery(GetCheckoutInfoDocument, {
    skip: complete || !checkoutId,
  });

  // FIXME: This is potentially a bottleneck, as it will be called on every
  // render. Consider using a context to store the parsed user data.
  const parsedData = useMemo(
    () => (data && complete ? parseGenericCheckoutInfo(data) : null),
    [data, complete]
  );

  return { data: parsedData, loading };
}
