"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSideBar } from "@/providers/sideBarProvider";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/types/user";
import Link from "next/link";

interface HeaderAdminProps {
  user: UserType;
}

const HeaderAdmin = ({ user }: HeaderAdminProps) => {
  const { toggleSidebar } = useSideBar();
  return (
    <header className="fixed top-0 inset-x-0 md:left-64 h-16 bg-card border-b z-10 transition-all duration-200">
      <div className="flex items-center h-full justify-between px-4">
        {/* Taggle Sidebar button */}
        <Button
          onClick={toggleSidebar}
          variant={"ghost"}
          size={"icon"}
          className="md:hidden">
          <Menu size={20} />
        </Button>

        {/* Profile DropDown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Avatar>
                <AvatarImage
                  src={user.picture || undefined}
                  alt={user.name || "User-image"}></AvatarImage>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.slice(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/profile"} className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 hover:!text-red-400 ">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HeaderAdmin;
