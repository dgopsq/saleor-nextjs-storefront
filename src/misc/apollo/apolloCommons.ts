import { TypePolicies } from "@apollo/client";

/**
 *
 */
export const commonApolloTypePolicies: TypePolicies = {
  Product: {
    keyFields: ["slug"],
  },
};
