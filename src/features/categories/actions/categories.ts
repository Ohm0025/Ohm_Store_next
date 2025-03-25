"use server";

import { InitialFormState } from "@/types/action";
import { createCategory } from "../db/categories";

export const categoryAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    id: formData.get("category-id") as string,
    name: formData.get("category-name") as string,
  };

  const result = await createCategory(rawData);

  return result && result.message
    ? {
        success: false,
        message: result.message,
        errors: result.error,
      }
    : {
        success: true,
        message: rawData.id ? "update success" : "create success",
      };
};
