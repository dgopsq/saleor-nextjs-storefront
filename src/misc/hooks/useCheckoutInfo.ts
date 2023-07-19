import {
  GenericCheckoutInfoFragmentDoc,
  GetCheckoutInfoDocument,
} from "@/__generated__/graphql";
import { useCheckoutToken } from "@/misc/states/checkoutTokenStore";
import { Checkout, parseGenericCheckoutInfo } from "@/queries/checkout/data";
import { useFragment, useQuery } from "@apollo/client";
import { useMemo } from "react";

type UseCheckoutInfoReturn = { data: Checkout | null; loading: boolean };

/**
 *
 */
export function useCheckoutInfo(): UseCheckoutInfoReturn {
  const checkoutToken = useCheckoutToken();

  const { data, complete } = useFragment({
    fragment: GenericCheckoutInfoFragmentDoc,
    fragmentName: "GenericCheckoutInfo",
    from: {
      __typename: "Checkout",
      token: checkoutToken ?? Symbol(),
    },
  });

  const { loading } = useQuery(GetCheckoutInfoDocument, {
    skip: complete || !checkoutToken,
  });

  // FIXME: This is potentially a bottleneck, as it will be called on every
  // render. Consider using a context to store the parsed user data.
  const parsedData = useMemo(
    () => (data && complete ? parseGenericCheckoutInfo(data) : null),
    [data, complete]
  );

  return { data: parsedData, loading };
}
