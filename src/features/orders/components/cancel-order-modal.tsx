import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Form from "next/form";
import React from "react";
import { cancelOrderStatusAction } from "../actions/orders";

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const CancelOrderModal = (props: CancelOrderModalProps) => {
  return (
    <Modal
      title={"Cancel Order"}
      description={"Do you wanna cancel this order?"}
      open={props.open}
      onOpenChange={props.onOpenChange}>
      <Form action={cancelOrderStatusAction}>
        <input type="hidden" name="order-id" value={props.orderId} />
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => props.onOpenChange(false)}>
            close
          </Button>
          <SubmitBtn
            name="confirm cancel"
            icon={Ban}
            className="bg-destructive hover:bg-destructive/80"
          />
        </div>
      </Form>
    </Modal>
  );
};

export default CancelOrderModal;
