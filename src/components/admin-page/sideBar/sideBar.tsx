"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSideBar } from "@/providers/sideBarProvider";
import { UserType } from "@/types/user";
import {
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  X,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SidebarLink from "./sideBar-link";
import { usePathname } from "next/navigation";
import { useSignout } from "@/hooks/useSignout";

interface SideBarAdminProps {
  user: UserType;
}

const SideBarAdmin = ({ user }: SideBarAdminProps) => {
  const { isSidebarOpen, toggleSidebar } = useSideBar();
  const sideBarLink = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: <FolderTree size={20} />,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: <ShoppingCart size={20} />,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: <ClipboardList size={20} />,
    },
  ];
  const pathname = usePathname();
  const { isPending, handleSignout } = useSignout();
  return (
    <div>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[gray]/70 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-svh w-64 bg-white border-r flex flex-col transition-all duration-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {/* logo */}
          <Link href={"/admin"} className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <div className="size-6 text-primary-foreground font-bold flex items-center justify-center">
                A
              </div>
            </div>
            <span className="text-xl font-bold">Admin</span>
          </Link>

          {/* Toggle side bar button */}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="md:hidden"
            onClick={toggleSidebar}>
            <X size={20} />
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col h-[calc(100vw-128px)] overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Profile Box */}
              <div className="flex items-center gap-3 bg-muted p-3 rounded-lg mb-6">
                <Avatar className="size-10">
                  <AvatarImage
                    src={user.picture || undefined}
                    alt={user.name || "user"}></AvatarImage>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium leading-none">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {/* Menu */}
              <nav className="space-y-1.5">
                {sideBarLink.map((link, index) => (
                  <SidebarLink
                    key={index}
                    onClose={toggleSidebar}
                    label={link.label}
                    href={link.href}
                    icon={link.icon}
                    isActive={pathname === link.href}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Signout button */}
        <div className="border-t p-4">
          <Button
            onClick={handleSignout}
            disabled={isPending}
            variant={"ghost"}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground cursor-pointer">
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default SideBarAdmin;
