interface Stats {
  daily: {
    revenue: number;
    electricityCost: number;
    poolFeeCost: number;
    netProfit: number;
    btcMined: number;
  };
  monthly: {
    revenue: number;
    electricity: number;
    poolFees: number;
    profit: number;
    coins: number;
  };
  yearly: {
    revenue: number;
    electricity: number;
    poolFees: number;
    profit: number;
    coins: number;
  };
  breakEvenDay: number | null;
  roi: number;
  powerCostMonthly: number;
}

interface Config {
  coin: string;
  power: number;
  hardwareCost: number;
  powerCost: number;
}

export function ResultsPanel({ stats, config }: { stats: Stats; config: Config }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const formatCrypto = (val: number) =>
    val < 0.01 ? val.toFixed(6) : val.toFixed(4);

  const cards = [
    {
      label: "Daily Profit",
      value: formatCurrency(stats.daily.netProfit),
      sub: `${formatCrypto(stats.daily.btcMined)} ${config.coin}/day`,
      color: stats.daily.netProfit >= 0 ? "emerald" : "red",
    },
    {
      label: "Monthly Profit",
      value: formatCurrency(stats.monthly.profit),
      sub: `${formatCrypto(stats.monthly.coins)} ${config.coin}/month`,
      color: stats.monthly.profit >= 0 ? "emerald" : "red",
    },
    {
      label: "Yearly Profit",
      value: formatCurrency(stats.yearly.profit),
      sub: `${formatCrypto(stats.yearly.coins)} ${config.coin}/year`,
      color: stats.yearly.profit >= 0 ? "emerald" : "red",
    },
    {
      label: "Break-Even",
      value: stats.breakEvenDay ? `${stats.breakEvenDay} days` : "No profit",
      sub: stats.breakEvenDay ? `ROI: ${stats.roi.toFixed(1)}% (1Y)` : "Check electricity costs",
      color: stats.breakEvenDay ? "cyan" : "red",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 p-6"
        >
          <div className={`absolute top-0 left-0 h-1 w-full bg-${card.color}-500`} />
          <p className="text-sm font-medium text-slate-400">{card.label}</p>
          <p className={`mt-2 text-2xl font-bold tracking-tight text-${card.color}-400`}>
            {card.value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
        </div>
      ))}

      {/* Detailed Breakdown */}
      <div className="sm:col-span-2 lg:col-span-4 rounded-xl bg-slate-800/50 border border-slate-700 p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
          Monthly Cost Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500">Gross Revenue</p>
            <p className="text-lg font-semibold text-emerald-400">{formatCurrency(stats.monthly.revenue)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Electricity</p>
            <p className="text-lg font-semibold text-amber-400">{formatCurrency(stats.monthly.electricity)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Pool Fees</p>
            <p className="text-lg font-semibold text-orange-400">{formatCurrency(stats.monthly.poolFees)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Net Profit</p>
            <p className={`text-lg font-semibold ${stats.monthly.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatCurrency(stats.monthly.profit)}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Power Efficiency</span>
            <span className="text-slate-200">{(config.power / 1000).toFixed(2)} kW continuous</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-400">Monthly Power Cost</span>
            <span className="text-slate-200">{formatCurrency(stats.powerCostMonthly)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-400">Profit Margin</span>
            <span className={stats.monthly.profit / stats.monthly.revenue > 0 ? "text-emerald-400" : "text-red-400"}>
              {((stats.monthly.profit / stats.monthly.revenue) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
