import { useEffect, useState } from "react";
import Header from "./components/Header";
import ProductModal from "./components/ProductModal";
import { AppProvider, useApp } from "./context/AppContext";
import { api } from "./lib/api";
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
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);

  async function loadHome() {
    setTrending(await api("/ai/trending"));
    if (user) setRecommendations(await api("/ai/recommendations"));
    else setRecommendations([]);
  }

  useEffect(() => { loadHome(); }, [user?.user_id]);

  const pages = {
    home: <Home recommendations={recommendations} trending={trending} onOpen={setSelected} setPage={setPage} />,
    shop: <Shop search={search} onOpen={setSelected} />,
    auth: <Auth setPage={setPage} />,
    profile: <Profile />,
    orders: <Orders />,
    cart: <Cart setPage={setPage} />,
    wishlist: <Wishlist onOpen={setSelected} />,
    admin: <Admin />
  };

  return (
    <div className="min-h-screen bg-slate-50 text-ink transition dark:bg-ink dark:text-white">
      <Header page={page} setPage={setPage} setSearch={setSearch} />
      {pages[page] || pages.home}
      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500">SmartShop AI combines collaborative filtering, content similarity, and live commerce signals in one production-ready reference app.</footer>
      <ProductModal product={selected} onClose={() => setSelected(null)} onOpen={setSelected} />
    </div>
  );
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>;
}
