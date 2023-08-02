"use client";

import {
  AccountIcon,
  CartIcon,
  LogoutIcon,
  ShippingIcon,
} from "@/components/core/Icon";
import { MenuItem } from "@/components/core/MenuItem";
import { TabsMenu } from "@/components/core/TabsMenu";
import { addressesRoute, ordersRoute, profileRoute } from "@/misc/navigation";
import { logout } from "@/misc/user";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";

/**
 *
 */
export const ProfileMenu: React.FC = () => {
  const t = useTranslations("User");
  const currentPath = usePathname();

  return (
    <div>
      <TabsMenu
        items={[
          {
            id: "/account/profile",
            label: t("Profile"),
            href: profileRoute,
            Icon: AccountIcon,
          },
          {
            id: "/account/addresses",
            label: t("Addresses"),
            href: addressesRoute,
            Icon: ShippingIcon,
          },
          {
            id: "/account/orders",
            label: t("Orders"),
            href: ordersRoute,
            Icon: CartIcon,
          },
        ]}
        active={currentPath ?? undefined}
      />

      <div className="border-b border-gray-50 w-full mt-6" />

      <div className="mt-6">
        <button className="w-full" onClick={logout}>
          <MenuItem Icon={LogoutIcon}>{t("Logout")}</MenuItem>
        </button>
      </div>
    </div>
  );
};
