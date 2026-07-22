import { useState } from "react";
import { MapPin, Phone, User, CheckCircle, Truck } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Cart({ setPage }) {
  const { cart, setCart, user } = useApp();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [step, setStep] = useState("cart"); // "cart" | "address" | "success"
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    street: user?.address?.street || "742 Evergreen Terrace",
    city: user?.address?.city || "Springfield",
    state: user?.address?.state || "IL",
    zip: user?.address?.zip || "62704",
    phone: user?.address?.phone || "+1 (555) 019-2831"
  });
  const [loading, setLoading] = useState(false);

  async function handleProceed() {
    if (!user) return setPage("auth");
    setStep("address");
  }

  async function submitOrder(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map(({ product_id, quantity, price }) => ({ product_id, quantity, price })),
          total_amount: total,
          address: address
        })
      });
      setCart([]);
      setStep("success");
    } catch (err) {
      alert("Order placement failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section max-w-4xl">
      <div className="section-title">
        <div>
          <p>Checkout Pipeline</p>
          <h2>{step === "address" ? "Shipping Address & Customer Details" : step === "success" ? "Order Confirmed!" : "Shopping Cart"}</h2>
        </div>
        <span className="font-bold text-mint">${total.toFixed(2)}</span>
      </div>

      {step === "cart" && (
        <div>
          <div className="space-y-3">
            {!cart.length ? (
              <div className="rounded border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-slate-900">
                <p className="text-slate-500">Your shopping cart is empty.</p>
                <button className="btn-primary mt-4" onClick={() => setPage("shop")}>Browse Shop Catalog</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product_id} className="row-card">
                  <img src={item.image} className="h-14 w-14 rounded object-cover" alt={item.name} />
                  <div className="flex-1">
                    <strong className="block">{item.name}</strong>
                    <span className="text-xs text-slate-500">{item.category}</span>
                  </div>
                  <span className="font-semibold">Qty {item.quantity}</span>
                  <span className="font-bold text-mint">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button className="btn-primary" onClick={handleProceed}>
                Proceed to Shipping Address <Truck size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {step === "address" && (
        <form onSubmit={submitOrder} className="rounded border border-black/10 bg-white p-6 shadow-md dark:border-white/10 dark:bg-slate-900">
          <h3 className="text-lg font-bold">Fill Shipping Address & Contact Details</h3>
          <p className="mt-1 text-sm text-slate-500">Every customer detail is stored in the database dataset for fulfillment & tracking.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <User size={16} className="text-slate-400 mr-2" />
                <input required className="w-full bg-transparent text-sm outline-none" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Email Address (Mail Receipt Destination)</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <input required type="email" className="w-full bg-transparent text-sm outline-none" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Phone Number</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <Phone size={16} className="text-slate-400 mr-2" />
                <input required className="w-full bg-transparent text-sm outline-none" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Street Address</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <MapPin size={16} className="text-slate-400 mr-2" />
                <input required className="w-full bg-transparent text-sm outline-none" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">City</label>
              <input required className="input mt-1" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>

            <div>
              <label className="label">State / Province</label>
              <input required className="input mt-1" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            </div>

            <div>
              <label className="label">ZIP / Postal Code</label>
              <input required className="input mt-1" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
            <button type="button" className="btn-secondary" onClick={() => setStep("cart")}>Back to Cart</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Processing Database Order..." : "Confirm & Save Order to Database"}
            </button>
          </div>
        </form>
      )}

      {step === "success" && (
        <div className="rounded border border-mint/30 bg-mint/10 p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-mint mb-3" />
          <h3 className="text-2xl font-black">Order Confirmed & Saved to Database!</h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            A confirmation email has been sent to <strong>{address.email}</strong> and saved in your inbox.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button className="btn-primary" onClick={() => setPage("profile")}>View Inbox & Profile</button>
            <button className="btn-secondary" onClick={() => setPage("orders")}>View All Orders</button>
          </div>
        </div>
      )}
    </main>
  );
}
