import { CreateCheckoutDocument } from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { useAuthToken } from "@/misc/states/tokensStore";
import { useApolloClient, useMutation } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

/**
 *
 */
export function useCheckoutToken() {
  const authToken = useAuthToken();
  const userInfo = useUserInfo();
  const [createCheckout, { loading: createCheckoutLoading }] = useMutation(
    CreateCheckoutDocument
  );
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(
    publicConfig.checkoutTokenStorageKey,
    null
  );
  const cli = useApolloClient();

  const latestUserCheckout = useMemo(() => {
    return userInfo?.checkoutTokens?.[0] || null;
  }, [userInfo]);

  // This generates a new "guest" checkout token
  // only if the user is not logged in.
  useEffect(() => {
    if (authToken || storedToken || createCheckoutLoading) return;

    const email = publicConfig.defaultCheckoutEmail;
    const channel = publicConfig.defaultCheckoutChannel;

    createCheckout({
      variables: {
        email,
        channel,
      },
      onCompleted: (data) => {
        setStoredToken(data.checkoutCreate?.checkout?.token || null);
      },
    });
  }, [
    storedToken,
    createCheckout,
    setStoredToken,
    authToken,
    createCheckoutLoading,
  ]);

  if (authToken) return latestUserCheckout;
  else return storedToken;
}
