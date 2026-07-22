import { useState, useMemo } from "react";
import { SlidersHorizontal, Star, ShoppingBag, Check, Search } from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Shop({ search = "", setPage }) {
  const { addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [addedIds, setAddedIds] = useState({});

  const brands = useMemo(() => ["All", ...new Set(MOCK_PRODUCTS.map((p) => p.brand))], []);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchBrand = selectedBrand === "All" || p.brand === selectedBrand;
      const matchPrice = p.price <= maxPrice;
      const matchRating = p.rating >= minRating;
      return matchSearch && matchCat && matchBrand && matchPrice && matchRating;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.product_id - b.product_id;
    });
  }, [search, selectedCategory, selectedBrand, maxPrice, minRating, sortBy]);

  function handleAddToCart(product) {
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.product_id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.product_id]: false }));
    }, 1500);
  }

  return (
    <main className="section max-w-7xl">
      <div className="section-title">
        <div>
          <p>Product Catalog & Discovery</p>
          <h2>Explore Electronics & AI Devices</h2>
        </div>
        <span className="text-sm font-semibold text-slate-500">{filteredProducts.length} Products Found</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters Sidebar */}
        <aside className="h-fit rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-black/10 pb-3 dark:border-white/10">
            <h3 className="flex items-center gap-2 font-bold"><SlidersHorizontal size={18} /> Filters</h3>
            <button
              className="text-xs text-mint underline font-semibold"
              onClick={() => { setSelectedCategory("All"); setSelectedBrand("All"); setMaxPrice(1500); setMinRating(0); setSortBy("featured"); }}
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="mt-4">
            <label className="label mb-2">Category</label>
            <div className="space-y-1">
              <button
                className={`w-full rounded px-3 py-1.5 text-left text-sm font-medium transition ${selectedCategory === "All" ? "bg-mint/15 font-bold text-mint" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                onClick={() => setSelectedCategory("All")}
              >
                All Categories
              </button>
              {MOCK_CATEGORIES.map((c) => (
                <button
                  key={c.name}
                  className={`w-full rounded px-3 py-1.5 text-left text-sm font-medium transition ${selectedCategory === c.name ? "bg-mint/15 font-bold text-mint" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  onClick={() => setSelectedCategory(c.name)}
                >
                  {c.name} ({c.count})
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">
            <label className="label mb-2">Brand</label>
            <select
              className="input text-sm"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="label">Max Price</label>
              <span className="text-mint">${maxPrice}</span>
            </div>
            <input
              type="range"
              min={100}
              max={1500}
              step={50}
              className="w-full accent-mint"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          {/* Min Rating Filter */}
          <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">
            <label className="label mb-2">Minimum Rating</label>
            <div className="flex gap-1">
              {[0, 4, 4.5, 4.8].map((stars) => (
                <button
                  key={stars}
                  className={`flex-1 rounded py-1 text-xs font-bold border transition ${minRating === stars ? "border-mint bg-mint/15 text-mint" : "border-black/10 dark:border-white/10"}`}
                  onClick={() => setMinRating(stars)}
                >
                  {stars === 0 ? "Any" : `${stars}★`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid & Sorting */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {search && (
              <p className="text-sm">Search results for <strong className="text-mint">"{search}"</strong></p>
            )}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Sort by:</span>
              <select
                className="input w-auto text-xs py-1.5"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured AI Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {!filteredProducts.length ? (
            <div className="rounded-xl border border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-slate-900">
              <Search size={40} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-xl font-bold">No products match your filters</h3>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your price slider or selected category.</p>
              <button
                className="btn-primary mt-4"
                onClick={() => { setSelectedCategory("All"); setSelectedBrand("All"); setMaxPrice(1500); setMinRating(0); }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => {
                const discount = Math.round(((p.original_price - p.price) / p.original_price) * 100);
                return (
                  <div
                    key={p.product_id}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
                  >
                    {discount > 0 && (
                      <span className="absolute left-3 top-3 z-10 rounded bg-coral px-2 py-0.5 text-xs font-bold text-white shadow">
                        -{discount}% OFF
                      </span>
                    )}

                    <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{p.brand}</span>
                        <span className="flex items-center gap-1 font-semibold text-amber-500">
                          <Star size={13} fill="currentColor" /> {p.rating} ({p.reviews_count})
                        </span>
                      </div>

                      <h3 className="mt-2 font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{p.description}</p>

                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                        <div>
                          <span className="text-lg font-black text-mint">${p.price.toFixed(2)}</span>
                          {p.original_price > p.price && (
                            <span className="ml-2 text-xs text-slate-400 line-through">${p.original_price.toFixed(2)}</span>
                          )}
                        </div>

                        <button
                          className={`btn-primary py-1.5 px-3 text-xs ${addedIds[p.product_id] ? "bg-emerald-600" : ""}`}
                          onClick={() => handleAddToCart(p)}
                        >
                          {addedIds[p.product_id] ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add</>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
