"use client";

import { SingleAddress } from "@/components/core/SingleAddress";
import { useUserInfo } from "@/misc/hooks/useUserInfo";
import Link from "next/link";
import { Island } from "@/components/core/Island";
import { PageHeading } from "@/components/core/Headings";
import { TextButton } from "@/components/core/Button";
import { useRouter } from "next/navigation";
import { EmptyText } from "@/components/core/EmptyText";
import { generateAddressRoute } from "@/misc/navigation";

/**
 *
 */
export const Addresses: React.FC = () => {
  const userInfo = useUserInfo();
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-row items-center gap-5">
        <div>
          <PageHeading>Addresses</PageHeading>
        </div>

        <div>
          <TextButton
            text="Add new"
            variant="primary"
            onClick={() => router.push("/account/addresses/new")}
          />
        </div>
      </div>

      <ul className="mt-8 flex flex-col gap-4">
        {!userInfo?.addresses?.length ? (
          <EmptyText>No addresses found.</EmptyText>
        ) : undefined}

        {userInfo?.addresses?.map((address) => (
          <li key={address.id} className="lg:col-span-3">
            <Link className="h-full" href={generateAddressRoute(address.id)}>
              <Island variant="outline">
                <SingleAddress address={address} showDefaultBadges />
              </Island>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
