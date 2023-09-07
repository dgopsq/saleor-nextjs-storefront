import { CheckIcon, SuccessIcon } from "@/components/core/Icon";
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
 * The steps component used during the checkout.
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
    <nav>
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            {currentStep > index ? (
              <Link href={step.route}>
                <span className="group flex flex-col p-4 border border-primary-600 bg-primary-600 rounded-lg">
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {formatStepIndex(index)}
                    </span>

                    <SuccessIcon className="text-white w-5 h-5" />
                  </div>

                  <span className="text-sm font-medium text-white">
                    {step.name}
                  </span>
                </span>
              </Link>
            ) : currentStep === index ? (
              <span
                className="flex flex-col p-4 bg-secondary-50 border border-secondary-50 rounded-lg"
                aria-current="step"
              >
                <span className="text-sm font-medium text-primary-600">
                  {formatStepIndex(index)}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </span>
            ) : (
              <span className="group flex flex-col p-4 border border-secondary-100 rounded-lg">
                <span className="text-sm font-medium text-secondary-500 group-hover:text-secondary-700">
                  {formatStepIndex(index)}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
