"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DailyResult {
  day: number;
  revenue: number;
  electricityCost: number;
  netProfit: number;
  cumulativeProfit: number;
}

export function ProfitChart({ results }: { results: DailyResult[] }) {
  const data = useMemo(() => {
    // Weekly samples for performance
    return results
      .filter((_, i) => i % 7 === 0 || i === results.length - 1)
      .map((r) => ({
        week: Math.ceil(r.day / 7),
        revenue: Math.round(r.revenue * 7),
        costs: Math.round((r.electricityCost) * 7),
        profit: Math.round(r.netProfit * 7),
        cumulative: Math.round(r.cumulativeProfit),
      }));
  }, [results]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Weekly Revenue vs. Costs
      </h3>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="week"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              label={{ value: "Week", position: "insideBottom", offset: -5, fill: "#94a3b8" }}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                border: "1px solid #334155",
                color: "#fff",
              }}
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <ReferenceLine y={0} stroke="#475569" />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Weekly Revenue"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="costs"
              name="Weekly Costs"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#colorCosts)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
