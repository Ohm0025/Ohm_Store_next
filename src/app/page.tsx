"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const HomePage = () => {
  const handleOnClick = () => console.log("Hello World");
  return (
    <div className="flex flex-col items-center">
      <h1>Home Page</h1>
      <Button className="hover:cursor-pointer" onClick={handleOnClick}>
        Submit
      </Button>
    </div>
  );
};

export default HomePage;
