import {
  GenericCheckoutInfoFragmentDoc,
  GetCheckoutInfoDocument,
  UpdateCheckoutBillingAddressDocument,
  UpdateCheckoutShippingAddressDocument,
} from "@/__generated__/graphql";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { useCheckoutId } from "@/misc/states/checkoutIdStore";
import { Checkout, parseGenericCheckoutInfo } from "@/queries/checkout/data";
import { addressToAddressInput } from "@/queries/user/data";
import { useApolloClient, useFragment, useQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";

type UseCheckoutInfoReturn = { data: Checkout | null; loading: boolean };

/**
 *
 */
export function useCheckoutInfo(): UseCheckoutInfoReturn {
  const checkoutId = useCheckoutId();
  const userInfo = useUserInfo();
  const client = useApolloClient();

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

  // Set the billing address and shipping address using
  // the ones saved as default in the user profile.
  // FIXME: This could be buggy or prone to create errors.
  useEffect(() => {
    if (!userInfo || !complete) return;

    const defaultShippingAddress =
      userInfo.addresses.find((address) => address.isDefaultShippingAddress) ??
      null;

    const defaultBillingAddress =
      userInfo.addresses.find((address) => address.isDefaultBillingAddress) ??
      null;

    if (
      !data.shippingAddress &&
      defaultShippingAddress &&
      data.isShippingRequired
    )
      client.mutate({
        mutation: UpdateCheckoutShippingAddressDocument,
        variables: {
          checkoutId: data.id,
          address: addressToAddressInput(defaultShippingAddress),
        },
      });

    if (!data.billingAddress && defaultBillingAddress)
      client.mutate({
        mutation: UpdateCheckoutBillingAddressDocument,
        variables: {
          checkoutId: data.id,
          address: addressToAddressInput(defaultBillingAddress),
        },
      });
  }, [userInfo, data, complete, client]);

  // FIXME: This is potentially a bottleneck, as it will be called on every
  // render. Consider using a context to store the parsed user data.
  const parsedData = useMemo(
    () => (data && complete ? parseGenericCheckoutInfo(data) : null),
    [data, complete]
  );

  return { data: parsedData, loading };
}
