"use client";

import { FailureIcon, SuccessIcon } from "@/components/core/Icon";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast, useToaster } from "react-hot-toast";
import { match } from "ts-pattern";

/**
 *
 */
export const Notifications = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div
        onMouseEnter={startPause}
        onMouseLeave={endPause}
        className="flex w-full flex-col items-center space-y-4 sm:items-end max-w-md ml-auto"
      >
        {toasts
          .filter((toast) => toast.visible)
          .map((toast) => (
            <Transition
              key={toast.id}
              as={Fragment}
              show={true}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                {...toast.ariaProps}
                className="pointer-events-auto overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 w-full"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {match(toast.type)
                        .with("success", () => (
                          <SuccessIcon className="h-6 w-6 text-green-400" />
                        ))
                        .with("error", () => (
                          <FailureIcon className="h-6 w-6 text-red-400" />
                        ))
                        .otherwise(() => undefined)}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">
                        {typeof toast.message === "function"
                          ? toast.message(toast)
                          : toast.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          ))}
      </div>
    </div>
  );
};

/**
 *
 */
export function successToast(message: string) {
  toast.success(message);
}

/**
 *
 */
export function errorToast(message: string) {
  toast.error(message);
}
