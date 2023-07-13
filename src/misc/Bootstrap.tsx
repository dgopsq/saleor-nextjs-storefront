"use client";

import { useCheckoutTokenStore } from "@/misc/states/checkoutTokenStore";
import { useAuthTokenStore } from "@/misc/states/authTokenStore";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

/**
 *
 */
export const Bootstrap: React.FC = () => {
  const apolloClient = useApolloClient();
  const initializeAuthToken = useAuthTokenStore((state) => state.initialize);
  const initializeCheckoutToken = useCheckoutTokenStore(
    (state) => state.initialize
  );

  useEffect(() => {
    initializeAuthToken(apolloClient);
    initializeCheckoutToken(apolloClient);
  }, [apolloClient, initializeAuthToken, initializeCheckoutToken]);

  return null;
};
