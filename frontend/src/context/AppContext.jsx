import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("smartshop_theme") || "light");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("smartshop_user") || "null"));
  const [cart, setCart] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("smartshop_theme", theme);
  }, [theme]);

  function persistSession(payload) {
    localStorage.setItem("smartshop_token", payload.token);
    localStorage.setItem("smartshop_user", JSON.stringify(payload.user));
    setUser(payload.user);
  }

  async function login(email, password) {
    persistSession(await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }));
  }

  async function register(form) {
    persistSession(await api("/auth/register", { method: "POST", body: JSON.stringify(form) }));
  }

  function logout() {
    localStorage.removeItem("smartshop_token");
    localStorage.removeItem("smartshop_user");
    setUser(null);
  }

  async function addToCart(product) {
    setCart((items) => {
      const found = items.find((item) => item.product_id === product.product_id);
      return found ? items.map((item) => item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }];
    });
    if (user) await api("/cart", { method: "POST", body: JSON.stringify({ product_id: product.product_id }) });
  }

  function rememberProduct(product) {
    setRecentlyViewed((items) => [product, ...items.filter((item) => item.product_id !== product.product_id)].slice(0, 6));
  }

  const value = useMemo(() => ({
    theme, setTheme, user, login, register, logout, cart, setCart, addToCart, recentlyViewed, rememberProduct
  }), [theme, user, cart, recentlyViewed]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
