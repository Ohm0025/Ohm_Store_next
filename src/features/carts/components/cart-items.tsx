"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { removeFromCartAction, updateCartAction } from "../actions/carts";
import { toast } from "sonner";

interface CartItemProps {
  cart: CartType;
}

const CartItems = ({ cart }: CartItemProps) => {
  // hook that can render ui before waiting backend response

  const handleUpdateQty = async (itemId: string, newCount: number) => {
    const formData = new FormData();
    formData.append("cart-item-id", itemId);
    formData.append("new-count", newCount.toString());

    const result = await updateCartAction(formData);

    if (result && result.message) {
      toast.error(result.message);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const result = await removeFromCartAction(itemId);
    if (result && result.message) {
      toast.error(result.message);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Cart Item list</h2>

      {cart?.items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4">
          <div className="relative size-24 border border-primary rounded-md overflow-hidden">
            <Link href={`/products/${item.product.id}`}>
              <Image
                alt={item.product.title}
                src={
                  item.product.mainImage?.url || "/images/no-product-image.webp"
                }
                fill
                className="object-cover"
              />
            </Link>
          </div>

          {/* Product Detail */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <Link
                href={`/products/${item.product.id}`}
                className="text-lg font-medium hover:text-primary transition-colors">
                {item.product.title}
              </Link>
              <p className="font-semibold">{formatPrice(item.price)}</p>
            </div>

            <div className="text-sm text-muted-foreground">
              Category : {item.product.category.name}
            </div>
            <div className="text-sm text-muted-foreground">
              Price per unit : {formatPrice(item.product.price)}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Button
                  onClick={() => handleUpdateQty(item.id, item.count - 1)}
                  variant={"outline"}
                  className="size-8"
                  disabled={item.count <= 1}>
                  <Minus size={14} />
                </Button>
                <span className="w-10 text-center">{item.count}</span>
                <Button
                  onClick={() => handleUpdateQty(item.id, item.count + 1)}
                  variant={"outline"}
                  className="size-8"
                  disabled={item.count >= item.product.stock}>
                  <Plus size={14} />
                </Button>
              </div>

              <Button
                onClick={() => handleRemoveItem(item.id)}
                variant={"ghost"}
                size={"icon"}
                className="text-destructive/90 hover:text-destructive">
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default CartItems;
