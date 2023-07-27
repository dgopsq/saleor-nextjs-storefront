import { TypePolicies } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

/**
 *
 */
export const commonApolloTypePolicies: TypePolicies = {
  Query: {
    fields: {
      products: relayStylePagination(),
    },
  },
  Product: {
    keyFields: ["slug"],
  },
  Order: {
    keyFields: ["number"],
  },
};
