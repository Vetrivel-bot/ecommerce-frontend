import React, { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import useFetchhook from "../hooks/useFetchhook"; // make sure path is correct

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Cart() {
  const [cartData, setCartData] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();

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
      // calculate total amount = sum of (productId.price * quantity)
      setCartItemsCount(
        data.cart.reduce(
          (sum, item) => sum + item.productId.price * item.quantity,
          0
        )
      );
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchCart();
    }
  }, [profile]);
  setTimeout(() => {
    fetchCart();
  }, 1000);
  const handleAddToCart = async (productId) => {
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

  const handleRemove = async (productId) => {
    try {
      await fetch(`${BASE_URL}/cart/remove`, {
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
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    console.log("Updating quantity to:", quantity);
    try {
      await fetch(`${BASE_URL}/cart/update`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: profile.user._id,
          quantity,
        }),
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (sessionError) {
    navigate("/login");
    return null;
  }

  if (profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <div className="relative">
              <section className="flex items-center justify-between rounded-xl p-4 gap-6 w-full max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-800">
                    {cartItemsCount}
                  </span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  Checkout
                </button>
              </section>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartData?.cart?.map((item, index) => (
            <ProductCard
              index={index}
              key={item.productId._id}
              product={item.productId}
              cartQuantity={item.quantity}
              onQuantityChange={(newQuantity) =>
                handleQuantityChange(item.productId._id, newQuantity)
              }
              onAddToCart={() => handleAddToCart(item.productId._id)}
              onRemove={() => handleRemove(item.productId._id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Cart;
