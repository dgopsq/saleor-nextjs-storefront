import { CreateCheckoutDocument } from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { useUserTokens } from "@/misc/token";
import { useMutation } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

/**
 *
 */
export function useCheckoutToken() {
  const [tempUserCheckoutToken, setTempUserCheckoutToken] = useState<
    string | null
  >(null);

  const userTokens = useUserTokens();
  const userInfo = useUserInfo();
  const [createCheckout, { loading: createCheckoutLoading }] = useMutation(
    CreateCheckoutDocument
  );
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(
    publicConfig.checkoutTokenStorageKey,
    null
  );

  const latestUserCheckout = useMemo(() => {
    return userInfo?.checkoutTokens?.[0] || null;
  }, [userInfo]);

  // This generates a new "guest" checkout token
  // whether the user is logged in or not.
  useEffect(() => {
    if (userTokens || storedToken || createCheckoutLoading) return;

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
    userTokens,
    createCheckoutLoading,
  ]);

  if (userTokens) return latestUserCheckout ?? tempUserCheckoutToken;
  else return storedToken;
}
