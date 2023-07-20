import { ClientApolloInstance } from "@/misc/apollo/apolloWrapper";
import { AsyncData } from "@/misc/asyncData";
import { logger } from "@/misc/logger";
import { CheckoutId } from "@/queries/checkout/data";
import { GenericCheckoutTokenError } from "@/queries/user/errors";
import { retrieveCheckoutId } from "@/queries/user/token";
import { match } from "ts-pattern";
import { create } from "zustand";

type CheckoutIdData = CheckoutId | null;

type CheckoutIdStore = {
  value: AsyncData<CheckoutIdData>;
  initialize: (client: ClientApolloInstance) => void;
};

/**
 *
 */
export const useCheckoutIdStore = create<CheckoutIdStore>((set) => ({
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

      const checkoutToken = await retrieveCheckoutId(client);

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

      logger.error(
        "Error while retrieving the Checkout Id",
        JSON.stringify(error)
      );
    }
  },
}));

/**
 *
 */
export const useCheckoutId = () => {
  const store = useCheckoutIdStore((state) => state.value);

  return match(store)
    .with({ kind: "Success" }, ({ data }) => data)
    .otherwise(() => null);
};
