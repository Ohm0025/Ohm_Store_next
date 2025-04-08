import { Button } from "@/components/ui/button";
import { getFeatureProducts } from "@/features/products/db/products";
import { ArrowRight, Sparkle } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductCard from "../products/product-card";

const FeatureProduct = async () => {
  const products = await getFeatureProducts();

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-2 border border-primary/60 rounded-full">
            <Sparkle size={14} />
            <span>Recommended Products</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">
            Best Seller Product In This Week
          </h2>
        </div>

        <Button variant={"ghost"} asChild className="group">
          <Link href={"/products"}>
            <span>Check All Products</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <div key={index}>
            <ProductCard key={index} product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureProduct;
