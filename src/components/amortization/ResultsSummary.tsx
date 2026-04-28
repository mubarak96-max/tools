interface Stats {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalPrincipal: number;
  monthsSaved: number;
  payoffDate: string;
}

export function ResultsSummary({ stats }: { stats: Stats }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const cards = [
    {
      label: "Monthly Payment",
      value: formatCurrency(stats.monthlyPayment),
      subtext: "Principal + Interest",
      color: "blue",
    },
    {
      label: "Total Interest",
      value: formatCurrency(stats.totalInterest),
      subtext: "Over life of loan",
      color: "amber",
    },
    {
      label: "Total Cost",
      value: formatCurrency(stats.totalPaid),
      subtext: "Principal + Interest",
      color: "slate",
    },
    {
      label: "Payoff Date",
      value: stats.payoffDate,
      subtext: stats.monthsSaved > 0 ? `${stats.monthsSaved} months early!` : "On schedule",
      color: "green",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5"
        >
          <div 
            className="absolute top-0 left-0 h-1 w-full" 
            style={{ 
              backgroundColor: card.color === 'blue' ? '#3b82f6' : 
                               card.color === 'amber' ? '#f59e0b' : 
                               card.color === 'slate' ? '#64748b' : 
                               '#10b981' 
            }} 
          />
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {card.value}
          </p>
          <p 
            className="mt-1 text-xs font-medium"
            style={{ 
              color: card.color === 'blue' ? '#2563eb' : 
                     card.color === 'amber' ? '#d97706' : 
                     card.color === 'slate' ? '#475569' : 
                     '#16a34a' 
            }}
          >
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}
