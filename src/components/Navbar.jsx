import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useFetchhook from "../hooks/useFetchhook";
import SearchResults from "./SearchResults";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const NavBar = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const fetchOptions = useMemo(
    () => ({ method: "GET", credentials: "include" }),
    []
  );

  const {
    data: profile,
    loading: profileLoading,
    error: sessionError,
  } = useFetchhook("/profile", fetchOptions);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        requestAnimationFrame(() => {
          setShowResults(false);
        });
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/search?q=${searchQuery}`
        );
        if (!response.ok) throw new Error("Search request failed");

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  useEffect(() => {
    if (!profile) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`${BASE_URL}/cart/${profile.user._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setCartItemsCount(data.cart.length);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
    const interval = setInterval(fetchCart, 1000);
    return () => clearInterval(interval);
  }, [profile]);

  useEffect(() => {
    let lastScrollPosition = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollPosition < lastScrollY) {
            // Scrolling up
            setVisible(true);
          } else if (
            currentScrollPosition > lastScrollY &&
            currentScrollPosition > 100
          ) {
            // Scrolling down and not at the top
            setVisible(false);
          }

          setScrolled(currentScrollPosition > 10);
          setLastScrollY(currentScrollPosition);
          ticking = false;
        });

        ticking = true;
      }

      lastScrollPosition = currentScrollPosition;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setShowResults(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (id) => {
    setShowResults(false);
    setSearchQuery("");
    setIsOpen(false);

    setTimeout(() => {
      navigate(`/product/${id}`);
    }, 10);
  };

  return (
    <nav
      className={`fixed top-0  left-0 right-0 z-50 transform transition-transform duration-500 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${scrolled ? "shadow-lg" : ""}`}
    >
      <div
        className={`transform transition-opacity duration-500 ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-2 text-center text-sm font-medium">
            Free Express Shipping on Orders Above ₹499 🚀
          </div>
        </div>

        {/* Main Navigation */}
        <div className="bg-white/95 backdrop-blur-md transition-all duration-300">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  TechMart
                </h1>
              </Link>

              {/* Desktop Search Bar */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <div className="relative w-full" ref={searchRef}>
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    className={`w-full pl-4 pr-12 py-2.5 rounded-xl border-2 transition-all duration-300 outline-none text-gray-700 ${
                      searchFocused
                        ? "border-purple-400 bg-white shadow-lg"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors">
                    <Search size={20} />
                  </button>
                  <SearchResults
                    results={searchResults}
                    loading={loading}
                    visible={showResults}
                    onResultClick={handleResultClick}
                  />
                </div>
              </div>

              {/* Desktop Nav Icons */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/cart"
                  className="relative text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="font-medium">Account</span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center gap-6">
                <Link
                  to="/cart"
                  className="relative text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Categories Bar */}
            <div className="hidden md:block border-t">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-8">
                  {["Computer", "Mobile", "Audio", "Wearable", "Drones"].map(
                    (category) => (
                      <Link
                        key={category}
                        to={`/${category.toLowerCase()}`}
                        className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <span className="font-medium">{category}</span>
                        <ChevronDown size={16} className="ml-1" />
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen" : "max-h-0"
          } overflow-hidden`}
        >
          {/* Mobile Search */}
          <div className="p-4 border-b">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="w-full pl-4 pr-12 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-purple-400 focus:bg-white transition-all text-black duration-300 outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </button>
              <SearchResults
                results={searchResults}
                loading={loading}
                visible={showResults && isOpen}
                onResultClick={handleResultClick}
              />
            </div>
          </div>

          {/* Mobile Links */}
          <div className="p-4 space-y-4">
            {["Computer", "Mobile", "Audio", "Wearable", "Drones"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block py-2 text-gray-600 hover:text-purple-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              )
            )}
            <div className="pt-4 border-t">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>My Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
