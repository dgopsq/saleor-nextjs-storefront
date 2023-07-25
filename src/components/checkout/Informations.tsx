"use client";

import { InformationsGuest } from "@/components/checkout/InformationsGuest";
import { InformationsUser } from "@/components/checkout/InformationsUser";
import { useUserInfo } from "@/misc/hooks/useUserInfo";

/**
 *
 */
export const Informations: React.FC = () => {
  const userInfo = useUserInfo();

  return userInfo ? (
    <InformationsUser userInfo={userInfo} />
  ) : (
    <InformationsGuest />
  );
};
