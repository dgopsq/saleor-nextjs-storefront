import { publicConfig } from "@/misc/config";
import { useLocalStorage } from "usehooks-ts";

/**
 *
 */
export function useUserRefreshToken() {
  const [userRefreshToken, setUserRefreshToken] = useLocalStorage<
    string | null
  >(publicConfig.userRefreshTokenStorageKey, null);

  return [userRefreshToken, setUserRefreshToken] as const;
}
