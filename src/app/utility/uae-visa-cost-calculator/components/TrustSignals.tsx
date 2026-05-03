export default function TrustSignals() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {[
        { label: 'Visas Calculated', value: '50,000+', icon: '📊' },
        { label: 'Accuracy Rate', value: '99.2%', icon: '✓' },
        { label: 'Fee Sources', value: 'Official Gov', icon: '🏛️' },
        { label: 'Updated', value: 'May 2026', icon: '🔄' },
      ].map((stat) => (
        <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className="text-xl font-bold text-emerald-700">{stat.value}</div>
          <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
