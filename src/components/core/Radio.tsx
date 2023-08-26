type Props = {
  selected: boolean;
  onClick?: () => void;
};

/**
 * Display a radio button.
 */
export const Radio: React.FC<Props> = ({ selected, onClick }) => {
  return (
    <input
      type="radio"
      checked={selected}
      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
      onClick={onClick}
    />
  );
};
