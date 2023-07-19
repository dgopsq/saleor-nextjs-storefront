type BaseBadgeProps = {
  label: string;
};

/**
 *
 */
export const NeutralBadge: React.FC<BaseBadgeProps> = ({ label }) => (
  <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
    {label}
  </span>
);
