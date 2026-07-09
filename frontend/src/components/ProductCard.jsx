import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function ProductCard({ product, onOpen }) {
  const { user, addToCart } = useApp();
  async function wishlist() {
    if (user) await api("/wishlist", { method: "POST", body: JSON.stringify({ product_id: product.product_id }) });
  }

  return (
    <motion.article layout whileHover={{ y: -4 }} className="product-card">
      <button onClick={() => onOpen(product)} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden rounded">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-xs font-bold text-ink">{product.category}</span>
        </div>
        <div className="mt-4">
          <h3 className="line-clamp-1 font-bold">{product.name}</h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500 dark:text-slate-400">{product.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-black">${product.price.toFixed(2)}</span>
            <span className="flex items-center gap-1 text-sm font-semibold text-gold"><Star size={16} fill="currentColor" /> {product.rating}</span>
          </div>
        </div>
      </button>
      <div className="mt-4 flex gap-2">
        <button className="btn-primary flex-1" onClick={() => addToCart(product)}><ShoppingCart size={17} /> Add</button>
        <button className="icon-btn" onClick={wishlist} title="Add to wishlist"><Heart size={18} /></button>
      </div>
    </motion.article>
  );
}
