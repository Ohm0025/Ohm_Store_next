import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, LucideIcon } from "lucide-react";

interface SubmitBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  pending?: boolean;
  icon?: LucideIcon;
}

const SubmitBtn = ({
  name,
  pending = false,
  icon,
  ...props
}: SubmitBtnProps) => {
  const Icon = icon; //make it be component
  return (
    <Button
      disabled={pending}
      type="submit"
      {...props}
      className="cursor-pointer w-full">
      {pending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={16} />} {name}
        </>
      )}
    </Button>
  );
};

export default SubmitBtn;
