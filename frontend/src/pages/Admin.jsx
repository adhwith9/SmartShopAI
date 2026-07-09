import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../components/MetricCard";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

const colors = ["#20c997", "#38bdf8", "#ff6b6b", "#f7b801", "#8b5cf6", "#14b8a6"];

export default function Admin() {
  const { user } = useApp();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [draft, setDraft] = useState({ name: "", description: "", category: "Electronics", price: 99, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80", stock: 20, rating: 4.5, tags: "ai,new" });

  async function load() {
    const [o, u, p, ord, r] = await Promise.all([
      api("/admin/overview"), api("/admin/users"), api("/admin/products"), api("/admin/orders"), api("/admin/reviews")
    ]);
    setOverview(o); setUsers(u); setProducts(p); setOrders(ord); setReviews(r);
  }

  useEffect(() => { if (user?.role === "admin") load(); }, [user]);
  if (user?.role !== "admin") return <main className="section"><h1 className="text-2xl font-black">Admin login required.</h1></main>;
  if (!overview) return <main className="section"><h1 className="text-2xl font-black">Loading dashboard...</h1></main>;

  async function createProduct(event) {
    event.preventDefault();
    await api("/admin/products", { method: "POST", body: JSON.stringify({ ...draft, price: Number(draft.price), stock: Number(draft.stock), rating: Number(draft.rating) }) });
    await load();
  }

  async function deleteProduct(productId) {
    await api(`/admin/products/${productId}`, { method: "DELETE" });
    await load();
  }

  async function moderate(reviewId, status) {
    await api(`/admin/reviews/${reviewId}`, { method: "PUT", body: JSON.stringify({ status }) });
    await load();
  }

  return (
    <main className="section">
      <div className="section-title"><div><p>Operations</p><h2>Admin dashboard</h2></div><span>{overview.recommendationMetrics.model}</span></div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Revenue" value={`$${overview.revenue}`} detail="+24% lift" />
        <MetricCard label="Users" value={overview.users} detail="registered" tone="sky" />
        <MetricCard label="Orders" value={overview.orders} detail="active pipeline" tone="gold" />
        <MetricCard label="Products" value={overview.products} detail="catalog SKUs" tone="coral" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <section className="panel">
          <h3 className="panel-title">Sales and behavior analytics</h3>
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
          <form className="grid gap-3 md:grid-cols-2" onSubmit={createProduct}>
            {["name", "category", "price", "stock", "rating", "tags"].map((field) => <input key={field} className="input" placeholder={field} value={draft[field]} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} />)}
            <input className="input md:col-span-2" placeholder="image URL" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
            <input className="input md:col-span-2" placeholder="description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            <button className="btn-primary md:col-span-2">Add product</button>
          </form>
          <div className="mt-4 max-h-72 space-y-2 overflow-auto">
            {products.map((product) => <div key={product.product_id} className="row-card"><strong className="flex-1">{product.name}</strong><span>{product.stock} left</span><button className="btn-danger" onClick={() => deleteProduct(product.product_id)}>Delete</button></div>)}
          </div>
        </section>
        <section className="panel">
          <h3 className="panel-title">Users, orders, and moderation</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div><h4 className="font-bold">Users</h4>{users.slice(0, 5).map((u) => <p className="mini-row" key={u.user_id}>{u.name}<span>{u.role}</span></p>)}</div>
            <div><h4 className="font-bold">Orders</h4>{orders.slice(0, 5).map((o) => <p className="mini-row" key={o.order_id}>#{o.order_id}<span>{o.status}</span></p>)}</div>
          </div>
          <h4 className="mt-5 font-bold">Review moderation</h4>
          <div className="space-y-2">
            {reviews.map((review) => <div className="row-card" key={review.review_id}><span className="flex-1">{review.comment}</span><button className="btn-secondary" onClick={() => moderate(review.review_id, review.status === "published" ? "hidden" : "published")}>{review.status}</button></div>)}
          </div>
        </section>
      </div>

      <section className="panel mt-6">
        <h3 className="panel-title">Inventory management</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {overview.lowStock.map((product) => <div key={product.product_id} className="rounded bg-coral/10 p-4"><strong>{product.name}</strong><p className="text-sm">{product.stock} units remaining</p></div>)}
        </div>
      </section>
    </main>
  );
}
