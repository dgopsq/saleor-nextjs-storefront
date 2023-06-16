export const publicConfig = {
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || "",
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "EUR",
  checkoutTokenStorageKey:
    process.env.NEXT_PUBLIC_CHECKOUT_TOKEN_STORAGE_KEY || "checkout-token",
  defaultCheckoutChannel:
    process.env.NEXT_PUBLIC_DEFAULT_CHECKOUT_CHANNEL || "default-channel",
  defaultCheckoutEmail:
    process.env.NEXT_PUBLIC_DEFAULT_CHECKOUT_EMAIL || "customer@example.com",
  productsPageSize: parseInt(
    process.env.NEXT_PUBLIC_PRODUCTS_PAGE_SIZE || "12"
  ),
};
