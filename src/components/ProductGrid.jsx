import React from "react";
import { ProductCard } from "./ProductCard";

export const ProductGrid = ({ products, onQuantityChange, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuantityChange={onQuantityChange}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
