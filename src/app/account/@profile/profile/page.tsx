import { PageHeading } from "@/components/core/Headings";
import { Island } from "@/components/core/Island";
import { ChangeEmail } from "@/components/user/ChangeEmail";
import { ChangePassword } from "@/components/user/ChangePassword";
import { EmailConfirmation } from "@/components/user/EmailConfirmation";
import { ProfileInfo } from "@/components/user/ProfileInfo";

export default async function Page() {
  return (
    <>
      <div>
        <PageHeading>Profile</PageHeading>
      </div>

      <div className="mt-8">
        <Island variant="solid">
          <ProfileInfo />
        </Island>
      </div>

      <div className="mt-8">
        <Island variant="solid">
          <ChangePassword />
        </Island>
      </div>

      <div className="mt-8">
        <Island variant="solid">
          <ChangeEmail />
        </Island>
      </div>

      <EmailConfirmation />
    </>
  );
}
