"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import React from "react";
import { forgotPasswordAction } from "../actions/auth";
import { useForm } from "@/hooks/useForm";

const ForgotPasswordForm = () => {
  const { isPending, formAction } = useForm(
    forgotPasswordAction,
    "/auth/signin"
  );
  return (
    <Form action={formAction}>
      <CardContent>
        <InputForm label="E-mail" id="email" type="email" required></InputForm>
      </CardContent>
      <CardFooter className="pt-6">
        <SubmitBtn pending={isPending} className="w-full" name="send link" />
      </CardFooter>
    </Form>
  );
};

export default ForgotPasswordForm;
