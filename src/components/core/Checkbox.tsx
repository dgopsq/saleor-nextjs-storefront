import { useCallback } from "react";

type Props = {
  label: string;
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

/**
 *
 */
export const Checkbox: React.FC<Props> = ({ label, id, value, onChange }) => {
  const handleChange = useCallback(() => {
    onChange(!value);
  }, [value, onChange]);

  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={id}
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          checked={value}
          onChange={handleChange}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={id} className="font-medium text-gray-900">
          {label}
        </label>
      </div>
    </div>
  );
};
