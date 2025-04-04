import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import {
  getProductGlobalTag,
  getProductIdTag,
  revalidateProductCache,
} from "./cache";
import { productSchema } from "../schemas/products";
import { authCheck } from "@/features/auths/db/auth";
import { canCreateProduct, canUpdateProduct } from "../permissions/products";
import { redirect } from "next/navigation";
import { deleteFromImageKit } from "@/lib/imageKit";

interface CreateProductInput {
  title: string;
  description: string;
  cost?: number;
  basePrice: number;
  price: number;
  stock: number;
  categoryId: string;
  images: Array<{ url: string; fileId: string }>;
  mainImageIndex: number;
}

export const getProducts = async () => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductGlobalTag());

  try {
    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: {
          where: {
            isMain: true,
          },
          take: 1, //get only 1 pic
        },
      },
    });

    return products.map((product) => ({
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: product.images.length > 0 ? product.images[0] : null,
    }));
  } catch (error) {
    console.error("Error getting products : ", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  "use cache";
  cacheLife("hours");
  cacheTag(getProductIdTag(id));

  try {
    const product = await db.product.findFirst({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      return null;
    }

    //find main picture
    const mainImage = product.images.find((image) => image.isMain);
    //find index main picture
    const mainImageIndex = mainImage
      ? product.images.findIndex((image) => image.isMain)
      : 0;

    return {
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: mainImage || null,
      mainImageIndex,
    };
  } catch (error) {
    console.error(`Error getting product by id: ${error}`);
    return null;
  }
};

export const createProduct = async (input: CreateProductInput) => {
  const user = await authCheck();
  if (!user || !canCreateProduct(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = productSchema.safeParse(input);

    if (!success) {
      return {
        message: `Please enter valid product information`,
        error: error.flatten().fieldErrors,
      };
    }

    // check if category exist
    const category = await db.categories.findUnique({
      where: { id: data.categoryId, status: "Active" },
    });

    if (!category) {
      return {
        message: "Selected category not found or inactive",
      };
    }

    // create new product
    const newProduct = await db.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoriesId: data.categoryId,
        },
      });
      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image, index) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: index === input.mainImageIndex,
                productId: product.id,
              },
            });
          })
        );
      }
      return product;
    }); //roll-back when failure happen

    revalidateProductCache(newProduct.id);
  } catch (error) {
    console.error("Error creating product : ", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const updateProduct = async (
  input: CreateProductInput & {
    id: string;
    deletedImageIds: string[];
  }
) => {
  const user = await authCheck();
  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = productSchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid product information",
        error: error.flatten().fieldErrors,
      };
    }

    const existingProduct = await db.product.findUnique({
      where: {
        id: input.id,
      },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return {
        message: "Product not found",
      };
    }

    const category = await db.categories.findUnique({
      where: {
        id: data.categoryId,
        status: "Active",
      },
    });

    if (!category) {
      return {
        message: "Selected category not found or inactive",
      };
    }

    if (input.deletedImageIds && input.deletedImageIds.length > 0) {
      for (const deleteImageId of input.deletedImageIds) {
        const imageToDelete = existingProduct.images.find(
          (image) => image.id === deleteImageId
        );
        if (imageToDelete) {
          await deleteFromImageKit(imageToDelete.fileId);
        }
      }
    }

    const updatedProduct = await db.$transaction(async (prisma) => {
      //1. update product data
      const product = await prisma.product.update({
        where: { id: input.id },
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoriesId: data.categoryId,
        },
      });
      //2. delete selected image
      if (input.deletedImageIds && input.deletedImageIds.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: { in: input.deletedImageIds },
            productId: product.id,
          },
        });
      }
      //3. set isMain to false value all
      await prisma.productImage.updateMany({
        where: {
          productId: product.id,
        },
        data: {
          isMain: false,
        },
      });
      //4. add new image
      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: false,
                productId: product.id,
              },
            });
          })
        );
      }
      //5. set main image index
      const allImages = await prisma.productImage.findMany({
        where: {
          productId: product.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      if (allImages.length > 0) {
        const validIndex = Math.min(input.mainImageIndex, allImages.length - 1);
        if (validIndex >= 0) {
          await prisma.productImage.update({
            where: {
              id: allImages[validIndex].id,
            },
            data: {
              isMain: true,
            },
          });
        }
      }
      return product;
    });
    revalidateProductCache(updatedProduct.id);
  } catch (error) {
    console.error("Error updating product : ", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};
