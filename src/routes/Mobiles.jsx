import React from "react";
import Card from "../components/Card";
import ScrollToTop from "../components/ScroolToTop";
import useRelatedProducts from "../hooks/useRelatedhook";
import { useNavigate } from "react-router-dom";
const Computer = () => {
  // Use the hook inside the component
  const { relatedProducts, isLoading, error } = useRelatedProducts({
    category: "mobile",
  });
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  return (
    <div className="container min-w-full mx-auto flex  flex-col gap-y-8 py-20 bg-gray-300">
      <ScrollToTop />
     {/* Promotional Cards Section */}
     <section className="bg-gradient-to-b from-gray-100 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Holiday Deals Card */}
            <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-2xl overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative z-10 p-8 lg:p-12">
                <div className="max-w-sm">
                  <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                    Holiday Deals
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Up to 30% off
                  </h2>
                  <p className="text-white/90 text-lg mb-8">
                    Selected Smartphone Brands
                  </p>
                  <button
                    onClick={() => navigate("/mobile")}
                    className="bg-white px-8 py-3 rounded-full font-semibold text-red-600 shadow-xl hover:bg-transparent hover:text-white border-2 border-transparent hover:border-white transition-all duration-300"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
              <img
                src="/1.png"
                alt="Smartphone"
                className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-left opacity-90"
              />
            </div>

            {/* Audio Gear Card */}
            <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative z-10 p-8 lg:p-12">
                <div className="max-w-sm">
                  <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                    Just In
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Premium Audio
                  </h2>
                  <p className="text-white/90 text-lg mb-8">
                    Top Headphone Brands
                  </p>
                  <button onClick={()=>navigate("/audio")} className="bg-white px-8 py-3 rounded-full font-semibold text-purple-600 shadow-xl hover:bg-transparent hover:text-white border-2 border-transparent hover:border-white transition-all duration-300">
                    Shop Now
                  </button>
                </div>
              </div>
              <img
                src="/2.png"
                alt="Headphones"
                className="absolute right-0 bottom-0 h-full w-1/2 object-cover object-left opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Computers Section */}
      <section className="py-20 bg-gradient-to-br from-gray-600/80 via-gray-900 to-gray-400/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-16">
            <span className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200">
              Mobiles{" "}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {relatedProducts?.map((product) => (
              <div className="transform transition-all duration-300 hover:-translate-y-2">
                <Card
                  key={product._id}
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
        </div>
      </section>
    </div>
  );
};

export default Computer;
