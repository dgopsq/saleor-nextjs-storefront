import { Product } from "@/queries/products/data";
import { classNames } from "@/misc/styles";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { Island } from "@/components/core/Island";

type Props = {
  images: Product["images"];
};

/**
 * Renders all product images.
 */
export const ProductImages: React.FC<Props> = ({ images }) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <Tab
              key={image.id}
              className="relative flex h-28 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-secondary-900 hover:bg-secondary-50 focus:outline-none"
            >
              {({ selected }) => (
                <div>
                  <span
                    className={classNames(
                      selected ? "bg-secondary-50" : "",
                      "pointer-events-none absolute inset-0 rounded-md"
                    )}
                    aria-hidden="true"
                  />

                  <span className="absolute inset-0 overflow-hidden rounded-md p-2">
                    <Image
                      src={image.url}
                      alt={image.alt ?? ""}
                      className="h-full w-full object-cover object-center"
                      width={200}
                      height={200}
                    />
                  </span>
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <Island variant="solid-darker">
              <Image
                src={image.url}
                alt={image.alt ?? ""}
                className="h-full w-full object-cover object-center sm:rounded-lg"
                width={600}
                height={600}
              />
            </Island>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
