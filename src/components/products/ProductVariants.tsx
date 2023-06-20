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

                <select
                  id={`attribute-${attribute.id}`}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={currentAttributes?.[attribute.id] ?? undefined}
                  onChange={({ target: { value } }) =>
                    handleChange(attribute.id, value)
                  }
                >
                  {attribute.values.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            );
        }
      })}
    </div>
  );
};
