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
};

/**
 *
 */
export const SingleOrder: React.FC<Props> = ({ order }) => {
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
    <div key={order.id} className="flex flex-row justify-between">
      <div>
        <ul className="flex flex-col gap-2">
          <li>
            <OrderDetail label="Order number" value={order.number} />
          </li>

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
      </div>

      <div>
        <div className="flex flex-row gap-2">{imagesRenderer}</div>
      </div>
    </div>
  );
};
