import { useState } from "react";
import { Mail, KeyRound, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Lock, UserPlus, Phone, MapPin, Building2 } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Auth({ setPage }) {
  const { persistSession } = useApp();
  const [authMode, setAuthMode] = useState("customer"); // "customer" | "vendor" | "admin"
  const [customerMode, setCustomerMode] = useState("login"); // "login" | "register"

  // Registration Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // OTP Verification State
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [sentOtpCode, setSentOtpCode] = useState("");

  // Admin Login Credentials State
  const [adminEmail, setAdminEmail] = useState("admin@smartshop.ai");
  const [adminPass, setAdminPass] = useState("admin123");

  const [infoMsg, setInfoMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      return setError("Please enter a valid email address.");
    }
    setLoading(true);

    try {
      const res = await api("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      setSentOtpCode(res.otp || "742918");
      setInfoMsg(`🔑 Verification OTP sent to ${email}. Check code below & inbox!`);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    if (!otp || otp.length < 4) {
      return setError("Please enter the 6-digit verification code.");
    }
    setLoading(true);

    try {
      const role = authMode === "vendor" ? "vendor" : "customer";
      const res = await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          name: name || email.split("@")[0],
          phone,
          companyName,
          gstin,
          role,
          address: { fullName: name || email.split("@")[0], street, city, state, zip, phone }
        })
      });

      // Override role if signing up as vendor
      if (res && res.user) {
        res.user.role = role;
        res.user.company_name = companyName;
      }

      persistSession(res);
      setPage(role === "vendor" ? "vendor" : "home");
    } catch (err) {
      setError(err.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api("/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({ email: adminEmail, password: adminPass })
      });

      persistSession(res);
      setPage("admin");
    } catch (err) {
      setError(err.message || "Admin authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[80vh] place-items-center px-4 py-10">
      <div className="w-full max-w-lg rounded-xl border border-black/10 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        {/* Main Portal Switcher */}
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800 mb-6">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition ${authMode === "customer" ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            onClick={() => { setAuthMode("customer"); setError(""); setInfoMsg(""); }}
          >
            <UserCheck size={15} /> Customer
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition ${authMode === "vendor" ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            onClick={() => { setAuthMode("vendor"); setError(""); setInfoMsg(""); }}
          >
            <Building2 size={15} /> Company Owner
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition ${authMode === "admin" ? "bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            onClick={() => { setAuthMode("admin"); setError(""); setInfoMsg(""); }}
          >
            <ShieldCheck size={15} /> Admin
          </button>
        </div>

        {authMode === "customer" || authMode === "vendor" ? (
          <div>
            {/* Customer / Vendor Login Header */}
            <div className="flex justify-between items-center border-b border-black/10 pb-3 mb-5 dark:border-white/10">
              <div>
                <h1 className="text-xl font-black">
                  {authMode === "vendor"
                    ? customerMode === "login" ? "Company Owner Login" : "Register Your Company / Brand"
                    : customerMode === "login" ? "Customer Login" : "Create Customer Account"}
                </h1>
                <p className="text-xs text-slate-500">
                  {authMode === "vendor"
                    ? "List products, manage inventory & track seller earnings"
                    : "Access personalized AI shopping & order tracking"}
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-mint hover:underline flex items-center gap-1"
                onClick={() => { setCustomerMode(customerMode === "login" ? "register" : "login"); setStep("email"); setError(""); }}
              >
                {customerMode === "login"
                  ? <><UserPlus size={14} /> {authMode === "vendor" ? "Register Company" : "Create Account"}</>
                  : <><UserCheck size={14} /> {authMode === "vendor" ? "Seller Login" : "Existing Login"}</>}
              </button>
            </div>

            {infoMsg && (
              <div className="mt-4 rounded border border-mint/30 bg-mint/10 p-3 text-xs font-bold text-mint flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{infoMsg}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded bg-coral/10 p-3 text-xs font-bold text-coral">
                {error}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
                {(customerMode === "register" || authMode === "vendor") && (
                  <>
                    {authMode === "vendor" && (
                      <div>
                        <label className="label">Company / Brand Name *</label>
                        <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                          <Building2 size={16} className="mr-2 text-indigo-400" />
                          <input
                            required
                            className="w-full bg-transparent text-sm outline-none"
                            placeholder="e.g. Nexus Tech Ltd / Brand Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="label">{authMode === "vendor" ? "Company Owner Full Name *" : "Full Name *"}</label>
                      <input
                        required
                        className="input mt-1"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">{authMode === "vendor" ? "Business Mobile Number *" : "Mobile Number *"}</label>
                      <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                        <Phone size={16} className="mr-2 text-slate-400" />
                        <input
                          required
                          className="w-full bg-transparent text-sm outline-none"
                          placeholder="+91 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    {authMode === "vendor" && (
                      <div>
                        <label className="label">GSTIN / Business Reg Number (Optional)</label>
                        <input
                          className="input mt-1 text-xs"
                          placeholder="e.g. 29ABCDE1234F1Z5"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="label">{authMode === "vendor" ? "Business Email Address *" : "Email Address *"}</label>
                  <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                    <Mail size={18} className="mr-2 text-slate-400" />
                    <input
                      required
                      type="email"
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="owner@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {customerMode === "register" && authMode === "customer" && (
                  <div className="space-y-3 pt-2 border-t border-black/10 dark:border-white/10">
                    <label className="label text-xs font-bold text-slate-500 uppercase">Default Delivery Address (Optional)</label>
                    <div>
                      <input className="input" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input className="input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                      <input className="input" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                      <input className="input" placeholder="PIN Code" value={zip} onChange={(e) => setZip(e.target.value)} />
                    </div>
                  </div>
                )}

                <button className="btn-primary mt-6 w-full justify-center" disabled={loading}>
                  {loading ? "Generating OTP..." : authMode === "vendor" ? "Send Seller Verification OTP" : customerMode === "register" ? "Create Account & Send Verification OTP" : "Send Login Verification OTP"} <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
                <div className="rounded bg-slate-100 p-3 dark:bg-slate-800 text-xs">
                  <span className="font-semibold text-slate-500">Email:</span> <strong className="text-mint">{email}</strong>
                  <button type="button" className="ml-2 font-bold underline" onClick={() => setStep("email")}>Change</button>
                </div>

                {sentOtpCode && (
                  <div className="rounded border border-mint/40 bg-mint/15 p-3 text-center">
                    <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Generated OTP Code:</span>
                    <span className="text-2xl font-black tracking-widest text-mint">{sentOtpCode}</span>
                    <p className="mt-1 text-[11px] text-slate-500">Delivered to your database email inbox</p>
                  </div>
                )}

                <div>
                  <label className="label">Enter 6-Digit Verification Code</label>
                  <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                    <KeyRound size={18} className="mr-2 text-slate-400" />
                    <input
                      required
                      maxLength={6}
                      className="w-full bg-transparent text-lg font-bold tracking-widest outline-none"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>

                <button className="btn-primary mt-6 w-full justify-center" disabled={loading}>
                  {loading ? "Verifying..." : authMode === "vendor" ? "Verify OTP & Enter Seller Portal" : "Verify OTP & Complete Setup"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-500/20 text-indigo-500">
                <Lock size={22} />
              </div>
              <div>
                <h1 className="text-xl font-black">Admin Console Access</h1>
                <p className="text-xs text-slate-500">Authorized personnel & dataset export portal</p>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded bg-coral/10 p-3 text-xs font-bold text-coral">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="mt-5 space-y-4">
              <div>
                <label className="label">Admin Email</label>
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

              <div className="rounded bg-amber-500/10 p-3 text-[11px] text-amber-700 dark:text-amber-300">
                <strong>Admin Credentials:</strong> admin@smartshop.ai / admin123
              </div>

              <button className="btn-primary mt-6 w-full justify-center" disabled={loading}>
                {loading ? "Authenticating Admin..." : "Authenticate Admin Portal"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
