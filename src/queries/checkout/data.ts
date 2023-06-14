import { GetCheckoutInfoQuery } from "@/__generated__/graphql";

/**
 *
 */
type CheckoutItem = {
  id: string;
};

/**
 *
 */
export type Checkout = {
  lines: Array<CheckoutItem>;
};

/**
 *
 */
export function parseCheckoutInfo(input: GetCheckoutInfoQuery): Checkout {
  return {
    lines:
      input.checkout?.lines.map((line) => ({
        id: line.id,
      })) ?? [],
  };
}
