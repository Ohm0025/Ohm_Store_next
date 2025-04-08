import { redirect } from "next/navigation";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCartTag } from "./cache";
import { db } from "@/lib/db";

export const getUserCart = async (userId: string | null) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));

  try {
    const cart = await db.cart.findUnique({
      where: {
        orderedById: "4455a844-d4c9-4ae1-816a-7b4ec7c9aaf3",
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    const cartWithDetail = {
      ...cart,
      items: cart.products.map((item) => {
        const mainImage = item.product.images.find((image) => image.isMain);
        return {
          id: item.id,
          count: item.count,
          price: item.price,
          product: {
            ...item.product,
            mainImage: mainImage || null,
            lowStock: 5,
            sku: item.product.id.substring(0, 8).toUpperCase(),
          },
        };
      }),
      itemCount: cart.products.reduce((sum, product) => sum + product.count, 0),
    };

    return cartWithDetail;
  } catch (error) {
    console.error("error at getting user cart : ", error);
    return null;
  }
};
