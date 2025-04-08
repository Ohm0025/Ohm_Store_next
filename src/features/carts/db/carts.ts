import { redirect } from "next/navigation";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCartTag, revalidateCartCache } from "./cache";
import { db } from "@/lib/db";
import { authCheck } from "@/features/auths/db/auth";
import { canUpdateUserCart } from "../permissions/carts";

interface AddToCartInput {
  productId: string;
  count: number;
}

interface UpdateCartInput {
  cartItemId: string;
  newCount: number;
}

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
        orderedById: userId,
      },
      include: {
        products: {
          orderBy: {
            createdAt: "asc",
          },
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

export const getCartItemCount = async (userId: string | null) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));

  try {
    const cart = await db.cart.findUnique({
      where: {
        orderedById: userId,
      },
      include: {
        products: true,
      },
    });

    if (!cart) {
      return 0;
    }

    return cart.products.reduce((sum, product) => sum + product.count, 0);
  } catch (error) {
    console.error("Error getting cartitem count : ", error);
    return 0;
  }
};

const recalculateCartTotal = async (cartId: string) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId,
    },
  });
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
  await db.cart.update({ where: { id: cartId }, data: { cartTotal } });
};

export const addToCart = async (input: AddToCartInput) => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart) {
    redirect("/auth/signin");
  }
  try {
    const product = await db.product.findUnique({
      where: {
        id: input.productId,
        status: "Active",
      },
    });

    if (!product) {
      return {
        message: "product not avilable",
      };
    }

    if (product.stock < input.count) {
      return {
        message: "product not enoungh",
      };
    }
    let cart = await db.cart.findUnique({
      where: {
        orderedById: user.id,
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: {
          cartTotal: 0,
          orderedById: user.id,
        },
      });
    }

    const existingProduct = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (existingProduct) {
      await db.cartItem.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          count: existingProduct.count + input.count,
          price: (existingProduct.count + input.count) * product.price,
        },
      });
    } else {
      await db.cartItem.create({
        data: {
          count: input.count,
          price: product.price * input.count,
          cartId: cart.id,
          productId: product.id,
        },
      });
    }
    await recalculateCartTotal(cart.id);

    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error adding to cart : ", error);
    return {
      message: "Error in adding product to cart",
    };
  }
};

export const updateCartItem = async (input: UpdateCartInput) => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart) {
    redirect("/auth/signin");
  }
  try {
    if (input.newCount < 1) {
      return {
        message: "At least 1 piece",
      };
    }

    const cartItem = await db.cartItem.findUnique({
      where: {
        id: input.cartItemId,
      },
      include: {
        cart: true,
        product: true,
      },
    });
    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "Not found product in cart",
      };
    }

    if (cartItem.product.stock < input.newCount) {
      return {
        message: "Product not enough",
      };
    }

    await db.cartItem.update({
      where: {
        id: input.cartItemId,
      },
      data: {
        count: input.newCount,
        price: cartItem.product.price * input.newCount,
      },
    });
    await recalculateCartTotal(cartItem.cartId);
    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error updating cart : ", error);
    return {
      message: "Error in updating cart",
    };
  }
};

export const removeFromCart = async (cartItemId: string) => {
  try {
    const user = await authCheck();
    if (!user || !canUpdateUserCart) {
      redirect("/auth/signin");
    }

    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "Product not found in this cart",
      };
    }

    await db.cartItem.delete({ where: { id: cartItemId } });

    await recalculateCartTotal(cartItem.cartId);
    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error removing from cart : ", error);
    return {
      message: "Error at removing product from cart",
    };
  }
};

export const clearCart = async () => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart) {
    redirect("/auth/signin");
  }
  try {
    const cart = await db.cart.findUnique({ where: { orderedById: user.id } });
    if (!cart) {
      return {
        message: "you cart is empthy",
      };
    }
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    await db.cart.update({ where: { id: cart.id }, data: { cartTotal: 0 } });

    revalidateCartCache(user.id);
  } catch (error) {
    console.error("Error clearing cart : ", error);
    return {
      message: "Can not delete cart",
    };
  }
};
