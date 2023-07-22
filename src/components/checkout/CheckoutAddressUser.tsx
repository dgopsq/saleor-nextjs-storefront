import { AddressBox } from "@/components/core/AddressBox";
import { Address, areAddressEqual } from "@/queries/user/data";
import { useMemo } from "react";

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
  const addressesRender = useMemo(
    () =>
      addresses.map((address) => {
        const isSelected = value ? areAddressEqual(value, address) : false;

        const handleClick = () => {
          if (!isLoading) onChange?.(address);
        };

        return (
          <li key={address.id}>
            <button
              onClick={handleClick}
              type="button"
              className="w-full h-full flex flex-row"
            >
              <AddressBox address={address} selected={isSelected} showRadio />
            </button>
          </li>
        );
      }),
    [addresses, onChange, isLoading, value]
  );

  return (
    <div className={isLoading ? "opacity-75 cursor-not-allowed" : undefined}>
      <ul className="flex flex-col gap-4">{addressesRender}</ul>
    </div>
  );
};
