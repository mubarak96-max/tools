"use client";

import { useState, useMemo } from "react";
import {
  calculateFba,
  CATEGORIES,
  formatGBP,
  formatPct,
  type FbaInputs,
} from "@/lib/amazonFba";
import { BarChart3, Receipt, TrendingUp, Package, Box, Truck, Tag, Percent } from "lucide-react";

// ── Reusable field ─────────────────────────────────────────────────
function Field({
  label,
  children,
  hint,
  icon: Icon,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  icon?: any;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-stone-400" />}
        <label className="block text-xs text-stone-500 font-medium">{label}</label>
      </div>
      {children}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  step = 0.01,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-stone-400 text-sm pointer-events-none">{prefix}</span>
      )}
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-orange-400 transition-all ${
          prefix ? "pl-7 pr-3" : suffix ? "pl-3 pr-8" : "px-3"
        }`}
      />
      {suffix && (
        <span className="absolute right-3 text-stone-400 text-sm pointer-events-none">{suffix}</span>
      )}
    </div>
  );
}

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
      {Icon && <Icon className="w-3 h-3 text-stone-400" />}
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
        {children}
      </p>
    </div>
  );
}

// Profit indicator colour
function profitColor(profit: number) {
  if (profit > 0) return "text-emerald-600";
  if (profit === 0) return "text-stone-500";
  return "text-red-500";
}
function profitBg(profit: number) {
  if (profit > 0) return "bg-emerald-50 border-emerald-200";
  if (profit === 0) return "bg-stone-50 border-stone-200";
  return "bg-red-50 border-red-200";
}

// ── Main component ─────────────────────────────────────────────────
export default function AmazonFbaCalculator() {
  // Pricing
  const [salePrice, setSalePrice] = useState(24.99);
  const [costPrice, setCostPrice] = useState(6.00);
  const [categoryId, setCategoryId] = useState("toys");

  // Product
  const [weightGrams, setWeightGrams] = useState(350);
  const [lengthCm, setLengthCm] = useState(20);
  const [widthCm, setWidthCm] = useState(15);
  const [heightCm, setHeightCm] = useState(8);

  // Additional costs
  const [inboundShipping, setInboundShipping] = useState(0.80);
  const [prepCost, setPrepCost] = useState(0.30);
  const [otherCosts, setOtherCosts] = useState(1.50);

  // Storage
  const [monthsStorage, setMonthsStorage] = useState(2);
  const [isPeakStorage, setIsPeakStorage] = useState(false);

  // VAT
  const [vatRegistered, setVatRegistered] = useState(false);
  const [vatRatePct, setVatRatePct] = useState(20);

  // Seller plan
  const [sellerPlan, setSellerPlan] = useState<"individual" | "professional">("professional");
  const [monthlyUnitsSold, setMonthlyUnitsSold] = useState(50);

  const [activeTab, setActiveTab] = useState<"breakdown" | "fees" | "monthly">("breakdown");

  const inputs: FbaInputs = {
    salePrice,
    costPrice,
    categoryId,
    weightGrams,
    lengthCm,
    widthCm,
    heightCm,
    inboundShippingPerUnit: inboundShipping,
    prepCostPerUnit: prepCost,
    otherCostsPerUnit: otherCosts,
    monthsStorage,
    isPeakStorage,
    vatRegistered,
    vatRatePct,
    sellerPlan,
    monthlyUnitsSold,
  };

  const result = useMemo(() => calculateFba(inputs), [
    salePrice, costPrice, categoryId, weightGrams, lengthCm, widthCm, heightCm,
    inboundShipping, prepCost, otherCosts, monthsStorage, isPeakStorage,
    vatRegistered, vatRatePct, sellerPlan, monthlyUnitsSold,
  ]);

  // Waterfall bar data
  const waterfallItems = [
    { label: "Sale price", value: result.salePriceExVat, positive: true, bold: true },
    { label: "Product cost", value: -result.costPrice, positive: false },
    { label: "Inbound shipping", value: -result.inboundShipping, positive: false },
    { label: "Prep & labelling", value: -result.prepCost, positive: false },
    { label: "Other costs", value: -result.otherCosts, positive: false },
    { label: "Referral fee", value: -result.referralFee, positive: false },
    { label: "FBA fulfilment", value: -result.fbaFulfilmentFee, positive: false },
    { label: "Storage fee", value: -result.storageFeeTotalForHold, positive: false },
    { label: "Seller plan", value: -result.sellerPlanFeePerUnit, positive: false },
    { label: "Net profit", value: result.netProfit, positive: result.netProfit >= 0, bold: true },
  ];
  const maxAbsVal = Math.max(...waterfallItems.map((i) => Math.abs(i.value)), 1);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">

      {/* Header summary bar */}
      <div className={`border-b px-5 py-6 ${profitBg(result.netProfit)}`}>
        <div className="flex flex-wrap gap-x-10 gap-y-6 items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 mb-0.5 font-medium uppercase tracking-wider">Net profit per unit</p>
            <p className={`text-4xl font-bold ${profitColor(result.netProfit)} tabular-nums`}>
              {formatGBP(result.netProfit)}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Margin</p>
              <p className={`text-xl font-semibold ${profitColor(result.netProfit)}`}>
                {formatPct(result.margin)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-0.5">ROI</p>
              <p className={`text-xl font-semibold ${profitColor(result.roi)}`}>
                {formatPct(result.roi)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Total Amazon fees</p>
              <p className="text-xl font-semibold text-stone-700">{formatGBP(result.totalAmazonFees)}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Break-even price</p>
              <p className="text-xl font-semibold text-stone-700">{formatGBP(result.breakEvenPrice)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

        {/* ── LEFT: Inputs ──────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 overflow-y-auto max-h-[700px] space-y-1">

          <SectionTitle icon={Tag}>Pricing</SectionTitle>
          <div className="space-y-3">
            <Field label="Sale price (inc. VAT)">
              <NumberInput value={salePrice} onChange={setSalePrice} prefix="£" step={0.01} />
            </Field>
            <Field label="Cost price per unit" hint="What you pay your supplier">
              <NumberInput value={costPrice} onChange={setCostPrice} prefix="£" step={0.01} />
            </Field>
            <Field label="Product category">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-orange-400 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <SectionTitle icon={Package}>Dimensions & Weight</SectionTitle>
          <div className="space-y-3">
            <Field label="Weight" hint="For FBA fulfilment fee calculation">
              <NumberInput value={weightGrams} onChange={setWeightGrams} suffix="g" step={10} />
            </Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="L (cm)">
                <NumberInput value={lengthCm} onChange={setLengthCm} step={0.5} />
              </Field>
              <Field label="W (cm)">
                <NumberInput value={widthCm} onChange={setWidthCm} step={0.5} />
              </Field>
              <Field label="H (cm)">
                <NumberInput value={heightCm} onChange={setHeightCm} step={0.5} />
              </Field>
            </div>
          </div>

          <SectionTitle icon={Truck}>Additional Costs</SectionTitle>
          <div className="space-y-3">
            <Field label="Inbound shipping" hint="Cost to ship to Amazon warehouse">
              <NumberInput value={inboundShipping} onChange={setInboundShipping} prefix="£" step={0.05} />
            </Field>
            <Field label="Prep & labelling" hint="Bagging, poly bags, labels">
              <NumberInput value={prepCost} onChange={setPrepCost} prefix="£" step={0.05} />
            </Field>
            <Field label="Other (PPC, ads, etc.)">
              <NumberInput value={otherCosts} onChange={setOtherCosts} prefix="£" step={0.05} />
            </Field>
          </div>

          <SectionTitle icon={Box}>Storage</SectionTitle>
          <div className="space-y-3">
            <Field label="Estimated months in storage">
              <NumberInput value={monthsStorage} onChange={setMonthsStorage} step={0.5} min={0} />
            </Field>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
              {[
                { value: false, label: "Jan–Sep" },
                { value: true, label: "Oct–Dec" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setIsPeakStorage(opt.value)}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${
                    isPeakStorage === opt.value
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <SectionTitle icon={Percent}>VAT & Plan</SectionTitle>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-stone-500 font-medium">VAT Registered</label>
              <button
                onClick={() => setVatRegistered(!vatRegistered)}
                className={`w-8 h-4 rounded-full transition-colors relative ${vatRegistered ? "bg-orange-500" : "bg-stone-300"}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${vatRegistered ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            {vatRegistered && (
              <Field label="VAT rate">
                <select
                  value={vatRatePct}
                  onChange={(e) => setVatRatePct(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-orange-400"
                >
                  <option value={20}>20% (Standard)</option>
                  <option value={5}>5% (Reduced)</option>
                  <option value={0}>0% (Zero)</option>
                </select>
              </Field>
            )}

            <Field label="Seller plan">
              <select
                value={sellerPlan}
                onChange={(e) => setSellerPlan(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-orange-400"
              >
                <option value="professional">Professional (£25/mo)</option>
                <option value="individual">Individual (£0.75/sale)</option>
              </select>
            </Field>
            {sellerPlan === "professional" && (
              <Field label="Monthly volume" hint="To amortise monthly fee">
                <NumberInput value={monthlyUnitsSold} onChange={setMonthlyUnitsSold} step={1} min={1} />
              </Field>
            )}
          </div>
        </div>

        {/* ── RIGHT: Results ────────────────────────────────────── */}
        <div className="p-5">

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1 shadow-inner">
            {[
              { id: "breakdown", label: "Breakdown", icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: "fees", label: "Fee Detail", icon: <Receipt className="w-3.5 h-3.5" /> },
              { id: "monthly", label: "Projected", icon: <TrendingUp className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-stone-800 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Breakdown tab */}
          {activeTab === "breakdown" && (
            <div className="space-y-6">
              {/* Waterfall */}
              <div className="space-y-3">
                {waterfallItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className={`text-[11px] w-36 shrink-0 ${item.bold ? "font-bold text-stone-800" : "text-stone-400 font-medium"}`}>
                      {item.label}
                    </span>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 bg-stone-50 rounded-full h-4 overflow-hidden border border-stone-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            item.bold && item.label === "Net profit"
                              ? item.positive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-red-400"
                              : item.positive
                              ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.2)]"
                              : "bg-stone-300"
                          }`}
                          style={{ width: `${(Math.abs(item.value) / maxAbsVal) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold w-20 text-right tabular-nums ${
                        item.label === "Net profit"
                          ? profitColor(result.netProfit)
                          : item.positive ? "text-sky-700" : "text-stone-600"
                      }`}>
                        {item.positive ? "+" : ""}{formatGBP(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key metrics cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: "Referral Fee", value: formatGBP(result.referralFee), sub: formatPct(result.referralFeePct) },
                  { label: "Fulfilment", value: formatGBP(result.fbaFulfilmentFee), sub: result.fbaFulfilmentLabel },
                  { label: "Storage", value: formatGBP(result.storageFeeTotalForHold), sub: `${monthsStorage} months` },
                  { label: "Total FBA Fees", value: formatGBP(result.totalAmazonFees), sub: formatPct((result.totalAmazonFees / result.salePrice) * 100) },
                  { label: "Total All-in Cost", value: formatGBP(result.totalCosts), sub: "Inc product cost" },
                  { label: "Break-even Price", value: formatGBP(result.breakEvenPrice), sub: "Target price" },
                ].map((m) => (
                  <div key={m.label} className="bg-stone-50 border border-stone-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight mb-1">{m.label}</p>
                    <p className="text-lg font-bold text-stone-800">{m.value}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              {vatRegistered && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start">
                  <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                    <Percent className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-[11px] text-amber-800 leading-relaxed">
                    <p className="font-bold mb-0.5">VAT Registered Economics</p>
                    You collect <strong>{formatGBP(result.vatOnSale)}</strong> VAT per sale to remit to HMRC. 
                    Profit is calculated on the ex-VAT revenue of <strong>{formatGBP(result.salePriceExVat)}</strong>.
                    Referral fees are calculated on the <strong>gross</strong> selling price.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fee detail tab */}
          {activeTab === "fees" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Amazon Service Fees</p>
                  <p className="text-xs text-stone-400">Per unit sold</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: `Referral Fee (${CATEGORIES.find(c=>c.id===categoryId)?.label})`, value: result.referralFee, pct: result.referralPctOfSale },
                      { label: `FBA Fulfilment (${result.fbaFulfilmentLabel})`, value: result.fbaFulfilmentFee, pct: result.fbaFulfilmentPctOfSale },
                      { label: `Storage Cost (est. ${monthsStorage} months)`, value: result.storageFeeTotalForHold, pct: result.storagePctOfSale },
                      { label: "Seller Account Subscription (Amortised)", value: result.sellerPlanFeePerUnit, pct: (result.sellerPlanFeePerUnit / result.salePrice) * 100 },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4 text-stone-600 text-[11px] font-medium">{row.label}</td>
                        <td className="py-3 px-4 text-right font-bold text-stone-800 text-[11px] tabular-nums">{formatGBP(row.value)}</td>
                        <td className="py-3 px-4 text-right text-stone-400 text-[10px] font-bold tabular-nums">{formatPct(row.pct)}</td>
                      </tr>
                    ))}
                    <tr className="bg-stone-50/50">
                      <td className="py-3 px-4 font-bold text-stone-900 text-xs">Total Selling Fees</td>
                      <td className="py-3 px-4 text-right font-black text-stone-900 text-xs tabular-nums">{formatGBP(result.totalAmazonFees)}</td>
                      <td className="py-3 px-4 text-right font-bold text-stone-700 text-[11px] tabular-nums">{formatPct((result.totalAmazonFees / result.salePrice) * 100)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Product & Sourcing Costs</p>
                  <p className="text-xs text-stone-400">Per unit landed</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "Unit Product Cost (COGS)", value: result.costPrice },
                      { label: "Inbound Freight & Shipping", value: result.inboundShipping },
                      { label: "Preparation & Labelling", value: result.prepCost },
                      { label: "Marketing / PPC Allowance", value: result.otherCosts },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4 text-stone-600 text-[11px] font-medium">{row.label}</td>
                        <td className="py-3 px-4 text-right font-bold text-stone-800 text-[11px] tabular-nums">{formatGBP(row.value)}</td>
                      </tr>
                    ))}
                    <tr className="bg-stone-50/50">
                      <td className="py-3 px-4 font-bold text-stone-900 text-xs">Total Landed Costs</td>
                      <td className="py-3 px-4 text-right font-black text-stone-900 text-xs tabular-nums">{formatGBP(result.totalCosts)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Monthly projection tab */}
          {activeTab === "monthly" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Units Sold", value: monthlyUnitsSold.toLocaleString("en-GB"), sub: "Per month" },
                  { label: "Monthly Sales", value: result.monthlyRevenue ? formatGBP(result.monthlyRevenue) : "—", sub: "Ex-VAT" },
                  { label: "Amazon Fees", value: result.monthlyAmazonFees ? formatGBP(result.monthlyAmazonFees) : "—", accent: "amber" as const, sub: "Revenue share" },
                  { label: "Monthly Profit", value: result.monthlyProfit ? formatGBP(result.monthlyProfit) : "—", accent: result.netProfit >= 0 ? "green" as const : "red" as const, sub: "Net take-home" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className={`rounded-2xl p-5 border shadow-sm transition-transform hover:scale-[1.02] ${
                      m.accent === "green" ? "bg-emerald-50 border-emerald-100" : 
                      m.accent === "amber" ? "bg-amber-50 border-amber-100" : 
                      m.accent === "red" ? "bg-red-50 border-red-100" : 
                      "bg-white border-stone-100"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">{m.label}</p>
                    <p className="text-2xl font-black text-stone-900 tabular-nums leading-none">{m.value}</p>
                    <p className="text-[10px] text-stone-400 mt-2 font-medium">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Scale table */}
              <div>
                <p className="text-xs font-bold text-stone-400 mb-3 uppercase tracking-wider">Profitability Scalability</p>
                <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                  <table className="w-full text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4 text-left text-stone-500 font-bold uppercase tracking-tighter">Units/mo</th>
                        <th className="py-3 px-4 text-right text-stone-500 font-bold uppercase tracking-tighter">Account Fee</th>
                        <th className="py-3 px-4 text-right text-stone-500 font-bold uppercase tracking-tighter">Profit/Unit</th>
                        <th className="py-3 px-4 text-right text-stone-500 font-bold uppercase tracking-tighter">Total Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[10, 25, 50, 100, 250, 500, 1000].map((units) => {
                        const planFee = sellerPlan === "individual" ? 0.75 : 25 / units;
                        const adj = result.netProfit - result.sellerPlanFeePerUnit + planFee;
                        const isCurrent = units === monthlyUnitsSold;
                        return (
                          <tr key={units} className={`border-b border-stone-100 last:border-0 transition-colors ${isCurrent ? "bg-orange-50 font-bold" : "hover:bg-stone-50/50"}`}>
                            <td className="py-3 px-4 text-stone-700">{units.toLocaleString()} {isCurrent && "★"}</td>
                            <td className="py-3 px-4 text-right text-stone-500 font-medium">{formatGBP(planFee)}</td>
                            <td className={`py-3 px-4 text-right font-bold ${profitColor(adj)}`}>{formatGBP(adj)}</td>
                            <td className={`py-3 px-4 text-right font-black ${profitColor(adj * units)}`}>{formatGBP(adj * units)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-100 flex gap-3 items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  <p className="text-[10px] text-stone-500 leading-snug">
                    <span className="font-bold text-stone-700">Volume Strategy:</span> 
                    The Professional plan (£25/mo) is more cost-effective than the Individual plan (£0.75/unit) 
                    once you exceed <strong>33 sales per month</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
