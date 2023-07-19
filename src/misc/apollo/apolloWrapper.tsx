"use client";

import { publicConfig } from "@/misc/config";
import {
  ApolloClient,
  ApolloLink,
  Observable,
  SuspenseCache,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getStoredAuthToken, refreshAuthToken } from "@/queries/user/token";
import { logger } from "@/misc/logger";
import { commonApolloTypePolicies } from "@/misc/apollo/apolloCommons";

/**
 *
 */
export type ClientApolloInstance = ApolloClient<unknown>;

const makeClient = () => {
  // This link is going to manage the authentication error and actually
  // refresh the token on every request when needed.
  const expiredSignatureErrorLink = onError(
    ({ graphQLErrors, forward, operation }) => {
      console.log("ERR", graphQLErrors);
      if (graphQLErrors) {
        const isExpiredSignature = graphQLErrors.some((err) => {
          const exceptions = err.extensions?.exception as { code?: string };
          return exceptions?.code === "ExpiredSignatureError";
        });

        if (!isExpiredSignature) return;

        logger.debug("ExpiredSignatureError detected, refreshing token.");

        return new Observable((observer) => {
          logger.debug("Token refreshed, retrying request.");

          refreshAuthToken().then(() => {
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          });
        });
      }
    }
  );

  // This Link will add the Authorization header to all requests
  // retrieving it from the authTokenStore.
  const asyncAuthLink = setContext(() => {
    const maybeAuthToken = getStoredAuthToken();

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

    expiredSignatureErrorLink,
    asyncAuthLink,
    httpLink,
  ]);

  return new ApolloClient({
    cache: new NextSSRInMemoryCache({
      typePolicies: commonApolloTypePolicies,
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
