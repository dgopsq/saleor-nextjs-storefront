type Props = {
  htmlFor?: string;
  children?: string;
};

/**
 *
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
