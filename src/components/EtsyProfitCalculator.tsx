"use client";

import { useState, useMemo } from "react";
import {
  calculateEtsy,
  formatCurrency,
  formatPct,
  CURRENCIES,
  PROCESSING_RATES,
  type EtsyInputs,
  type CurrencyCode,
  type ProcessingCountry,
  type OffsiteAdsThreshold,
} from "@/lib/etsyCalculator";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Package,
  Percent,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Minus,
} from "lucide-react";

// ── Small helpers ─────────────────────────────────────────────────

function Field({
  label,
  children,
  hint,
  icon: Icon,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-stone-400" />}
        <label className="block text-xs text-stone-500 font-semibold uppercase tracking-wide">
          {label}
        </label>
      </div>
      {children}
      {hint && <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">{hint}</p>}
    </div>
  );
}

function NumInput({
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  step = 0.01,
  placeholder = "0.00",
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
        <span className="absolute left-3 text-stone-400 text-sm pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value || ""}
        min={min}
        step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all ${
          prefix ? "pl-7 pr-3" : suffix ? "pl-3 pr-8" : "px-3"
        }`}
      />
      {suffix && (
        <span className="absolute right-3 text-stone-400 text-sm pointer-events-none select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-orange-500" : "bg-stone-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-xs text-stone-600 font-medium group-hover:text-stone-900 transition-colors">
        {label}
      </span>
    </label>
  );
}

function SectionTitle({
  children,
  icon: Icon,
  expanded,
  onToggle,
  collapsible = false,
}: {
  children: React.ReactNode;
  icon?: React.ElementType;
  expanded?: boolean;
  onToggle?: () => void;
  collapsible?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between mb-4 pb-2 border-b border-stone-100 ${collapsible ? "cursor-pointer" : ""}`}
      onClick={collapsible ? onToggle : undefined}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-orange-500" />}
        <span className="text-sm font-bold text-stone-800">{children}</span>
      </div>
      {collapsible &&
        (expanded ? (
          <ChevronUp className="w-4 h-4 text-stone-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400" />
        ))}
    </div>
  );
}

