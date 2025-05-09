import InputForm from "@/components/shared/InputForm";
import Modal from "@/components/shared/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import Form from "next/form";
import React, { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { updatePaymentAction } from "../actions/orders";
import { useForm } from "@/hooks/useForm";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PaymentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const PaymentFormModal = ({
  open,
  onOpenChange,
  orderId,
}: PaymentFormModalProps) => {
  const [preview, setPreview] = useState<string | null>(null); //this component open under other component that use client already

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; //will get array
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      // 5 mb
      toast.error("File is too large > 5 Mb");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const { formAction, isPending } = useForm(updatePaymentAction);
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={"Upload Slip Payment"}
      description="">
      <Form action={formAction}>
        <input type="hidden" value={orderId} name="order-id" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <InputForm
              label="Slip Image"
              id="payment-image"
              type="file"
              accept="image/*"
              required
              onChange={(event) => handleFileChange(event)}
            />
          </div>
          <ScrollArea className="max-h-[400px] sm:max-h-[480px]">
            {preview && (
              <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                <Image
                  alt="payment preview"
                  src={preview}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </ScrollArea>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant={"outline"}
              type="button"
              disabled={isPending}
              onClick={() => {
                setPreview(null);
                onOpenChange(false);
              }}>
              cancel
            </Button>
            <Button type="submit" disabled={!preview || isPending}>
              <Upload size={16} />
              <span>{isPending ? "uploading..." : "upload"}</span>
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default PaymentFormModal;
