"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UserType } from "@/types/user";
import { ShoppingBag } from "lucide-react";
import Form from "next/form";
import React from "react";
import { checkoutAction } from "../actions/orders";
import { useForm } from "@/hooks/useForm";
import ErrorMessage from "@/components/shared/errorMessage";

interface CheckoutFormProps {
  user: UserType;
}

const CheckoutForm = ({ user }: CheckoutFormProps) => {
  const hasUserData = !!(user.address && user.tel);
  const { errors, formAction, isPending, clearErrors } =
    useForm(checkoutAction);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Address Details</CardTitle>
      </CardHeader>
      <Form action={formAction} onChange={clearErrors}>
        <CardContent className="flex flex-col gap-4">
          {hasUserData && (
            <div className="flex items-center space-x-2 mb-4 border p-3 rounded-md bg-muted/5">
              <Switch
                id="use-profile-data"
                name="use-profile-data"
                defaultChecked
              />
              <Label htmlFor="use-profile-data">use your address</Label>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <InputForm
              label="phone number"
              id="phone"
              placeholder="00-00000000"
              defaultValue={user.tel || ""}
              required
            />
            {/* Error Message */}
            {errors.phone && <ErrorMessage error={errors.phone[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">
              Delivery Address
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={user.address || ""}
              placeholder="please enter address for delivery"
              className="min-h-24"
            />
            {/* Error message */}
            {errors.address && <ErrorMessage error={errors.address[0]} />}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              name="note"
              placeholder="please enter note to delivery (if you have)"
              className="min-h-20"
            />
            {/* Error message */}
            {errors.note && <ErrorMessage error={errors.note[0]} />}
          </div>

          <div className="pt-4">
            <SubmitBtn
              pending={isPending}
              name="Proceed Payment"
              icon={ShoppingBag}
              className="w-full"
            />
          </div>
        </CardContent>
      </Form>
    </Card>
  );
};

export default CheckoutForm;
