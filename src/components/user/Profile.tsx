import { PageHeading } from "@/components/core/Headings";
import { Island } from "@/components/core/Island";
import { ChangeEmail } from "@/components/user/ChangeEmail";
import { ChangePassword } from "@/components/user/ChangePassword";
import { EmailConfirmation } from "@/components/user/EmailConfirmation";
import { ProfileInfo } from "@/components/user/ProfileInfo";
import { useTranslations } from "next-intl";

/**
 * Renders the user profile page.
 */
export const Profile: React.FC = () => {
  const t = useTranslations("User");

  return (
    <>
      <div>
        <PageHeading>{t("Profile")}</PageHeading>
      </div>

      <div className="mt-8">
        <Island variant="outline">
          <ProfileInfo />
        </Island>
      </div>

      <div className="mt-8">
        <Island variant="outline">
          <ChangePassword />
        </Island>
      </div>

      <div className="mt-8">
        <Island variant="outline">
          <ChangeEmail />
        </Island>
      </div>

      <EmailConfirmation />
    </>
  );
};
