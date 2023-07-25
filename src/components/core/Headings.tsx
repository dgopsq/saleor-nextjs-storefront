type BaseHeadingProps = {
  children: string;
};

/**
 *
 */
export const PageHeading: React.FC<BaseHeadingProps> = ({ children }) => (
  <h1 id="summary-heading" className="text-2xl font-medium text-gray-900">
    {children}
  </h1>
);

/**
 *
 */
export const SectionHeading: React.FC<BaseHeadingProps> = ({ children }) => (
  <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
    {children}
  </h2>
);
