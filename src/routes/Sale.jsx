import React from "react";
import Card from "../components/Card";
import ScrollToTop from "../components/ScroolToTop";
import useRelatedProducts from "../hooks/useRelatedhook";

const Computer = () => {
  // Use the hook inside the component
  const { relatedProducts, isLoading, error } = useRelatedProducts({
    category: "computer",
  });

  if (isLoading)
    return <div className="text-center p-8">Loading computers...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  return (
    <div className="container min-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-300">
      <ScrollToTop />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card */}
        <div className="relative flex-1 bg-red-500 transition-colors text-white rounded-lg overflow-hidden flex items-center p-8 min-h-[350px]">
          <div className="z-10 max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Holiday Deals</h3>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              Up to 30% off
            </h1>
            <p className="text-base mb-4">Selected Smartphone Brands</p>
            <button className="bg-white outline-2 outline-white text-red-500 px-6 py-2 rounded-full font-semibold shadow-xl hover:bg-transparent hover:text-white transition">
              Shop
            </button>
          </div>
          <img
            src="https://via.placeholder.com/300x400/FF0000/FFFFFF?text=Phone+Image"
            alt="Smartphone"
            className="absolute right-0 bottom-0 h-full object-contain"
          />
        </div>

        {/* Right Card */}
        <div className="relative flex-1 bg-yellow-500 text-white rounded-lg overflow-hidden min-h-[350px] flex items-center p-8">
          <div className="z-10 max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Just In</h3>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              Take Your Sound Anywhere
            </h1>
            <p className="text-base mb-4">Top Headphone Brands</p>
            <button className="bg-white outline-2 outline-white text-purple-500 px-6 py-2 rounded-full font-semibold shadow transition hover:text-white hover:bg-transparent">
              Shop
            </button>
          </div>
          <img
            src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
            alt="Headphones"
            className="absolute right-0 bottom-0 h-full object-contain"
          />
        </div>
      </div>

      {/* Computers Section */}
      <section className="mt-18 bg-gray-500">
        <h1 className="text-5xl font-extrabold  text-center p-8">Computers</h1>
        <div className="min-w-full justify-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:grid-cols-5 p-4">
          {" "}
          {relatedProducts?.map((product, index) => (
            <Card
              key={index}
              id={product._id}
              image={product.image}
              title={product.title}
              badge={product.badge}
              tags={product.tags}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Computer;
