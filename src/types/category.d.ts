import { Categories } from "@prisma/client";

export type CategoryType = Omit<Categories, "createdAt", "updatedAt">;
