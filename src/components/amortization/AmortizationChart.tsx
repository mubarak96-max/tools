"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

export function AmortizationChart({
  schedule,
}: {
  schedule: AmortizationRow[];
}) {
  const data = useMemo(() => {
    // Sample every 12th month for performance + add first/last
    const sampled = schedule.filter(
      (_, i) => i === 0 || i === schedule.length - 1 || i % 12 === 0
    );
    return sampled.map((row) => ({
      year: Math.ceil(row.month / 12),
      principal: Math.round(row.principal),
      interest: Math.round(row.interest),
      balance: Math.round(row.balance),
    }));
  }, [schedule]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Amortization Visualization
      </h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              label={{ value: "Year", position: "insideBottom", offset: -5, fill: "#64748b" }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="balance"
              name="Remaining Balance"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorBalance)"
            />
            <Area
              type="monotone"
              dataKey="principal"
              name="Principal Paid"
              stroke="#10b981"
              strokeWidth={2}
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="interest"
              name="Interest Paid"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
