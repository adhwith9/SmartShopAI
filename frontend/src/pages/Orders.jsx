import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Orders() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  useEffect(() => { if (user) api("/orders").then(setOrders); }, [user]);
  if (!user) return <main className="section"><h1 className="text-2xl font-black">Login to view order history.</h1></main>;
  return (
    <main className="section">
      <div className="section-title"><div><p>Purchases</p><h2>Order history</h2></div></div>
      <div className="space-y-3">
        {orders.map((order) => <div key={order.order_id} className="row-card"><strong>Order #{order.order_id}</strong><span>${order.total_amount.toFixed(2)}</span><span>{order.status}</span></div>)}
      </div>
    </main>
  );
}
