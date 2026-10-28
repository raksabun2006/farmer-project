import { useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router";
import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/farmer/Dashboard.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import NotFound from "../pages/NotFound.jsx";
import OrderConfirmationPage from "../pages/OrderConfirmationPage.jsx";
import ProductPage from "../pages/product/ProductPage.jsx";
import AboutPage from "../pages/about/AboutPage.jsx";
import ContactPage from "../pages/contact/ContactPage.jsx";
import AgribusinessNews from "../pages/news/AgribusinessNews.jsx";
import ProductDetail from "../pages/product/ProductDetail.jsx";
import CartPage from "../pages/cart/CartPage.jsx";
import { CartProvider } from "../context/CartContext.jsx";
import i18n from "../i18n/index.js";
// import ChatPage from "../pages/chat/ChatPage.jsx";
// import { AuthProvider } from "../context/AuthContext.jsx";

const LocalizedLayout = () => {
  const { locale } = useParams();

  useEffect(() => {
    if (locale === "en" || locale === "km") {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  if (locale !== "en" && locale !== "km") {
    return <Navigate to="/" replace />;
  }

  return <MainLayout />;
};

const AppRoutes = () => {
  return (
    // <AuthProvider>
    <CartProvider>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductPage/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<CartPage/>}/>
    <Route path="/about" element={<AboutPage/>} />
    <Route path="/contact" element={<ContactPage/>} />
    {/* <Route path="/chat" element={<ChatPage/>}/> */}
    <Route path="/news" element={<AgribusinessNews/>}/>
      
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage/>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_FARMER", "FARMER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/farmer" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/:locale" element={<LocalizedLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="news" element={<AgribusinessNews />} />
        <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="dashboard" element={<ProtectedRoute allowedRoles={["ROLE_FARMER", "FARMER"]}><Dashboard /></ProtectedRoute>} />
        <Route path="farmer" element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </CartProvider>
    // </AuthProvider>
  );
};

export default AppRoutes;
