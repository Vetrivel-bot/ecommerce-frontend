import { useEffect, useState, useMemo } from "react";
import AdminCard from "../components/adminCard";
import AddCard from "../components/addCard";
import { useNavigate } from "react-router-dom";
import useFetchhook from "../hooks/useFetchhook";
import { LogOut, User, Mail, Shield } from "lucide-react";

const URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const navigate = useNavigate();

  const fetchOptions = useMemo(
    () => ({ method: "GET", credentials: "include" }),
    []
  );

  const {
    data: profile,
    loading: sessionLoading,
    error: sessionError,
  } = useFetchhook("/profile", fetchOptions);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (profile && profile.user.role === "admin") {
      const fetchData = async () => {
        try {
          const res = await fetch(`${URL}/products`);
          const data = await res.json();
          setProducts(data);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };
      fetchData();
      const interval = setInterval(fetchData, 2000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-pulse flex flex-col items-center text-gray-300">
          <div className="w-24 h-24 bg-gray-700 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (sessionError) {
    navigate("/login");
    return null;
  }

  if (profile) {
    const { role } = profile.user;
    if (role === "admin") {
      return (
        <>
          <div className="py-8 bg-gray-900 border-b border-gray-800 sticky top-0 z-10 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <h1 className="text-3xl text-gray-200 font-bold">Admin Panel</h1>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                onClick={() => {
                  navigate("/logout");
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <section className="bg-gray-800 min-h-screen">
            <div className="min-w-full justify-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:grid-cols-5 p-4">
              <AddCard />
              {products.map((product) => (
                <AdminCard
                  key={product._id}
                  id={product._id}
                  image={product.image}
                  title={product.title}
                  badge={product.badge}
                  price={product.price}
                  tags={product.tags}
                />
              ))}
            </div>
          </section>
        </>
      );
    } else {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <User size={48} className="text-gray-800" />
              </div>
              <h1 className="text-3xl font-bold text-white">{profile.user.username}</h1>
              <p className="text-blue-200 mt-1">{role}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg animate-fade-in transition-all duration-300 hover:bg-gray-600">
                <User className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Username</p>
                  <p className="text-gray-200 font-medium">{profile.user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg animate-fade-in transition-all duration-300 hover:bg-gray-600" style={{ animationDelay: "0.1s" }}>
                <Mail className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-gray-200 font-medium">{profile.user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg animate-fade-in transition-all duration-300 hover:bg-gray-600" style={{ animationDelay: "0.2s" }}>
                <Shield className="text-blue-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-gray-200 font-medium capitalize">{profile.user.role}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700">
              <button 
                onClick={() => navigate("/logout")}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default Profile;