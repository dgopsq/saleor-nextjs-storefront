import { getUserTokensCookies } from "@/app/account/@auth/login/actions";

export default async function Layout(props: {
  auth: React.ReactNode;
  profile: React.ReactNode;
}) {
  const userToken = await getUserTokensCookies();
  const isLoggedIn = userToken !== null;

  if (!isLoggedIn)
    return <div className="max-w-lg w-full mx-a mt-10">{props.auth}</div>;

  return <>{props.profile}</>;
}
