import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchhook from "../hooks/useFetchhook";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function AuthPage() {
  const navigate = useNavigate();

  // Check existing session/profile
  const fetchOptions = useMemo(
    () => ({ method: "GET", credentials: "include" }),
    []
  );
  const {
    data: profile,
    loading: sessionLoading,
    error: sessionError,
  } = useFetchhook("/profile", fetchOptions);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (!sessionLoading && profile?.user) {
      navigate("/");
    }
  }, [sessionLoading, profile, navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setError("");
    setFormData({ username: "", email: "", password: "" });
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = isLogin ? "/login" : "/signup";

    try {
      const response = await fetch(BASE_URL + url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Authentication failed");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Show loader while checking session
  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-t-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-lg text-gray-800">Checking session…</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500">
        <div className="animate-spin h-12 w-12 border-4 border-t-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex  text-black items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-500 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl ring-1 ring-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-center animate-pulse">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-blue-700 font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
