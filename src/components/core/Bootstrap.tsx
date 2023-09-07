"use client";

import { useCustomFormErrors } from "@/misc/hooks/useCustomFormErrors";
import { useCheckoutIdStore } from "@/misc/states/checkoutIdStore";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

/**
 * Bootstrap component used to trigger initialization jobs.
 * This will be executed with a valid Apollo client in the context.
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

/**
 * Bootstrap component used to handle translations inside the zod library.
 */
export const FormBootstrap: React.FC = () => {
  // Handle translations inside the zod library.
  useCustomFormErrors();

  return null;
};
