import { Button } from "@/components/core/Button";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";

type Props = {
  triggerOnVisible?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
};

/**
 *
 */
export const ShowMoreButton: React.FC<Props> = ({
  onClick,
  isLoading,
  triggerOnVisible,
}) => {
  const [canTrigger, setCanTrigger] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!triggerOnVisible && !!entry?.isIntersecting;

  useEffect(() => {
    if (canTrigger && !isLoading) {
      onClick?.();
      setCanTrigger(false);
    }
  }, [canTrigger, onClick, isLoading]);

  useEffect(() => {
    setCanTrigger(isVisible);
  }, [isVisible]);

  return (
    <div ref={ref}>
      <Button
        variant="secondary"
        size="large"
        text="Show more"
        onClick={onClick}
        isLoading={isLoading}
      />
    </div>
  );
};
