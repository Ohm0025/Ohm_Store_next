import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { CategoryType } from "@/types/category";
import { Trash2 } from "lucide-react";
import Form from "next/form";
import React, { useEffect } from "react";
import { deleteCategoryAction } from "../actions/categories";

interface DeleteCatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
}

const DeleteCatModal = ({
  open,
  onOpenChange,
  category,
}: DeleteCatModalProps) => {
  const { state, formAction, isPending } = useForm(deleteCategoryAction);

  useEffect(() => {
    if (state.success) onOpenChange(false);
  }, [state, onOpenChange]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={"Delete Category"}
      description="Are you sure to delete this category ?">
      <Form action={formAction}>
        <input type="hidden" name="category-id" value={category?.id} />
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6">
          <Button
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            type="button"
            variant={"outline"}
            className="flex-1">
            Cancel
          </Button>
          <SubmitBtn
            pending={isPending}
            name="Delete"
            icon={Trash2}
            className="bg-destructive hover:bg-destructive/80 flex-1"
          />
        </div>
      </Form>
    </Modal>
  );
};

export default DeleteCatModal;
