"use client";

import { ProfileIcon } from "@/components/core/Icon";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { useMemo } from "react";

/**
 * A button used in the navbar composed by the
 * user profile icon and the user name.
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
      <ProfileIcon className="h-6 w-6 flex-shrink-0 text-secondary-400 group-hover:text-secondary-500" />

      {showedName.length > 0 ? (
        <span className="ml-2 text-sm font-medium text-secondary-700 group-hover:text-secondary-800 hidden lg:block">
          {showedName}
        </span>
      ) : undefined}
    </div>
  );
};
