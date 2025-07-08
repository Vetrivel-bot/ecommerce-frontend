import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./routes/Home";
import Product from "./routes/Product";
import Computer from "./routes/Computer";
import Drones from "./routes/Drones";
import Audio from "./routes/Audio";
import Mobiles from "./routes/Mobiles";
import Wearable from "./routes/wearable";
import Sale from "./routes/Sale";
import Profile from "./routes/profile";
import Login from "./routes/login";
import AdminProduct from "./routes/AdminProduct";
import Cart from "./routes/Cart";
import Logout from "./routes/logout";
import NotFoundPage from "./routes/404";
const App = () => {
  return (
    <>
      <Navbar />

      <div className="flex  mt-17  md:mt-30 lg:mt-40 flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Computer" element={<Computer />} />
            <Route path="/Drones" element={<Drones />} />
            <Route path="/Audio" element={<Audio />} />
            <Route path="/Mobile" element={<Mobiles />} />
            <Route path="/Wearable" element={<Wearable />} />
            <Route path="/Sale" element={<Sale />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/adminproduct/:id" element={<AdminProduct />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
