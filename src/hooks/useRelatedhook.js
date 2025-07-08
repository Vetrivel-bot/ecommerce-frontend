import { useState, useEffect } from "react";

const useRelatedProducts = ({ category, tags }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${URL}/products/related`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: category || "",
            tags: tags || [],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch related products");
        }

        const data = await response.json();
        setRelatedProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (category || (tags && tags.length > 0)) {
      fetchRelatedProducts();
    }
  }, [category, tags]);

  return { relatedProducts, isLoading, error };
};

export default useRelatedProducts;
