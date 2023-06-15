import { FragmentType, getFragmentData } from "@/__generated__";
import {
  CheckoutProductFragmentDoc,
  GetCheckoutInfoQuery,
} from "@/__generated__/graphql";

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
