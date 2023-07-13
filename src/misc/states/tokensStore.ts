import { ClientApolloInstance } from "@/misc/apolloWrapper";
import { AsyncData } from "@/misc/asyncData";
import { logger } from "@/misc/logger";
import { GenericAuthTokenError } from "@/queries/user/errors";
import { AuthToken, retrieveAuthToken } from "@/queries/user/token";
import { match } from "ts-pattern";
import { create } from "zustand";

type TokensStoreData = AuthToken | null;

type AutoTokenStore = {
  value: AsyncData<TokensStoreData>;
  initialize: (client: ClientApolloInstance) => void;
};

/**
 *
 */
export const useAuthTokenStore = create<AutoTokenStore>((set) => ({
  /**
   *
   */
  value: { kind: "NotAsked" },

  /**
   *
   */
  initialize: async (client) => {
    try {
      logger.debug("Start the Auth Token bootstrap");

      set({ value: { kind: "Loading" } });

      const authToken = await retrieveAuthToken(client);

      logger.debug(
        "Auth Token retrieval job ended with result:",
        authToken ?? "No Token"
      );

      set({ value: { kind: "Success", data: authToken } });
    } catch (error) {
      set({
        value: {
          kind: "Failure",
          error: new GenericAuthTokenError(),
        },
      });

      logger.error("Error while retrieving the Auth Token", error);
    }
  },
}));

/**
 *
 */
export const useAuthToken = () => {
  const authTokenStore = useAuthTokenStore((state) => state.value);

  return match(authTokenStore)
    .with({ kind: "Success" }, ({ data }) => data)
    .otherwise(() => null);
};
