import { FailureIcon, SuccessIcon } from "@/components/core/Icon";

type BaseAlertProps = {
  text: string;
};

/**
 * Alert showing a success message.
 */
export const SuccessAlert: React.FC<BaseAlertProps> = ({ text }) => (
  <div className="rounded-md bg-green-100 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <SuccessIcon className="h-5 w-5 text-green-600" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-green-800">{text}</p>
      </div>
    </div>
  </div>
);

/**
 * Alert showing an error message.
 */
export const ErrorAlert: React.FC<BaseAlertProps> = ({ text }) => (
  <div className="rounded-md bg-red-100 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <FailureIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800">{text}</p>
      </div>
    </div>
  </div>
);
