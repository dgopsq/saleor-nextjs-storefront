import { Sidebar } from "@/components/core/Sidebar";
import { ProfileInfo } from "@/components/user/ProfileInfo";

export default async function Page() {
  return (
    <>
      <div className="flex">
        <div className="flex-initial w-52">
          <Sidebar
            items={[
              { id: "info", label: "Account info", href: "#" },
              {
                id: "emailAndPassword",
                label: "Email and password",
                href: "#",
              },
            ]}
            active="info"
          />
        </div>

        <div className="flex-1 pl-12">
          <ProfileInfo />
        </div>
      </div>
    </>
  );
}
