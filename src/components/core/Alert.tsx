import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

type BaseAlertProps = {
  text: string;
};

/**
 *
 */
export const SuccessAlert: React.FC<BaseAlertProps> = ({ text }) => (
  <div className="rounded-md bg-green-100 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <CheckCircleIcon
          className="h-5 w-5 text-green-600"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-green-800">{text}</p>
      </div>
    </div>
  </div>
);

/**
 *
 */
export const ErrorAlert: React.FC<BaseAlertProps> = ({ text }) => (
  <div className="rounded-md bg-red-100 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <XCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800">{text}</p>
      </div>
    </div>
  </div>
);
