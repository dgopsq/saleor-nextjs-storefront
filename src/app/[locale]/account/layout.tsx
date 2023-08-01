import { getStoredAuthTokenServer } from "@/app/[locale]/account/@auth/login/actions";
import { ProfileMenu } from "@/components/user/ProfileMenu";

export default async function Layout(props: {
  auth: React.ReactNode;
  profile: React.ReactNode;
}) {
  const authToken = await getStoredAuthTokenServer();
  const isLoggedIn = authToken !== null;

  if (!isLoggedIn)
    return <div className="max-w-lg w-full mx-a">{props.auth}</div>;

  return (
    <div className="w-full md:grid grid-cols-8 gap-x-8">
      <div className="col-span-2">
        <ProfileMenu />
      </div>

      <div className="mt-8 md:mt-0 col-span-6">{props.profile}</div>
    </div>
  );
}
