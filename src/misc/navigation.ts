/**
 * Routes
 */

import { publicConfig } from "@/misc/config";

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
 * Generate the category route of a product.
 */
export const generateCategoryRoute = (slug: string) =>
  `${categoriesRoute}/${slug}`;

/**
 * Generate the address route.
 */
export const generateAddressRoute = (id: string) => `${addressesRoute}/${id}`;

/**
 * Generate the order route.
 */
export const generateOrderRoute = (id: string) => `${ordersRoute}/${id}`;

/**
 * Generate the complete URL based on a path.
 */
export const generateFullUrl = (path: string) =>
  `${publicConfig.baseUrl}${path}`;
