import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { UserType } from "@/types/user";
import { AuthBtn, SignoutBtn, UserAvatar } from "./userComp";

interface MobileMenuProps {
  user: UserType | null;
}

const MobileMenu = ({ user }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col w-full md:max-w-sm">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl">
            {user ? "Your Profile" : "Welcome"}
          </SheetTitle>
        </SheetHeader>
        <div>
          {/* User Profile && Auth btn */}
          {user ? <UserAvatar user={user} /> : <AuthBtn />}

          {/* Nav Links */}

          {/* Go to Admin page Btn */}
          {user && user.role === "Admin" && <div>Go to admin page</div>}

          {user && (
            <SheetFooter>
              <SignoutBtn />
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
//Sheet trigger = button element so it can't have btn child -> solve by asChild (use child element instead)
