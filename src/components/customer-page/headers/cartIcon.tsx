import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CartIconProps {
  itemCount: number;
}

const CartIconBtn = ({ itemCount }: CartIconProps) => {
  return (
    <Link href={"/cart"} className="md:hidden relative">
      <ShoppingCart size={20} />
      {itemCount >= 0 && (
        <Badge className="absolute -top-2 -right-2 size-5 rounded-full p-0 flex items-center justify-center text-[10px]">
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Link>
  );
};

export default CartIconBtn;
