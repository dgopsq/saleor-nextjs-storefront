import { Weight as BaseWeight, WeightUnitsEnum } from "@/__generated__/graphql";

/**
 *
 */
export type Weight = {
  unit: WeightUnitsEnum;
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
