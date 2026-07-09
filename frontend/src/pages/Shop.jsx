import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { api } from "../lib/api";

export default function Shop({ search, onOpen }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: "", max_price: "", min_rating: "" });

  useEffect(() => { api("/categories").then(setCategories); }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    api(`/products?${params.toString()}`).then(setProducts);
  }, [search, filters]);

  const activeCopy = useMemo(() => search ? `Results for "${search}"` : "All products", [search]);

  return (
    <main className="section">
      <div className="section-title"><div><p>Catalog</p><h2>{activeCopy}</h2></div><span>{products.length} matching products</span></div>
      <div className="filters">
        <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
        </select>
        <input className="input" type="number" placeholder="Max price" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
        <select className="input" value={filters.min_rating} onChange={(e) => setFilters({ ...filters, min_rating: e.target.value })}>
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.product_id} product={product} onOpen={onOpen} />)}
      </div>
    </main>
  );
}
