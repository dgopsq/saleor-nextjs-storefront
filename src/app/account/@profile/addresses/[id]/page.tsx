import { EditAddress } from "@/components/user/EditAddress";

type Params = {
  id: string;
};

export default async function Page({ params }: { params: Params }) {
  return <EditAddress id={decodeURIComponent(params.id)} />;
}
