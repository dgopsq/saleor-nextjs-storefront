import { OrderDetails } from "@/components/user/OrderDetails";

type Params = {
  number: string;
};

export default async function Page({ params }: { params: Params }) {
  return <OrderDetails number={decodeURIComponent(params.number)} />;
}
