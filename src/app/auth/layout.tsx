import React from "react";
import { authCheck } from "@/features/auths/db/auth";
import { redirect } from "next/navigation";

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
      <main>{children}</main>
    </div>
  );
}

export default AuthLayout;
