import { Spinner } from "@/components/core/Spinner";

/**
 * A loading spinner used to indicate that something is loading.
 */
export const LoadingSpinner = () => (
  <div className="w-full flex flex-row justify-center">
    <Spinner size="medium" variant="main" />
  </div>
);
