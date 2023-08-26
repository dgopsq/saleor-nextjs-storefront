type Props = {
  children: string;
};

/**
 * Specific text used when there is no data to display.
 */
export const EmptyText: React.FC<Props> = ({ children }) => {
  return <p className="text-gray-400">{children}</p>;
};
