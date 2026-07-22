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
  const [activeTab, setActiveTab] = useState("analytics");
  const [adminEmail, setAdminEmail] = useState("admin@smartshop.ai");
  const [adminPass, setAdminPass] = useState("admin123");
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [draft, setDraft] = useState({ name: "", description: "", category: "Electronics", price: 14999, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80", stock: 20, rating: 4.5, tags: "ai,new" });

  async function load() {
    const [o, c, p, ord, r] = await Promise.all([
      api("/admin/overview"), api("/admin/customers"), api("/admin/products"), api("/admin/orders"), api("/admin/reviews")
    ]);
    setOverview(o); setCustomers(Array.isArray(c) ? c : []); setProducts(Array.isArray(p) ? p : []); setOrders(Array.isArray(ord) ? ord : []); setReviews(Array.isArray(r) ? r : []);
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

  function exportCustomerDataset() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "smartshop_customer_dataset.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <main className="section">
      <div className="section-title">
        <div>
          <p>Operations & Database Dataset</p>
          <h2>Admin Control Panel & Customer Dataset</h2>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn-secondary text-sm ${activeTab === "analytics" ? "border-mint text-mint" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics & Products
          </button>
          <button
            className={`btn-secondary text-sm ${activeTab === "customers" ? "border-mint text-mint" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <Database size={16} /> Customer Dataset ({customers.length})
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Revenue" value={`₹${overview.revenue}`} detail="+24% lift" />
        <MetricCard label="Total Customers" value={customers.length || overview.users} detail="in dataset" tone="sky" />
        <MetricCard label="Total Orders" value={orders.length || overview.orders} detail="processed" tone="gold" />
        <MetricCard label="Products" value={products.length || overview.products} detail="catalog SKUs" tone="coral" />
      </div>

      {activeTab === "customers" ? (
        <section className="panel mt-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
            <div>
              <h3 className="panel-title mb-0">Saved Customer Dataset & Directory</h3>
              <p className="text-xs text-slate-500">Every customer registration, contact email, address, and purchase record stored in the database</p>
            </div>
            <button className="btn-primary text-sm" onClick={exportCustomerDataset}>
              <Download size={16} /> Export Dataset (JSON)
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 bg-slate-100 dark:border-white/10 dark:bg-slate-800">
                <tr>
                  <th className="p-3 font-bold">ID</th>
                  <th className="p-3 font-bold">Customer Name</th>
                  <th className="p-3 font-bold">Email</th>
                  <th className="p-3 font-bold">Role</th>
                  <th className="p-3 font-bold">Shipping Address</th>
                  <th className="p-3 font-bold">Total Orders</th>
                  <th className="p-3 font-bold">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.user_id} className="border-b border-black/5 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-mint">#{c.user_id}</td>
                    <td className="p-3 font-bold">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3"><span className="rounded bg-mint/15 px-2 py-0.5 text-xs font-bold text-mint">{c.role}</span></td>
                    <td className="p-3 text-xs text-slate-600 dark:text-slate-300">
                      {c.address?.street ? `${c.address.street}, ${c.address.city}, ${c.address.state}` : "Standard Shipping On File"}
                    </td>
                    <td className="p-3 font-bold">{c.orders_count || 1}</td>
                    <td className="p-3 font-bold text-mint">₹{(c.total_spent || 16999).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
