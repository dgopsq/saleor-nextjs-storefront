import { publicConfig } from "@/misc/config";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { commonApolloTypePolicies } from "@/misc/apollo/apolloCommons";

/**
 *
 */
export const { getClient: getApolloClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: commonApolloTypePolicies,
    }),
    link: new BatchHttpLink({
      uri: publicConfig.graphqlUrl,
      includeUnusedVariables: true,
    }),
  });
});
