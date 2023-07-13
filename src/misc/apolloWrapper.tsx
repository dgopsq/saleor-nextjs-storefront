"use client";

import { publicConfig } from "@/misc/config";
import { ApolloClient, ApolloLink, SuspenseCache } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { useMemo } from "react";
import { useAuthToken } from "@/misc/states/tokensStore";
import { AuthToken } from "@/queries/user/token";

/**
 *
 */
export type ClientApolloInstance = ApolloClient<unknown>;

const makeClientGen = (authToken: AuthToken | null) => () => {
  const token = authToken ?? null;

  const httpLink = new BatchHttpLink({
    uri: publicConfig.graphqlUrl,
    includeUnusedVariables: true,
    headers: token
      ? {
          authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  const mainLink =
    typeof window === "undefined"
      ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
      : httpLink;

  return new ApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Product: {
          keyFields: ["slug"],
        },
      },
    }),
    link: mainLink,
  });
};

function makeSuspenseCache() {
  return new SuspenseCache();
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const authToken = useAuthToken();
  const makeClient = useMemo(() => makeClientGen(authToken), [authToken]);

  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
