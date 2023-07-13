/**
 *
 */
export class GenericAuthTokenError extends Error {
  constructor() {
    super(
      "Generic error while retrieving or refreshing the authentication token"
    );
  }
}
