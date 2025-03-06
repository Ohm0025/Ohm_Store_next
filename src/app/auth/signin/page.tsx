import React from "react";
import AuthHeader from "@/features/auths/components/AuthHeader";
import AuthForm from "@/features/auths/components/AuthForm";

const SiginPage = () => {
  const type = "signin";
  return (
    <AuthHeader type={type}>
      <AuthForm type={type} />
    </AuthHeader>
  );
};

export default SiginPage;
