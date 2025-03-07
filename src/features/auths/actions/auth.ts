"use server";

import { InitialFormState } from "@/types/action";
import { signin, signup } from "../db/auth";

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
