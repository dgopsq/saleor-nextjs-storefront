"use client";

import { TabsMenu } from "@/components/core/TabsMenu";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
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
          Icon: UserIcon,
        },
        {
          id: "addresses",
          label: "Addresses",
          href: "/account/addresses",
          Icon: HomeIcon,
        },
      ]}
      active={selectedProfileSegment ?? undefined}
    />
  );
};
