/**
 * Routes
 */

export const homeRoute = "/";
export const cartRoute = "/cart";
export const productsRoute = "/products";
export const categoriesRoute = "/categories";

export const checkoutRoute = "/checkout";
export const checkoutInformationsRoute = "/checkout/informations";
export const checkoutShippingRoute = "/checkout/shipping";
export const checkoutPaymentRoute = "/checkout/payment";
export const checkoutCompleteRoute = "/checkout/complete";

export const accountRoute = "/account";
export const loginRoute = "/account/login";
export const signupRoute = "/account/signup";
export const profileRoute = "/account/profile";
export const addressesRoute = "/account/addresses";
export const newAddressRoute = "/account/addresses/new";
export const ordersRoute = "/account/orders";

/**
 *
 */
export const generateCategoryRoute = (slug: string) =>
  `${categoriesRoute}/${slug}`;

/**
 *
 */
export const generateAddressRoute = (id: string) => `${addressesRoute}/${id}`;

/**
 *
 */
export const generateOrderRoute = (id: string) => `${ordersRoute}/${id}`;
