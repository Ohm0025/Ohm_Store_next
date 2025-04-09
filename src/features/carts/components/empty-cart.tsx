import { Button } from "@/components/ui/button";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-primary rounded-md">
      <div className="bg-muted p-6 rounded-full mb-6">
        <ShoppingBag size={64} />
      </div>
      <h2 className="text-xl font-semibold mb-2">Your Cart Is Empty</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {"It seem your cart is empty. Let's add some products to your cart. "}
      </p>

      <Button asChild>
        <Link href={"/products"}>
          <Search size={16} />
          <span>Search Product</span>
        </Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
