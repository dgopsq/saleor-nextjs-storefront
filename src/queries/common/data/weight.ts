import { Weight as BaseWeight } from "@/__generated__/graphql";

/**
 *
 */
export type Weight = {
  unit: string;
  value: number;
};

/**
 *
 */
export function parseWeight(input: BaseWeight): Weight {
  return {
    unit: input.unit,
    value: input.value,
  };
}
