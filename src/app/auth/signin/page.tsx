import React from "react";
import AuthHeader from "@/features/auths/components/AuthHeader";
import AuthForm from "@/features/auths/components/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Ohm's E-commerce web application",
};

const SiginPage = () => {
  const type = "signin";
  return (
    <AuthHeader type={type}>
      <AuthForm type={type} />
    </AuthHeader>
  );
};

export default SiginPage;
