import React from "react";
import { authCheck } from "@/features/auths/db/auth";
import { redirect } from "next/navigation";
import HeaderCustomer from "@/components/customer-page/headers/header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await authCheck();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col justify-center min-h-svh">
      <HeaderCustomer user={null} />
      <main>{children}</main>
    </div>
  );
}

export default AuthLayout;
