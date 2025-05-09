import { authCheck } from "@/features/auths/db/auth";
import { redirect } from "next/navigation";
import { canCancelOrder, canCreateOrder } from "../permissions/orders";
import { checkoutSchema } from "../shemas/orders";
import { db } from "@/lib/db";
import { generateNumberOrder } from "@/lib/generateOrderNumber";
import { clearCart } from "@/features/carts/db/carts";
import { getOrderIdTag, revalidateOrderCache } from "./cache";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import formatDate from "@/lib/formatDate";
import { uploadToImageKit } from "@/lib/imageKit";

interface CheckoutInput {
  address: string;
  phone: string;
  note?: string;
  useProfileData?: string;
}

export const createOrder = async (input: CheckoutInput) => {
  const user = await authCheck();

  if (!user || !canCreateOrder(user)) {
    redirect("/auth/signin");
  }

  try {
    const useProfileData = input.useProfileData === "on"; //true / false

    if (useProfileData && user.address && user.tel) {
      input.address = user.address;
      input.phone = user.tel;
    }

    const { success, data, error } = checkoutSchema.safeParse(input);

    if (!success) {
      return {
        message: "please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    const cart = await db.cart.findUnique({
      where: { orderedById: user.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.products.length === 0) {
      return {
        message: "No product in your cart",
      };
    }

    const shippingFee = 50;

    const orderNumber = generateNumberOrder();

    const totalAmount = cart.cartTotal + shippingFee;

    const newOrder = await db.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          totalAmount,
          status: "Pending",
          address: data.address,
          phone: data.phone,
          note: data.note,
          shippingFee,
          customerId: user.id,
        },
      });

      for (const item of cart.products) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { images: true },
        });

        if (!product || product.stock < item.count) {
          throw new Error(`${product?.title} out of stock`);
        }
        const mainImage = product.images.find((image) => image.isMain);

        await prisma.orderItem.create({
          data: {
            quantity: item.count,
            price: product.price,
            totalPrice: item.price,
            productTitle: product.title,
            productImage: mainImage?.url || null,
            orderId: order.id,
            productId: item.productId,
          },
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            sold: product.sold + item.count,
            stock: product.stock - item.count,
          },
        });
      }

      return order;
    });
    if (!newOrder) {
      return {
        message: "Something wrong when order",
      };
    }
    await clearCart();
    revalidateOrderCache(newOrder.id, user.id);
    return {
      orderId: newOrder.id,
    };
  } catch (error) {
    console.error("Error creating order : ", error);
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
    return {
      message: "Something went wrong , please try again later",
    };
  }
};

export const getOrderById = async (userId: string, orderId: string) => {
  //authcheck can not use with useCache
  "use cache";
  if (!userId) {
    redirect("/auth/signin");
  }
  cacheLife("minutes");
  cacheTag(getOrderIdTag(orderId));
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });
    if (!order) {
      return null;
    }
    const items = order.items.map((item) => {
      const mainImage = item.product.images.find((image) => image.isMain);
      return {
        ...item,
        product: {
          ...item.product,
          mainImage,
          lowStock: 5,
          sku: item.product.id.substring(0, 8).toUpperCase(),
        },
      };
    });
    return {
      ...order,
      items,
      createdAtFormatted: formatDate(order.createdAt),
      paymentAtFormatted: order.paymentAt ? formatDate(order.paymentAt) : null,
    };
  } catch (error) {
    console.error("Error at getting order : ", error);
    return null;
  }
};

export const uploadPaymentSlip = async (orderId: string, file: File) => {
  const user = await authCheck();
  if (!user) {
    redirect("/auth/signin");
  }

  try {
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return {
        message: "Not found this order",
      };
    }

    if (order.customerId !== user.id) {
      return {
        message: "You don't belong to this order",
      };
    }

    if (order.status !== "Pending") {
      return {
        message: "You send the slip already",
      };
    }

    const uploadResult = await uploadToImageKit(file, "payment");

    if (!uploadResult || uploadResult.message) {
      return {
        message: uploadResult.message || "incomplete slip uploading",
      };
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentImage: uploadResult.url,
        status: "Paid",
        paymentAt: new Date(),
      },
    });

    revalidateOrderCache(updatedOrder.id, updatedOrder.customerId);
  } catch (error) {
    console.error("Error uploading payment slip : ", error);
    return {
      message: "Error occur at uploading payment slip",
    };
  }
};

export const cancelOrderStatus = async (orderId: string) => {
  const user = await authCheck();
  if (!user || !canCancelOrder(user)) {
    redirect("/auth/signin");
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return {
        message: "order not found",
      };
    }

    if (order.customerId !== user.id) {
      return {
        message: "you have no right to cancel this order",
      };
    }

    if (order.status !== "Pending") {
      return {
        message: "can not cancel order because payment's already success",
      };
    }

    await db.$transaction(async (prisma) => {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "Cancelled",
        },
      });
    });

    revalidateOrderCache(orderId, user.id);
  } catch (error) {
    console.error("Error cancelling order : ", error);
    return {
      message: "Something went wrong in cancelling order",
    };
  }
};
