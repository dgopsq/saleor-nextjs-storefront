"use client";

import {
  AccountIcon,
  CartIcon,
  LogoutIcon,
  ShippingIcon,
} from "@/components/core/Icon";
import { MenuItem } from "@/components/core/MenuItem";
import { TabsMenu } from "@/components/core/TabsMenu";
import { logout } from "@/misc/user";
import { useSelectedLayoutSegment } from "next/navigation";
/**
 *
 */
export const ProfileMenu: React.FC = () => {
  const selectedProfileSegment = useSelectedLayoutSegment("profile");

  return (
    <div>
      <TabsMenu
        items={[
          {
            id: "profile",
            label: "Profile",
            href: "/account/profile",
            Icon: AccountIcon,
          },
          {
            id: "addresses",
            label: "Addresses",
            href: "/account/addresses",
            Icon: ShippingIcon,
          },
          {
            id: "orders",
            label: "Orders",
            href: "/account/orders",
            Icon: CartIcon,
          },
        ]}
        active={selectedProfileSegment ?? undefined}
      />

      <div className="border-b border-gray-50 w-full mt-6" />

      <div className="mt-6">
        <button className="w-full" onClick={logout}>
          <MenuItem Icon={LogoutIcon}>Logout</MenuItem>
        </button>
      </div>
    </div>
  );
};
