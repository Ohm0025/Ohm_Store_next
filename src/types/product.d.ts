import { Product } from "@prisma/client";
import { CategoryType } from "./category";

export interface ProductType extends Product {
  category: CategoryType;
  lowStock: number;
  sku: string;
}
