import { FragmentType, getFragmentData } from "@/__generated__";
import {
  CheckoutProductFragmentDoc,
  GenericAddressFragmentDoc,
  ShippingMethod as BaseShippingMethod,
  GenericCheckoutInfoFragment,
} from "@/__generated__/graphql";
import { Price, parsePrice } from "@/queries/common/data/price";
import { Weight, parseWeight } from "@/queries/common/data/weight";
import { ProductVariant, parseVariant } from "@/queries/products/data";
import { Address, parseAddress } from "@/queries/user/data";

/**
 *
 */
export type CheckoutToken = string;

/**
 *
 */
type CheckoutItem = {
  id: string;
  variant: ProductVariant;
  product: CheckoutProduct;
  quantity: number;
};

/**
 *
 */
type ShippingMethod = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  minimumOrderPrice: Price | null;
  maximumOrderPrice: Price | null;
  minimumOrderWeight: Weight | null;
  maximumOrderWeight: Weight | null;
  price: Price;
  maximumDeliveryDays: number | null;
  minimumDeliveryDays: number | null;
};

/**
 *
 */
export type CheckoutProduct = {
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
  shippingAddress: Address | null;
  billingAddress: Address | null;
  shippingMethods: Array<ShippingMethod>;
};

/**
 *
 */
export function parseGenericCheckoutInfo(input: GenericCheckoutInfoFragment) {
  const {
    lines,
    subtotalPrice,
    shippingPrice,
    totalPrice,
    shippingAddress,
    billingAddress,
    shippingMethods,
  } = input;

  const rawShippingAddress =
    getFragmentData(GenericAddressFragmentDoc, shippingAddress) ?? null;

  const rawBillingAddress =
    getFragmentData(GenericAddressFragmentDoc, billingAddress) ?? null;

  return {
    lines: lines.map((line) => ({
      id: line.id,
      variant: parseVariant(line.variant),
      product: parseCheckoutProductVariant(line.variant),
      quantity: line.quantity,
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
    shippingAddress: rawShippingAddress
      ? parseAddress(rawShippingAddress)
      : null,
    billingAddress: rawBillingAddress ? parseAddress(rawBillingAddress) : null,
    shippingMethods: shippingMethods.map(parseShippingMethod),
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

/**
 *
 */
export function parseShippingMethod(
  input: Pick<
    BaseShippingMethod,
    | "id"
    | "name"
    | "description"
    | "active"
    | "minimumOrderWeight"
    | "minimumOrderPrice"
    | "maximumOrderWeight"
    | "maximumOrderPrice"
    | "minimumDeliveryDays"
    | "maximumDeliveryDays"
    | "price"
  >
): ShippingMethod {
  return {
    id: input.id,
    name: input.name,
    description: input.description ?? null,
    active: input.active,
    minimumOrderPrice: input.minimumOrderPrice
      ? parsePrice(input.minimumOrderPrice)
      : null,
    maximumOrderPrice: input.maximumOrderPrice
      ? parsePrice(input.maximumOrderPrice)
      : null,
    minimumOrderWeight: input.minimumOrderWeight
      ? parseWeight(input.minimumOrderWeight)
      : null,
    maximumOrderWeight: input.maximumOrderWeight
      ? parseWeight(input.maximumOrderWeight)
      : null,
    price: parsePrice(input.price),
    maximumDeliveryDays: input.maximumDeliveryDays ?? null,
    minimumDeliveryDays: input.minimumDeliveryDays ?? null,
  };
}
