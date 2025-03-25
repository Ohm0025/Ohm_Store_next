import { db } from "@/lib/db";

export const getCategories = async () => {
  try {
    return await db.categories.findMany({
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
