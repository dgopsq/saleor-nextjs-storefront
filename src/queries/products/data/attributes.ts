import { AttributeInputTypeEnum } from "@/__generated__/graphql";
import { ProductVariant } from "@/queries/products/data";

/**
 *
 */
type AggregatedAttributeDropdown = {
  id: string;
  kind: "Dropdown";
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
export type AggregatedAttribute = AggregatedAttributeDropdown;

/**
 *
 */
export function parseVariantsAttributes(
  input: Array<ProductVariant>
): Array<AggregatedAttribute> {
  const attributesMap: Record<string, AggregatedAttribute> = {};

  input.forEach(({ attributes, id }) => {
    attributes.forEach(({ attribute, values }) => {
      switch (attribute.type) {
        // Handle the `Dropdown` attribute type.
        case AttributeInputTypeEnum.Dropdown: {
          const prevValues = attributesMap[attribute.id]?.values || [];

          const newValues = values.map((value) => ({
            id: value.id,
            name: value.name,
            variantId: id,
          }));

          attributesMap[attribute.id] = {
            id: attribute.id,
            kind: "Dropdown",
            name: attribute.name,
            values: prevValues.concat(newValues),
          };
        }
      }
    });
  });

  return Object.values(attributesMap);
}
