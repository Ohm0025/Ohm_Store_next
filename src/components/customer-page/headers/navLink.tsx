import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";
import React from "react";

const NAV_LINK = [
  { title: "Main Page", href: "/" },
  { title: "Product Page", href: "/products" },
  { title: "About Page", href: "/about" },
  { title: "Contact Page", href: "/contact" },
];

export const MobileNavLink = () => (
  <div className="flex flex-col gap-2">
    {NAV_LINK.map((link, index) => (
      <SheetClose key={index} asChild>
        <Button variant="secondary" size="lg" asChild>
          <Link href={link.href}>{link.title}</Link>
        </Button>
      </SheetClose>
    ))}
  </div>
);

export const DesktopNavLink = () => (
  <div className="flex items-center gap-1">
    {NAV_LINK.map((item, index) => (
      <Button variant="ghost" size="sm" key={index} asChild>
        <Link href={item.href}>{item.title}</Link>
      </Button>
    ))}
  </div>
);
