"use client";

import { useUserInfo } from "@/misc/hooks/useUserInfo";
import { classNames } from "@/misc/styles";

/**
 *
 */
export const Addresses: React.FC = () => {
  const userInfo = useUserInfo();

  return (
    <div className="">
      <h3 className="text-xl font-semibold">Addresses</h3>

      <div className="mt-8">
        <ul>
          {userInfo?.addresses?.map((address, index) => (
            <li
              key={address.id}
              className={classNames(
                "border border-gray-100 rounded-lg p-6",
                index > 0 ? "mt-4" : ""
              )}
            >
              <div>
                {address.firstName} {address.lastName} {address.companyName}
              </div>
              <div className="mt-1">{address.streetAddress1}</div>
              <div>{address.streetAddress2}</div>
              <div className="mt-1">
                {address.city} ({address.countryArea}), {address.postalCode},{" "}
                {address.country}
              </div>
              {address.phone ? <div>{address.phone}</div> : undefined}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
