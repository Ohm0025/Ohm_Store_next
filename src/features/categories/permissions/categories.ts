import { UserType } from "@/types/user";

export const canCreateCategory = (user: UserType) => {
  return user.role === "Admin";
};
