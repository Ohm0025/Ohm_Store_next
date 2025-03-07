import { db } from "@//lib/db";

export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: {
        id,
        status: "Active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        address: true,
        picture: true,
        tel: true,
      },
    });
  } catch (error) {
    console.error("Error Get User By Id : ", error);
    return null;
  }
};
