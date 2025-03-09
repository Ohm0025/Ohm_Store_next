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
import { MobileNavLink } from "./navLink";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

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
        <div className="flex-1 flex flex-col gap-6">
          {/* User Profile && Auth btn */}
          {user ? <UserAvatar user={user} /> : <AuthBtn />}

          <Separator />

          <div className="px-4">
            <ScrollArea className="h-50 sm:h-60 w-full">
              {/* Nav Links */}
              <MobileNavLink />

              {/* Go to Admin page Btn */}
              {user && user.role === "Admin" && (
                <div className="mt-2">
                  <Separator className="mb-2" />
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    asChild>
                    <Link href="/admin">Backend</Link>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        {user && (
          <SheetFooter>
            <SignoutBtn isMobile />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
//Sheet trigger = button element so it can't have btn child -> solve by asChild (use child element instead)
