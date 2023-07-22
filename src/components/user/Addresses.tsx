"use client";

import { AddressBox } from "@/components/core/AddressBox";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

/**
 *
 */
export const Addresses: React.FC = () => {
  const userInfo = useUserInfo();

  return (
    <div className="">
      <h3 className="text-xl font-semibold">Addresses</h3>

      <div className="mt-8">
        <ul className="flex flex-col gap-4">
          {userInfo?.addresses?.map((address) => (
            <li key={address.id} className="lg:col-span-3">
              <Link
                className="h-full"
                href={`/account/addresses/${address.id}`}
              >
                <AddressBox address={address} showDefaultBadges />
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
    </div>
  );
};
