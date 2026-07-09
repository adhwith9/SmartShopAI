export default function MetricCard({ label, value, detail, tone = "mint" }) {
  return (
    <div className={`metric-card tone-${tone}`}>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <strong className="mt-2 block text-3xl">{value}</strong>
      <span className="mt-2 block text-xs font-semibold uppercase tracking-wide">{detail}</span>
    </div>
  );
}
