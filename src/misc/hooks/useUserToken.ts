import { publicConfig } from "@/misc/config";
import { useLocalStorage } from "usehooks-ts";

/**
 *
 */
export function useUserToken() {
  const [userToken, setUserToken] = useLocalStorage<string | null>(
    publicConfig.userTokenStorageKey,
    null
  );

  return [userToken, setUserToken] as const;
}
