import { OrderStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case "Pending":
      return "pending payment";
    case "Paid":
      return "already paid";
    case "Shipped":
      return "product shipped";
    case "Delivered":
      return "product delivered";
    case "Cancelled":
      return "order cancelled";
    default:
      return status;
  }
};

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500";
    case "Paid":
      return "bg-blue-500";
    case "Shipped":
      return "bg-indigo-500";
    case "Delivered":
      return "bg-green-500";
    case "Cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
