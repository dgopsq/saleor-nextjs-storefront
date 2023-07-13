"use client";

import { useAuthTokenStore } from "@/misc/states/tokensStore";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

/**
 *
 */
export const Bootstrap: React.FC = () => {
  const apolloClient = useApolloClient();
  const initializeAuthToken = useAuthTokenStore((state) => state.initialize);

  useEffect(() => {
    initializeAuthToken(apolloClient);
  }, [apolloClient, initializeAuthToken]);

  return null;
};
