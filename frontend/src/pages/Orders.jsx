import { useEffect, useState } from "react";
import { Package, CheckCircle2, FileText, ExternalLink, Printer } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";
import { generatePrintableInvoiceHtml } from "../lib/paymentService";

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

  function handleOpenInvoice(order) {
    const htmlContent = generatePrintableInvoiceHtml(order);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
    }
  }

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package size={48} className="mx-auto text-indigo-400 mb-3" />
        <h1 className="text-2xl font-black text-white">Login Required</h1>
        <p className="text-sm text-slate-400 mt-1">Please log in to view your order history, invoices, and live tracking details.</p>
        <button 
          className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-500/25 transition-all"
          onClick={() => setPage("auth")}
        >
          Login to Your Account
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Order Pipeline & Fulfillment</p>
          <h1 className="text-2xl font-black text-white">Order History & Live Invoices</h1>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          {orders.length} Total Orders
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm font-semibold animate-pulse">
          Loading live orders from database...
        </div>
      ) : !orders.length ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
          <Package size={40} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Your confirmed purchases will appear here with live tracking numbers and official tax invoices.
          </p>
          <button 
            className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-full shadow-lg transition-all"
            onClick={() => setPage("shop")}
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.order_id || o.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
              
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <strong className="text-base font-bold text-white">Order #{o.order_id || o.id}</strong>
                  <span className="ml-3 text-xs text-slate-400">{new Date(o.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 size={13} /> {o.status || "Processing"}
                  </span>
                  
                  <span className="font-extrabold text-indigo-400 text-base">
                    ₹{(o.total_amount || 0).toLocaleString('en-IN')}
                  </span>

                  {/* Print Invoice Button */}
                  <button
                    onClick={() => handleOpenInvoice(o)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition-colors"
                    title="View & Print Official PDF Tax Invoice"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-400" /> Invoice
                  </button>
                </div>
              </div>

              {/* Order Meta details */}
              <div className="grid gap-3 text-xs md:grid-cols-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block font-medium">Tracking Number:</span>
                  <span className="font-mono font-bold text-sky-400">{o.tracking_number || "TRK-EXP-99120"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Payment Method:</span>
                  <span className="font-semibold text-slate-200">{o.payment_method || "Credit Card (Test Mode)"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Delivery Address:</span>
                  <span className="truncate block text-slate-300">
                    {o.address?.street ? `${o.address.street}, ${o.address.city}` : "742 Evergreen Terrace, Springfield"}
                  </span>
                </div>
              </div>

              {/* Purchased Items List */}
              {Array.isArray(o.items) && o.items.length > 0 && (
                <div className="pt-1 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Items Purchased:</span>
                  <div className="flex flex-wrap gap-2">
                    {o.items.map((item, idx) => (
                      <span key={idx} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-200 flex items-center gap-2">
                        <span>{item.name || `Product #${item.product_id}`}</span>
                        <span className="text-indigo-400 font-bold">x{item.quantity || 1}</span>
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
