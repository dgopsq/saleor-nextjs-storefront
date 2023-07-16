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
          id: "authentication",
          label: "Email and password",
          href: "/account/authentication",
        },
        { id: "addresses", label: "Addresses", href: "/account/addresses" },
      ]}
      active={selectedProfileSegment ?? undefined}
    />
  );
};
