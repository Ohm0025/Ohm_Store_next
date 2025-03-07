import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const CartIconBtn = () => {
  return (
    <Link href={"/cart"}>
      <ShoppingCart size={20} />
    </Link>
  );
};

export default CartIconBtn;
