import { getStoredAuthTokenServer } from "@/app/account/@auth/login/actions";
import { ProfileMenu } from "@/components/user/ProfileMenu";

export default async function Layout(props: {
  auth: React.ReactNode;
  profile: React.ReactNode;
}) {
  const authToken = await getStoredAuthTokenServer();
  const isLoggedIn = authToken !== null;

  if (!isLoggedIn)
    return <div className="max-w-lg w-full mx-a mt-10">{props.auth}</div>;

  return (
    <div className="w-full">
      <div>
        <ProfileMenu />
      </div>

      <div className="mt-8">{props.profile}</div>
    </div>
  );
}
