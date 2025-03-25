"use client";
import { createContext, useState, useContext } from "react";

interface SideBarProviderType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SideBarContext = createContext<SideBarProviderType | undefined>(
  undefined
);

export const SideBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  const toggleSidebar = () => setIsSideBarOpen((prev) => !prev);
  return (
    <SideBarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SideBarContext.Provider>
  );
};

export const useSideBar = () => {
  const context = useContext(SideBarContext);

  if (context === undefined) {
    throw new Error("useSidebar must be used within a SideBarProvider");
  }

  return context;
};
