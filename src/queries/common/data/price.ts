import { Money } from "@/__generated__/graphql";

/**
 *
 */
export type Price = {
  amount: number;
  currency: string;
};

/**
 *
 */
export function parsePrice(input: Money): Price {
  return {
    amount: input.amount,
    currency: input.currency,
  };
}
