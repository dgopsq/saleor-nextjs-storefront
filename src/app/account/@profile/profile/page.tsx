import { Island } from "@/components/core/Island";
import { ChangeEmail } from "@/components/user/ChangeEmail";
import { ChangePassword } from "@/components/user/ChangePassword";
import { EmailConfirmation } from "@/components/user/EmailConfirmation";
import { ProfileInfo } from "@/components/user/ProfileInfo";

export default async function Page() {
  return (
    <>
      <div>
        <Island variant="outline">
          <ProfileInfo />
        </Island>
      </div>

      <div className="mt-12">
        <Island variant="outline">
          <ChangePassword />
        </Island>
      </div>

      <div className="mt-12">
        <Island variant="outline">
          <ChangeEmail />
        </Island>
      </div>

      <EmailConfirmation />
    </>
  );
}
