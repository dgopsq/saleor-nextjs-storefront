import { FragmentType, getFragmentData } from "@/__generated__";
import {
  CheckoutProductFragmentDoc,
  GenericAddressFragmentDoc,
  GenericCheckoutInfoFragment,
  GenericPaymentGatewayFragment,
  GenericPaymentGatewayFragmentDoc,
  GenericShippingMethodFragment,
  GenericShippingMethodFragmentDoc,
} from "@/__generated__/graphql";
import { Price, parsePrice } from "@/queries/common/data/price";
import { Weight, parseWeight } from "@/queries/common/data/weight";
import { ProductVariant, parseVariant } from "@/queries/products/data";
import { Address, parseAddress } from "@/queries/user/data";

/**
 *
 */
export type CheckoutId = string | number;

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
export type DeliveryMethod = {
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
export type PaymentGateway = {
  id: string;
  name: string;
  config: Array<{
    field: string;
    value: string | null;
  }>;
};

/**
 *
 */
export type Checkout = {
  id: string;
  email: string | null;
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
  shippingMethods: Array<DeliveryMethod>;
  deliveryMethod: DeliveryMethod | null;
  availablePaymentGateways: Array<PaymentGateway>;
};

/**
 *
 */
export function parseGenericCheckoutInfo(
  input: GenericCheckoutInfoFragment
): Checkout {
  const {
    id,
    email,
    lines,
    subtotalPrice,
    shippingPrice,
    totalPrice,
    shippingAddress,
    billingAddress,
    shippingMethods,
    deliveryMethod,
    availablePaymentGateways,
  } = input;

  const rawShippingAddress =
    getFragmentData(GenericAddressFragmentDoc, shippingAddress) ?? null;

  const rawBillingAddress =
    getFragmentData(GenericAddressFragmentDoc, billingAddress) ?? null;

  const rawDeliveryMethod =
    deliveryMethod?.__typename === "ShippingMethod"
      ? getFragmentData(GenericShippingMethodFragmentDoc, deliveryMethod)
      : null;

  return {
    id,
    email: email ?? null,
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
    shippingMethods: shippingMethods.map((rawShippingMethod) => {
      const shippingMethodFragment = getFragmentData(
        GenericShippingMethodFragmentDoc,
        rawShippingMethod
      );

      return parseShippingMethod(shippingMethodFragment);
    }),
    deliveryMethod: rawDeliveryMethod
      ? parseShippingMethod(rawDeliveryMethod)
      : null,
    availablePaymentGateways: availablePaymentGateways.map(
      (rawPaymentGateway) => {
        const paymentGatewayFragment = getFragmentData(
          GenericPaymentGatewayFragmentDoc,
          rawPaymentGateway
        );

        return parsePaymentGateway(paymentGatewayFragment);
      }
    ),
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
  input: GenericShippingMethodFragment
): DeliveryMethod {
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

/**
 *
 */
export function parsePaymentGateway(
  input: GenericPaymentGatewayFragment
): PaymentGateway {
  return {
    id: input.id,
    name: input.name,
    config:
      input.config.map((config) => ({
        field: config.field,
        value: config.value ?? null,
      })) ?? [],
  };
}
