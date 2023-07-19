"use client";

import { Sidebar } from "@/components/core/Sidebar";
import { useSelectedLayoutSegment } from "next/navigation";

/**
 *
 */
export const ProfileSidebar: React.FC = () => {
  const selectedProfileSegment = useSelectedLayoutSegment("profile");

  return (
    <Sidebar
      items={[
        {
          id: "profile",
          label: "Profile",
          href: "/account/profile",
        },
        {
          id: "addresses",
          label: "Addresses",
          href: "/account/addresses",
        },
      ]}
      active={selectedProfileSegment ?? undefined}
    />
  );
};
