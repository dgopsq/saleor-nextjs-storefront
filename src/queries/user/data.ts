import { getFragmentData } from "@/__generated__";
import {
  GenericAddressFragment,
  GenericAddressFragmentDoc,
  GenericUserFragment,
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
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  checkoutIds: Array<string>;
  addresses: Array<Address>;
};

/**
 *
 */
export function parseAddress(input: GenericAddressFragment): Address {
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
  } = input;

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
export function parseUser(input: GenericUserFragment): User {
  const { id, email, firstName, lastName, checkoutIds } = input;
  const addresses =
    getFragmentData(GenericAddressFragmentDoc, input.addresses) ?? [];

  console.log(addresses);

  return {
    id,
    email,
    firstName,
    lastName,
    checkoutIds: checkoutIds || [],
    addresses: addresses.map(parseAddress),
  };
}
