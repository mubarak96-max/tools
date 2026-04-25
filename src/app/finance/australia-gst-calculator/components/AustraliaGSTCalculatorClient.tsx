"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Minus,
  DollarSign,
  Trash2,
  Calculator,
  Receipt,
  Info,
  Copy,
  Check,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type GSTStatus = "taxable" | "gstFree" | "inputTaxed";

interface LineItem {
  id: string;
  description: string;
  amount: number;
  status: GSTStatus;
  isInclusive: boolean;
}

const GST_RATE = 0.1;

const STATUS_CONFIG: Record<
  GSTStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  taxable: {
    label: "Taxable (10%)",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  gstFree: {
    label: "GST-Free (0%)",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  inputTaxed: {
    label: "Input-Taxed",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
};

const COLORS = ["#f59e0b", "#10b981", "#3b82f6"];

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// Stable ID generator for new items
function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export function AustraliaGSTCalculatorClient() {
  // Use "single" or "invoice" mode
  const [mode, setMode] = useState<"single" | "invoice">("single");
  const [singleAmount, setSingleAmount] = useState<number>(100);
  const [singleIsInclusive, setSingleIsInclusive] = useState<boolean>(false);
  
  // Initialize with stable IDs to avoid hydration mismatch
  const [items, setItems] = useState<LineItem[]>([
    {
      id: "init-1",
      description: "Consulting Services",
      amount: 2500,
      status: "taxable",
      isInclusive: false,
    },
    {
      id: "init-2",
      description: "Office Supplies",
      amount: 150,
      status: "taxable",
      isInclusive: true,
    },
    {
      id: "init-3",
      description: "Basic Food",
      amount: 80,
      status: "gstFree",
      isInclusive: false,
    },
  ]);
  const [copied, setCopied] = useState(false);

  // Single mode calculations
  const singleResult = useMemo(() => {
    const amount = Number(singleAmount) || 0;
    if (singleIsInclusive) {
      const gst = amount / 11;
      const exclusive = amount - gst;
      return { inclusive: amount, exclusive, gst };
    } else {
      const gst = amount * GST_RATE;
      const inclusive = amount + gst;
      return { inclusive, exclusive: amount, gst };
    }
  }, [singleAmount, singleIsInclusive]);

  // Invoice mode calculations
  const invoiceTotals = useMemo(() => {
    let taxableExclusive = 0;
    let taxableGst = 0;
    let taxableInclusive = 0;
    let gstFreeTotal = 0;
    let inputTaxedTotal = 0;

    items.forEach((item) => {
      const amount = Number(item.amount) || 0;
      if (item.status === "taxable") {
        if (item.isInclusive) {
          const gst = amount / 11;
          taxableGst += gst;
          taxableExclusive += amount - gst;
          taxableInclusive += amount;
        } else {
          const gst = amount * GST_RATE;
          taxableGst += gst;
          taxableExclusive += amount;
          taxableInclusive += amount + gst;
        }
      } else if (item.status === "gstFree") {
        gstFreeTotal += amount;
      } else {
        inputTaxedTotal += amount;
      }
    });

    const grandTotal = taxableInclusive + gstFreeTotal + inputTaxedTotal;
    const totalGst = taxableGst;

    return {
      taxableExclusive,
      taxableGst,
      taxableInclusive,
      gstFreeTotal,
      inputTaxedTotal,
      grandTotal,
      totalGst,
    };
  }, [items]);

  const pieData = useMemo(() => [
    { name: "Taxable", value: invoiceTotals.taxableInclusive, color: "#f59e0b" },
    { name: "GST-Free", value: invoiceTotals.gstFreeTotal, color: "#10b981" },
    {
      name: "Input-Taxed",
      value: invoiceTotals.inputTaxedTotal,
      color: "#3b82f6",
    },
  ].filter((d) => d.value > 0), [invoiceTotals]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        description: "",
        amount: 0,
        status: "taxable",
        isInclusive: false,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const copySingleResult = () => {
    const text = singleIsInclusive
      ? `GST Inclusive: ${formatMoney(singleResult.inclusive)}\nGST Amount: ${formatMoney(singleResult.gst)}\nGST Exclusive: ${formatMoney(singleResult.exclusive)}`
      : `GST Exclusive: ${formatMoney(singleResult.exclusive)}\nGST Amount: ${formatMoney(singleResult.gst)}\nGST Inclusive: ${formatMoney(singleResult.inclusive)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Mode Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
              mode === "single"
                ? "bg-amber-500 text-white shadow-md"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Calculator className="h-4 w-4" />
            Single Amount
          </button>
          <button
            type="button"
            onClick={() => setMode("invoice")}
            className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
              mode === "invoice"
                ? "bg-amber-500 text-white shadow-md"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Receipt className="h-4 w-4" />
            Invoice Mode
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {mode === "single" ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm">
                  <Calculator className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                  Single Amount
                </h2>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Amount to Calculate
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400 group-focus-within:text-amber-500 transition-colors">
                    $
                  </span>
                  <input
                    type="number"
                    value={singleAmount || ""}
                    onChange={(e) => setSingleAmount(Number(e.target.value))}
                    className="block w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-10 pr-4 py-4 text-xl font-black text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="100.00"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Pricing Structure
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSingleIsInclusive(false)}
                    className={`rounded-2xl border-2 px-4 py-4 text-sm font-black uppercase tracking-tight transition-all ${
                      !singleIsInclusive
                        ? "border-amber-500 bg-amber-50 text-amber-600 shadow-sm"
                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                    }`}
                  >
                    GST Exclusive
                  </button>
                  <button
                    type="button"
                    onClick={() => setSingleIsInclusive(true)}
                    className={`rounded-2xl border-2 px-4 py-4 text-sm font-black uppercase tracking-tight transition-all ${
                      singleIsInclusive
                        ? "border-amber-500 bg-amber-50 text-amber-600 shadow-sm"
                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                    }`}
                  >
                    GST Inclusive
                  </button>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Calculation Logic
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-600 italic">
                  {singleIsInclusive
                    ? `To extract GST from an inclusive price, we divide by 11. $${singleAmount} ÷ 11 = ${formatMoney(singleResult.gst)}`
                    : `To add GST to an exclusive price, we multiply by 10%. $${singleAmount} × 0.10 = ${formatMoney(singleResult.gst)}`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                      Line Items
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-all active:scale-95"
                    title="Add Item"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-5 group transition-all hover:bg-white hover:shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="space-y-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          className="block w-full bg-transparent text-sm font-bold text-slate-900 border-b border-slate-200 py-1 focus:border-amber-500 focus:outline-none placeholder:text-slate-300"
                          placeholder="What's this for?"
                        />

                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                              $
                            </span>
                            <input
                              type="number"
                              value={item.amount || ""}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "amount",
                                  Number(e.target.value)
                                )
                              }
                              className="block w-full rounded-xl border border-slate-200 bg-white pl-7 pr-3 py-2 text-sm font-black text-slate-900 focus:border-amber-500 focus:outline-none shadow-sm"
                            />
                          </div>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "status",
                                e.target.value as GSTStatus
                              )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase text-slate-500 focus:border-amber-500 focus:outline-none shadow-sm cursor-pointer"
                          >
                            <option value="taxable">Taxable</option>
                            <option value="gstFree">GST-Free</option>
                            <option value="inputTaxed">Input-Taxed</option>
                          </select>
                        </div>

                        {item.status === "taxable" && (
                          <div className="flex gap-2 p-1 bg-white rounded-lg border border-slate-100">
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(item.id, "isInclusive", false)
                              }
                              className={`flex-1 rounded-md py-1.5 text-[10px] font-black uppercase tracking-tighter transition-all ${
                                !item.isInclusive
                                  ? "bg-amber-500 text-white shadow-sm"
                                  : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              Excl. GST
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(item.id, "isInclusive", true)
                              }
                              className={`flex-1 rounded-md py-1.5 text-[10px] font-black uppercase tracking-tighter transition-all ${
                                item.isInclusive
                                  ? "bg-amber-500 text-white shadow-sm"
                                  : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              Incl. GST
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm font-bold text-slate-400 italic">
                        No items added yet.
                      </p>
                      <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 text-xs font-black uppercase text-amber-500 hover:underline"
                      >
                        Add one now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {mode === "single" ? (
            <>
              {/* Single Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-premium">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {singleIsInclusive ? "GST Inclusive" : "GST Exclusive"}
                  </p>
                  <p className="mt-3 text-4xl font-black text-slate-900 tracking-tight">
                    {formatMoney(
                      singleIsInclusive
                        ? singleResult.inclusive
                        : singleResult.exclusive
                    )}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Input
                    </span>
                  </div>
                </div>
                <div className="rounded-[2rem] border-2 border-amber-500 bg-amber-50/30 p-8 text-center shadow-2xl shadow-amber-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                    GST Portion (10%)
                  </p>
                  <p className="mt-3 text-4xl font-black text-amber-600 tracking-tight">
                    {formatMoney(singleResult.gst)}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <span className="rounded-full bg-amber-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Tax
                    </span>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-premium">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {singleIsInclusive ? "GST Exclusive" : "GST Inclusive"}
                  </p>
                  <p className="mt-3 text-4xl font-black text-emerald-600 tracking-tight">
                    {formatMoney(
                      singleIsInclusive
                        ? singleResult.exclusive
                        : singleResult.inclusive
                    )}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <span className="rounded-full bg-emerald-100 text-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      Calculated
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                    Value Distribution
                  </h3>
                  <button
                    type="button"
                    onClick={copySingleResult}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase text-slate-600 hover:border-amber-500 hover:text-amber-600 transition-all shadow-sm active:scale-95"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy Results"}
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="relative h-12 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                    <div
                      className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-700 ease-out flex items-center justify-center text-[10px] font-black text-white"
                      style={{
                        width: `${(singleResult.exclusive / singleResult.inclusive) * 100}%`,
                      }}
                    >
                      {((singleResult.exclusive / singleResult.inclusive) * 100).toFixed(
                        1
                      )}
                      %
                    </div>
                    <div
                      className="absolute top-0 h-full bg-amber-500 transition-all duration-700 ease-out flex items-center justify-center text-[10px] font-black text-white"
                      style={{
                        left: `${(singleResult.exclusive / singleResult.inclusive) * 100}%`,
                        width: `${(singleResult.gst / singleResult.inclusive) * 100}%`,
                      }}
                    >
                      {((singleResult.gst / singleResult.inclusive) * 100).toFixed(
                        1
                      )}
                      %
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 h-4 w-4 rounded-full bg-emerald-500 shadow-sm" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Net Amount
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                          {formatMoney(singleResult.exclusive)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 text-right justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          GST Content
                        </p>
                        <p className="text-2xl font-black text-amber-600">
                          {formatMoney(singleResult.gst)}
                        </p>
                      </div>
                      <div className="mt-1 h-4 w-4 rounded-full bg-amber-500 shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Conversions */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
                <h3 className="mb-6 text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                  Comparative Benchmarks
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[-20, -10, 10, 20].map((offset) => {
                    const amt = singleAmount + offset;
                    if (amt <= 0) return null;
                    const gst = singleIsInclusive ? amt / 11 : amt * GST_RATE;
                    const net = singleIsInclusive ? amt - gst : amt;
                    return (
                      <div
                        key={offset}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center group hover:bg-white hover:border-amber-200 hover:shadow-md transition-all duration-300"
                      >
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {singleIsInclusive ? "Incl." : "Excl."} ${amt}
                        </p>
                        <p className="mt-1 text-lg font-black text-slate-900">
                          {formatMoney(net + gst)}
                        </p>
                        <p className="mt-1 text-[10px] font-black text-amber-500">
                          GST: {formatMoney(gst)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Invoice Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-premium">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Subtotal
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-900">
                    {formatMoney(
                      invoiceTotals.taxableExclusive +
                        invoiceTotals.gstFreeTotal +
                        invoiceTotals.inputTaxedTotal
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-premium ring-2 ring-amber-500/10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">
                    Total GST
                  </p>
                  <p className="mt-1 text-xl font-black text-amber-600">
                    {formatMoney(invoiceTotals.totalGst)}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-center shadow-premium">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                    Grand Total
                  </p>
                  <p className="mt-1 text-xl font-black text-emerald-600">
                    {formatMoney(invoiceTotals.grandTotal)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-premium">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Total Items
                  </p>
                  <p className="mt-1 text-xl font-black text-blue-600">
                    {items.length}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
                <h3 className="mb-8 text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                  Tax Composition Analysis
                </h3>
                <div className="grid items-center gap-12 md:grid-cols-2">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => formatMoney(Number(value) || 0)}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "none",
                            borderRadius: "1rem",
                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          align="center"
                          formatter={(value: string) => (
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {pieData.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs font-black uppercase text-slate-500">
                            {entry.name}
                          </span>
                        </div>
                        <span className="text-base font-black text-slate-900">
                          {formatMoney(entry.value)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center px-2">
                      <span className="text-xs font-black uppercase text-amber-600">
                        Total GST Liability
                      </span>
                      <span className="text-2xl font-black text-amber-600 tracking-tighter">
                        {formatMoney(invoiceTotals.totalGst)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemised List */}
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-premium">
                <h3 className="mb-6 text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                  Itemised Ledger
                </h3>
                <div className="space-y-3">
                  {items.map((item) => {
                    const config = STATUS_CONFIG[item.status];
                    let gst = 0;
                    let total = item.amount;
                    if (item.status === "taxable") {
                      if (item.isInclusive) {
                        gst = item.amount / 11;
                      } else {
                        gst = item.amount * GST_RATE;
                        total = item.amount + gst;
                      }
                    }
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between rounded-2xl border p-5 transition-all hover:scale-[1.01] ${config.border} ${config.bg}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900 uppercase tracking-tight">
                            {item.description || "Unlabelled Transaction"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white border ${config.border} ${config.color}`}
                            >
                              {config.label}
                            </span>
                            {item.status === "taxable" && (
                              <span className="text-[9px] font-black uppercase text-slate-400">
                                {item.isInclusive ? "Inclusive" : "Exclusive"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900 tracking-tight">
                            {formatMoney(total)}
                          </p>
                          {item.status === "taxable" && (
                            <p className={`text-xs font-bold ${config.color}`}>
                              GST: {formatMoney(gst)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center border-t border-slate-200 pt-6 px-2">
                    <span className="text-lg font-black uppercase text-slate-900 italic tracking-tighter">
                      Grand Total
                    </span>
                    <span className="text-3xl font-black text-emerald-600 tracking-tighter">
                      {formatMoney(invoiceTotals.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* BAS Helper */}
              <div className="rounded-[2rem] border border-amber-200 bg-white p-8 shadow-premium ring-1 ring-amber-50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none text-slate-900">
                      BAS Quick-Fill
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      Quarterly Statement Mapping
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      G1 — Total Sales
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      {formatMoney(invoiceTotals.grandTotal)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                      G3 — GST-Free Sales
                    </p>
                    <p className="text-2xl font-black text-emerald-600">
                      {formatMoney(invoiceTotals.gstFreeTotal)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                      G6 — Input-Taxed Sales
                    </p>
                    <p className="text-2xl font-black text-blue-400">
                      {formatMoney(invoiceTotals.inputTaxedTotal)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-500 border border-amber-400 p-6 shadow-lg shadow-amber-500/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-950/70 mb-1">
                      G9 — GST Collected
                    </p>
                    <p className="text-2xl font-black text-amber-950">
                      {formatMoney(invoiceTotals.totalGst)}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                    These labels correspond to quarterly Business Activity
                    Statement (BAS) fields G1, G3, G6, and G9. Ensure you also
                    calculate G11 (Purchases) and G10 (Capital Purchases) to
                    determine your net GST position.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
