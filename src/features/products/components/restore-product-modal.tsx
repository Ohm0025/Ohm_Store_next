import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { ProductType } from "@/types/product";
import { RefreshCcw } from "lucide-react";
import Form from "next/form";
import React, { useEffect } from "react";
import { restoreProductAction } from "../actions/products";

interface RestoreProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const RestoreProductModal = ({
  open,
  onOpenChange,
  product,
}: RestoreProductModalProps) => {
  const { isPending, state, formAction } = useForm(restoreProductAction);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Restore Product"
      description={`Are you sure you want to restore the product ${product?.title}`}>
      <Form action={formAction}>
        <input type="hidden" name="product-id" value={product?.id} />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <SubmitBtn
            name="Restore"
            icon={RefreshCcw}
            pending={isPending}
            className=""
          />
        </div>
      </Form>
    </Modal>
  );
};

export default RestoreProductModal;
