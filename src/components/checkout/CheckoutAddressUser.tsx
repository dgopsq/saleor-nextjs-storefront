import { CheckoutAddAddress } from "@/components/checkout/CheckoutAddAddress";
import { RadioIsland } from "@/components/core/RadioIsland";
import { SingleAddress } from "@/components/core/SingleAddress";
import { Address, areAddressEqual } from "@/queries/user/data";
import { useMemo } from "react";

type Props = {
  addresses: Array<Address>;
  onChange?: (address: Address) => void;
  value?: Address;
  isLoading?: boolean;
  addAddress?: boolean;
  onCancelAddAddress?: () => void;
};

/**
 *
 */
export const CheckoutAddressUser: React.FC<Props> = ({
  addresses,
  onChange,
  value,
  isLoading,
  addAddress,
  onCancelAddAddress,
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
              <RadioIsland isSelected={isSelected}>
                <SingleAddress address={address} />
              </RadioIsland>
            </button>
          </li>
        );
      }),
    [addresses, onChange, isLoading, value]
  );

  return !addAddress ? (
    <div className={isLoading ? "opacity-75 cursor-not-allowed" : undefined}>
      <ul className="flex flex-col gap-4">{addressesRender}</ul>
    </div>
  ) : (
    <CheckoutAddAddress
      onCancel={onCancelAddAddress}
      onAddressCreated={onChange}
    />
  );
};
