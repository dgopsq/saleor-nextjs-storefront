"use client";

import { publicConfig } from "@/misc/config";
import { ApolloClient, ApolloLink, SuspenseCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { UserTokens, useUserTokens } from "@/misc/token";
import { useMemo } from "react";

const makeClientGen = (tokens: UserTokens | null) => () => {
  const token = tokens?.token ?? null;

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
  const tokens = useUserTokens();
  const makeClient = useMemo(() => makeClientGen(tokens), [tokens]);

  console.log("TOKENS", tokens);

  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
