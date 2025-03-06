"use server";

import { InitialFormState } from "@/types/action";
import { signup } from "../db/auth";

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

  const result = await signup(rawData);

  return result && result.message
    ? { success: false, message: result.message, errors: result.error }
    : {
        success: true,
        message: rawData.confirmPassword ? "register success" : "login success",
      };
};
