import { Product } from "@/queries/products/data";

/**
 *
 */
export function formatPrice(amount: number, currency: string) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 *
 */
export function formatSingleProductPrice(prices: Product["prices"]) {
  const priceFrom = prices.from;
  const priceTo = prices.to;

  const formattedPriceFrom = priceFrom
    ? formatPrice(priceFrom.amount, priceFrom.currency)
    : null;

  const formattedPriceTo = priceTo
    ? formatPrice(priceTo.amount, priceTo.currency)
    : null;

  const formattedPrice =
    priceFrom?.amount === priceTo?.amount
      ? formattedPriceFrom
      : `${formattedPriceFrom} - ${formattedPriceTo}`;

  return formattedPrice;
}
