import Modal from "@/components/shared/modal";
import { useForm } from "@/hooks/useForm";
import { CategoryType } from "@/types/category";
import Form from "next/form";
import React, { useEffect } from "react";
import { reactiveCategoryAction } from "../actions/categories";
import { Button } from "@/components/ui/button";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { RefreshCcw } from "lucide-react";

interface ReactiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType;
}

const ReactiveCatModal = ({
  open,
  onOpenChange,
  category,
}: ReactiveModalProps) => {
  const { state, formAction, isPending } = useForm(reactiveCategoryAction);

  useEffect(() => {
    if (state.success) onOpenChange(false);
  }, [state, onOpenChange]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reactivate Category"
      description="Are you sure reactive this category ?">
      <Form action={formAction}>
        <input type="hidden" name="category-id" value={category?.id} />
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6">
          <Button
            className="flex-1"
            type="button"
            variant={"outline"}
            onClick={() => onOpenChange(false)}
            disabled={isPending}>
            Cancel
          </Button>
          <SubmitBtn
            pending={isPending}
            name="Reactivate"
            icon={RefreshCcw}
            className="bg-green-500 hover:bg-green-300 flex-1"
          />
        </div>
      </Form>
    </Modal>
  );
};

export default ReactiveCatModal;
