import { UserType } from "@/types/user";
import React from "react";
import MobileMenu from "./mobileMenu";
import CartIconBtn from "./cartIcon";
import { DesktopNavLink } from "./navLink";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./desktopUserMenu";
import { getCartItemCount } from "@/features/carts/db/carts";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = async ({ user }: NavbarProps) => {
  const itemCount = user ? await getCartItemCount(user.id) : 0;
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Nav */}
      {user && <CartIconBtn itemCount={itemCount} />}
      <MobileMenu user={user} />
      {/* Desktop Nav */}
      <div className="hidden md:flex">
        <DesktopNavLink />

        {user ? (
          <DesktopUserMenu user={user} itemCount={itemCount} />
        ) : (
          <Button asChild size="sm">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
