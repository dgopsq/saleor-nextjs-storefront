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

function makeClient() {
  const httpLink = new BatchHttpLink({
    uri: publicConfig.graphqlUrl,
    includeUnusedVariables: true,
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(publicConfig.userTokenStorageKey);

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Product: {
          keyFields: ["slug"],
        },
      },
    }),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

function makeSuspenseCache() {
  return new SuspenseCache();
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
