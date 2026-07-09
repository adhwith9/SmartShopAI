import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, TrendingUp } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

export default function Home({ recommendations, trending, onOpen, setPage }) {
  const { recentlyViewed, user } = useApp();
  const heroProducts = recommendations.length ? recommendations.map((r) => r.product) : trending;

  return (
    <main>
      <section className="hero-band">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.05fr_.95fr] md:py-16">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="self-center">
            <div className="inline-flex items-center gap-2 rounded bg-white/85 px-3 py-2 text-sm font-bold text-ink shadow-sm"><Sparkles size={16} /> Hybrid recommendation engine</div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">SmartShop AI</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-700 dark:text-slate-200">
              AI-powered personalized recommendations for e-commerce platforms, tuned by browsing history, purchases, ratings, preferences, and real-time behavior signals.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => setPage("shop")}>Explore products</button>
              <button className="btn-secondary" onClick={() => setPage(user ? "admin" : "auth")}>{user?.role === "admin" ? "Open dashboard" : "Try demo login"}</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="hero-visual">
            <div className="ai-grid">
              {(heroProducts.slice(0, 4)).map((product) => (
                <button key={product.product_id} onClick={() => onOpen(product)} className="ai-tile">
                  <img src={product.image} alt={product.name} />
                  <span>{product.name}</span>
                </button>
              ))}
            </div>
            <div className="signal-card"><BrainCircuit /> Preference prediction active</div>
            <div className="signal-card bottom"><TrendingUp /> Trending detection live</div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <div><p>Personalized</p><h2>Recommended for you</h2></div>
          <span>{recommendations.length ? "Collaborative + content-based scores" : "Login to unlock user-specific ranking"}</span>
        </div>
        <div className="product-row">
          {heroProducts.slice(0, 8).map((product) => <ProductCard key={product.product_id} product={product} onOpen={onOpen} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-title"><div><p>Live demand</p><h2>Trending now</h2></div><span>Weighted by views, carts, purchases, and ratings</span></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.slice(0, 4).map((product) => <ProductCard key={product.product_id} product={product} onOpen={onOpen} />)}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="section">
          <div className="section-title"><div><p>Session memory</p><h2>Recently viewed</h2></div></div>
          <div className="product-row">{recentlyViewed.map((product) => <ProductCard key={product.product_id} product={product} onOpen={onOpen} />)}</div>
        </section>
      )}
    </main>
  );
}
