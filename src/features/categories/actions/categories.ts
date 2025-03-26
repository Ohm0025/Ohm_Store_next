"use server";

import { InitialFormState } from "@/types/action";
import {
  createCategory,
  reactivateCategory,
  removeCategory,
  updateCategory,
} from "../db/categories";

export const categoryAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    id: formData.get("category-id") as string,
    name: formData.get("category-name") as string,
  };

  const result = rawData.id
    ? await updateCategory(rawData)
    : await createCategory(rawData);

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

export const deleteCategoryAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("category-id") as string;

  const result = await removeCategory(id);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Category deleted successfully",
      };
};

export const reactiveCategoryAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("category-id") as string;

  const result = await reactivateCategory(id);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Category reactivate successfully",
      };
};
