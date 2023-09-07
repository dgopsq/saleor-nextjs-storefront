import { FailureIcon, SuccessIcon } from "@/components/core/Icon";

type BaseAlertProps = {
  text: string;
};

/**
 * Alert showing a success message.
 */
export const SuccessAlert: React.FC<BaseAlertProps> = ({ text }) => (
  <div className="rounded-md bg-success-100 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <SuccessIcon className="h-5 w-5 text-success-600" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-success-800">{text}</p>
      </div>
    </div>
  </div>
);

/**
 * Alert showing an error message.
 */
export const ErrorAlert: React.FC<BaseAlertProps> = ({ text }) => (
  <div className="rounded-md bg-danger-100 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <FailureIcon className="h-5 w-5 text-danger-600" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-danger-800">{text}</p>
      </div>
    </div>
  </div>
);
