import { useEffect, useState } from "react";
import { PlusCircle, Building2, Package, CheckCircle2, Clock, XCircle, TrendingUp, DollarSign, Image as ImageIcon, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function MerchantPortal({ setPage }) {
  const { user } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    brand: user?.company_name || "My Brand",
    price: 4999,
    original_price: 6999,
    stock: 15,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80",
    description: "",
    tags: "electronics, new"
  });

  async function loadVendorProducts() {
    setLoading(true);
    try {
      const res = await api("/vendor/products");
      setProducts(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error loading vendor products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.email) {
      loadVendorProducts();
    }
  }, [user]);

  async function handleAddProduct(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        vendor_email: user?.email,
        vendor_name: user?.name,
        company_name: user?.company_name || form.brand
      };

      await api("/vendor/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setMsg("🎉 Product submitted successfully! Sent to System Admin for verification & approval.");
      setForm({
        name: "",
        category: "Electronics",
        brand: user?.company_name || "My Brand",
        price: 4999,
        original_price: 6999,
        stock: 15,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80",
        description: "",
        tags: "electronics, new"
      });
      await loadVendorProducts();
    } catch (err) {
      setError(err.message || "Failed to submit product.");
    } finally {
      setSubmitting(false);
    }
  }

  const approvedCount = products.filter(p => p.status === "approved" || !p.status).length;
  const pendingCount = products.filter(p => p.status === "pending_approval").length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * (Number(p.stock) || 1)), 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Company Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl border border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Building2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                Verified Seller / Company
              </span>
            </div>
            <h1 className="text-2xl font-black">{user?.company_name || user?.name || "Merchant Enterprise"}</h1>
            <p className="text-xs text-slate-400">Account: {user?.email} | GSTIN: {user?.gstin || "N/A"}</p>
          </div>
        </div>
        <button
          onClick={() => setPage("home")}
          className="mt-4 md:mt-0 rounded-lg bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
        >
          View Public Store Catalog
        </button>
      </div>

      {/* Seller Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Live Products</span>
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{approvedCount}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pending Admin Review</span>
            <Clock size={20} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-500">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Inventory Valuation</span>
            <DollarSign size={20} className="text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">₹{totalValue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Add New Product Form */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-black/10 pb-4 dark:border-white/10">
              <PlusCircle className="text-indigo-500" size={22} />
              <h2 className="text-lg font-black">List New Product</h2>
            </div>

            {msg && (
              <div className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                {msg}
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-xs font-bold text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="mt-4 space-y-4">
              <div>
                <label className="label">Product Title *</label>
                <input
                  required
                  className="input mt-1"
                  placeholder="e.g. UltraBook Pro 16 AI Laptop"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category *</label>
                  <select
                    className="input mt-1"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>Electronics</option>
                    <option>Audio</option>
                    <option>Wearables</option>
                    <option>Smart Home</option>
                    <option>Accessories</option>
                    <option>Fashion</option>
                  </select>
                </div>
                <div>
                  <label className="label">Brand / Company *</label>
                  <input
                    required
                    className="input mt-1"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Selling Price (₹) *</label>
                  <input
                    required
                    type="number"
                    className="input mt-1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Original Price (₹)</label>
                  <input
                    type="number"
                    className="input mt-1"
                    value={form.original_price}
                    onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Stock Units *</label>
                  <input
                    required
                    type="number"
                    className="input mt-1"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Image URL *</label>
                <input
                  required
                  className="input mt-1 text-xs"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  rows={3}
                  className="input mt-1"
                  placeholder="Describe your product features..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Sparkles size={16} />
                {submitting ? "Submitting for Approval..." : "Submit Product to Admin for Review"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Company Inventory & Approval Status */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Package className="text-indigo-500" size={22} />
                <h2 className="text-lg font-black">My Company Inventory ({products.length})</h2>
              </div>
              <button
                onClick={loadVendorProducts}
                className="text-xs font-bold text-indigo-500 hover:underline"
              >
                Refresh List
              </button>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-slate-500">Loading company products...</p>
            ) : products.length === 0 ? (
              <div className="py-12 text-center">
                <Package size={40} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No products listed yet.</p>
                <p className="text-xs text-slate-400 mt-1">Use the form on the left to list your first product!</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {products.map((p) => {
                  const status = p.status || "approved";
                  return (
                    <div
                      key={p.product_id || p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-black/10 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-16 w-16 rounded-lg object-cover border border-black/10 dark:border-white/10"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h3>
                          <p className="text-xs text-slate-500">{p.category} • Brand: {p.brand}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs font-bold">
                            <span className="text-indigo-600 dark:text-indigo-400">₹{Number(p.price).toLocaleString("en-IN")}</span>
                            <span className="text-slate-500">Stock: {p.stock} units</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        {status === "approved" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                            <CheckCircle2 size={13} /> Approved & Live
                          </span>
                        )}
                        {status === "pending_approval" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 border border-amber-500/20">
                            <Clock size={13} /> Pending Admin Review
                          </span>
                        )}
                        {status === "rejected" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 border border-red-500/20">
                            <XCircle size={13} /> Rejected by Admin
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">ID: #{p.product_id}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
