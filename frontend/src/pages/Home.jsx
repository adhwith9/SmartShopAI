import { Sparkles, ShieldCheck, Truck, Headphones, ArrowRight, Star, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Home({ setPage }) {
  const { addToCart, user } = useApp();
  const [addedIds, setAddedIds] = useState({});

  function handleAddToCart(product) {
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.product_id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.product_id]: false }));
    }, 1500);
  }

  return (
    <main className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-ink to-slate-900 py-16 px-6 text-white rounded-3xl mx-4 my-4 shadow-2xl">
        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-4 py-1 text-xs font-bold text-mint uppercase tracking-wider">
            <Sparkles size={14} /> AI Recommendation Engine Enabled
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Next-Gen Smart Shopping Platform
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
            Experience personalized AI recommendations, passwordless email OTP verification, fast checkout, and persistent customer data synchronization.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="btn-primary px-7 py-3 text-base" onClick={() => setPage("shop")}>
              Explore Product Catalog <ArrowRight size={18} />
            </button>
            <button className="btn-secondary px-7 py-3 text-base text-white border-white/20 hover:bg-white/10" onClick={() => setPage("auth")}>
              {user ? `Welcome back, ${user.name}` : "Login with Email OTP"}
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-mint/15 text-mint"><Truck size={20} /></div>
            <div><strong className="block text-sm">Free Express Shipping</strong><span className="text-xs text-slate-500">Orders over $50</span></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-500/15 text-sky-500"><ShieldCheck size={20} /></div>
            <div><strong className="block text-sm">2-Year AI Warranty</strong><span className="text-xs text-slate-500">100% Guaranteed</span></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500/15 text-amber-500"><Headphones size={20} /></div>
            <div><strong className="block text-sm">24/7 AI Support</strong><span className="text-xs text-slate-500">Instant Customer Care</span></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500"><Sparkles size={20} /></div>
            <div><strong className="block text-sm">Persistent Dataset</strong><span className="text-xs text-slate-500">Saved Database Sync</span></div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-6">
          <div><p className="text-xs font-bold text-mint uppercase">Categories</p><h2 className="text-2xl font-black">Shop by Category</h2></div>
          <button className="text-sm font-bold text-mint hover:underline" onClick={() => setPage("shop")}>View All Categories</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="cursor-pointer group rounded-xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
              onClick={() => setPage("shop")}
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-mint">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.count} Premium SKUs</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Recommendation Engine Showcase */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-6">
          <div><p className="text-xs font-bold text-mint uppercase">Personalized Engine</p><h2 className="text-2xl font-black">🔥 Trending AI Recommended Deals</h2></div>
          <button className="text-sm font-bold text-mint hover:underline" onClick={() => setPage("shop")}>Explore All</button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRODUCTS.slice(0, 3).map((p) => (
            <div key={p.product_id} className="group relative flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:shadow-lg dark:border-white/10 dark:bg-slate-900">
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{p.brand}</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-500"><Star size={13} fill="currentColor" /> {p.rating}</span>
                </div>
                <h3 className="mt-2 font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{p.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                  <span className="text-lg font-black text-mint">${p.price.toFixed(2)}</span>
                  <button className="btn-primary py-1.5 px-3 text-xs" onClick={() => handleAddToCart(p)}>
                    {addedIds[p.product_id] ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Cart</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
