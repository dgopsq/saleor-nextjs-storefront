import { CountryCode } from "@/__generated__/graphql";
import { CheckIcon, UpDownIcon } from "@/components/core/Icon";
import { classNames } from "@/misc/styles";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";

function countryCodeToName(countryCode?: CountryCode): string | null {
  if (!countryCode) return null;

  return (
    new Intl.DisplayNames(["us"], { type: "region" }).of(countryCode) ?? null
  );
}

const countries = Object.values(CountryCode);

type Props = {
  label: string;
  value?: CountryCode;
  onChange?: (value: CountryCode) => void;
  error?: string;
};

/**
 *
 */
export const CountrySelect: React.FC<Props> = ({
  value,
  onChange,
  label,
  error,
}) => {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </Listbox.Label>

          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="block truncate">
                  {countryCodeToName(value) ?? "Select a country"}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <UpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>

            {error ? (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            ) : undefined}

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {countries.map((countryCode) => (
                  <Listbox.Option
                    key={countryCode}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={countryCode}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {countryCodeToName(countryCode)}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
