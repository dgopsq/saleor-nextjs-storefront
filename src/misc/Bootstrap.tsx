"use client";

import { useCheckoutTokenStore } from "@/misc/states/checkoutTokenStore";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

/**
 *
 */
export const Bootstrap: React.FC = () => {
  const apolloClient = useApolloClient();
  const initializeCheckoutToken = useCheckoutTokenStore(
    (state) => state.initialize
  );

  useEffect(() => {
    initializeCheckoutToken(apolloClient);
  }, [apolloClient, initializeCheckoutToken]);

  return null;
};
