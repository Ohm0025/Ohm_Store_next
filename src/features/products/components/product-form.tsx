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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/useForm";
import { CategoryType } from "@/types/category";
import { Save } from "lucide-react";
import Form from "next/form";
import React, { useState } from "react";
import { productAction } from "../actions/products";
import ErrorMessage from "@/components/shared/errorMessage";
import ProductImageUpload from "./product-image-upload";

interface ProductFormProps {
  categories: CategoryType[];
}

const ProductForm = ({ categories }: ProductFormProps) => {
  //Price state
  const [basePrice, setBasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");

  //Image state
  const [productImages, setProductImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const { errors, formAction, isPending, clearErrors } = useForm(
    productAction,
    "/admin/products"
  );

  const calculateDiscount = () => {
    const basePriceNum = parseFloat(basePrice) || 0;
    const salePriceNum = parseFloat(salePrice) || 0;

    if (basePriceNum === 0 || salePriceNum === 0) {
      return "0.00%";
    }
    if (basePriceNum <= salePriceNum) {
      return "0.00%";
    }

    const discount = ((basePriceNum - salePriceNum) * 100) / basePriceNum;

    return `${discount.toFixed(2)}%`;
  };

  const handleImageChange = (images: File[], mainImageIndex: number) => {
    setProductImages(images);
    setMainImageIndex(mainImageIndex);
  };

  const handleSubmit = async (formData: FormData) => {
    if (productImages.length > 0) {
      productImages.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("main-image-index", mainImageIndex.toString());
    }
    return formAction(formData);
  };
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Product Information
        </CardTitle>
        <CardDescription>Enter the details of your new product</CardDescription>
      </CardHeader>

      <Form
        action={handleSubmit}
        onChange={clearErrors}
        className="flex flex-col gap-4">
        <CardContent className="flex flex-col gap-6">
          {/* Basic Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Basic Information</h3>
            <div className="flex flex-col gap-2">
              <InputForm
                label="Product Title"
                id="title"
                placeholder="Enter product title"
                required
              />
              {errors.title && (
                <ErrorMessage error={errors.title[0]}></ErrorMessage>
              )}
            </div>

            {/* Product Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                className="min-h-20"
                id="description"
                name="description"
                placeholder="Enter description product"></Textarea>
              {errors.description && (
                <ErrorMessage error={errors.description[0]} />
              )}
            </div>

            {/* Category select */}
            <div className="flex flex-col gap-2">
              <Label>
                Category
                <span className="text-red-500">*</span>
              </Label>
              <Select name="category-id">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories
                    .filter((c) => c.status === "Active")
                    .map((category, index) => (
                      <SelectItem key={index} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <ErrorMessage error={errors.categoryId[0]} />
              )}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Pricing Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cost */}
              <div className="flex flex-col gap-2">
                <InputForm
                  label="Cost Price"
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                {errors.cost && <ErrorMessage error={errors.cost[0]} />}
              </div>
              {/* Base Price */}
              <div>
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Base Price"
                    id="base-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                  {errors.basePrice && (
                    <ErrorMessage error={errors.basePrice[0]} />
                  )}
                </div>
              </div>

              {/* Product Image Section */}
              <ProductImageUpload onImageChange={handleImageChange} />

              {/* Sale Price */}
              <div>
                <div className="flex flex-col gap-2">
                  <InputForm
                    label="Sale Price"
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    defaultValue={basePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                  {errors.price && <ErrorMessage error={errors.price[0]} />}
                </div>
              </div>
              {/* Discount % */}
              <div className="flex flex-col gap-2">
                <Label>Discount</Label>
                <div className="text-sm text-muted-foreground h-9 px-3 rounded-md border border-input bg-gray-50 flex items-center">
                  {calculateDiscount()}
                </div>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Stock Information</h3>
            <div>
              <InputForm
                label="Stock Quantity"
                id="stock"
                type="nunmber"
                min="0"
                placeholder="0"
                required
              />
              {errors.stock && <ErrorMessage error={errors.stock[0]} />}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitBtn name="Save Product" icon={Save} pending={isPending} />
        </CardFooter>
      </Form>
    </Card>
  );
};

export default ProductForm;
