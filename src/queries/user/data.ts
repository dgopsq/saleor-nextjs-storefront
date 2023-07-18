import { getFragmentData } from "@/__generated__";
import {
  AddressInput,
  CountryCode,
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
export type Address = {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  cityArea: string;
  postalCode: string;
  country: CountryCode;
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
  defaultShippingAddress: Address | null;
  defaultBillingAddress: Address | null;
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

    // FIXME: is this unsafe?
    country: country.code as CountryCode,

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

  const rawDefaultShippingAddress =
    getFragmentData(GenericAddressFragmentDoc, input.defaultShippingAddress) ??
    null;

  const rawDefaultBillingAddress =
    getFragmentData(GenericAddressFragmentDoc, input.defaultBillingAddress) ??
    null;

  return {
    id,
    email,
    firstName,
    lastName,
    checkoutTokens: checkouts?.edges?.map((edge) => edge?.node?.token) ?? [],
    defaultShippingAddress: rawDefaultShippingAddress
      ? parseAddress(rawDefaultShippingAddress)
      : null,
    defaultBillingAddress: rawDefaultBillingAddress
      ? parseAddress(rawDefaultBillingAddress)
      : null,
    addresses: input.addresses.map((rawAddress) => {
      const addressFragment = getFragmentData(
        GenericAddressFragmentDoc,
        rawAddress
      );

      return parseAddress(addressFragment);
    }),
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
export function addressToAddressForm(input: Address): Partial<AddressForm> {
  return {
    firstName: input.firstName ?? undefined,
    lastName: input.lastName ?? undefined,
    companyName: input.companyName ?? undefined,
    streetAddress1: input.streetAddress1 ?? undefined,
    streetAddress2: input.streetAddress2 ?? undefined,
    city: input.city ?? undefined,
    postalCode: input.postalCode ?? undefined,
    country: input.country ?? undefined,
    countryArea: input.countryArea ?? undefined,
    phone: input.phone ?? undefined,
  };
}

/**
 *
 */
export function addressToAddressInput(input: Address): AddressInput {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    companyName: input.companyName,
    streetAddress1: input.streetAddress1,
    streetAddress2: input.streetAddress2,
    city: input.city,
    postalCode: input.postalCode,
    country: input.country,
    countryArea: input.countryArea,
    phone: input.phone,
  };
}
