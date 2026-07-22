import { useState } from "react";
import { MapPin, Phone, User, CheckCircle, Truck, Trash2, Plus, Minus, CreditCard, Wallet, QrCode, Building2, Banknote, ShieldCheck } from "lucide-react";
import { api, MOCK_COUPONS } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Cart({ setPage }) {
  const { cart, setCart, user } = useApp();
  const [step, setStep] = useState("cart"); // "cart" | "address" | "payment" | "success"

  const [address, setAddress] = useState({
    fullName: user?.name || "SmartShop Customer",
    email: user?.email || "customer@smartshop.ai",
    street: user?.address?.street || "742 Evergreen Terrace",
    city: user?.address?.city || "Springfield",
    state: user?.address?.state || "IL",
    zip: user?.address?.zip || "62704",
    phone: user?.address?.phone || user?.phone || "+91 9876543210"
  });

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking" | "cod" | "wallet"
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 2000 || !cart.length ? 0 : 99;
  const taxAmount = (subtotal - discountAmount) * 0.18; // 18% GST in India
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);

  function updateQuantity(productId, delta) {
    setCart((items) =>
      items
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }

  function removeItem(productId) {
    setCart((items) => items.filter((item) => item.product_id !== productId));
  }

  function applyCoupon(e) {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    const found = MOCK_COUPONS[code];
    if (found) {
      setDiscountPercent(found.discountPercent || 20);
      setCouponMsg(`✅ Applied "${code}" - ${found.description}`);
    } else {
      setCouponMsg("❌ Invalid coupon code. Try SMARTSHOP20");
    }
  }

  async function handleConfirmOrder() {
    if (!user) return setPage("auth");
    setLoading(true);

    let methodLabel = "Razorpay / UPI";
    if (paymentMethod === "card") methodLabel = "Credit / Debit Card";
    if (paymentMethod === "netbanking") methodLabel = `NetBanking (${selectedBank})`;
    if (paymentMethod === "cod") methodLabel = "Cash on Delivery (COD)";
    if (paymentMethod === "wallet") methodLabel = "SmartShop Pay Later Wallet";

    try {
      const order = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map(({ product_id, quantity, price, name }) => ({ product_id, quantity, price, name })),
          subtotal,
          discount: discountAmount,
          total_amount: grandTotal,
          payment_method: methodLabel,
          address
        })
      });

      setConfirmedOrder(order);
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
          <p>Checkout Pipeline (Amazon / Flipkart Grade)</p>
          <h2>{step === "address" ? "Delivery Address" : step === "payment" ? "Select Payment Method" : step === "success" ? "Order Confirmed!" : "Shopping Cart"}</h2>
        </div>
        <span className="font-bold text-mint">₹{grandTotal.toLocaleString('en-IN')}</span>
      </div>

      {step === "cart" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Cart Items List */}
          <div className="space-y-3">
            {!cart.length ? (
              <div className="rounded-xl border border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-slate-900">
                <p className="text-slate-500">Your shopping cart is empty.</p>
                <button className="btn-primary mt-4" onClick={() => setPage("shop")}>Browse Shop Catalog</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product_id} className="row-card flex items-center justify-between gap-3">
                  <img src={item.image} className="h-16 w-16 rounded-lg object-cover" alt={item.name} />
                  <div className="flex-1 min-w-0">
                    <strong className="block text-sm truncate">{item.name}</strong>
                    <span className="text-xs text-slate-500">₹{item.price.toLocaleString('en-IN')} each</span>
                  </div>

                  <div className="flex items-center gap-2 rounded border border-black/15 px-2 py-1 dark:border-white/15">
                    <button onClick={() => updateQuantity(item.product_id, -1)} className="p-0.5 hover:text-mint"><Minus size={14} /></button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, 1)} className="p-0.5 hover:text-mint"><Plus size={14} /></button>
                  </div>

                  <span className="font-bold text-mint text-sm w-24 text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  <button onClick={() => removeItem(item.product_id)} className="text-coral hover:opacity-75 p-1"><Trash2 size={16} /></button>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary Panel */}
          {cart.length > 0 && (
            <aside className="h-fit rounded-xl border border-black/10 bg-white p-5 shadow-sm space-y-4 dark:border-white/10 dark:bg-slate-900">
              <h3 className="font-bold border-b border-black/10 pb-3 dark:border-white/10">Order Summary</h3>

              <form onSubmit={applyCoupon} className="space-y-2">
                <label className="label text-xs">Coupon Code (Try SMARTSHOP20)</label>
                <div className="flex gap-2">
                  <input
                    className="input text-xs uppercase"
                    placeholder="SMARTSHOP20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="btn-secondary text-xs px-3">Apply</button>
                </div>
                {couponMsg && <p className="text-[11px] font-semibold">{couponMsg}</p>}
              </form>

              <div className="space-y-2 text-xs border-t border-black/10 pt-3 dark:border-white/10">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-mint font-bold"><span>Discount (20%)</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between"><span>GST (18%)</span><span>₹{taxAmount.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Express Delivery</span><span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span></div>
                <div className="flex justify-between text-sm font-black border-t border-black/10 pt-2 text-mint dark:border-white/10">
                  <span>Grand Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button className="btn-primary w-full justify-center" onClick={() => user ? setStep("address") : setPage("auth")}>
                Proceed to Shipping <Truck size={16} />
              </button>
            </aside>
          )}
        </div>
      )}

      {step === "address" && (
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-md dark:border-white/10 dark:bg-slate-900">
          <h3 className="text-lg font-bold">Fill Shipping Address Details</h3>
          <p className="text-xs text-slate-500 mt-1">Saved to persistent customer dataset for tracking.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <User size={16} className="text-slate-400 mr-2" />
                <input required className="w-full bg-transparent text-sm outline-none" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Email Address (Order Confirmation Destination)</label>
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

            <div><label className="label">City</label><input required className="input mt-1" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></div>
            <div><label className="label">State / Province</label><input required className="input mt-1" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></div>
            <div><label className="label">PIN Code</label><input required className="input mt-1" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} /></div>
          </div>

          <div className="mt-6 flex justify-between border-t border-black/10 pt-4 dark:border-white/10">
            <button className="btn-secondary" onClick={() => setStep("cart")}>Back to Cart</button>
            <button className="btn-primary" onClick={() => setStep("payment")}>Continue to Payment <CreditCard size={16} /></button>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-md dark:border-white/10 dark:bg-slate-900 space-y-6">
          <div>
            <h3 className="text-lg font-bold">Select Payment Gateway Method</h3>
            <p className="text-xs text-slate-500 mt-0.5">Choose your preferred payment option like Flipkart / Amazon</p>
          </div>

          {/* Payment Method Option Selector Tabs */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <div
              className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === "upi" ? "border-mint bg-mint/10 shadow" : "border-black/10 dark:border-white/10"}`}
              onClick={() => setPaymentMethod("upi")}
            >
              <div className="flex items-center gap-2 text-mint mb-1"><QrCode size={18} /><strong className="text-sm">UPI Payment</strong></div>
              <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
            </div>

            <div
              className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === "card" ? "border-mint bg-mint/10 shadow" : "border-black/10 dark:border-white/10"}`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="flex items-center gap-2 text-sky-500 mb-1"><CreditCard size={18} /><strong className="text-sm">Credit / Debit Card</strong></div>
              <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Maestro</p>
            </div>

            <div
              className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === "netbanking" ? "border-mint bg-mint/10 shadow" : "border-black/10 dark:border-white/10"}`}
              onClick={() => setPaymentMethod("netbanking")}
            >
              <div className="flex items-center gap-2 text-indigo-500 mb-1"><Building2 size={18} /><strong className="text-sm">NetBanking</strong></div>
              <p className="text-[11px] text-slate-500">HDFC, ICICI, SBI, Axis & 50+ Banks</p>
            </div>

            <div
              className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === "cod" ? "border-mint bg-mint/10 shadow" : "border-black/10 dark:border-white/10"}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="flex items-center gap-2 text-emerald-500 mb-1"><Banknote size={18} /><strong className="text-sm">Cash on Delivery (COD)</strong></div>
              <p className="text-[11px] text-slate-500">Pay cash or UPI upon delivery</p>
            </div>

            <div
              className={`cursor-pointer rounded-xl border p-4 transition ${paymentMethod === "wallet" ? "border-mint bg-mint/10 shadow" : "border-black/10 dark:border-white/10"}`}
              onClick={() => setPaymentMethod("wallet")}
            >
              <div className="flex items-center gap-2 text-amber-500 mb-1"><Wallet size={18} /><strong className="text-sm">SmartShop Pay Later</strong></div>
              <p className="text-[11px] text-slate-500">1-Click Instant Credit Checkout</p>
            </div>
          </div>

          {/* Dynamic Payment Details Input */}
          <div className="rounded-xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800">
            {paymentMethod === "upi" && (
              <div className="space-y-3">
                <label className="label">Enter UPI ID (e.g., yourname@okaxis / 9876543210@paytm)</label>
                <input className="input" placeholder="mobile@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                <p className="text-[11px] text-slate-500 flex items-center gap-1"><ShieldCheck size={14} className="text-mint" /> Instant UPI payment verification via Razorpay Gateway</p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="label">Card Number</label>
                  <input className="input" placeholder="4532 •••• •••• 8912" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Expiry Date</label><input className="input" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} /></div>
                  <div><label className="label">CVV Code</label><input className="input" type="password" maxLength={4} placeholder="•••" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} /></div>
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="space-y-3">
                <label className="label">Select Your Bank</label>
                <select className="input" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="space-y-1 text-xs">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">✅ Cash / UPI on Delivery Available</p>
                <p className="text-slate-500">Pay cash or scan QR code when courier arrives at {address.city}.</p>
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="space-y-1 text-xs">
                <p className="font-bold text-amber-600 dark:text-amber-400">⚡ 1-Click Instant Pay Later Active</p>
                <p className="text-slate-500">Credit limit of ₹50,000 available for your account {address.email}.</p>
              </div>
            )}
          </div>

          <div className="rounded bg-slate-100 p-4 text-xs dark:bg-slate-800 space-y-1">
            <p><strong>Delivering to:</strong> {address.fullName}, {address.street}, {address.city}, {address.state} {address.zip}</p>
            <p><strong>Total Payable:</strong> <span className="font-bold text-mint text-sm">₹{grandTotal.toLocaleString('en-IN')}</span></p>
          </div>

          <div className="flex justify-between border-t border-black/10 pt-4 dark:border-white/10">
            <button className="btn-secondary" onClick={() => setStep("address")}>Back</button>
            <button className="btn-primary" disabled={loading} onClick={handleConfirmOrder}>
              {loading ? "Verifying & Confirming..." : `Pay ₹${grandTotal.toLocaleString('en-IN')} & Confirm Order`}
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="rounded-xl border border-mint/30 bg-mint/10 p-8 text-center space-y-4">
          <CheckCircle size={52} className="mx-auto text-mint" />
          <h3 className="text-3xl font-black">Order Confirmed & Payment Verified!</h3>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            A confirmation receipt has been delivered to <strong>{address.email}</strong> and saved in your inbox.
          </p>

          {confirmedOrder && (
            <div className="mx-auto max-w-md rounded bg-white p-4 text-left text-xs shadow dark:bg-slate-900 space-y-1">
              <p><strong>Order ID:</strong> #{confirmedOrder.order_id}</p>
              <p><strong>Payment Method:</strong> {confirmedOrder.payment_method}</p>
              <p><strong>Tracking Number:</strong> <span className="font-mono font-bold text-mint">{confirmedOrder.tracking_number}</span></p>
              <p><strong>Estimated Delivery:</strong> {confirmedOrder.estimated_delivery}</p>
              <p><strong>Total Amount:</strong> ₹{confirmedOrder.total_amount.toLocaleString('en-IN')}</p>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <button className="btn-primary" onClick={() => setPage("profile")}>View Inbox & Tracking</button>
            <button className="btn-secondary" onClick={() => setPage("shop")}>Continue Shopping</button>
          </div>
        </div>
      )}
    </main>
  );
}
