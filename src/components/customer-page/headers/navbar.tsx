import { UserType } from "@/types/user";
import React from "react";
import MobileMenu from "./mobileMenu";
import CartIconBtn from "./cartIcon";
import { DesktopNavLink } from "./navLink";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./desktopUserMenu";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Nav */}
      {user && <CartIconBtn />}
      <MobileMenu user={user} />
      {/* Desktop Nav */}
      <div className="hidden md:flex">
        <DesktopNavLink />

        {user ? (
          <DesktopUserMenu user={user} />
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
