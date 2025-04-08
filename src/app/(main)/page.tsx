import FeatureProduct from "@/components/customer-page/home/featureProduct";
import Hero from "@/components/customer-page/home/hero";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-6 md:gap-12">
      <Hero />
      <FeatureProduct />
    </div>
  );
};

export default HomePage;
