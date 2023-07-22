import { Island } from "@/components/core/Island";
import { Radio } from "@/components/core/Radio";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  isSelected?: boolean;
}>;

/**
 *
 */
export const RadioIsland: React.FC<Props> = ({ isSelected, children }) => {
  return (
    <Island variant="outline" isSelected={isSelected}>
      <div className="flex flex-row items-center gap-6">
        <Radio selected={!!isSelected} />

        <div className="basis-full grow shrink">{children}</div>
      </div>
    </Island>
  );
};
