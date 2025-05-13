import Link from "next/link";
import React from "react";

interface AuthFooterProps {
  type: "signup" | "signin";
}

const authTextMap = {
  signup: {
    footerText: "Already have an account?",
    linkText: "Sign in",
    linkHref: "/auth/signin",
  },
  signin: {
    footerText: "Don't have an account?",
    linkText: "Sign up",
    linkHref: "/auth/signup",
  },
};

const AuthFooter = ({ type }: AuthFooterProps) => {
  const { footerText, linkText, linkHref } = authTextMap[type];
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-center text-sm text-accent-foreground">
        {footerText}{" "}
        <Link href={linkHref} className="text-primary hover:underline">
          {linkText}
        </Link>
      </p>

      {type === "signin" && (
        <Link
          href={"/auth/forgot-password"}
          className="text-sm text-muted-foreground hover:text-primary hover:underline">
          Forgat Possword?
        </Link>
      )}
    </div>
  );
};

export default AuthFooter;
