import { ClientApolloInstance } from "@/misc/apolloWrapper";
import { AsyncData } from "@/misc/asyncData";
import { GenericAuthTokenError } from "@/queries/user/errors";
import { AuthToken, retrieveAuthToken } from "@/queries/user/token";
import { ApolloClient } from "@apollo/client";
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
export const useAuthTokenStore = create<AutoTokenStore>((set, get) => ({
  value: { kind: "NotAsked" },
  initialize: async (client) => {
    try {
      set({ value: { kind: "Loading" } });

      const authToken = await retrieveAuthToken(client);

      set({ value: { kind: "Success", data: authToken } });
    } catch (error) {
      set({
        value: {
          kind: "Failure",
          error: new GenericAuthTokenError(),
        },
      });

      console.error("Error while retrieving the Auth Token", error);
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
