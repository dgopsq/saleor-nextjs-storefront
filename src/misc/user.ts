import { publicConfig } from "@/misc/config";
import { generateFullUrl } from "@/misc/navigation";
import Cookies from "js-cookie";

/**
 *
 */
export function logout() {
  Cookies.remove(publicConfig.userTokenStorageKey);
  Cookies.remove(publicConfig.userRefreshTokenStorageKey);
  Cookies.remove(publicConfig.checkoutIdStorageKey);

  window.location.href = generateFullUrl(publicConfig.homepagePath);
}
