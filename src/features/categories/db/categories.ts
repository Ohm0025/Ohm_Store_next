import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCategoryGlobalTag, revalidateCategoryCache } from "./cache";
import { categorySchema } from "../schemas/categories";
import { authCheck } from "@/features/auths/db/auth";
import {
  canCreateCategory,
  canUpdateCategory,
} from "../permissions/categories";
import { redirect } from "next/navigation";

interface CreateCategoryInput {
  name: string;
}

interface UpdateCategoryInput {
  id: string;
  name: string;
}

export const getCategories = async () => {
  "use cache";

  cacheLife("days");
  cacheTag(getCategoryGlobalTag());

  try {
    return await db.categories.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  } catch (error) {
    console.error("Error geting category data : ", error);
    return [];
  }
};

export const createCategory = async (input: CreateCategoryInput) => {
  const user = await authCheck();
  if (!user || !canCreateCategory(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = categorySchema.safeParse(input);
    if (!success) {
      return {
        message: "Please Enter Valid Data",
        error: error.flatten().fieldErrors,
      };
    }

    //Check exist category
    const checkCat = await db.categories.findFirst({
      where: { name: data.name },
    });
    if (checkCat) {
      return {
        message: "This category already exist",
      };
    }

    //create new category
    const newCat = await db.categories.create({
      data: { name: data.name },
    });

    revalidateCategoryCache(newCat.id);
  } catch (error) {
    console.error("Error adding category : ", error);
    return {
      message: "Something went wrong , pls try again later",
    };
  }
};

export const updateCategory = async (input: UpdateCategoryInput) => {
  const user = await authCheck();

  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = categorySchema.safeParse(input);
    if (!success) {
      return {
        message: "Please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    // check exist data
    const existCat = await db.categories.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!existCat) {
      return {
        message: "Category not found",
      };
    }

    // check if same as another category
    const duplicateCat = await db.categories.findFirst({
      where: { name: data.name, id: { not: input.id } },
    });

    if (duplicateCat) {
      return {
        message: "This category already exist",
      };
    }

    // update data
    const updateCat = await db.categories.update({
      where: {
        id: input.id,
      },
      data: {
        name: data.name,
      },
    });

    revalidateCategoryCache(updateCat.id);
  } catch (error) {
    console.error("error update category : ", error);
    return {
      message: "Somthing went wrong , pls try again later",
    };
  }
};
