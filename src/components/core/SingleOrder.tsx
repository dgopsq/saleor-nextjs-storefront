import { TextButton } from "@/components/core/Button";
import { Island } from "@/components/core/Island";
import { KeyValue } from "@/components/core/KeyValue";
import { formatDateFull } from "@/misc/date";
import { Order } from "@/queries/checkout/data";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
  order: Order;
  onDetailsClick?: () => void;
};

/**
 *
 */
export const SingleOrder: React.FC<Props> = ({ order, onDetailsClick }) => {
  const t = useTranslations("User");
  const imagesRenderer = useMemo(() => {
    return order.lines.slice(0, 3).reduce((acc, line) => {
      const image = line.variant?.images[0] ?? null;

      if (!image) return acc;

      return [
        ...acc,
        <Island key={line.id} variant="solid-darker">
          <Image src={image.url} alt={image.alt ?? ""} width={80} height={80} />
        </Island>,
      ];
    }, [] as Array<React.ReactNode>);
  }, [order]);

  return (
    <div key={order.id} className="flex flex-row justify-between items-center">
      <div>
        <div>
          <span className="font-semibold">
            {t("Order")} {order.number}
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-1">
          <li>
            <KeyValue label={t("Status")} value={order.statusDisplay} />
          </li>

          <li>
            <KeyValue
              label={t("Created at")}
              value={formatDateFull(new Date(order.createdAt))}
            />
          </li>
        </ul>

        {onDetailsClick ? (
          <div className="mt-4">
            <TextButton
              variant="primary"
              text={t("More details...")}
              onClick={onDetailsClick}
            />
          </div>
        ) : undefined}
      </div>

      <div>
        <div className="flex flex-row gap-2">{imagesRenderer}</div>
      </div>
    </div>
  );
};
