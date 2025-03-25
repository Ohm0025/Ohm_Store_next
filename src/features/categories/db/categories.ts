import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCategoryGlobalTag } from "./cache";

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
  try {
  } catch (error) {
    console.error("Error adding category : ", error);
    return {
      message: "Something went wrong , pls try again later",
    };
  }
};
