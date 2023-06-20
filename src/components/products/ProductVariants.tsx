import { Product, parseVariantsAttributes } from "@/queries/products/data";
import { useMemo } from "react";

type Props = {
  variants: Product["variants"];
};

/**
 *
 */
export const ProductVariants: React.FC<Props> = ({ variants }) => {
  const attributes = useMemo(
    () => parseVariantsAttributes(variants),
    [variants]
  );

  return (
    <div>
      {attributes.map((attribute) => {
        switch (attribute.kind) {
          case "Dropdown":
            return (
              <div>
                <label
                  htmlFor={`attribute-${attribute.id}`}
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {attribute.name}
                </label>

                <select
                  id={`attribute-${attribute.id}`}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Choose</option>

                  {attribute.values.map(({ id, variantId, name }) => (
                    <option key={id} value={variantId}>
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
