import { publicConfig } from "@/misc/config";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { __DEV__ } from "@apollo/client/utilities/globals";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

/**
 *
 */
export const { getClient: getApolloClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          keyFields: ["slug"],
        },
      },
    }),
    link: new BatchHttpLink({
      uri: publicConfig.graphqlUrl,
      includeUnusedVariables: true,
    }),
  });
});
