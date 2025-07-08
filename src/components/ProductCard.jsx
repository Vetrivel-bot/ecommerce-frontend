import React from "react";
import { Plus, Minus, ShoppingCart, CreditCard, Trash } from "lucide-react";

export const ProductCard = ({
  product,
  onQuantityChange,
  onAddToCart,
  onRemove,
  cartQuantity,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toFixed(2)}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onQuantityChange(cartQuantity - 1)}
              disabled={cartQuantity <= 1}
              className="p-1 rounded-full bg-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 text-gray-700 h-4" />
            </button>
            <span className="w-8 text-center text-gray-900 font-medium">
              {cartQuantity}
            </span>
            <button
              onClick={() => onQuantityChange(cartQuantity + 1)}
              className="p-1 rounded-full bg-gray-300 hover:bg-gray-200"
            >
              <Plus className="w-4 text-gray-700 h-4" />
            </button>
          </div>
        </div>
        <section className="flex flex-col gap-3">
          <button
            onClick={() => onRemove(product._id)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium
                     flex items-center justify-center space-x-2
                     hover:bg-red-700 transition-colors duration-200"
          >
            <Trash className="w-5 h-5" />
            <span>Remove Product</span>
          </button>
          <button
            onClick={() => onAddToCart(product._id)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium
                     flex items-center justify-center space-x-2
                     hover:bg-blue-700 transition-colors duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Buy Now</span>
          </button>
        </section>
      </div>
    </div>
  );
};
