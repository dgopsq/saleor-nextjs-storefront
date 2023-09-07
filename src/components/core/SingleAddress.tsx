import { NeutralBadge } from "@/components/core/Badge";
import { Address } from "@/queries/user/data";
import { useTranslations } from "next-intl";

type Props = {
  address: Address;
  showDefaultBadges?: boolean;
  multiline?: boolean;
};

/**
 * Component used to display a single address.
 */
export const SingleAddress: React.FC<Props> = ({
  address,
  showDefaultBadges,
  multiline,
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

  const t = useTranslations("User");

  const hasDefaultAddresses =
    isDefaultBillingAddress || isDefaultShippingAddress;

  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row text-left">
      {!multiline ? (
        <div className="flex flex-row items-center gap-2">
          <div className="text-sm font-semibold">
            {firstName} {lastName}
          </div>

          <div className="text-sm text-secondary-700">{`${streetAddress1}, ${city} (${countryArea}), ${postalCode}, ${country}`}</div>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2">
          <ul className="flex flex-col gap-2">
            <li className="text-sm font-semibold">
              {firstName} {lastName}
            </li>

            <li className="text-sm text-secondary-700">{streetAddress1}</li>

            <li className="text-sm text-secondary-700">{`${city} (${countryArea}), ${postalCode}`}</li>

            <li className="text-sm text-secondary-700">{country}</li>
          </ul>
        </div>
      )}

      {showDefaultBadges && hasDefaultAddresses ? (
        <div className="flex flex-row gap-2">
          {isDefaultBillingAddress ? (
            <NeutralBadge label={t("Default billing")} />
          ) : undefined}

          {isDefaultShippingAddress ? (
            <NeutralBadge label={t("Default shipping")} />
          ) : undefined}
        </div>
      ) : undefined}
    </div>
  );
};
