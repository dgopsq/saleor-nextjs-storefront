export const publicConfig = {
  /**
   * The base URL of the app.
   */
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  /**
   * The Saleor GraphQL URL used to retrieve all the data.
   */
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL || "",

  /**
   * The default currency used in the store.
   */
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "EUR",

  /**
   * The storage key used to store the checkout ID.
   */
  checkoutIdStorageKey:
    process.env.NEXT_PUBLIC_CHECKOUT_ID_STORAGE_KEY || "checkout-id",

  /**
   * The default channel used all around the app.
   */
  defaultChannel: process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel",

  /**
   * The default email used in the checkout while dealing
   * with guest users.
   */
  defaultCheckoutEmail:
    process.env.NEXT_PUBLIC_DEFAULT_CHECKOUT_EMAIL || "customer@example.com",

  /**
   * The default page size used to paginate all
   * the products.
   */
  productsPageSize: parseInt(
    process.env.NEXT_PUBLIC_PRODUCTS_PAGE_SIZE || "12"
  ),

  /**
   * The query parameter used to identify the variant ID.
   */
  variantIdQueryParam: process.env.NEXT_PUBLIC_VARIANT_ID_QUERY_PARAM || "v",

  /**
   * The redirect URL used in the signup email confirmation.
   */
  signupRedirectPath:
    process.env.NEXT_PUBLIC_SIGNUP_REDIRECT_URL || "/account/login",

  /**
   * The storage key used to store the user token.
   */
  userTokenStorageKey:
    process.env.NEXT_PUBLIC_USER_TOKEN_STORAGE_KEY || "user-token",

  /**
   * The storage key used to store the user refresh token.
   */
  userRefreshTokenStorageKey:
    process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN_STORAGE_KEY ||
    "user-refresh-token",

  /**
   * The redirect URL used in the confirmation email sent
   * while changing the user email.
   */
  emailChangeRedirectPath:
    process.env.NEXT_PUBLIC_EMAIL_CHANGE_REDIRECT_URL ||
    "/account/authentication",

  /**
   * The callback URL used by Stripe in order to finalize
   * a payment.
   */
  stripePaymentCallbackPath:
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_CALLBACK_URL ||
    "/checkout/stripe/callback",

  /**
   * The Stripe gateway ID.
   */
  stripeGatewayId:
    process.env.NEXT_PUBLIC_STRIPE_GATEWAY_ID || "app.saleor.stripe",

  /**
   * Flag to enable/disable the product quantity select.
   */
  showProductQuantitySelect:
    process.env.NEXT_PUBLIC_SHOW_PRODUCT_QUANTITY_SELECT === "true",

  /**
   * Number of orders showed in the user's profile page.
   */
  lastOrdersShowed: parseInt(
    process.env.NEXT_PUBLIC_LAST_ORDERS_SHOWED ?? "15"
  ),

  /**
   * The homepage URL.
   */
  homepagePath: process.env.NEXT_PUBLIC_HOMEPAGE_URL || "/",

  /**
   * The default locale used in the store.
   */
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en",

  /**
   * The default HTML title used in the store.
   */
  seoTitle: process.env.NEXT_PUBLIC_SEO_TITLE || "Your shop title",

  /**
   * The default HTML description used in the store.
   */
  seoDescription:
    process.env.NEXT_PUBLIC_SEO_DESCRIPTION || "Your shop description.",
};
