import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Cart({ setPage }) {
  const { cart, setCart, user } = useApp();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function checkout() {
    if (!user) return setPage("auth");
    await api("/orders", { method: "POST", body: JSON.stringify({ items: cart.map(({ product_id, quantity }) => ({ product_id, quantity })) }) });
    setCart([]);
    setPage("orders");
  }

  return (
    <main className="section">
      <div className="section-title"><div><p>Checkout</p><h2>Cart</h2></div><span>${total.toFixed(2)}</span></div>
      <div className="space-y-3">
        {cart.map((item) => <div key={item.product_id} className="row-card"><img src={item.image} className="h-14 w-14 rounded object-cover" /><strong className="flex-1">{item.name}</strong><span>Qty {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}
      </div>
      <button className="btn-primary mt-6" disabled={!cart.length} onClick={checkout}>Place order</button>
    </main>
  );
}
