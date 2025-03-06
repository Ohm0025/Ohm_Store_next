import React from "react";
import type { Metadata } from "next";
import AuthHeader from "@/features/auths/components/AuthHeader";
import AuthForm from "@/features/auths/components/AuthForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Register to Ohm's E-commerce web application",
};

function SignUpPage() {
  const type = "signup";
  return (
    <div>
      <AuthHeader type={type}>
        <AuthForm type={type} />
      </AuthHeader>
    </div>
  );
}

export default SignUpPage;
