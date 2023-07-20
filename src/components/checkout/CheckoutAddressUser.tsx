import { AddressBox } from "@/components/core/AddressBox";
import { isDeepEqual, omit } from "@/misc/object";
import { Address } from "@/queries/user/data";
import { useMemo } from "react";

const omitAddressMetaValues = (address: Address) => {
  return omit(address, [
    "id",
    "isDefaultBillingAddress",
    "isDefaultShippingAddress",
  ]);
};

type Props = {
  addresses: Array<Address>;
  onChange?: (address: Address) => void;
  value?: Address;
  isLoading?: boolean;
};

/**
 *
 */
export const CheckoutAddressUser: React.FC<Props> = ({
  addresses,
  onChange,
  value,
  isLoading,
}) => {
  const currentAddr = useMemo(
    () => (value ? omitAddressMetaValues(value) : null),
    [value]
  );

  const addressesRender = useMemo(
    () =>
      addresses.map((address) => {
        const valueAddr = omitAddressMetaValues(address);

        const isSameAddr = currentAddr
          ? isDeepEqual(valueAddr, currentAddr)
          : false;

        const handleClick = () => {
          if (!isLoading) onChange?.(address);
        };

        return (
          <li key={address.id} className="lg:col-span-3">
            <button
              onClick={handleClick}
              type="button"
              className="w-full h-full"
            >
              <AddressBox address={address} selected={isSameAddr} />
            </button>
          </li>
        );
      }),
    [addresses, onChange, isLoading, currentAddr]
  );

  return (
    <div className={isLoading ? "opacity-75 cursor-not-allowed" : undefined}>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-6">
        {addressesRender}
      </ul>
    </div>
  );
};
