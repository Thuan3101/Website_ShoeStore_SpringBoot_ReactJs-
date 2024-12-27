import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./component/index/index";
import ProductDetail from "./component/product-detail/product-detail";
import Register from "./component/Register/Register";
import Cart from "./component/cart/Cart";
import Checkout from "./component/Checkout/Checkout";
import Collections from "./component/collections/collections";
import AdminDashboard from "./component/AdminDashboard/AdminDashboard";
import AddProduct from "./component/AddProduct/AddProduct";
import UserManagement from "./component/UserManagement/UserManagement";
import ProductManagement from "./component/ProductManagement/ProductManagement";
import AddEditUser from "./component/AddEditUser/AddEditUser";
import CategoryManagement from "./component/CategoryManagement/CategoryManagement";
import ProductCategoryManagement from "./component/ProductCategoryManagement/ProductCategoryManagement";
import EditProduct from "./component/EditProduct/EditProduct";
import OrderManagement from "./component/OrderManagement/OrderManagement";
import OrderDetails from "./component/OrderDetails/OrderDetails";
import Account from "./component/Account/Account";
import UserOrderDetails from "./component/Account/OrderDetails";
import SearchResults from "./component/index/SearchResults";
import Login from "./component/Login/Login";
import FogotPassword from "./component/Login/FogotPassword";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [tokenReady, setTokenReady] = useState(false); // New state to track token readiness

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("http://localhost:8088/api/v1/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      });

      const newAccessToken = response.data.token;
      localStorage.setItem("token", newAccessToken);
      setTokenReady(true); // Token is now ready
      // After refreshing the token, fetch the index message immediately
      fetchIndexMessage(newAccessToken); // Pass new token to fetch message
    } catch (error) {
      console.error("Failed to refresh token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/"; // Redirect to login page
    }
  };

  // Function to fetch the index message
  const fetchIndexMessage = async (currentToken) => {
    const token = currentToken || localStorage.getItem("token");
    if (!token) {
      setMessage("Bạn chưa đăng nhập.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8088/index", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response from server:", response.data);
      const responseMessage = response.data?.message || response.data;
      setMessage(typeof responseMessage === 'string' ? responseMessage : "Đã xảy ra lỗi không xác định.");
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle API error responses
  const handleApiError = (error) => {
    if (error.response) {
      console.error("Error response:", error.response);
      if (error.response.status === 401) {
        setMessage("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      } else {
        setMessage(`Đã xảy ra lỗi. Mã lỗi: ${error.response.status}`);
        window.location.href = "/";
      }
    } else {
      console.error("Error:", error);
      setMessage("Đã xảy ra lỗi không xác định.");
    }
  };

  // Check and refresh token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const tokenExpiration = payload.exp * 1000;

      if (Date.now() > tokenExpiration) {
        // Token expired, refresh it
        refreshAccessToken();
      } else {
        // Token is valid, set token ready
        setTokenReady(true);
        // Fetch the message immediately if token is valid
        fetchIndexMessage(token);
      }
    } else {
      setTokenReady(true); // No token, proceed without one
    }
  }, []);

  // Fetch message when token is ready
  useEffect(() => {
    if (tokenReady) {
      const intervalId = setInterval(() => fetchIndexMessage(), 360000); // Refresh every 60 seconds

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [tokenReady]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage message={message} setMessage={setMessage} />} />
        <Route path="/product-detail/:slug" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<FogotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/collections/:slug" element={<Collections />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/product-management" element={<ProductManagement />} />
        <Route path="/admin/add-edit-user" element={<AddEditUser />} />
        <Route path="/admin/category-management" element={<CategoryManagement />} />
        <Route path="/admin/product-category-management" element={<ProductCategoryManagement />} />
        <Route path="/admin/edit-product/:slug" element={<EditProduct />} />
        <Route path="/admin/order-management" element={<OrderManagement />} />
        <Route path="/admin/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/order-details/:orderId" element={<UserOrderDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
