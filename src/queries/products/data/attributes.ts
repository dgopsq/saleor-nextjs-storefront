import {
  Attribute,
  AttributeInputTypeEnum,
  AttributeValue,
} from "@/__generated__/graphql";
import { ProductVariant } from "@/queries/products/data";
import { match } from "ts-pattern";

/**
 * Only the `Dropdown` type is supported for now.
 */
export enum AttributeKind {
  Dropdown = "Dropdown",
}

/**
 *
 */
export type ProductAttribute = {
  attribute: {
    id: string;
    type: AttributeKind;
    name: string | null;
  };

  values: Array<{
    id: string;
    name: string | null;
  }>;
};

/**
 *
 */
type AggregatedAttributeDropdown = {
  id: string;
  kind: AttributeKind.Dropdown;
  name: string | null;
  values: Array<{
    id: string;
    name: string | null;
    variantId: string;
  }>;
};

/**
 *
 */
type AggregatedAttribute = AggregatedAttributeDropdown;

/**
 *
 */
export function parseAttributes(
  input: Array<{
    attribute: Pick<Attribute, "id" | "inputType" | "name">;
    values: Array<Pick<AttributeValue, "id" | "name">>;
  }>
): Array<ProductAttribute> {
  const output: Array<ProductAttribute> = [];

  for (const { attribute, values } of input) {
    const parsedType = match(attribute.inputType)
      .with(AttributeInputTypeEnum.Dropdown, () => AttributeKind.Dropdown)
      .otherwise(() => null);

    if (parsedType === null) continue;

    output.push({
      attribute: {
        id: attribute.id,
        type: parsedType,
        name: attribute.name ?? null,
      },

      values: values.map((value) => ({
        id: value.id,
        name: value.name ?? null,
      })),
    });
  }

  return output;
}

/**
 *
 */
export function parseVariantsAttributes(
  input: Array<ProductVariant>
): Array<AggregatedAttribute> {
  const attributesMap: Record<string, AggregatedAttribute> = {};

  input.forEach(({ attributes, id }) => {
    attributes.forEach(({ attribute, values }) => {
      match(attribute.type)
        .with(AttributeKind.Dropdown, () => {
          const prevValues = attributesMap[attribute.id]?.values || [];

          const newValues = values.map((value) => ({
            id: value.id,
            name: value.name,
            variantId: id,
          }));

          attributesMap[attribute.id] = {
            id: attribute.id,
            kind: AttributeKind.Dropdown,
            name: attribute.name,
            values: prevValues.concat(newValues),
          };
        })
        .exhaustive();
    });
  });

  return Object.values(attributesMap);
}
