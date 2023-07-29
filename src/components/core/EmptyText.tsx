type Props = {
  children: string;
};

/**
 *
 */
export const EmptyText: React.FC<Props> = ({ children }) => {
  return <p className="text-gray-400">{children}</p>;
};
