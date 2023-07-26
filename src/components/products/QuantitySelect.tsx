import { Select, SelectItem } from "@/components/core/Select";
import { ProductVariant } from "@/queries/products/data";
import { useMemo } from "react";

type Props = {
  id?: string;
  variant: ProductVariant;
  value: number;
  onChange: (value: number) => void;
};

/**
 *
 */
export const QuantitySelect: React.FC<Props> = ({
  id,
  variant,
  value,
  onChange,
}) => {
  const qtyOptions = useMemo<Array<SelectItem<number>>>(() => {
    const qty = variant?.quantityAvailable ?? 0;
    const limit = variant?.quantityLimitPerCustomer ?? null;
    const computedQty = limit !== null ? Math.min(qty, limit) : qty;

    return Array.from({ length: computedQty }, (_, i) => i + 1).map((i) => ({
      id: i.toString(),
      label: i.toString(),
      value: i,
    }));
  }, [variant]);

  return (
    <Select<number>
      id={id}
      options={qtyOptions}
      onChange={onChange}
      value={value}
      parseValue={parseInt}
    />
  );
};
