import { Select } from "@/components/core/Select";
import {
  AttributeKind,
  Product,
  parseVariantsAttributes,
} from "@/queries/products/data";
import { useCallback, useMemo } from "react";
import { match } from "ts-pattern";

type Props = {
  variants: Product["variants"];
  value: string;
  onChange?: (value: string) => void;
};

/**
 *
 */
export const ProductVariants: React.FC<Props> = ({
  variants,
  value,
  onChange,
}) => {
  const attributes = useMemo(
    () => parseVariantsAttributes(variants),
    [variants]
  );

  const currentAttributes = useMemo(() => {
    if (!value) return {};

    const variant = variants.find((variant) => variant.id === value);

    if (!variant) return {};

    const attributesValues: Record<string, string> = {};

    variant.attributes.forEach(({ attribute, values }) => {
      match(attribute.type)
        .with(AttributeKind.Dropdown, () => {
          const valueId = values[0]?.id ?? null;
          if (valueId !== null) attributesValues[attribute.id] = valueId;
        })
        .exhaustive();
    });

    return attributesValues;
  }, [value, variants]);

  // TODO: This is a very naive implementation.
  // It should be improve to increase performance and accuracy.
  const getVariantFromAttributes = useCallback(
    (attributes: Record<string, string>) => {
      const attributesArray = Object.entries(attributes);

      return variants.find((variant) => {
        return attributesArray.every(([attributeId, valueId]) =>
          variant.attributes.some(
            ({ attribute, values }) =>
              attribute.id === attributeId &&
              values.some((value) => value.id === valueId)
          )
        );
      });
    },
    [variants]
  );

  const handleChange = useCallback(
    (attributeId: string, valueId: string) => {
      const updatedAttributes = {
        ...currentAttributes,
        [attributeId]: valueId,
      };

      const variant = getVariantFromAttributes(updatedAttributes);

      if (variant && onChange) onChange(variant.id);
    },
    [currentAttributes, onChange, getVariantFromAttributes]
  );

  return (
    <div>
      {attributes.map((attribute) => {
        switch (attribute.kind) {
          case "Dropdown":
            return (
              <div key={attribute.id}>
                <label
                  htmlFor={`attribute-${attribute.id}`}
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {attribute.name}
                </label>

                <div className="mt-1">
                  <Select
                    value={currentAttributes?.[attribute.id] ?? undefined}
                    onChange={(value) => handleChange(attribute.id, value)}
                    options={attribute.values.map(({ id, name }) => ({
                      id,
                      value: id,
                      label: name ?? "",
                    }))}
                    parseValue={(_) => _}
                  />
                </div>
              </div>
            );
        }
      })}
    </div>
  );
};
