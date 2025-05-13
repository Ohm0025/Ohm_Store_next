"use server";

import { InitialFormState } from "@/types/action";
import {
  resetPassword,
  sendResetPasswordEmail,
  signin,
  signout,
  signup,
} from "../db/auth";

export const authAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    name: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = rawData.confirmPassword
    ? await signup(rawData)
    : await signin(rawData);

  return result && result.message
    ? { success: false, message: result.message, errors: result.error }
    : {
        success: true,
        message: rawData.confirmPassword ? "register success" : "login success",
      };
};

export const signoutAction = async () => {
  const result = await signout();
  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "signout success" };
};

export const forgotPasswordAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const email = formData.get("email") as string;
  const result = await sendResetPasswordEmail(email);
  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "send reset link to email successfully" };
};

export const resetPasswordAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const data = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm-password") as string,
  };

  const result = await resetPassword(data);
  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "reset password successfully" };
};
