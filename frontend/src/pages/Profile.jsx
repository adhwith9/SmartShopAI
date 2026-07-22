import { useEffect, useState } from "react";
import { Mail, ShieldCheck, UserCheck, UserPlus, Lock } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Profile({ setPage }) {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [preferences, setPreferences] = useState((user?.preferences || []).join(","));
  const [emails, setEmails] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      api("/emails").then((res) => setEmails(Array.isArray(res) ? res : []));
    }
  }, [user]);

  if (!user) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-slate-900 space-y-4">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint/20 text-mint">
            <UserCheck size={28} />
          </div>
          <h1 className="text-2xl font-black">Login Required</h1>
          <p className="text-sm text-slate-500">Log in or create an account to view your database email inbox, order history, and account settings.</p>
          <div className="pt-2 flex justify-center gap-3">
            <button className="btn-primary" onClick={() => setPage("auth")}>Login with Email OTP</button>
            <button className="btn-secondary" onClick={() => setPage("auth")}>Create Account</button>
          </div>
        </div>
      </main>
    );
  }

  async function save() {
    const updated = await api("/profile", {
      method: "PUT",
      body: JSON.stringify({ name, preferences: preferences.split(",").map((p) => p.trim()) })
    });
    localStorage.setItem("smartshop_user", JSON.stringify(updated || { ...user, name }));
    setSaved(true);
  }

  return (
    <main className="section max-w-4xl">
      <div className="section-title">
        <div>
          <p>Database & Account</p>
          <h2>User Profile & Inbox Mails</h2>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn-secondary text-sm ${activeTab === "inbox" ? "bg-mint/20 border-mint text-mint" : ""}`}
            onClick={() => setActiveTab("inbox")}
          >
            <Mail size={16} /> Received Mails ({emails.length})
          </button>
          <button
            className={`btn-secondary text-sm ${activeTab === "settings" ? "bg-mint/20 border-mint text-mint" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Account Details
          </button>
        </div>
      </div>

      {activeTab === "inbox" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded bg-white/80 p-4 border border-black/10 dark:bg-slate-900 dark:border-white/10">
            <div className="flex items-center gap-3">
              <Mail className="text-mint" size={24} />
              <div>
                <h3 className="font-bold">Database Mail Inbox for {user.email}</h3>
                <p className="text-xs text-slate-500">Synced with persistent database storage</p>
              </div>
            </div>
            <span className="rounded bg-mint/15 px-3 py-1 text-xs font-bold text-mint">Live Synced</span>
          </div>

          <div className="grid gap-3">
            {emails.map((mail) => (
              <div key={mail.id} className="rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-mint">{mail.sender}</span>
                  <span className="text-xs text-slate-400">{mail.date}</span>
                </div>
                <h4 className="mt-1 text-base font-bold">{mail.subject}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{mail.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-black/10 pb-4 dark:border-white/10">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-mint/20 font-black text-mint">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="label">Email (Database Account)</label>
              <input className="input mt-2 opacity-75 cursor-not-allowed" value={user.email} disabled />
            </div>
            <div>
              <label className="label">Category Preferences (Comma-separated)</label>
              <input className="input mt-2" value={preferences} onChange={(e) => setPreferences(e.target.value)} />
            </div>
            <div className="pt-2">
              <button className="btn-primary" onClick={save}>Save Profile</button>
              {saved && <span className="ml-3 text-sm font-bold text-mint">Saved to Database</span>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
