import AuthHeader from "@/features/auths/components/AuthHeader";
import ForgotPasswordForm from "@/features/auths/components/forgot-password-form";
import React from "react";

const ForgotPasswordPage = () => {
  return (
    <AuthHeader type="forgot-password">
      <ForgotPasswordForm />
    </AuthHeader>
  );
};

export default ForgotPasswordPage;
