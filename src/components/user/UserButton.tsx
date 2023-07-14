"use client";

import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { UserIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

/**
 *
 */
export const UserButton: React.FC = () => {
  const userInfo = useUserInfo();

  const showedName = useMemo(() => {
    const computedName: Array<string> = [];

    if (userInfo?.firstName) computedName.push(userInfo.firstName);
    if (userInfo?.lastName) computedName.push(userInfo.lastName);

    return computedName.join(" ");
  }, [userInfo]);

  return (
    <div className="group -m-2 flex items-center p-2">
      <UserIcon
        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />

      {showedName.length > 0 ? (
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {showedName}
        </span>
      ) : undefined}
    </div>
  );
};
