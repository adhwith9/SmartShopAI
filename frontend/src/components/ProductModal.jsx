import { X, Star, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";
import ProductCard from "./ProductCard";

export default function ProductModal({ product, onClose, onOpen }) {
  const { user, addToCart, rememberProduct } = useApp();
  const [detail, setDetail] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!product) return;
    api(`/products/${product.product_id}${user ? `?user_id=${user.user_id}` : ""}`).then((data) => {
      setDetail(data);
      rememberProduct(data.product);
    });
  }, [product?.product_id]);

  if (!product) return null;
  const item = detail?.product || product;

  async function review() {
    if (!comment.trim()) return;
    await api("/reviews", { method: "POST", body: JSON.stringify({ product_id: item.product_id, rating: 5, comment }) });
    setComment("");
    setDetail(await api(`/products/${item.product_id}`));
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded bg-white p-4 shadow-2xl dark:bg-slate-950 md:p-6">
        <div className="flex justify-end"><button className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
          <img src={item.image} alt={item.name} className="aspect-square w-full rounded object-cover" />
          <div>
            <p className="text-sm font-bold uppercase text-mint">{item.category}</p>
            <h2 className="mt-2 text-3xl font-black">{item.name}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{item.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <strong className="text-3xl">${item.price.toFixed(2)}</strong>
              <span className="flex items-center gap-1 text-gold"><Star size={18} fill="currentColor" /> {item.rating}</span>
              <span className="text-sm text-slate-500">{item.stock} in stock</span>
            </div>
            <button className="btn-primary mt-5" onClick={() => addToCart(item)}><ShoppingCart size={18} /> Add to cart</button>
            <div className="mt-8">
              <h3 className="font-bold">Ratings and reviews</h3>
              <div className="mt-3 space-y-2">
                {(detail?.reviews || []).map((r) => <p key={r.review_id} className="rounded bg-slate-100 p-3 text-sm dark:bg-white/10">{r.comment}</p>)}
              </div>
              {user && <div className="mt-3 flex gap-2"><input className="input" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a quick review" /><button className="btn-secondary" onClick={review}>Post</button></div>}
            </div>
          </div>
        </div>
        <h3 className="mt-8 font-bold">Similar products</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(detail?.similar || []).slice(0, 3).map(({ product: similar }) => <ProductCard key={similar.product_id} product={similar} onOpen={onOpen} />)}
        </div>
      </section>
    </div>
  );
}
