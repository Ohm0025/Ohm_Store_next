import HeaderAdmin from "@/components/admin-page/header/header";
import SideBarAdmin from "@/components/admin-page/sideBar/sideBar";
import { authCheck } from "@/features/auths/db/auth";
import { SideBarProvider } from "@/providers/sideBarProvider";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  return (
    <SideBarProvider>
      <div className="bg-background flex min-h-svh">
        <SideBarAdmin user={user} />

        <div className="flex-1 flex flex-col">
          <HeaderAdmin user={user} />
          <main className="flex-1 overflow-y-auto md:ml-64 pt-16 p-4 md:px-6 transition-all duration-200">
            {children}
          </main>
        </div>
      </div>
    </SideBarProvider>
  );
};

export default AdminLayout;
