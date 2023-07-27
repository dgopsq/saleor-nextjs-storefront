"use client";

import { CartIcon, HomeIcon, ProfileIcon } from "@/components/core/Icon";
import { TabsMenu } from "@/components/core/TabsMenu";
import { useSelectedLayoutSegment } from "next/navigation";
/**
 *
 */
export const ProfileMenu: React.FC = () => {
  const selectedProfileSegment = useSelectedLayoutSegment("profile");

  return (
    <TabsMenu
      items={[
        {
          id: "profile",
          label: "Profile",
          href: "/account/profile",
          Icon: ProfileIcon,
        },
        {
          id: "addresses",
          label: "Addresses",
          href: "/account/addresses",
          Icon: HomeIcon,
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
  );
};
