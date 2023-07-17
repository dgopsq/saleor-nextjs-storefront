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
        { id: "info", label: "Informations", href: "/account/info" },
        {
          id: "authentication",
          label: "Email and password",
          href: "/account/authentication",
        },
      ]}
      active={selectedProfileSegment ?? undefined}
    />
  );
};
