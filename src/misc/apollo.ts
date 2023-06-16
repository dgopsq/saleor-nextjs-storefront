import { publicConfig } from "@/misc/config";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { __DEV__ } from "@apollo/client/utilities/globals";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

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
    link: new HttpLink({
      uri: publicConfig.graphqlUrl,
    }),
  });
});
