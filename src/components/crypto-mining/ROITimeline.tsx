"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DailyResult {
  day: number;
  cumulativeProfit: number;
}

export function ROITimeline({
  results,
  hardwareCost,
}: {
  results: DailyResult[];
  hardwareCost: number;
}) {
  const data = useMemo(() => {
    return results
      .filter((_, i) => i % 7 === 0 || i === results.length - 1)
      .map((r) => ({
        week: Math.ceil(r.day / 7),
        profit: r.cumulativeProfit,
        hardware: -hardwareCost,
      }));
  }, [results, hardwareCost]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        ROI & Break-Even Timeline
      </h3>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
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
            <ReferenceLine y={0} stroke="#10b981" strokeDasharray="5 5" label={{ value: "Break Even", fill: "#10b981", fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="profit"
              name="Cumulative Profit"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#06b6d4" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
