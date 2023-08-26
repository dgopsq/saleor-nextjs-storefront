type Props = {
  htmlFor?: string;
  children?: string;
};

/**
 * Component used to display a label for a form field.
 */
export const Label: React.FC<Props> = ({ htmlFor, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {children}
    </label>
  );
};
