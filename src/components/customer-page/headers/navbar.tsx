import { UserType } from "@/types/user";
import React from "react";
import MobileMenu from "./mobileMenu";
import CartIconBtn from "./cartIcon";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Nav */}
      {user && <CartIconBtn />}
      <MobileMenu />
      {/* Desktop Nav */}
      <div className="hidden">
        <div>Desktop Links</div>
        {user ? <div>Desktop user menu</div> : <div>Go to sigin btn</div>}
      </div>
    </nav>
  );
};

export default Navbar;
