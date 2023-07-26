import { Order } from "@/queries/checkout/data";

type Props = {
  order: Order;
};

/**
 *
 */
export const SingleOrder: React.FC<Props> = ({ order }) => {
  return (
    <div key={order.id}>
      <h4>{order.id}</h4>
      <p>{order.totalPrice?.amount}</p>
    </div>
  );
};
