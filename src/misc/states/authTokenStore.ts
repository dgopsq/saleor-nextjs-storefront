import { AsyncData } from "@/misc/asyncData";
import { AuthToken } from "@/queries/user/data";
import { getStoredAuthToken } from "@/queries/user/token";
import { match } from "ts-pattern";
import { create } from "zustand";

type TokensStoreData = AuthToken | null;

type AutoTokenStore = {
  value: AsyncData<TokensStoreData>;
  initialize: () => void;
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
  initialize: () => {
    const storedAuthToken = getStoredAuthToken();

    set({
      value: {
        kind: "Success",
        data: storedAuthToken,
      },
    });
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
