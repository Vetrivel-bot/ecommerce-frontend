import React from "react";

const SearchResults = ({ results, loading, visible, onResultClick }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[60vh] overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-pulse">Searching products...</div>
        </div>
      ) : results.length > 0 ? (
        <div className="py-2">
          {results.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onResultClick(product._id);
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) =>
                e.key === "Enter" && onResultClick(product._id)
              }
            >
              <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/100?text=Product";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {product.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
