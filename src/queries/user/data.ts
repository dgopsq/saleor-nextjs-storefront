import { getFragmentData } from "@/__generated__";
import {
  AddressInput,
  GenericAddressFragment,
  GenericAddressFragmentDoc,
  GenericUserFragment,
} from "@/__generated__/graphql";
import { AddressForm } from "@/components/core/AddressForm";
import jwt_decode from "jwt-decode";
import * as z from "zod";

/**
 *
 */
export type AuthToken = string;

/**
 *
 */
export type RefreshToken = string;

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
  checkoutTokens: Array<string>;
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
  const { id, email, firstName, lastName, checkouts } = input;
  const addresses =
    getFragmentData(GenericAddressFragmentDoc, input.addresses) ?? [];

  console.log(addresses);

  return {
    id,
    email,
    firstName,
    lastName,
    checkoutTokens: checkouts?.edges?.map((edge) => edge?.node?.token) ?? [],
    addresses: addresses.map(parseAddress),
  };
}

/**
 *
 */
const userTokenPayloadSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
});

type UserTokenPayload = z.infer<typeof userTokenPayloadSchema>;

/**
 *
 */
export function decodeUserToken(token: string): UserTokenPayload | null {
  const decoded = jwt_decode(token);
  const parsed = userTokenPayloadSchema.safeParse(decoded);

  return parsed.success ? parsed.data : null;
}

/**
 *
 */
export function addressFormToAddressInput(
  addressForm: AddressForm
): AddressInput {
  return {
    firstName: addressForm.firstName,
    lastName: addressForm.lastName,
    companyName: addressForm.companyName,
    streetAddress1: addressForm.streetAddress1,
    streetAddress2: addressForm.streetAddress2,
    city: addressForm.city,
    postalCode: addressForm.postalCode,
    country: addressForm.country,
    phone: addressForm.phone,
  };
}
