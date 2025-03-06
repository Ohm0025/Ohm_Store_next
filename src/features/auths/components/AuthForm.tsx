"use client";
import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import AuthFooter from "./AuthFooter";

interface AuthFormProps {
  type: "signup" | "signin";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const renderInput = (
    label: string,
    id: string,
    required = false,
    type = "text"
  ) => {
    return (
      <div>
        <InputForm label={label} id={id} required={required} type={type} />
      </div>
    );
  };
  return (
    <Form action="">
      <CardContent className="flex flex-col gap-4">
        {type === "signup" && renderInput("Username", "username")}
        {renderInput("Email", "email", true, "email")}
        {renderInput("Password", "password", true, "password")}
        {type === "signup" &&
          renderInput("Confirm Password", "confirmPassword", true, "password")}
      </CardContent>
      <CardFooter className="pt-4 flex flex-col gap-2">
        <AuthFooter type={type} />
        <SubmitBtn
          name={type === "signup" ? "Register" : "Login"}
          className="w-full"
        />
      </CardFooter>
    </Form>
  );
};

export default AuthForm;
