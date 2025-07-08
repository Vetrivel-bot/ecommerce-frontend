import React, { useState, useEffect, useRef } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Changed variable name

const AddCard = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: null,
    description: "",
    tags: [],
    category: "",
    badge: "",
  });
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null); // Added ref for file input

  // Add cleanup for object URLs
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous URL if exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("tags", formData.tags.join(","));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("badge", formData.badge);

      const response = await fetch(`${BACKEND_URL}/products/upload`, {
        // Changed variable name here
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to submit product");
      }

      const result = await response.json();
      console.log("Product added successfully:", result);

      // Reset form and clear file input
      setFormData({
        title: "",
        price: "",
        image: null,
        description: "",
        tags: [],
        category: "",
        badge: "",
      });
      setImagePreview(null);
      setIsAdding(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error submitting product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input on cancel
    }
  };

  if (isAdding) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4">
            <div className="flex flex-col lg:flex-row p-6 gap-6">
              {/* Left Column - Image Upload */}
              <div className="lg:w-1/2 flex flex-col items-center">
                <div className="w-full mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageUpload"
                    ref={fileInputRef} // Added ref here
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer w-full block group"
                  >
                    {imagePreview ? (
                      <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-gray-200 group-hover:border-blue-400 transition-all">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-black hover:opacity-50 group-hover:bg-opacity-20 transition-all rounded-xl" />
                      </div>
                    ) : (
                      <div className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50 transition-colors">
                        <svg
                          className="mx-auto h-16 w-16 text-gray-400 group-hover:text-blue-400 transition-colors"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Add New Product
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                      placeholder="Enter product title"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="mobile">Mobile</option>
                        <option value="computer">Computer</option>
                        <option value="drone">Drone</option>
                        <option value="audio">Audio</option>
                        <option value="wearable">Wearable</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400"
                      placeholder="Write product description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      Tags
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center pl-3 pr-2 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(index)}
                            className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400 text-sm"
                          placeholder="Add new tag"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddTag()
                          }
                        />
                        <button
                          onClick={handleAddTag}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                      onClick={handleAdd}
                      disabled={isSubmitting}
                      className={`flex-1 px-6 py-3 ${
                        isSubmitting
                          ? "bg-gray-400"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white font-semibold rounded-lg transition-colors shadow-sm`}
                    >
                      {isSubmitting ? "Submitting..." : "Add Product"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card bg-white shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden min-w-[260px]  min-h-[300px] flex items-center justify-center cursor-pointer"
      onClick={() => setIsAdding(true)}
    >
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center group hover:bg-blue-100 transition-colors">
        <span className="text-4xl text-blue-500 group-hover:text-blue-600 transition-colors">
          +
        </span>
      </div>
    </div>
  );
};

export default AddCard;
