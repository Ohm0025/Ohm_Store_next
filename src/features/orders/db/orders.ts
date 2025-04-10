import { authCheck } from "@/features/auths/db/auth";
import { redirect } from "next/navigation";
import { canCreateOrder } from "../permissions/orders";
import { checkoutSchema } from "../shemas/orders";
import { db } from "@/lib/db";
import { generateNumberOrder } from "@/lib/generateOrderNumber";
import { clearCart } from "@/features/carts/db/carts";
import { revalidateOrderCache } from "./cache";

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
