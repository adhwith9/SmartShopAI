import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductModal from "./components/ProductModal";
import { AppProvider, useApp } from "./context/AppContext";
import { api, MOCK_PRODUCTS } from "./lib/api";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";

function Shell() {
  const { user } = useApp();
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState(MOCK_PRODUCTS);

  async function loadHomeData() {
    try {
      const trendingRes = await api("/ai/trending");
      setTrending(Array.isArray(trendingRes) && trendingRes.length ? trendingRes : MOCK_PRODUCTS);
      if (user) {
        const recRes = await api("/ai/recommendations");
        setRecommendations(Array.isArray(recRes) ? recRes : []);
      } else {
        setRecommendations([]);
      }
    } catch (e) {
      setTrending(MOCK_PRODUCTS);
      setRecommendations([]);
    }
  }

  useEffect(() => { 
    loadHomeData(); 
  }, [user?.email]);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home recommendations={recommendations} trending={trending} onOpen={setSelectedProduct} setPage={setPage} />;
      case "shop":
        return <Shop search="" onOpen={setSelectedProduct} />;
      case "auth":
        return <Auth setPage={setPage} />;
      case "profile":
        return <Profile setPage={setPage} />;
      case "orders":
        return <Orders setPage={setPage} />;
      case "cart":
        return <Cart setPage={setPage} />;
      case "wishlist":
        return <Wishlist onOpen={setSelectedProduct} />;
      case "admin":
        return <Admin />;
      default:
        return <Home recommendations={recommendations} trending={trending} onOpen={setSelectedProduct} setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar page={page} setPage={setPage} />
      
      <main className="flex-1">
        {renderPage()}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 px-4 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">SmartShop AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise AI-powered shopping platform combining real-time recommendations, Supabase cloud persistence, and native Android APK support.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setPage("home")} className="hover:text-indigo-400 transition-colors">Home Page</button></li>
              <li><button onClick={() => setPage("shop")} className="hover:text-indigo-400 transition-colors">Store Catalog</button></li>
              <li><button onClick={() => setPage("cart")} className="hover:text-indigo-400 transition-colors">Shopping Cart</button></li>
              <li><button onClick={() => setPage("wishlist")} className="hover:text-indigo-400 transition-colors">Saved Wishlist</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setPage("orders")} className="hover:text-indigo-400 transition-colors">Track Orders & Invoices</button></li>
              <li><button onClick={() => setPage("profile")} className="hover:text-indigo-400 transition-colors">Account Settings</button></li>
              <li><a href="mailto:support@smartshop.ai" className="hover:text-indigo-400 transition-colors">Email Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">Technology Stack</h4>
            <p className="text-xs text-slate-400">
              React + Vite • Tailwind CSS • Supabase Postgres • Capacitor Android • Nodemailer • Razorpay
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 SmartShop AI Inc. All rights reserved. Production-ready reference build.
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOpen={setSelectedProduct} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
