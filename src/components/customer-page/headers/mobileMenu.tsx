import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileMenu = () => {
  return (
    <Button variant="ghost" size="icon">
      <Menu size={20} />
    </Button>
  );
};

export default MobileMenu;
