import { useEffect, useState } from "react";
import { Package, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Orders({ setPage }) {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api("/orders").then((res) => {
        setOrders(Array.isArray(res) ? res : []);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <main className="section text-center py-16">
        <Package size={48} className="mx-auto text-slate-400 mb-3" />
        <h1 className="text-2xl font-black">Login Required</h1>
        <p className="text-sm text-slate-500 mt-1">Please log in to view your order history and live tracking details.</p>
        <button className="btn-primary mt-4" onClick={() => setPage("auth")}>Login to Your Account</button>
      </main>
    );
  }

  return (
    <main className="section max-w-5xl">
      <div className="section-title">
        <div>
          <p>Order Pipeline & Fulfillment</p>
          <h2>Order History & Live Tracking</h2>
        </div>
        <span className="text-sm font-semibold text-slate-500">{orders.length} Orders Placed</span>
      </div>

      {loading ? (
        <div className="text-center py-10 font-bold">Loading order database...</div>
      ) : !orders.length ? (
        <div className="rounded-xl border border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-slate-900">
          <Package size={40} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-xl font-bold">No orders placed yet</h3>
          <p className="text-sm text-slate-500 mt-1">Your confirmed purchases will appear here with live tracking numbers.</p>
          <button className="btn-primary mt-4" onClick={() => setPage("shop")}>Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.order_id} className="rounded-xl border border-black/10 bg-white p-5 shadow-sm space-y-3 dark:border-white/10 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between border-b border-black/10 pb-3 gap-2 dark:border-white/10">
                <div>
                  <strong className="text-base font-black">Order #{o.order_id}</strong>
                  <span className="ml-3 text-xs text-slate-500">{new Date(o.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-mint/15 px-2.5 py-1 text-xs font-bold text-mint">
                    <CheckCircle2 size={14} /> {o.status || "Processing"}
                  </span>
                  <span className="font-black text-mint text-base">₹{(o.total_amount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid gap-3 text-xs md:grid-cols-3 bg-slate-50 p-3 rounded-lg dark:bg-slate-800/60">
                <div>
                  <span className="text-slate-500 block font-semibold">Tracking Number:</span>
                  <span className="font-mono font-bold text-mint">{o.tracking_number || "TRK-98214152"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Estimated Delivery:</span>
                  <span>{o.estimated_delivery || "Within 3 Business Days"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Shipping Address:</span>
                  <span className="truncate block">{o.shipping_address?.street ? `${o.shipping_address.street}, ${o.shipping_address.city}` : "Standard Shipping"}</span>
                </div>
              </div>

              {Array.isArray(o.items) && o.items.length > 0 && (
                <div className="pt-1 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Items Purchased:</span>
                  <div className="flex flex-wrap gap-2">
                    {o.items.map((item, idx) => (
                      <span key={idx} className="rounded border border-black/10 px-2 py-1 text-xs font-semibold dark:border-white/10">
                        {item.name || `Product #${item.product_id}`} (x{item.quantity || 1})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
