import React, { useMemo, useState, useEffect } from "react";
import { ShoppingCart, CreditCard, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useFetchhook from "../hooks/useFetchhook"; // assuming this exists

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Card = ({ image, title, tags, badge, id, price }) => {
  const navigate = useNavigate();

  const [cartData, setCartData] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const fetchOptions = useMemo(
    () => ({ method: "GET", credentials: "include" }),
    []
  );

  const {
    data: profile,
    loading: profileLoading,
    error: sessionError,
  } = useFetchhook("/profile", fetchOptions);

  const fetchCart = async () => {
    if (!profile) return;
    try {
      const res = await fetch(`${BASE_URL}/cart/${profile.user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setCartData(data);
      setCartItemsCount(
        data.cart.reduce((total, item) => total + item.quantity, 0)
      );
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addtocart = async (productId) => {
    try {
      await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: profile.user._id,
        }),
      });
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const buynow = (e, id) => {
    e.stopPropagation();
    console.log(id);
  };

  return (
    <div
      onClick={() => {
        window.scrollTo(0, 0);
        navigate(`/product/${id}`);
      }}
      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 border hover:border-2 border-blue-300 hover:border-blue-500/60 hover:shadow-lg"
    >
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">
            {badge}
          </span>
        </div>
      )}

      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-medium text-gray-800 mb-2 line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-gray-900">₹{price}</span>
          <div className="flex gap-1.5">
            {tags?.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-500"
              >
                <Tag size={10} className="mr-0.5 text-gray-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addtocart(id);
            }}
            className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-800 px-2 py-1.5 rounded text-sm hover:border-gray-300 transition-colors"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
          <button
            onClick={(e) => buynow(e, id)}
            className="flex items-center justify-center gap-1.5 bg-blue-600 text-white px-2 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <CreditCard size={15} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
