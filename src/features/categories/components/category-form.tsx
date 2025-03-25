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
import { Plus } from "lucide-react";
import Form from "next/form";
import React from "react";

const CategoryForm = () => {
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

      <Form action={""} className="space-y-4">
        <CardContent>
          <div className="space-y-2">
            <InputForm
              label="Category name"
              id="category-name"
              placeholder="Enter Category Name"
              required></InputForm>
            {/* error message */}
          </div>
        </CardContent>

        <CardFooter>
          <SubmitBtn name="Add Category" icon={Plus} />
        </CardFooter>
      </Form>
    </Card>
  );
};

export default CategoryForm;
