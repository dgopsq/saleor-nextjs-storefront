import { NeutralBadge } from "@/components/core/Badge";
import { Island } from "@/components/core/Island";
import { Address } from "@/queries/user/data";

type Props = {
  address: Address;
  showDefaultBadges?: boolean;
  selected?: boolean;
};

/**
 *
 */
export const AddressBox: React.FC<Props> = ({
  address,
  showDefaultBadges,
  selected,
}) => {
  const {
    firstName,
    lastName,
    companyName,
    streetAddress1,
    streetAddress2,
    city,
    postalCode,
    country,
    countryArea,
    isDefaultBillingAddress,
    isDefaultShippingAddress,
  } = address;

  const hasDefaultAddresses =
    isDefaultBillingAddress || isDefaultShippingAddress;

  return (
    <Island variant={selected ? "outline-selected" : "outline"}>
      <div className="text-left">
        <div className="font-semibold">
          {firstName} {lastName}
        </div>

        {companyName ? (
          <div className="mt-1 text-sm">{companyName}</div>
        ) : undefined}

        <div className="mt-1 text-sm">{streetAddress1}</div>

        {address.streetAddress2 ? (
          <div className="mt-1 text-sm">{streetAddress2}</div>
        ) : undefined}

        <div className="mt-1 text-sm">
          {city} ({countryArea}), {postalCode}, {country}
        </div>

        {address.phone ? (
          <div className="mt-1 text-sm">{address.phone}</div>
        ) : undefined}
      </div>

      {showDefaultBadges && hasDefaultAddresses ? (
        <div className="mt-4 grid gap-2 grid-cols-3">
          {isDefaultBillingAddress ? (
            <NeutralBadge label="Default billing" />
          ) : undefined}

          {isDefaultShippingAddress ? (
            <NeutralBadge label="Default shipping" />
          ) : undefined}
        </div>
      ) : undefined}
    </Island>
  );
};
