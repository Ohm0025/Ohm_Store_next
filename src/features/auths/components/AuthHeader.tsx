import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthHeaderProps {
  type: "signup" | "signin";
  children: React.ReactNode;
}

const AuthHeader = ({ type, children }: AuthHeaderProps) => {
  const title = type === "signup" ? "Register" : "Login";
  const desc =
    type === "signup"
      ? "Register to Ohm's E-commerce web application"
      : "Login to Ohm's E-commerce web application";

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
