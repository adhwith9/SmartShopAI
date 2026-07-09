import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Auth({ setPage }) {
  const { login, register } = useApp();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "ava@example.com", password: "customer123", preferences: "electronics,fitness" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register({ ...form, preferences: form.preferences.split(",").map((p) => p.trim()) });
      setPage("home");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-[72vh] place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <h1 className="text-2xl font-black">{mode === "login" ? "Welcome back" : "Create your profile"}</h1>
        <p className="mt-2 text-sm text-slate-500">Customer demo: ava@example.com / customer123. Admin demo: admin@smartshop.ai / admin123.</p>
        {mode === "register" && <input className="input mt-5" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="input mt-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input mt-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {mode === "register" && <input className="input mt-3" placeholder="Preferences, comma separated" value={form.preferences} onChange={(e) => setForm({ ...form, preferences: e.target.value })} />}
        {error && <p className="mt-3 text-sm font-semibold text-coral">{error}</p>}
        <button className="btn-primary mt-5 w-full justify-center">{mode === "login" ? "Login" : "Register"}</button>
        <button type="button" className="mt-4 text-sm font-bold text-mint" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account?" : "Already registered?"}
        </button>
      </form>
    </main>
  );
}
