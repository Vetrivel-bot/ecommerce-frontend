import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScroolToTop";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminProduct = () => {
  const { id } = useParams();
  // Initial product data
  const initialProduct = {
    title: "",
    price: 0,
    image: "",
    description: "",
    tags: [],
    badge: "",
  };
  const navigate = useNavigate(); // Added useNavigate hook

  // Main states
  const [product, setProduct] = useState(initialProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialProduct);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // For previewing in the UI
      setFormData((prev) => ({
        ...prev,
        imageFile: file, // Store the raw file for uploading
        imagePreview: imageUrl, // Store the URL for previewing
      }));
    }
  };

  // Toggle edit mode
  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      // Create a FormData object to handle text fields and the image file
      const data = new FormData();

      // Append all text fields from formData, excluding imageFile and imagePreview
      for (const key in formData) {
        if (key !== "imageFile" && key !== "imagePreview") {
          if (Array.isArray(formData[key])) {
            // If the value is an array, append each element separately
            formData[key].forEach((value) => data.append(key, value));
          } else {
            // If the value is not an array, append it as is
            data.append(key, formData[key]);
          }
        }
      }

      // Append the image file if it exists
      if (formData.imageFile) {
        data.append("image", formData.imageFile); // 'image' is the key the server expects
      }

      // Send the request with FormData
      const response = await fetch(`${BACKEND_URL}/products/update/${id}`, {
        method: "PUT",
        body: data, // No Content-Type header; browser sets it automatically
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setIsEditing(false);
      navigate("/profile");

      console.log("Update successful:", updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${BACKEND_URL}/products/delete/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Delete failed");
        console.log("Product deleted successfully");
        navigate("/profile");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-white">
        <div className="bg-white w-full min-h-full grid lg:grid-cols-2 items-center justify-center">
          {/* Image Section */}
          {/* Image Section */}
          <div className="md:p-13 lg:pr-24 md:pb-0 justify-center flex lg:justify-end">
            {isEditing ? (
              <div className="w-full mb-4 max-w-2xl mx-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer w-full block group"
                >
                  {formData.imagePreview || product.image ? (
                    <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl border-2 border-dashed border-gray-200 group-hover:border-blue-400 transition-all">
                      <img
                        src={formData.imagePreview || product.image}
                        alt="Preview"
                        className="w-full h-full object-cover absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-transparent group-hover:bg-black hover:opacity-50 group-hover:bg-opacity-20 transition-all rounded-xl" />
                    </div>
                  ) : (
                    <div className="aspect-square md:aspect-[4/3] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50 transition-colors">
                      {/* Proper SVG implementation */}
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400 group-hover:text-blue-400 transition-colors"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        />
                      </svg>
                      <span className="mt-4 text-base font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                        Upload Product Image
                      </span>
                      <span className="mt-1 text-sm text-gray-400">
                        PNG, JPG, JPEG (Max 10MB)
                      </span>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="w-full max-w-2xl mx-auto">
                <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex items-center md:p-7 flex-col gap-3 mt-3 mb-3">
            <div className="mx-7 w-full">
              <center>
                {isEditing ? (
                  <textarea
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="text-black font-bold text-2xl border border-gray-300 rounded px-2 py-1 w-full"
                    rows={4}
                  />
                ) : (
                  <h1 className="text-black font-bold text-2xl">
                    {product.title}
                  </h1>
                )}
              </center>
            </div>
            <div className="py-2 px-4 w-full">
              <center>
                {isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="text-black font-medium text-2xl border border-gray-300 rounded px-2 py-1 text-center"
                  />
                ) : (
                  <h1 className="text-black font-medium text-2xl">
                    ₹{product.price}
                  </h1>
                )}
              </center>
            </div>
            {/* Action Buttons */}
            {isEditing ? (
              <button
                onClick={handleSave}
                className="max-w-lg bg-green-500 hover:bg-green-600 text-white font-medium rounded-full py-2 px-4 w-full text-sm transition-colors"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="max-w-lg bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-full py-2 px-4 w-full text-sm transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="max-w-lg bg-red-500 hover:bg-red-600 text-white font-medium rounded-full py-2 px-4 w-full text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        {/* Description Section */}
        <section className="text-black pt-9">
          <center>
            <h1 className="text-black pb-4">Description</h1>
          </center>
          <div className="px-9">
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-xl"
                rows={6}
              />
            ) : (
              <p className="text-xl">{product.description}</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminProduct;
