type BaseHeadingProps = {
  children: string;
};

/**
 * The heading of a page.
 */
export const PageHeading: React.FC<BaseHeadingProps> = ({ children }) => (
  <h1 id="summary-heading" className="text-2xl font-medium text-secondary-900">
    {children}
  </h1>
);

/**
 * The heading of a section.
 */
export const SectionHeading: React.FC<BaseHeadingProps> = ({ children }) => (
  <h2 id="summary-heading" className="text-lg font-medium text-secondary-900">
    {children}
  </h2>
);
