"use client";

import { InformationsGuest } from "@/components/checkout/InformationsGuest";
import { InformationsUser } from "@/components/checkout/InformationsUser";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { useCheckoutGuard } from "@/misc/hooks/useCheckoutGuard";
import { useUserInfo } from "@/misc/hooks/useUserInfo";

/**
 * Hub component for the checkout informations.
 * It will render the guest or user informations
 * depending on the user state.
 */
export const Informations: React.FC = () => {
  const userInfo = useUserInfo();
  const { showCheckout } = useCheckoutGuard();

  if (!showCheckout) return <LoadingSpinner />;

  return userInfo ? (
    <InformationsUser userInfo={userInfo} />
  ) : (
    <InformationsGuest />
  );
};
