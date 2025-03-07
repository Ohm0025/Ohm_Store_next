//in file .d.ts - can't have any declare variable or function
import { User } from "@prisma/client";

export interface UserType
  extends Omit<User, "pictureId" | "password" | "createdAt" | "updatedAt"> {
  //can add more fields in {}
} //omit - use for ruleout some fields
