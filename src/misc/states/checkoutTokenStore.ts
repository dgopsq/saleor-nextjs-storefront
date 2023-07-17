import { ClientApolloInstance } from "@/misc/apollo/apolloWrapper";
import { AsyncData } from "@/misc/asyncData";
import { logger } from "@/misc/logger";
import { CheckoutToken } from "@/queries/checkout/data";
import { GenericCheckoutTokenError } from "@/queries/user/errors";
import { retrieveCheckoutToken } from "@/queries/user/token";
import { match } from "ts-pattern";
import { create } from "zustand";

type CheckoutTokenData = CheckoutToken | null;

type CheckoutTokenStore = {
  value: AsyncData<CheckoutTokenData>;
  initialize: (client: ClientApolloInstance) => void;
};

/**
 *
 */
export const useCheckoutTokenStore = create<CheckoutTokenStore>((set) => ({
  /**
   *
   */
  value: { kind: "NotAsked" },

  /**
   *
   */
  initialize: async (client) => {
    try {
      logger.debug("Start the Checkout Token bootstrap");

      set({ value: { kind: "Loading" } });

      const checkoutToken = await retrieveCheckoutToken(client);

      logger.debug(
        "Checkout Token retrieval job ended with result:",
        checkoutToken ?? "No Token"
      );

      set({ value: { kind: "Success", data: checkoutToken } });
    } catch (error) {
      set({
        value: {
          kind: "Failure",
          error: new GenericCheckoutTokenError(),
        },
      });

      logger.error("Error while retrieving the Checkout Token", error);
    }
  },
}));

/**
 *
 */
export const useCheckoutToken = () => {
  const authTokenStore = useCheckoutTokenStore((state) => state.value);

  return match(authTokenStore)
    .with({ kind: "Success" }, ({ data }) => data)
    .otherwise(() => null);
};
