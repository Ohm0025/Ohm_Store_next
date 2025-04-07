import Modal from "@/components/shared/modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "@/types/product";
import { Clock, Tag } from "lucide-react";
import Image from "next/image";
import React from "react";
import dayjs from "@/lib/dayjs";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const ProductDetailModal = ({
  open,
  onOpenChange,
  product,
}: ProductDetailModalProps) => {
  if (!product) {
    return null;
  }

  const formattedDate = dayjs(product.createdAt).fromNow();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={product.title}
      description={`SKU: ${product.sku}`}
      className="md:max-w-3xl">
      <div>
        <Tabs>
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">
              images ({product.images?.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {/* Main Image */}
                <div className="relative aspect-square border rounded-md overflow-hidden group">
                  <Image
                    className="object-cover transition-transform group-hover:scale-105"
                    alt={product.title}
                    src={
                      product.mainImage?.url || "/images/no-product-image.webp"
                    }
                    fill
                  />
                </div>
                {/* Product Info */}
                <div className="p-4 flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge
                      variant={
                        product.status === "Active" ? "default" : "destructive"
                      }>
                      {product.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1">
                      <Tag size={12} />
                      <span>{product.category.name}</span>
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold line-clamp-2 mb-1">
                    {product.title}
                  </h2>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span className="text-sm">Added {formattedDate}</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="details">Details</TabsContent>
          <TabsContent value="images">Images</TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
