type Props = {
  label: string;
  value: string;
};

/**
 * Component used to display a key-value pair.
 */
export const KeyValue: React.FC<Props> = ({ label, value }) => {
  return (
    <>
      <span className="font-semibold text-sm">{label}:</span>{" "}
      <span className="text-sm">{value}</span>
    </>
  );
};
