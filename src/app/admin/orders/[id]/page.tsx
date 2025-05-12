import { Button } from "@/components/ui/button";
import { authCheck } from "@/features/auths/db/auth";
import AdminOrderDetail from "@/features/orders/components/admin-order-detail";
import { getOrderById } from "@/features/orders/db/orders";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface AdminOrderDetailPage {
  params: Promise<{ id: string }>;
}

const AdminOrderDetailPage = async ({ params }: AdminOrderDetailPage) => {
  const user = await authCheck();
  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  const { id } = await params;

  const order = await getOrderById(user.id, id);

  if (!order) {
    redirect("/admin/orders");
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Order # {order.orderNumber}</h1>
          <p className="text-muted-foreground text-sm">
            Create on {order?.createdAtFormatted}
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/admin/orders">
            <ArrowLeft size={16} />
            <span>Back to Orders</span>
          </Link>
        </Button>
      </div>

      <AdminOrderDetail order={order} />
    </div>
  );
};

export default AdminOrderDetailPage;
