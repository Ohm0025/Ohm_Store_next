import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/user";
import Link from "next/link";
import React from "react";
import { SignoutBtn, UserAvatarSmall, UserDropDown } from "./userComp";

interface DesktopUserMenuProps {
  user: UserType;
  itemCount: number;
}

const DesktopUserMenu = ({ user, itemCount }: DesktopUserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"} className="rounded-full size-8">
          <UserAvatarSmall user={user} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4} className="w-56">
        <DropdownMenuLabel className="flex flex-col items-center gap-2">
          <UserDropDown user={user} />
          <span>Hello , {user.name || user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">My Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/cart">
            <span>My Cart</span>
            <Badge className="ml-auto bg-primary">{itemCount}</Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/my-order">My Order</Link>
        </DropdownMenuItem>

        {user.role === "Admin" && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin">Backend</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <div>
          <SignoutBtn />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DesktopUserMenu;
