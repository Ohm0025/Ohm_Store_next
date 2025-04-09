"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCartAction } from "../actions/carts";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  className?: string;
  children?: React.ReactNode;
}

const AddToCartButton = ({
  productId,
  stock,
  className,
  children,
}: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("product-id", productId);
      formData.append("count", "1"); // add - remove : 1 product
      const result = await addToCartAction(formData);

      if (result && result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      disabled={stock <= 0 || isPending}>
      <ShoppingCart size={16} />
      {children || <span>Add To Cart</span>}
    </Button>
  );
};

export default AddToCartButton;
