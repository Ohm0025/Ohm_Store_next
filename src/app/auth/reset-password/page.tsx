import AuthHeader from "@/features/auths/components/AuthHeader";
import ResetPasswordForm from "@/features/auths/components/reset-password-form";
import { redirect } from "next/navigation";
import React from "react";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token: string;
  }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { token } = await searchParams;

  if (!token) {
    redirect("/auth/signin");
  }

  return (
    <AuthHeader type="reset-password">
      <ResetPasswordForm token={token} />
    </AuthHeader>
  );
};

export default ResetPasswordPage;
