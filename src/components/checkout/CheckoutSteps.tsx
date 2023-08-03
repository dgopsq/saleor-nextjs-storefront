import { Route } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

function formatStepIndex(index: number) {
  const step = index + 1;
  return step < 10 ? `0${step}` : step;
}

type Step = {
  name: string;
  route: Route;
};

type Props = {
  currentStep: number;
};

/**
 *
 */
export const CheckoutSteps: React.FC<Props> = ({ currentStep }) => {
  const t = useTranslations("Checkout");
  const steps: Array<Step> = useMemo(
    () => [
      { name: t("Informations"), route: "/checkout/informations" },
      { name: t("Shipping"), route: "/checkout/shipping" },
      { name: t("Payment"), route: "/checkout/payment" },
    ],
    [t]
  );

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:block">
        <ol role="list" className="space-y-4 md:space-x-8 md:space-y-0 md:flex">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <Link href={step.route}>
                  <span className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                      {formatStepIndex(index)}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </span>
                </Link>
              ) : currentStep === index ? (
                <span
                  className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-indigo-600">
                    {formatStepIndex(index)}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </span>
              ) : (
                <span className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    {formatStepIndex(index)}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile */}
      <nav
        className="flex items-center justify-center md:hidden"
        aria-label="Progress"
      >
        <ol role="list" className="flex items-center space-x-5">
          {steps.map((step, index) => (
            <li key={step.name}>
              {currentStep > index ? (
                <Link
                  href={step.route}
                  className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900"
                >
                  <span className="sr-only">{step.name}</span>
                </Link>
              ) : currentStep === index ? (
                <span className="relative flex items-center justify-center">
                  <span
                    className="absolute flex h-5 w-5 p-px"
                    aria-hidden="true"
                  >
                    <span className="h-full w-full rounded-full bg-indigo-200" />
                  </span>
                  <span
                    className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </span>
              ) : (
                <span className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
                  <span className="sr-only">{step.name}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
