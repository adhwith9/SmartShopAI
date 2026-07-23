import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { logoutSession } from "../lib/authService";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("smartshop_theme") || "dark");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("smartshop_user") || "null"));
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("smartshop_cart") || "[]"));
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("smartshop_wishlist") || "[]"));
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("smartshop_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("smartshop_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("smartshop_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function toggleTheme() {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }

  function persistSession(payload) {
    if (payload && payload.token && payload.user) {
      localStorage.setItem("smartshop_token", payload.token);
      localStorage.setItem("smartshop_user", JSON.stringify(payload.user));
      setUser(payload.user);
    }
  }

  async function login(email, password) {
    const res = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    persistSession(res);
    return res;
  }

  async function register(form) {
    const res = await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
    persistSession(res);
    return res;
  }

  function logout() {
    logoutSession();
    setUser(null);
  }

  async function addToCart(product) {
    setCart((items) => {
      const found = items.find((item) => item.product_id === product.product_id);
      return found 
        ? items.map((item) => item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item) 
        : [...items, { ...product, quantity: 1 }];
    });
    if (user) await api("/cart", { method: "POST", body: JSON.stringify({ product_id: product.product_id }) });
  }

  function updateCartQuantity(productId, newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      setCart((items) => items.map(item => item.product_id === productId ? { ...item, quantity: newQty } : item));
    }
  }

  function removeFromCart(productId) {
    setCart((items) => items.filter(item => item.product_id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  function toggleWishlist(product) {
    setWishlist((items) => {
      const exists = items.some(item => item.product_id === product.product_id);
      return exists 
        ? items.filter(item => item.product_id !== product.product_id) 
        : [...items, product];
    });
  }

  function rememberProduct(product) {
    setRecentlyViewed((items) => [product, ...items.filter((item) => item.product_id !== product.product_id)].slice(0, 6));
  }

  const value = useMemo(() => ({
    theme, 
    setTheme, 
    toggleTheme, 
    user, 
    setUser, 
    persistSession, 
    login, 
    register, 
    logout, 
    cart, 
    cartItems: cart, 
    setCart, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    wishlist, 
    toggleWishlist, 
    recentlyViewed, 
    rememberProduct
  }), [theme, user, cart, wishlist, recentlyViewed]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
