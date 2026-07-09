import { Bot, Heart, Moon, Search, ShoppingBag, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Header({ page, setPage, setSearch }) {
  const { theme, setTheme, user, logout, cart } = useApp();
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setSuggestions(q.length > 1 ? await api(`/ai/suggestions?q=${encodeURIComponent(q)}`) : []);
    }, 220);
    return () => clearTimeout(timer);
  }, [q]);

  function submit(event) {
    event.preventDefault();
    setSearch(q);
    setPage("shop");
    setSuggestions([]);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/86 backdrop-blur-xl dark:border-white/10 dark:bg-ink/88">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <button className="flex items-center gap-2 font-black tracking-tight" onClick={() => setPage("home")}>
          <span className="grid h-10 w-10 place-items-center rounded bg-ink text-mint dark:bg-white"><Bot size={22} /></span>
          <span className="text-lg">SmartShop AI</span>
        </button>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto text-sm md:order-none md:w-auto md:flex-1 md:justify-center">
          {["home", "shop", "orders", "profile"].map((item) => (
            <button key={item} onClick={() => setPage(item)} className={`nav-btn ${page === item ? "active" : ""}`}>
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
          {user?.role === "admin" && <button onClick={() => setPage("admin")} className={`nav-btn ${page === "admin" ? "active" : ""}`}>Admin</button>}
        </nav>
        <form onSubmit={submit} className="relative min-w-0 flex-1 md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Smart search" className="input pl-9" />
          {suggestions.length > 0 && (
            <div className="absolute mt-2 w-full overflow-hidden rounded border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900">
              {suggestions.map((item) => (
                <button key={item.product_id} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => { setSearch(item.name); setPage("shop"); setSuggestions([]); }}>
                  <img src={item.image} className="h-9 w-9 rounded object-cover" />
                  <span className="truncate text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </form>
        <button className="icon-btn" title="Wishlist" onClick={() => setPage("wishlist")}><Heart size={18} /></button>
        <button className="icon-btn relative" title="Cart" onClick={() => setPage("cart")}><ShoppingBag size={18} /><span className="badge">{cart.length}</span></button>
        <button className="icon-btn" title="Theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        {user ? (
          <button className="btn-secondary" onClick={logout}>Logout</button>
        ) : (
          <button className="btn-primary" onClick={() => setPage("auth")}><UserRound size={17} /> Login</button>
        )}
      </div>
    </header>
  );
}
