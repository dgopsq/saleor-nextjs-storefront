import { getStoredAuthTokenServer } from "@/app/account/@auth/login/actions";

export default async function Layout(props: {
  auth: React.ReactNode;
  profile: React.ReactNode;
}) {
  const authToken = await getStoredAuthTokenServer();
  const isLoggedIn = authToken !== null;

  if (!isLoggedIn)
    return <div className="max-w-lg w-full mx-a mt-10">{props.auth}</div>;

  return <div className="w-full">{props.profile}</div>;
}
