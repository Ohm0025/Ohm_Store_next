"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@/hooks/useForm";
import { Plus } from "lucide-react";
import Form from "next/form";
import React from "react";
import { categoryAction } from "../actions/categories";
import ErrorMessage from "@/components/shared/errorMessage";

const CategoryForm = () => {
  const { errors, formAction, isPending, clearErrors } =
    useForm(categoryAction);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Plus size={18} />
          <span>Add new category</span>
        </CardTitle>

        <CardDescription className="text-xs sm:text-sm">
          Create a new category for your products
        </CardDescription>
      </CardHeader>

      <Form action={formAction} onChange={clearErrors} className="space-y-4">
        <CardContent>
          <div className="space-y-2">
            <InputForm
              label="Category name"
              id="category-name"
              placeholder="Enter Category Name"
              required></InputForm>
            {/* error message */}
            {errors.name && <ErrorMessage error={errors.name[0]} />}
          </div>
        </CardContent>

        <CardFooter>
          <SubmitBtn name="Add Category" icon={Plus} pending={isPending} />
        </CardFooter>
      </Form>
    </Card>
  );
};

export default CategoryForm;
