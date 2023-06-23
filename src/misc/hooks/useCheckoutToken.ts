import { CreateCheckoutDocument } from "@/__generated__/graphql";
import { publicConfig } from "@/misc/config";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

/**
 *
 */
export function useCheckoutToken() {
  const [createCheckout] = useMutation(CreateCheckoutDocument);
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(
    publicConfig.checkoutTokenStorageKey,
    null
  );

  useEffect(() => {
    if (storedToken !== null) return;

    createCheckout({
      variables: {
        email: publicConfig.defaultCheckoutEmail,
        channel: publicConfig.defaultCheckoutChannel,
      },
      onCompleted: (data) => {
        setStoredToken(data.checkoutCreate?.checkout?.token || null);
      },
    });
  }, [storedToken, createCheckout, setStoredToken]);

  return storedToken;
}
