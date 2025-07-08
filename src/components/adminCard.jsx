import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AdminCard = ({ image, title, tags: initialTags, price, badge, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    image: image,
    title: title,
    price: price,
    tags: initialTags || [],
    badge: badge || "",
  });
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    fetch(`${BACKEND_URL}/api/products/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Update failed");
        return response.json();
      })
      .then((data) => {
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${BACKEND_URL}/api/products/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }).catch(console.error);
    }
  };

  const handleAddTag = (e) => {
    e.stopPropagation();
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (index, e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
    <div
      className="card bg-white shadow-lg shadow-gray-500 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 w-64 min-h-[400px] flex flex-col cursor-pointer"
      onClick={() => navigate(`/adminproduct/${id}`)}
    >
      <figure className="h-40 w-full">
        <img
          src={formData.image}
          alt={formData.title}
          className="w-full h-full pt-5 px-4 object-cover"
        />
      </figure>

      <div className="card-body p-4 flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onClick={(e) => e.stopPropagation()}
              className="text-black card-title text-base font-bold border border-gray-300 rounded px-2 py-1 w-48"
            />
          ) : (
            <h2 className="text-black card-title text-base font-bold line-clamp-2">
              {formData.title}
            </h2>
          )}
          {isEditing ? (
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              onClick={(e) => e.stopPropagation()}
              className="badge badge-secondary text-xs px-2 py-1 border border-gray-300 rounded"
            />
          ) : (
            formData.badge && (
              <div className="badge badge-secondary text-xs px-2 py-1">
                {formData.badge}
              </div>
            )
          )}
        </div>

        <div className="flex justify-center my-2">
          {isEditing ? (
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              onClick={(e) => e.stopPropagation()}
              className="text-black font-bold text-lg border border-gray-300 rounded px-2 py-1 text-center"
            />
          ) : (
            <h1 className="text-black font-bold text-lg">₹ {formData.price}</h1>
          )}
        </div>

        <div className="card-actions flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="badge badge-outline text-black border-gray-900 text-xs font-bold px-2 py-1">
                {tag}
              </div>
              {isEditing && (
                <button
                  onClick={(e) => handleRemoveTag(index, e)}
                  className="text-red-500 text-xs"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="border border-gray-300 rounded px-2 py-1 text-xs"
              />
              <button
                onClick={handleAddTag}
                className="text-green-500 text-xl font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-3 mb-3">
          <center>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-full py-2 px-4 w-full text-sm transition-colors"
              >
                Save
              </button>
            ) : (
              <button
                onClick={toggleEdit}
                className="bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-full py-2 px-4 w-full text-sm transition-colors"
              >
                Edit
              </button>
            )}
          </center>
          <center>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-full py-2 px-4 w-full text-sm transition-colors"
            >
              Delete
            </button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
