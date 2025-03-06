import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  pending?: boolean;
}

const SubmitBtn = ({ name, pending = false, ...props }: SubmitBtnProps) => {
  return (
    <Button
      disabled={pending}
      type="submit"
      {...props}
      className="cursor-pointer w-full">
      {pending ? <Loader2 size={16} className="animate-spin" /> : name}
    </Button>
  );
};

export default SubmitBtn;
