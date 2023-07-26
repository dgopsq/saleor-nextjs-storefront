import { TextButton } from "@/components/core/Button";
import { Island } from "@/components/core/Island";
import { formatDateFull } from "@/misc/date";
import { Order, OrderStatus } from "@/queries/checkout/data";
import Image from "next/image";
import { useMemo } from "react";
import { match } from "ts-pattern";

const OrderDetail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <>
      <span className="font-semibold text-sm">{label}:</span>{" "}
      <span className="text-sm">{value}</span>
    </>
  );
};

type Props = {
  order: Order;
  onDetailsClick?: () => void;
};

/**
 *
 */
export const SingleOrder: React.FC<Props> = ({ order, onDetailsClick }) => {
  const imagesRenderer = useMemo(() => {
    return order.lines.slice(0, 3).reduce((acc, line) => {
      const image = line.images[0];

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
          <span className="font-semibold">Order {order.number}</span>
        </div>

        <ul className="mt-4 flex flex-col gap-1">
          <li>
            <OrderDetail
              label="Status"
              value={match(order.status)
                .with(OrderStatus.Fulfilled, () => "Complete")
                .with(OrderStatus.Returned, () => "Refunded")
                .with(OrderStatus.Canceled, () => "Canceled")
                .otherwise(() => "In progress")}
            />
          </li>

          <li>
            <OrderDetail
              label="Created at"
              value={formatDateFull(new Date(order.createdAt))}
            />
          </li>
        </ul>

        {onDetailsClick ? (
          <div className="mt-4">
            <TextButton
              variant="primary"
              text="More details..."
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
