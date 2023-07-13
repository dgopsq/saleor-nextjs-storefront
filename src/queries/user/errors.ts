/**
 *
 */
export class GenericAuthTokenError extends Error {
  constructor() {
    super(
      "Generic error while retrieving or refreshing the Authentication Token"
    );
  }
}

/**
 *
 */
export class GenericCheckoutTokenError extends Error {
  constructor() {
    super("Generic error while retrieving or refreshing the Checkout Token");
  }
}