function ResultRow({
  label,
  value,
  sub,
  highlight = false,
  negative = false,
  large = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  negative?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${highlight ? "bg-stone-50 -mx-3 px-3 rounded-lg" : ""}`}
    >
      <div>
        <p className={`${large ? "text-sm font-bold" : "text-xs"} text-stone-600`}>{label}</p>
        {sub && <p className="text-[10px] text-stone-400">{sub}</p>}
      </div>
      <span
        className={`font-bold tabular-nums ${large ? "text-lg" : "text-sm"} ${
          negative ? "text-red-500" : highlight ? "text-stone-900" : "text-stone-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main Calculator ───────────────────────────────────────────────

const DEFAULT_INPUTS: EtsyInputs = {
  salePrice: 25,
  shippingCharged: 5,
  materialCost: 4,
  laborCost: 3,
  shippingCost: 4,
  packagingCost: 0.5,
  otherCosts: 0.5,
  currency: "USD",
  paymentProcessingCountry: "US",
  useOffsiteAds: false,
  offsiteAdsSales: "under10k",
  listingFeeIncluded: true,
  etsyPlusIncluded: false,
  unitsPerMonth: 20,
};

export default function EtsyProfitCalculator() {
  const [inputs, setInputs] = useState<EtsyInputs>(DEFAULT_INPUTS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = <K extends keyof EtsyInputs>(key: K, value: EtsyInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const results = useMemo(() => calculateEtsy(inputs), [inputs]);
  const cur = inputs.currency;
  const fmt = (n: number) => formatCurrency(n, cur);

  const profitColor =
    results.netProfit > 0
      ? "text-emerald-600"
      : results.netProfit === 0
      ? "text-stone-500"
      : "text-red-600";

  const marginStatus =
    results.netMargin >= 0.3
      ? { icon: CheckCircle, color: "text-emerald-600", label: "Healthy margin" }
      : results.netMargin >= 0.15
      ? { icon: AlertCircle, color: "text-amber-600", label: "Thin margin" }
      : { icon: Minus, color: "text-red-500", label: "Below target" };

  const MarginIcon = marginStatus.icon;

  return (
    <div className="rounded-3xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        {/* ── LEFT: Inputs ─────────────────────────────────────── */}
        <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-stone-100">
          {/* Currency + Country */}
          <div className="mb-6">
            <SectionTitle icon={DollarSign}>Currency & Location</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Currency">
                <select
                  value={inputs.currency}
                  onChange={(e) => set("currency", e.target.value as CurrencyCode)}
                  className="w-full py-2.5 px-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-orange-400 transition-all"
                >
                  {Object.entries(CURRENCIES).map(([code, { label }]) => (
                    <option key={code} value={code}>
                      {code} — {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Country (Processing)">
                <select
                  value={inputs.paymentProcessingCountry}
                  onChange={(e) =>
                    set("paymentProcessingCountry", e.target.value as ProcessingCountry)
                  }
                  className="w-full py-2.5 px-3 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-orange-400 transition-all"
                >
                  {Object.entries(PROCESSING_RATES).map(([code, { label }]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <SectionTitle icon={ShoppingBag}>Listing Price & Shipping</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sale Price" hint="Your listing price (excl. shipping)">
                <NumInput
                  value={inputs.salePrice}
                  onChange={(v) => set("salePrice", v)}
                  prefix={CURRENCIES[cur].symbol}
                />
              </Field>
              <Field label="Shipping Charged" hint="What you charge buyer for shipping">
                <NumInput
                  value={inputs.shippingCharged}
                  onChange={(v) => set("shippingCharged", v)}
                  prefix={CURRENCIES[cur].symbol}
                />
              </Field>
            </div>
          </div>

          {/* Costs */}
          <div className="mb-6">
            <SectionTitle icon={Package}>Your Costs Per Unit</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Materials / COGS" hint="Cost of goods sold">
                <NumInput
                  value={inputs.materialCost}
                  onChange={(v) => set("materialCost", v)}
                  prefix={CURRENCIES[cur].symbol}
                />
              </Field>
              <Field label="Your Labor" hint="Value of your time per unit">
                <NumInput
                  value={inputs.laborCost}
                  onChange={(v) => set("laborCost", v)}
                  prefix={CURRENCIES[cur].symbol}
                />
              </Field>
              <Field label="Actual Shipping" hint="What you pay to ship">
                <NumInput
                  value={inputs.shippingCost}
                  onChange={(v) => set("shippingCost", v)}
                  prefix={CURRENCIES[cur].symbol}
                />
              </Field>
              <Field label="Packaging" hint="Boxes, tissue, stickers, etc.">
                <NumInput
                  value={inputs.packagingCost}
                  onChange={(v) => set("packagingCost", v)}
                  prefix={CURRENCIES[cur].symbol}
                />
              </Field>
              <Field label="Other Costs" hint="Props, tools (amortized), etc.">
                <NumInput
                  value={inputs.otherCosts}
                  onChange={(v) => set("otherCosts", v)}
                  prefix={CURRENCIES[cur].symbol}
                />
              </Field>
            </div>
          </div>

          {/* Etsy Fee Options */}
          <div className="mb-6">
            <SectionTitle icon={Percent}>Etsy Fee Options</SectionTitle>
            <div className="space-y-3">
              <Toggle
                checked={inputs.listingFeeIncluded}
                onChange={(v) => set("listingFeeIncluded", v)}
                label="Include $0.20 listing fee per sale"
              />
              <Toggle
                checked={inputs.etsyPlusIncluded}
                onChange={(v) => set("etsyPlusIncluded", v)}
                label="Include Etsy Plus ($10/mo) apportioned per unit"
              />
              <Toggle
                checked={inputs.useOffsiteAds}
                onChange={(v) => set("useOffsiteAds", v)}
                label="Include Offsite Ads fee"
              />
              {inputs.useOffsiteAds && (
                <div className="ml-10 mt-2">
                  <p className="text-xs text-stone-500 mb-2">Annual sales threshold:</p>
                  <div className="flex gap-3">
                    {(
                      [
                        { val: "under10k", label: "Under $10k (12%)" },
                        { val: "over10k", label: "Over $10k (15%, mandatory)" },
                      ] as { val: OffsiteAdsThreshold; label: string }[]
                    ).map(({ val, label }) => (
                      <button
                        key={val}
                        onClick={() => set("offsiteAdsSales", val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          inputs.offsiteAdsSales === val
                            ? "bg-orange-100 text-orange-700 border border-orange-300"
                            : "bg-stone-100 text-stone-500 border border-transparent hover:bg-stone-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced */}
          <div>
            <button
              onClick={() => setShowAdvanced((p) => !p)}
              className="flex items-center gap-2 text-xs text-stone-400 hover:text-orange-600 transition-colors font-medium"
            >
              {showAdvanced ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {showAdvanced ? "Hide" : "Show"} advanced options
            </button>
            {showAdvanced && (
              <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <Field
                  label="Units sold per month"
                  hint="Used to apportion Etsy Plus monthly fee per unit"
                >
                  <NumInput
                    value={inputs.unitsPerMonth}
                    onChange={(v) => set("unitsPerMonth", Math.max(1, v))}
                    min={1}
                    step={1}
                    placeholder="20"
                  />
                </Field>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Results ────────────────────────────────────── */}
        <div className="p-6 lg:p-8 bg-stone-50/50">
          {/* Net Profit Hero */}
          <div className="mb-6 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">
              Net Profit Per Sale
            </p>
            <p className={`text-4xl font-black tabular-nums ${profitColor}`}>
              {results.netProfit < 0 ? "-" : ""}
              {fmt(Math.abs(results.netProfit))}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <MarginIcon className={`w-3.5 h-3.5 ${marginStatus.color}`} />
              <span className={`text-xs font-semibold ${marginStatus.color}`}>
                {marginStatus.label} — {formatPct(results.netMargin)} margin
              </span>
            </div>
          </div>

          {/* Revenue & Cost Summary */}
          <div className="mb-4 space-y-0.5">
            <ResultRow label="Gross Revenue" value={fmt(results.grossRevenue)} />
            <div className="border-t border-stone-100 my-1" />
            <ResultRow
              label="Your Total Costs"
              value={`-${fmt(results.totalCosts)}`}
              negative
            />
            <ResultRow
              label="Total Etsy Fees"
              value={`-${fmt(results.fees.totalEtsyFees)}`}
              negative
            />
            <div className="border-t border-stone-200 my-1" />
            <ResultRow
              label="Net Profit"
              value={(results.netProfit < 0 ? "-" : "") + fmt(Math.abs(results.netProfit))}
              highlight
              large
            />
          </div>

          {/* Fee Breakdown */}
          <div className="mt-5 p-4 rounded-2xl bg-white border border-stone-200">
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">
              Etsy Fee Breakdown
            </p>
            <div className="space-y-1.5">
              <ResultRow
                label="Transaction Fee (6.5%)"
                value={fmt(results.fees.transactionFee)}
                sub={`on ${fmt(results.grossRevenue)} sale total`}
              />
              <ResultRow
                label="Payment Processing"
                sub={`${(PROCESSING_RATES[inputs.paymentProcessingCountry].rate * 100).toFixed(0)}% + ${CURRENCIES[cur].symbol}${CURRENCIES[cur].processingFlat.toFixed(2)}`}
                value={fmt(results.fees.processingFee)}
              />
              {inputs.listingFeeIncluded && (
                <ResultRow label="Listing Fee" value={`$${results.fees.listingFee.toFixed(2)}`} />
              )}
              {inputs.useOffsiteAds && (
                <ResultRow
                  label={`Offsite Ads (${inputs.offsiteAdsSales === "over10k" ? "15%" : "12%"})`}
                  value={fmt(results.fees.offsiteAdsFee)}
                />
              )}
              {inputs.etsyPlusIncluded && (
                <ResultRow
                  label="Etsy Plus (apportioned)"
                  value={fmt(results.fees.etsyPlusFee)}
                  sub={`$10/mo ÷ ${inputs.unitsPerMonth} units`}
                />
              )}
              <div className="border-t border-stone-100 mt-2 pt-2">
                <ResultRow
                  label="Total Etsy Fees"
                  value={fmt(results.fees.totalEtsyFees)}
                  highlight
                />
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              {
                label: "Net Margin",
                value: formatPct(results.netMargin),
                sub: "of gross revenue",
                good: results.netMargin >= 0.2,
              },
              {
                label: "ROI",
                value: formatPct(results.roi),
                sub: "return on costs",
                good: results.roi >= 0.5,
              },
              {
                label: "Break-even",
                value: fmt(results.breakevenPrice),
                sub: "min listing price",
                good: inputs.salePrice >= results.breakevenPrice,
              },
            ].map(({ label, value, sub, good }) => (
              <div
                key={label}
                className={`p-3 rounded-xl border text-center ${
                  good
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-amber-50 border-amber-100"
                }`}
              >
                <p
                  className={`text-base font-black tabular-nums ${
                    good ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {value}
                </p>
                <p className="text-[9px] uppercase tracking-wide font-bold text-stone-500 mt-0.5">
                  {label}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Tip */}
          {results.netProfit < 0 && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex gap-2">
              <Info className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-700 leading-relaxed">
                <strong>You&apos;re losing money.</strong> Try raising your listing price to at least{" "}
                <strong>{fmt(results.breakevenPrice)}</strong> to break even, or reduce material
                and shipping costs.
              </p>
            </div>
          )}

          {results.netMargin > 0 && results.netMargin < 0.15 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Margin is below 15% — the recommended minimum for a sustainable Etsy shop. Consider
                optimizing packaging costs or raising your price by{" "}
                <strong>{fmt(results.breakevenPrice * 0.18 - inputs.salePrice)}</strong>.
              </p>
            </div>
          )}

          {results.netMargin >= 0.3 && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                <strong>Strong margin!</strong> You have room to invest in Etsy Ads, photography,
                or premium packaging without hurting profitability.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="mt-5 text-[10px] text-stone-400 leading-relaxed">
            Fee data current as of 2025. Etsy updates fees periodically — verify at{" "}
            <a
              href="https://www.etsy.com/seller-fees"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-orange-500 transition-colors"
            >
              etsy.com/seller-fees
            </a>
            . For informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
