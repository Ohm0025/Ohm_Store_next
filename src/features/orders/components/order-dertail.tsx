"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/formatPrice";
import { generatePromptPayQR } from "@/lib/generatePromptPayQR";
import { getStatusColor, getStatusText } from "@/lib/utils";
import { OrderType } from "@/types/order";
import { Ban, CreditCard, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import PaymentFormModal from "./payment-form-modal";
import CancelOrderModal from "./cancel-order-modal";

interface OrderDetailProps {
  order: OrderType;
}

const OrderDetail = ({ order }: OrderDetailProps) => {
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const [isPaymentFormModal, setIsPaymenyFormModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);

  const handleGenerateQR = async () => {
    try {
      setIsGeneratingQR(true);
      const qrCode = await generatePromptPayQR(order.totalAmount);
      setQrCodeURL(qrCode);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsGeneratingQR(false);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">
              Order Number : {order.orderNumber}
            </CardTitle>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </CardHeader>
          <CardContent className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Count</TableHead>
                  <TableHead className="text-left">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative size-10 border rounded-md overflow-hidden">
                          <Image
                            alt={item.productTitle}
                            src={
                              item.productImage ||
                              "/images/no-product-image.webp"
                            }
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{item.productTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.totalPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Delivery detail</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-1">address : </h3>
                <p className="text-muted-foreground">{order.address || "-"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">phone : </h3>
                <p className="text-muted-foreground">{order.phone || "-"}</p>
              </div>
              {order.note && (
                <div>
                  <h3 className="font-medium mb-1">note : </h3>
                  <p className="text-muted-foreground">{order.note}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div>
                  <h3 className="font-medium mb-1">tracking number : </h3>
                  <p className="text-muted-foreground">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Price : </span>
                <span>
                  {formatPrice(order.totalAmount - order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Fee : </span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span className="text-muted-foreground">Total Amount : </span>
                <span>
                  {formatPrice(order.totalAmount + order.shippingFee)}
                </span>
              </div>
            </div>

            {order.status === "Pending" && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-col gap-2">
                  {qrCodeURL ? (
                    <div className="rounded-md border p-4 flex flex-col items-center">
                      <h3 className="text-center font-medium mb-3">
                        Scan QR Code For Payment
                      </h3>
                      <div className="mb-3">
                        <Image
                          alt="PromptPay QR Code"
                          src={qrCodeURL}
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerateQR}
                      disabled={isGeneratingQR}>
                      <CreditCard />
                      <span>
                        {isGeneratingQR
                          ? "QR code is generating..."
                          : "Pay By Promptpay"}
                      </span>
                    </Button>
                  )}

                  <Button
                    variant={"outline"}
                    onClick={() => setIsPaymenyFormModal(true)}>
                    <Upload size={16} />
                    <span>upload payment slip</span>
                  </Button>

                  <Button
                    variant={"destructive"}
                    onClick={() => setIsCancelModal(true)}>
                    <Ban size={16} />
                    <span>cancel order</span>
                  </Button>
                </div>

                <PaymentFormModal
                  open={isPaymentFormModal}
                  onOpenChange={setIsPaymenyFormModal}
                  orderId={order.id}
                />
                <CancelOrderModal
                  open={isCancelModal}
                  onOpenChange={setIsCancelModal}
                  orderId={order.id}
                />
              </div>
            )}

            {order.paymentImage && (
              <div className="flex flex-col gap-2 pt-2">
                <h3 className="font-medium">Payment slip :</h3>
                <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                  <Image
                    alt="Payment slip"
                    src={order.paymentImage}
                    fill
                    className="object-contain"
                  />
                </div>
                {order.paymentAt && (
                  <p className="text-sm text-muted-foreground">
                    Payment At : {order.paymentAtFormatted}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
