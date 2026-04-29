"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface TaxResult {
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  netAnnual: number;
  pretaxDeductions?: number;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"];

export function TaxBreakdown({ result }: { result: TaxResult }) {
  const data = [
    { name: "Federal Tax", value: result.federalTax },
    { name: "State Tax", value: result.stateTax },
    { name: "Social Security", value: result.socialSecurity },
    { name: "Medicare", value: result.medicare },
    ...(result.additionalMedicare > 0 ? [{ name: "Addl. Medicare", value: result.additionalMedicare }] : []),
    { name: "Net Pay", value: result.netAnnual },
  ].filter((d) => d.value > 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Tax & Pay Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Tax Breakdown</h3>
        <div className="space-y-4">
          {[
            { label: "Federal Income Tax", value: result.federalTax, color: "bg-blue-500" },
            { label: "State Income Tax", value: result.stateTax, color: "bg-violet-500" },
            { label: "Social Security (6.2%)", value: result.socialSecurity, color: "bg-amber-500" },
            { label: "Medicare (1.45%)", value: result.medicare, color: "bg-emerald-500" },
            ...(result.additionalMedicare > 0 ? [{ label: "Additional Medicare (0.9%)", value: result.additionalMedicare, color: "bg-red-500" }] : []),
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.value)}</span>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">Total Tax Withheld</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(result.federalTax + result.stateTax + result.socialSecurity + result.medicare + result.additionalMedicare)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
