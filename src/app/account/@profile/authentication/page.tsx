import { ChangeEmail } from "@/components/user/ChangeEmail";
import { ChangePassword } from "@/components/user/ChangePassword";
import { EmailConfirmation } from "@/components/user/EmailConfirmation";

export default async function Page() {
  return (
    <>
      <div className="border-b border-gray-100 pb-16">
        <ChangePassword />
      </div>

      <div className="pt-16">
        <ChangeEmail />
      </div>

      <EmailConfirmation />
    </>
  );
}
