"use client";

import { useCheckoutTokenStore } from "@/misc/states/checkoutTokenStore";
import { useAuthTokenStore } from "@/misc/states/tokensStore";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

/**
 *
 */
export const Bootstrap: React.FC = () => {
  const apolloClient = useApolloClient();
  const authToken = useAuthTokenStore((state) => state.value);
  const initializeAuthToken = useAuthTokenStore((state) => state.initialize);
  const initializeCheckoutToken = useCheckoutTokenStore(
    (state) => state.initialize
  );

  useEffect(() => {
    initializeAuthToken(apolloClient);
  }, [apolloClient, initializeAuthToken]);

  useEffect(() => {
    if (authToken.kind === "Success") initializeCheckoutToken(apolloClient);
  }, [authToken, initializeCheckoutToken, apolloClient]);

  return null;
};
