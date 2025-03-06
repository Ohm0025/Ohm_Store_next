"use client";
import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import AuthFooter from "./AuthFooter";
import { useForm } from "@/hooks/useForm";
import { authAction } from "../actions/auth";

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
        {errors[id] && (
          <span className="text-red-500 text-sm">{errors[id]}</span> //get only the first error
        )}
      </div>
    );
  };

  const { errors, formAction, isPending, clearErrors } = useForm(
    authAction,
    "/"
  );

  return (
    <Form action={formAction} onChange={clearErrors}>
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
          pending={isPending}
        />
      </CardFooter>
    </Form>
  );
};

export default AuthForm;
