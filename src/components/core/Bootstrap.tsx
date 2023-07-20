"use client";

import { useCheckoutIdStore } from "@/misc/states/checkoutIdStore";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

/**
 *
 */
export const Bootstrap: React.FC = () => {
  const apolloClient = useApolloClient();
  const initializeCheckoutToken = useCheckoutIdStore(
    (state) => state.initialize
  );

  useEffect(() => {
    initializeCheckoutToken(apolloClient);
  }, [apolloClient, initializeCheckoutToken]);

  return null;
};
