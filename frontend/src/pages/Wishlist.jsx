import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Wishlist({ onOpen }) {
  const { user } = useApp();
  const [items, setItems] = useState([]);
  useEffect(() => { if (user) api("/wishlist").then(setItems); }, [user]);
  if (!user) return <main className="section"><h1 className="text-2xl font-black">Login to save products to your wishlist.</h1></main>;
  return (
    <main className="section">
      <div className="section-title"><div><p>Saved</p><h2>Wishlist</h2></div></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((product) => <ProductCard key={product.product_id} product={product} onOpen={onOpen} />)}</div>
    </main>
  );
}
