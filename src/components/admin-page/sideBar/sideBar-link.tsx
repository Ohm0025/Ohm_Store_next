import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
}

const SidebarLink = ({
  label,
  href,
  icon,
  isActive,
  onClose,
}: SidebarLinkProps) => {
  return (
    <Button
      onClick={onClose}
      variant={isActive ? "secondary" : "ghost"}
      asChild>
      <Link
        href={href}
        className={cn(
          "w-full justify-start gap-3",
          isActive
            ? "font-semibold"
            : "text-muted-foreground hover:text-foreground"
        )}>
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarLink;
