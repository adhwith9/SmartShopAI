import { useState } from "react";
import { Mail, KeyRound, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Auth({ setPage }) {
  const { persistSession } = useApp();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [sentOtpCode, setSentOtpCode] = useState("");
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
      const res = await api("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp, name })
      });

      persistSession(res);
      setPage("home");
    } catch (err) {
      setError(err.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[75vh] place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-mint/20 text-mint">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black">OTP Email Verification</h1>
            <p className="text-xs text-slate-500">Fast, secure & passwordless login connected to database</p>
          </div>
        </div>

        {infoMsg && (
          <div className="mt-5 rounded border border-mint/30 bg-mint/10 p-3 text-xs font-bold text-mint flex items-center gap-2">
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
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="label">Your Name (Optional)</label>
              <input
                className="input mt-1"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Your Email Address</label>
              <div className="mt-1 flex items-center rounded border border-black/15 px-3 py-2 dark:border-white/15">
                <Mail size={18} className="mr-2 text-slate-400" />
                <input
                  required
                  type="email"
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button className="btn-primary mt-6 w-full justify-center" disabled={loading}>
              {loading ? "Generating OTP Code..." : "Send Verification OTP"} <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div className="rounded bg-slate-100 p-3 dark:bg-slate-800 text-xs">
              <span className="font-semibold text-slate-500">Email:</span> <strong className="text-mint">{email}</strong>
              <button type="button" className="ml-2 font-bold underline" onClick={() => setStep("email")}>Change</button>
            </div>

            {sentOtpCode && (
              <div className="rounded border border-mint/40 bg-mint/15 p-3 text-center">
                <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Generated OTP Code:</span>
                <span className="text-2xl font-black tracking-widest text-mint">{sentOtpCode}</span>
                <p className="mt-1 text-[11px] text-slate-500">Also sent to your database email inbox</p>
              </div>
            )}

            <div>
              <label className="label">Enter 6-Digit OTP Code</label>
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
              {loading ? "Verifying OTP..." : "Verify OTP & Complete Login"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
