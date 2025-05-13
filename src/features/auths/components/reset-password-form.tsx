"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import React from "react";
import { resetPasswordAction } from "../actions/auth";
import { useForm } from "@/hooks/useForm";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { isPending, formAction } = useForm(
    resetPasswordAction,
    "/auth/signin"
  );
  return (
    <Form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <CardContent className="flex flex-col gap-4">
        <div>
          <InputForm
            label="Enter new password"
            id="password"
            type="password"
            required></InputForm>
        </div>
        <div>
          <InputForm
            label="Confirm new password"
            id="confirm-password"
            type="password"
            required></InputForm>
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <SubmitBtn
          pending={isPending}
          name="change password"
          className="w-full"
        />
      </CardFooter>
    </Form>
  );
};

export default ResetPasswordForm;
