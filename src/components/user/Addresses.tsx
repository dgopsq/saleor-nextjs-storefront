"use client";

import { SingleAddress } from "@/components/core/SingleAddress";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Island } from "@/components/core/Island";

/**
 *
 */
export const Addresses: React.FC = () => {
  const userInfo = useUserInfo();

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {userInfo?.addresses?.map((address) => (
          <li key={address.id} className="lg:col-span-3">
            <Link
              className="h-full"
              href="/account/addresses/[id]"
              as={`/account/addresses/${address.id}`}
            >
              <Island variant="outline">
                <SingleAddress address={address} showDefaultBadges />
              </Island>
            </Link>
          </li>
        ))}

        <li className="lg:col-span-3">
          <Link className="h-full" href={`/account/addresses/new`}>
            <div className="border border-gray-100 bg-gray-50 rounded-lg p-6 h-full flex flex-column items-center justify-center">
              <span className="text-gray-400 text-bold">
                <PlusIcon className="h-6 w-6 text-gray-300" />
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};
