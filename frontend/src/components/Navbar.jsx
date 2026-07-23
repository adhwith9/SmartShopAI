import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Sparkles, 
  LogOut, 
  LayoutDashboard, 
  PackageCheck,
  ChevronDown
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../lib/api";

export default function Navbar({ page, setPage }) {
  const { user, cartItems, wishlist, logout, theme, toggleTheme } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Live AI Search Autocomplete
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await api(`/ai/suggestions?q=${encodeURIComponent(searchQuery)}`);
          setSuggestions(Array.isArray(res) ? res : []);
        } catch (e) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const cartCount = cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 dark:bg-slate-950/90 border-b border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setPage("home"); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                SmartShop <span className="text-indigo-400">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-indigo-400/80 -mt-1">
                Next-Gen Shopping
              </span>
            </div>
          </div>

          {/* Center Search Bar with AI Autocomplete */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, brands or AI recommendations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (page !== "shop") setPage("shop"); }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-100 placeholder-slate-400 rounded-full border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 border-b border-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> AI Search Matches
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.product_id}
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                      setPage("shop");
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.category} • {item.brand}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-400">₹{item.price?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation Items & Icons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setPage("home")}
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
                page === "home" ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setPage("shop")}
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
                page === "shop" ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              Store
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Dark / Light Theme"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setPage("wishlist")}
              className="relative p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setPage("cart")}
              className="relative p-2 text-slate-300 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-full transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user.name || user.email.split("@")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setPage("profile"); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-400" /> Account Profile
                    </button>
                    <button
                      onClick={() => { setPage("orders"); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-emerald-400" /> My Orders & Invoices
                    </button>
                    {(user.role === "vendor" || user.company_name) && (
                      <button
                        onClick={() => { setPage("vendor"); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Seller Portal
                      </button>
                    )}
                    {user.role === "admin" && (
                      <button
                        onClick={() => { setPage("admin"); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-400" /> Admin Dashboard
                      </button>
                    )}
                    <div className="my-1 border-t border-slate-800"></div>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); setPage("home"); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setPage("auth")}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-full shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105"
              >
                <User className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setPage("cart")}
              className="relative p-2 text-slate-300 hover:text-white"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setPage("shop")}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800 text-slate-100 rounded-xl border border-slate-700"
            />
          </div>
          <button onClick={() => { setPage("home"); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm text-slate-200 font-medium hover:bg-slate-800 rounded-lg">Home</button>
          <button onClick={() => { setPage("shop"); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm text-slate-200 font-medium hover:bg-slate-800 rounded-lg">Store Catalog</button>
          <button onClick={() => { setPage("wishlist"); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm text-slate-200 font-medium hover:bg-slate-800 rounded-lg">Wishlist ({wishlist.length})</button>
          {user ? (
            <>
              <button onClick={() => { setPage("orders"); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm text-slate-200 font-medium hover:bg-slate-800 rounded-lg">My Orders & Invoices</button>
              <button onClick={() => { setPage("profile"); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm text-slate-200 font-medium hover:bg-slate-800 rounded-lg">Account Settings</button>
              {user.role === "admin" && <button onClick={() => { setPage("admin"); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm text-amber-400 font-medium hover:bg-slate-800 rounded-lg">Admin Panel</button>}
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 text-sm text-rose-400 font-medium hover:bg-slate-800 rounded-lg">Sign Out ({user.email})</button>
            </>
          ) : (
            <button onClick={() => { setPage("auth"); setMobileMenuOpen(false); }} className="w-full text-center py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 rounded-xl">Sign In / Register</button>
          )}
        </div>
      )}
    </header>
  );
}
