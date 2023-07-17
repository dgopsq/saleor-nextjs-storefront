import { getStoredAuthTokenServer } from "@/app/account/@auth/login/actions";
import { ProfileSidebar } from "@/components/user/ProfileSidebar";

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
      <div className="flex">
        <div className="flex-initial w-52">
          <ProfileSidebar />
        </div>

        <div className="flex-1 pl-12">{props.profile}</div>
      </div>
    </div>
  );
}
