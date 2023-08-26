export type SelectItem<T extends string | number> = {
  id: string;
  value: T;
  label: string;
};

type Props<T extends string | number> = {
  id?: string;
  value?: T;
  options: Array<SelectItem<T>>;
  onChange: (value: T) => void;
  parseValue: (value: string) => T;
};

/**
 * Select input field with a list of options.
 */
export const Select = <T extends string | number>({
  id,
  value,
  options,
  onChange,
  parseValue,
}: Props<T>) => {
  return (
    <select
      id={id}
      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={value}
      onChange={({ target: { value } }) => onChange(parseValue(value))}
    >
      {options.map(({ id, label, value }) => (
        <option key={id} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
