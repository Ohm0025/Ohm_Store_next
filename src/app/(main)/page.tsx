"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const HomePage = () => {
  const handleOnClick = () => console.log("Hello World");
  return (
    <Button className="hover:cursor-pointer" onClick={handleOnClick}>
      Submit
    </Button>
  );
};

export default HomePage;
