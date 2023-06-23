import { FragmentType, getFragmentData } from "@/__generated__";
import {
  AddressVariantFragmentDoc,
  UserVariantFragmentDoc,
} from "@/__generated__/graphql";

/**
 *
 */
type Address = {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  cityArea: string;
  postalCode: string;
  country: {
    code: string;
    country: string;
  };
  countryArea: string;
  phone: string | null;
  isDefaultShippingAddress: boolean | null;
  isDefaultBillingAddress: boolean | null;
};

/**
 *
 */
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Array<Address>;
};

/**
 *
 */
export function parseAddress(
  input: FragmentType<typeof AddressVariantFragmentDoc>
): Address {
  const {
    id,
    firstName,
    lastName,
    companyName,
    streetAddress1,
    streetAddress2,
    city,
    cityArea,
    postalCode,
    country,
    countryArea,
    phone,
    isDefaultShippingAddress,
    isDefaultBillingAddress,
  } = getFragmentData(AddressVariantFragmentDoc, input);

  return {
    id,
    firstName,
    lastName,
    companyName,
    streetAddress1,
    streetAddress2,
    city,
    cityArea,
    postalCode,
    country: {
      code: country.code,
      country: country.country,
    },
    countryArea,
    phone: phone || null,
    isDefaultShippingAddress: isDefaultShippingAddress || null,
    isDefaultBillingAddress: isDefaultBillingAddress || null,
  };
}

/**
 *
 */
export function parseUser(
  input: FragmentType<typeof UserVariantFragmentDoc>
): User {
  const { id, email, firstName, lastName, addresses } = getFragmentData(
    UserVariantFragmentDoc,
    input
  );

  return {
    id,
    email,
    firstName,
    lastName,
    addresses: addresses.map(parseAddress),
  };
}
