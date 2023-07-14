import { FragmentType, getFragmentData } from "@/__generated__";
import {
  CheckoutProductFragmentDoc,
  GetCheckoutInfoQuery,
} from "@/__generated__/graphql";

/**
 *
 */
export type CheckoutToken = string;

/**
 *
 */
type CheckoutItem = {
  id: string;
};

/**
 *
 */
type CheckoutProduct = {
  id: string;
  name: string;
  slug: string;
};

/**
 *
 */
export type Checkout = {
  lines: Array<CheckoutItem>;
  subtotalPrice: {
    amount: number;
    currency: string;
  } | null;
  shippingPrice: {
    amount: number;
    currency: string;
  } | null;
  totalPrice: {
    amount: number;
    currency: string;
  } | null;
};

/**
 *
 */
export function parseCheckoutInfo({
  checkout,
}: GetCheckoutInfoQuery): Checkout {
  if (!checkout) {
    return {
      lines: [],
      subtotalPrice: null,
      shippingPrice: null,
      totalPrice: null,
    };
  }

  const { lines, subtotalPrice, shippingPrice, totalPrice } = checkout;

  return {
    lines: lines.map((line) => ({
      id: line.id,
    })),
    subtotalPrice: subtotalPrice
      ? {
          amount: subtotalPrice.gross.amount,
          currency: subtotalPrice.gross.currency,
        }
      : null,
    shippingPrice: shippingPrice
      ? {
          amount: shippingPrice.gross.amount,
          currency: shippingPrice.gross.currency,
        }
      : null,
    totalPrice: totalPrice
      ? {
          amount: totalPrice.gross.amount,
          currency: totalPrice.gross.currency,
        }
      : null,
  };
}

/**
 *
 */
export function parseCheckoutProductVariant(
  input: FragmentType<typeof CheckoutProductFragmentDoc>
): CheckoutProduct {
  const {
    product: { id, name, slug },
  } = getFragmentData(CheckoutProductFragmentDoc, input);

  return {
    id,
    name,
    slug,
  };
}
