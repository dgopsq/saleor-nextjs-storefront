type Props = {
  label: string;
  value: string;
};

/**
 *
 */
export const KeyValue: React.FC<Props> = ({ label, value }) => {
  return (
    <>
      <span className="font-semibold text-sm">{label}:</span>{" "}
      <span className="text-sm">{value}</span>
    </>
  );
};
