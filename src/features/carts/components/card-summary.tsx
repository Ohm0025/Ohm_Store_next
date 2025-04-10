"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useOptimistic, useTransition } from "react";
import { clearCartAction } from "../actions/carts";
import { toast } from "sonner";

interface CartSummaryProps {
  cart: CartType;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  const [isPending, startTransition] = useTransition();
  const [opCart, updateOpCart] = useOptimistic(
    cart,
    (state, action: "clear") => {
      if (action === "clear") {
        return {
          ...state,
          items: [],
          cartTotal: 0,
          itemCount: 0,
        };
      }
      return state; //if server down will also return previous state
    }
  );

  const handleClearCart = async () => {
    startTransition(() => {
      updateOpCart("clear");
    });
    const result = await clearCartAction();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const shippingFee = 50;

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Purchase Summary</h2>
      <div className="flex justify-between">
        <span>Total Payment</span>
        <span>{formatPrice(opCart.cartTotal)}</span>
      </div>

      <div className="flex justify-between text-muted-foreground">
        <span>Delivery Fee</span>
        <span>{shippingFee}</span>
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{formatPrice(opCart.cartTotal)}</span>
      </div>

      <div className="pt-4 space-y-2">
        <Button size="lg" className="w-full" asChild>
          <Link href={"/checkout"}>
            <ShoppingBag size={18} />
            <span>Checkout</span>
          </Link>
        </Button>
        <Button
          variant={"outline"}
          className="w-full"
          disabled={opCart.items.length === 0 || isPending}
          onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>
    </Card>
  );
};

export default CartSummary;
