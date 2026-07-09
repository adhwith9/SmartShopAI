import { useState } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [preferences, setPreferences] = useState((user?.preferences || []).join(","));
  const [saved, setSaved] = useState(false);
  if (!user) return <main className="section"><h1 className="text-2xl font-black">Login to manage your profile.</h1></main>;

  async function save() {
    const updated = await api("/profile", { method: "PUT", body: JSON.stringify({ name, preferences: preferences.split(",").map((p) => p.trim()) }) });
    localStorage.setItem("smartshop_user", JSON.stringify(updated));
    setSaved(true);
  }

  return (
    <main className="section max-w-3xl">
      <div className="section-title"><div><p>Account</p><h2>Profile management</h2></div></div>
      <div className="rounded border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
        <label className="label">Name</label><input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="label mt-5">Preferences</label><input className="input mt-2" value={preferences} onChange={(e) => setPreferences(e.target.value)} />
        <button className="btn-primary mt-5" onClick={save}>Save profile</button>
        {saved && <span className="ml-3 text-sm font-bold text-mint">Saved</span>}
      </div>
    </main>
  );
}
