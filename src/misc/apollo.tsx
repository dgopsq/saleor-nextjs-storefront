import React, { PropsWithChildren } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { config } from "@/misc/config";

const client = new ApolloClient({
  uri: config.graphqlUrl,
  cache: new InMemoryCache(),
});

export const AppApolloProvider: React.FC<PropsWithChildren> = ({
  children,
}) => <ApolloProvider client={client}>{children}</ApolloProvider>;
