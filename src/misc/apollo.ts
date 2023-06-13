import { config } from "@/misc/config";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

/**
 *
 */
export const { getClient: getApolloClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: config.graphqlUrl,
    }),
  });
});
