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
      className="h-4 w-4 border-secondary-300 text-primary-600 focus:ring-primary-600 cursor-pointer"
      onClick={onClick}
    />
  );
};
