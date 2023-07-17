"use client";

import { publicConfig } from "@/misc/config";
import { ApolloClient, ApolloLink, SuspenseCache } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { useAuthTokenStore } from "@/misc/states/authTokenStore";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { match } from "ts-pattern";
import { refreshAuthToken } from "@/queries/user/token";

/**
 *
 */
export type ClientApolloInstance = ApolloClient<unknown>;

const makeClient = () => {
  // This link is going to manage the authentication error and actually
  // refresh the token on every request when needed.
  const expiredSignatureErrorLink = onError(
    ({ graphQLErrors, forward, operation }) => {
      if (graphQLErrors) {
        const isExpiredSignature = graphQLErrors.some(
          (err) => err.extensions?.code === "ExpiredSignatureError"
        );

        if (!isExpiredSignature) return;

        refreshAuthToken().then(() => {
          forward(operation);
        });
      }
    }
  );

  // This Link will add the Authorization header to all requests
  // retrieving it from the authTokenStore.
  const asyncAuthLink = setContext(() => {
    const tokensStore = useAuthTokenStore.getState();
    const maybeAuthToken = match(tokensStore.value)
      .with(
        {
          kind: "Success",
        },
        ({ data }) => data
      )
      .otherwise(() => null);

    if (!maybeAuthToken) return {};

    return {
      headers: {
        authorization: `Bearer ${maybeAuthToken}`,
      },
    };
  });

  //
  const httpLink = new BatchHttpLink({
    uri: publicConfig.graphqlUrl,
    includeUnusedVariables: true,
  });

  const mainLink = ApolloLink.from([
    ...(typeof window === "undefined"
      ? [
          new SSRMultipartLink({
            stripDefer: true,
          }),
        ]
      : []),

    asyncAuthLink,
    httpLink,
    expiredSignatureErrorLink,
  ]);

  return new ApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Product: {
          keyFields: ["slug"],
        },
      },
    }),
    link: mainLink,
    defaultOptions: {},
  });
};

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
