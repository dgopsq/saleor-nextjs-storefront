export const publicConfig = {
  /**
   *
   */
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || "",

  /**
   *
   */
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "EUR",

  /**
   * @deprecated
   */
  checkoutTokenStorageKey:
    process.env.NEXT_PUBLIC_CHECKOUT_TOKEN_STORAGE_KEY || "checkout-token",

  /**
   *
   */
  checkoutIdStorageKey:
    process.env.NEXT_PUBLIC_CHECKOUT_ID_STORAGE_KEY || "checkout-token",

  /**
   *
   */
  defaultCheckoutChannel:
    process.env.NEXT_PUBLIC_DEFAULT_CHECKOUT_CHANNEL || "default-channel",

  /**
   *
   */
  defaultCheckoutEmail:
    process.env.NEXT_PUBLIC_DEFAULT_CHECKOUT_EMAIL || "customer@example.com",

  /**
   *
   */
  productsPageSize: parseInt(
    process.env.NEXT_PUBLIC_PRODUCTS_PAGE_SIZE || "12"
  ),

  /**
   *
   */
  variantIdQueryParam: process.env.NEXT_PUBLIC_VARIANT_ID_QUERY_PARAM || "v",

  /**
   *
   */
  signupRedirectUrl:
    process.env.NEXT_PUBLIC_SIGNUP_REDIRECT_URL || "http://localhost:3000",

  /**
   *
   */
  userTokenStorageKey:
    process.env.NEXT_PUBLIC_USER_TOKEN_STORAGE_KEY || "user-token",

  /**
   *
   */
  userRefreshTokenStorageKey:
    process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN_STORAGE_KEY ||
    "user-refresh-token",

  /**
   *
   */
  emailChangeRedirectUrl:
    process.env.NEXT_PUBLIC_EMAIL_CHANGE_REDIRECT_URL ||
    "http://localhost:3000/account/authentication",

  /**
   *
   */
  stripePaymentCallbackUrl:
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_CALLBACK_URL ||
    "http://localhost:3000/checkout/stripe/callback",
};
