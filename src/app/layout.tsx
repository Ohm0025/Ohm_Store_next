import "./globals.css";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Ohm Store | E-Commerce Workshop",
    template: "%s | E-Commerce Workshop",
  },
  description: "ohm's E-commerce web application",
  keywords: ["ohm", "e-commerce", "store"],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
