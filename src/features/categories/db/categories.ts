import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCategoryGlobalTag, revalidateCategoryCache } from "./cache";
import { categorySchema } from "../schemas/categories";
import { authCheck } from "@/features/auths/db/auth";
import { canCreateCategory } from "../permissions/categories";
import { redirect } from "next/navigation";

interface CreateCategoryInput {
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
