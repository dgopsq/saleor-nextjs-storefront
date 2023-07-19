"use client";

import { NeutralBadge } from "@/components/core/Badge";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
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
        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
          {userInfo?.addresses?.map((address) => (
            <li key={address.id} className="md:col-span-3">
              <Link href={`/account/addresses/${address.id}`}>
                <div className="border border-gray-100 rounded-lg p-6">
                  <div>
                    <div className="font-semibold">
                      {address.firstName} {address.lastName}
                    </div>

                    {address.companyName ? (
                      <div className="mt-1 text-sm">{address.phone}</div>
                    ) : undefined}

                    <div className="mt-1 text-sm">{address.streetAddress1}</div>

                    {address.streetAddress2 ? (
                      <div className="mt-1 text-sm">
                        {address.streetAddress2}
                      </div>
                    ) : undefined}

                    <div className="mt-1 text-sm">
                      {address.city} ({address.countryArea}),{" "}
                      {address.postalCode}, {address.country}
                    </div>

                    {address.phone ? (
                      <div className="mt-1 text-sm">{address.phone}</div>
                    ) : undefined}
                  </div>

                  {address.isDefaultBillingAddress ||
                  address.isDefaultShippingAddress ? (
                    <div className="mt-4 grid gap-2 grid-cols-3">
                      {address.isDefaultBillingAddress ? (
                        <NeutralBadge label="Default billing" />
                      ) : undefined}

                      {address.isDefaultShippingAddress ? (
                        <NeutralBadge label="Default shipping" />
                      ) : undefined}
                    </div>
                  ) : undefined}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
