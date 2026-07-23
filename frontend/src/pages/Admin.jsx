import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Database, ShieldCheck, Lock, Mail } from "lucide-react";
import MetricCard from "../components/MetricCard";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

const colors = ["#20c997", "#38bdf8", "#ff6b6b", "#f7b801", "#8b5cf6", "#14b8a6"];

export default function Admin() {
  const { user, persistSession } = useApp();
  const [overview, setOverview] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("analytics");
  const [adminEmail, setAdminEmail] = useState("admin@smartshop.ai");
  const [adminPass, setAdminPass] = useState("admin123");
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [draft, setDraft] = useState({ name: "", description: "", category: "Electronics", price: 14999, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80", stock: 20, rating: 4.5, tags: "ai,new" });

  async function load() {
    const [o, c, p, ord, r, pend] = await Promise.all([
      api("/admin/overview"), api("/admin/customers"), api("/admin/products"), api("/admin/orders"), api("/admin/reviews"), api("/admin/pending-products")
    ]);
    setOverview(o);
    setCustomers(Array.isArray(c) ? c : []);
    setProducts(Array.isArray(p) ? p : []);
    setOrders(Array.isArray(ord) ? ord : []);
    setReviews(Array.isArray(r) ? r : []);
    setPendingProducts(Array.isArray(pend) ? pend : []);
  }

  async function handleApprove(id) {
    await api("/admin/approve-product", { method: "POST", body: JSON.stringify({ id }) });
    await load();
  }

  async function handleReject(id) {
    await api("/admin/reject-product", { method: "POST", body: JSON.stringify({ id }) });
    await load();
  }

  useEffect(() => { if (user?.role === "admin") load(); }, [user]);

  async function handleAdminLoginSubmit(e) {
    e.preventDefault();
    setLoginError("");
    setLoadingLogin(true);
    try {
      const res = await api("/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({ email: adminEmail, password: adminPass })
      });
      persistSession(res);
      await load();
    } catch (err) {
      setLoginError(err.message || "Admin authentication failed.");
    } finally {
      setLoadingLogin(false);
    }
  }

  if (user?.role !== "admin") {
    return (
      <main className="grid min-h-[75vh] place-items-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500/20 text-indigo-500">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 className="text-xl font-black">Admin Portal Login Required</h1>
              <p className="text-xs text-slate-500">Log in with Administrator credentials to unlock control panel</p>
            </div>
          </div>

          {loginError && (
            <div className="mt-4 rounded bg-coral/10 p-3 text-xs font-bold text-coral">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Admin Email Address</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <Mail size={18} className="mr-2 text-slate-400" />
                <input
                  required
                  type="email"
                  className="w-full bg-transparent text-sm outline-none"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Security Passcode</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <Lock size={18} className="mr-2 text-slate-400" />
                <input
                  required
                  type="password"
                  className="w-full bg-transparent text-sm outline-none"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
              <strong>Admin Demo Credentials:</strong> admin@smartshop.ai / admin123
            </div>

            <button className="btn-primary mt-6 w-full justify-center" disabled={loadingLogin}>
              {loadingLogin ? "Authenticating Admin..." : "Log in as Administrator"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (!overview) return <main className="section"><h1 className="text-2xl font-black">Loading admin dashboard...</h1></main>;

  return (
    <main className="section">
      <div className="section-title">
        <div>
          <p>Operations & Database Dataset</p>
          <h2>Admin Control Panel & System Directory</h2>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn-secondary text-sm ${activeTab === "analytics" ? "border-mint text-mint" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics & Products
          </button>
          <button
            className={`btn-secondary text-sm ${activeTab === "pending" ? "border-amber-500 text-amber-500" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Approvals ({pendingProducts.length})
          </button>
          <button
            className={`btn-secondary text-sm ${activeTab === "customers" ? "border-mint text-mint" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <Database size={16} /> User Directory ({customers.length})
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total Revenue" value={`₹${overview.revenue}`} detail="+24% lift" />
        <MetricCard label="Registered Customers" value={customersList.length} detail="shoppers" tone="sky" />
        <MetricCard label="Company Owners" value={vendorsList.length} detail="sellers" tone="gold" />
        <MetricCard label="System Admins" value={adminsList.length} detail="administrators" tone="coral" />
      </div>

      {activeTab === "pending" ? (
        <section className="panel mt-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
            <div>
              <h3 className="panel-title mb-0">Company Owner Product Submissions ({pendingProducts.length})</h3>
              <p className="text-xs text-slate-500">Review products submitted by registered Company Owners before publishing to public store</p>
            </div>
            <button className="btn-secondary text-xs" onClick={load}>Refresh List</button>
          </div>

          {pendingProducts.length === 0 ? (
            <p className="py-12 text-center text-sm font-bold text-slate-500">🎉 No pending product approvals. All submitted products have been reviewed!</p>
          ) : (
            <div className="mt-4 space-y-4">
              {pendingProducts.map((p) => (
                <div key={p.product_id || p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="flex items-center gap-4">
                    <img src={p.image} alt={p.name} className="h-20 w-20 rounded-lg object-cover border border-black/10 dark:border-white/10" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">PENDING REVIEW</span>
                        <span className="text-xs font-bold text-slate-500">Submitted by: {p.company_name || p.brand || p.vendor_email} ({p.vendor_email})</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">{p.name}</h4>
                      <p className="text-xs text-slate-500">{p.category} • Price: ₹{Number(p.price).toLocaleString("en-IN")} • Stock: {p.stock} units</p>
                      {p.description && <p className="text-xs text-slate-400 mt-1 italic">"{p.description}"</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(p.product_id || p.id)}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                    >
                      Approve & Publish to Store
                    </button>
                    <button
                      onClick={() => handleReject(p.product_id || p.id)}
                      className="rounded-lg bg-red-600/10 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-600/20 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : activeTab === "customers" ? (
        <section className="panel mt-6">
          {/* Sub-Directory Selector Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-4 dark:border-white/10 gap-4">
            <div>
              <h3 className="panel-title mb-0">Categorized User Directory & Dataset</h3>
              <p className="text-xs text-slate-500">Separate database lists for Customers, Company Owners, and System Administrators</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => setDatasetFilter("customers")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${datasetFilter === "customers" ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                🛍️ Customers ({customersList.length})
              </button>
              <button
                onClick={() => setDatasetFilter("vendors")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${datasetFilter === "vendors" ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                🏢 Company Owners ({vendorsList.length})
              </button>
              <button
                onClick={() => setDatasetFilter("admins")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${datasetFilter === "admins" ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                🛡️ Admins ({adminsList.length})
              </button>
            </div>
          </div>

          {/* LIST 1: CUSTOMERS */}
          {datasetFilter === "customers" && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Registered Customer Directory</span>
                <button className="btn-primary text-xs" onClick={() => exportDataset(customersList, "customers_dataset.json")}>
                  <Download size={14} /> Export Customers Dataset
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-black/10 bg-slate-100 dark:border-white/10 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 font-bold">ID</th>
                      <th className="p-3 font-bold">Customer Name</th>
                      <th className="p-3 font-bold">Email</th>
                      <th className="p-3 font-bold">Mobile</th>
                      <th className="p-3 font-bold">Shipping Address</th>
                      <th className="p-3 font-bold">Total Orders</th>
                      <th className="p-3 font-bold">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersList.map((c) => (
                      <tr key={c.user_id || c.email} className="border-b border-black/5 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-mint">#{c.user_id || 101}</td>
                        <td className="p-3 font-bold">{c.name}</td>
                        <td className="p-3">{c.email}</td>
                        <td className="p-3 text-xs">{c.phone || "+91 9876543210"}</td>
                        <td className="p-3 text-xs text-slate-600 dark:text-slate-300">
                          {c.address?.street ? `${c.address.street}, ${c.address.city}, ${c.address.state}` : "Standard Shipping On File"}
                        </td>
                        <td className="p-3 font-bold">{c.ordersCount || 1}</td>
                        <td className="p-3 font-bold text-mint">₹{c.totalSpent ? c.totalSpent.toLocaleString("en-IN") : "16,999"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LIST 2: COMPANY OWNERS (VENDORS) */}
          {datasetFilter === "vendors" && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Registered Company Owners & Merchant Directory</span>
                <button className="btn-primary text-xs" onClick={() => exportDataset(vendorsList, "company_owners_dataset.json")}>
                  <Download size={14} /> Export Sellers Dataset
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-black/10 bg-indigo-950/20 text-indigo-400 dark:border-white/10 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 font-bold">Seller ID</th>
                      <th className="p-3 font-bold">Company / Brand Name</th>
                      <th className="p-3 font-bold">Owner Name</th>
                      <th className="p-3 font-bold">Business Email</th>
                      <th className="p-3 font-bold">Mobile</th>
                      <th className="p-3 font-bold">GSTIN / Reg ID</th>
                      <th className="p-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-xs text-slate-400">No company owners registered yet. Use Company Owner registration tab in Auth page to create seller accounts!</td>
                      </tr>
                    ) : (
                      vendorsList.map((v) => (
                        <tr key={v.user_id || v.email} className="border-b border-black/5 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-bold text-indigo-400">#VND-{v.user_id || Math.floor(1000 + Math.random() * 9000)}</td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{v.company_name || v.name}</td>
                          <td className="p-3">{v.name}</td>
                          <td className="p-3 font-medium">{v.email}</td>
                          <td className="p-3 text-xs">{v.phone || "+91 9876543210"}</td>
                          <td className="p-3 font-mono text-xs text-amber-500">{v.gstin || "29ABCDE1234F1Z5"}</td>
                          <td className="p-3">
                            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">Verified Seller</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LIST 3: SYSTEM ADMINISTRATORS */}
          {datasetFilter === "admins" && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">System Administrators & Privileged Personnel</span>
                <button className="btn-primary text-xs" onClick={() => exportDataset(adminsList, "administrators_dataset.json")}>
                  <Download size={14} /> Export Admins Dataset
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-black/10 bg-slate-100 dark:border-white/10 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 font-bold">Admin ID</th>
                      <th className="p-3 font-bold">Admin Name</th>
                      <th className="p-3 font-bold">Email</th>
                      <th className="p-3 font-bold">Role & Access Level</th>
                      <th className="p-3 font-bold">Security Passcode</th>
                      <th className="p-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminsList.map((a) => (
                      <tr key={a.user_id || a.email} className="border-b border-black/5 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-amber-500">#ADM-{a.user_id || "001"}</td>
                        <td className="p-3 font-bold">{a.name || "System Administrator"}</td>
                        <td className="p-3 font-medium">{a.email}</td>
                        <td className="p-3"><span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-400">Super Administrator</span></td>
                        <td className="p-3 font-mono text-xs text-slate-400">•••••••• (admin123)</td>
                        <td className="p-3"><span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
            <section className="panel">
              <h3 className="panel-title">Sales and behavior analytics (₹ INR)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview.categorySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
                    <XAxis dataKey="category" /><YAxis /><Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#20c997" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
            <section className="panel">
              <h3 className="panel-title">Recommendation performance</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie dataKey="value" data={[
                    { name: "CTR", value: overview.recommendationMetrics.ctr },
                    { name: "Lift", value: overview.recommendationMetrics.conversionLift },
                    { name: "Coverage", value: overview.recommendationMetrics.coverage }
                  ]} outerRadius={86}>
                    {colors.map((c) => <Cell key={c} fill={c} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <section className="panel">
              <h3 className="panel-title">Product management</h3>
              <form className="grid gap-3 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); api("/admin/products", { method: "POST", body: JSON.stringify(draft) }).then(load); }}>
                {["name", "category", "price", "stock", "rating", "tags"].map((field) => <input key={field} className="input" placeholder={field} value={draft[field]} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />)}
                <input className="input md:col-span-2" placeholder="image URL" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
                <input className="input md:col-span-2" placeholder="description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                <button className="btn-primary md:col-span-2">Add product</button>
              </form>
            </section>
            <section className="panel">
              <h3 className="panel-title">Orders and Review Moderation</h3>
              <div className="space-y-2 max-h-72 overflow-auto">
                {orders.map((o) => (
                  <div className="row-card" key={o.order_id || Math.random()}>
                    <span className="font-bold">Order #{o.order_id}</span>
                    <span className="text-xs text-slate-500">{o.user_email}</span>
                    <span className="font-bold text-mint">₹{(o.total_amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
