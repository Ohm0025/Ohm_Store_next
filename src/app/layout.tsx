import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Kanit } from "next/font/google";

export const metadata: Metadata = {
  title: {
    default: "Ohm Store | E-Commerce Workshop",
    template: "%s | E-Commerce Workshop",
  },
  description: "ohm's E-commerce web application",
  keywords: ["ohm", "e-commerce", "store"],
};

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={kanit.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
