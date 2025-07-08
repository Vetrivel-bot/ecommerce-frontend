import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import useFetchhook from "../hooks/useFetchhook";
import { ShoppingCart, CreditCard, Tag } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Memoized fetch options
  const fetchOptions = useMemo(
    () => ({
      method: "GET",
      credentials: "include",
      skip: false,
    }),
    []
  );

  // Profile fetch
  const {
    data: profile,
    loading: profileLoading,
    error: sessionError,
  } = useFetchhook("/profile", fetchOptions);

  // Handle session errors
  useEffect(() => {
    if (sessionError) navigate("/login");
  }, [sessionError, navigate]);

  // Product data fetch
  const fetchProductData = useCallback(async () => {
    try {
      // First fetch the main product
      const productRes = await fetch(`${BASE_URL}/products/${id}`);
      if (!productRes.ok) throw new Error("Product not found");
      
      const productData = await productRes.json();
      setProduct(productData);

      // Then fetch related products using POST
      const relatedRes = await fetch(`${BASE_URL}/products/related`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: Array.isArray(productData.tags) ? productData.tags : [],
          excludeId: productData._id
        }),
      });

      if (!relatedRes.ok) throw new Error("Failed to load related products");
      const relatedData = await relatedRes.json();
      setRelatedProducts(relatedData);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Cart management
  const fetchCart = useCallback(async () => {
    if (!profile?.user?._id) return;
    try {
      const res = await fetch(`${BASE_URL}/cart/${profile.user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setCartItemsCount(data.cart.reduce((t, i) => t + i.quantity, 0));
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  }, [profile]);

  const addToCart = useCallback(async (productId) => {
    if (!profile?.user?._id) return navigate("/login");
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
      await fetchCart();
    } catch (error) {
      console.error("Cart error:", error);
    }
  }, [profile, fetchCart, navigate]);

  const buyNow = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ productId: id, quantity: 1 }] }),
      });
      if (!response.ok) throw new Error("Order failed");
    } catch (err) {
      console.error("Order error:", err);
    }
  }, [id]);

  // Loading states
  if (profileLoading || loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="relative aspect-square bg-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="px-6 py-8 lg:py-12 flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                </div>

                <div className="prose prose-gray mb-8">
                  <h2 className="text-xl text-gray-800 font-semibold mb-3">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => addToCart(id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={buyNow}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <CreditCard size={20} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
              Related Products
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <Card
                  id={product._id}
                  image={product.image}
                  title={product.title}
                  badge={product.badge}
                  tags={product.tags}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Product;