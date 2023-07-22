import { NeutralBadge } from "@/components/core/Badge";
import { Island } from "@/components/core/Island";
import { Radio } from "@/components/core/Radio";
import { Address } from "@/queries/user/data";

type Props = {
  address: Address;
  showDefaultBadges?: boolean;
  selected?: boolean;
  showRadio?: boolean;
};

/**
 *
 */
export const AddressBox: React.FC<Props> = ({
  address,
  showDefaultBadges,
  selected,
  showRadio,
}) => {
  const {
    firstName,
    lastName,
    streetAddress1,
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
    <Island variant="outline" selected={selected}>
      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        <div className="flex flex-row items-center gap-2">
          {showRadio ? (
            <div className="pr-4 inline" style={{ lineHeight: 0 }}>
              <Radio selected={!!selected} />
            </div>
          ) : undefined}

          <div className="text-sm font-semibold">
            {firstName} {lastName}
          </div>

          <div className="text-sm text-gray-700">{`${streetAddress1}, ${city} (${countryArea}), ${postalCode}, ${country}`}</div>
        </div>

        {showDefaultBadges && hasDefaultAddresses ? (
          <div className="flex flex-row gap-2">
            {isDefaultBillingAddress ? (
              <NeutralBadge label="Default billing" />
            ) : undefined}

            {isDefaultShippingAddress ? (
              <NeutralBadge label="Default shipping" />
            ) : undefined}
          </div>
        ) : undefined}
      </div>
    </Island>
  );
};
