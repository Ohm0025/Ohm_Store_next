import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthHeaderProps {
  type: "signup" | "signin" | "forgot-password" | "reset-password";
  children: React.ReactNode;
}

const AuthHeader = ({ type, children }: AuthHeaderProps) => {
  let title = "";
  let desc = "";

  switch (type) {
    case "signup":
      title = "Register";
      desc = "Enter your data for registration";
      break;
    case "signin":
      title = "Login";
      desc = "Enter E-mail/Password for login";
      break;
    case "forgot-password":
      title = "Forgot Password";
      desc = "Enter E-mail for reset password";
      break;
    case "reset-password":
      title = "Reset Password";
      desc = "Enter new password";
      break;
  }
  return (
    <div className="px-4 md:px-0">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">{desc}</CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};

export default AuthHeader;
