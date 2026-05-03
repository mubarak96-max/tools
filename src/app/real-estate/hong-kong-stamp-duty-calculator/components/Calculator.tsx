"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import {
  Building2,
  Calculator as CalculatorIcon,
  Check,
  Clipboard,
  Globe2,
  Home,
  Printer,
  UserRound,
} from "lucide-react";

import {
  SCALE1_TABLE,
  SCALE2_TABLE,
  calculateStampDuty,
  formatHKD,
  parsePrice,
  type BuyerType,
  type PropertyType,
} from "@/app/real-estate/hong-kong-stamp-duty-calculator/lib/stampDuty";

const BUYER_TYPES: Array<{ value: BuyerType; label: string; sub: string; icon: ComponentType<{ className?: string }> }> = [
  { value: "hk_resident_first", label: "HK Resident - 1st Home", sub: "Scale 1 rates", icon: Home },
  { value: "hk_resident_additional", label: "HK Resident - 2nd+ Home", sub: "Scale 2 + 7.5% Additional AVD", icon: UserRound },
  { value: "non_resident", label: "Non-Resident / Company", sub: "Scale 2 + 7.5% BSD", icon: Globe2 },
];

const PRESET_PRICES = [
  { label: "HK$3M", value: 3_000_000 },
  { label: "HK$5M", value: 5_000_000 },
  { label: "HK$8M", value: 8_000_000 },
  { label: "HK$12M", value: 12_000_000 },
  { label: "HK$20M", value: 20_000_000 },
];

export default function Calculator() {
  const [priceInput, setPriceInput] = useState("");
  const [price, setPrice] = useState(0);
  const [buyerType, setBuyerType] = useState<BuyerType>("hk_resident_first");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [activeTab, setActiveTab] = useState<"results" | "rates">("results");
  const [copied, setCopied] = useState(false);

  const result = price > 0 ? calculateStampDuty(price, buyerType, propertyType) : null;

  function handlePriceChange(value: string) {
    setPriceInput(value);
    setPrice(parsePrice(value));
  }

  function handlePreset(value: number) {
    setPrice(value);
    setPriceInput(value.toLocaleString("en-HK"));
  }

  function copyResult() {
    if (!result) return;

    const text = [
      "Hong Kong Stamp Duty Calculation",
      `Property Price: ${formatHKD(price)}`,
      `Buyer Type: ${BUYER_TYPES.find((item) => item.value === buyerType)?.label ?? buyerType}`,
      `Property Type: ${propertyType === "residential" ? "Residential" : "Non-residential"}`,
      "",
      ...result.breakdown.map((item) => `${item.label}: ${formatHKD(item.amount)} (${item.rate})`),
      "",
      `TOTAL STAMP DUTY: ${formatHKD(result.total)}`,
      `Effective Rate: ${result.effectiveRate}`,
      "",
      typeof window !== "undefined" ? `Calculated at ${window.location.href}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-[#ddd5c8] bg-white shadow-[0_20px_60px_rgba(26,22,18,0.08)]">
        <div className="bg-[linear-gradient(135deg,#1a1612_0%,#3d3530_100%)] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <CalculatorIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold tracking-tight">Stamp Duty Calculator</h2>
              <p className="text-sm text-white/65">Updated for 2024 and 2025 post-policy changes</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <Label>Property Type</Label>
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f2ede4] p-1.5">
              <SegmentButton
                active={propertyType === "residential"}
                icon={Home}
                label="Residential"
                onClick={() => setPropertyType("residential")}
              />
              <SegmentButton
                active={propertyType === "non_residential"}
                icon={Building2}
                label="Commercial"
                onClick={() => setPropertyType("non_residential")}
              />
            </div>
          </div>

          {propertyType === "residential" ? (
            <div className="space-y-3">
              <Label>Buyer Type</Label>
              <div className="space-y-2">
                {BUYER_TYPES.map((item) => (
                  <BuyerButton
                    key={item.value}
                    item={item}
                    selected={buyerType === item.value}
                    onSelect={setBuyerType}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.25rem] border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              Non-residential mode uses Scale 2 AVD only. BSD and Additional AVD do not apply here.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hk-price">Purchase Price</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#b8973a]">
                HK$
              </span>
              <input
                id="hk-price"
                type="text"
                inputMode="numeric"
                value={priceInput}
                onChange={(event) => handlePriceChange(event.target.value)}
                placeholder="e.g. 8,000,000"
                className="w-full rounded-2xl border border-[#ddd5c8] bg-white py-3.5 pl-14 pr-4 text-base text-[#1a1612] outline-none transition focus:border-[#b8973a] focus:ring-4 focus:ring-[#b8973a]/15"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_PRICES.map((preset) => {
              const active = price === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handlePreset(preset.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-[#b8973a] bg-[#b8973a] text-white shadow-[0_10px_20px_rgba(184,151,58,0.25)]"
                      : "border-[#ddd5c8] bg-white text-[#3d3530] hover:border-[#d4af5a] hover:text-[#1a1612]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-[#d4af5a] bg-[linear-gradient(160deg,#fff_0%,#fdfbf7_100%)] px-5 py-6 text-center shadow-[0_18px_40px_rgba(184,151,58,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b5e56]">Total Stamp Duty</p>
                <p className="mt-3 bg-[linear-gradient(135deg,#8a6e28_0%,#d4af5a_50%,#8a6e28_100%)] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                  {formatHKD(result.total)}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge tone="gold">Effective Rate: {result.effectiveRate}</Badge>
                  <Badge tone="blue">{formatHKD(price)} property</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f2ede4] p-1.5">
                <TabButton active={activeTab === "results"} onClick={() => setActiveTab("results")}>
                  Breakdown
                </TabButton>
                <TabButton active={activeTab === "rates"} onClick={() => setActiveTab("rates")}>
                  Rate Tables
                </TabButton>
              </div>

              {activeTab === "results" ? (
                <div className="space-y-3">
                  {result.breakdown.map((item) => (
                    <div
                      key={`${item.label}-${item.amount}`}
                      className="flex flex-col gap-4 rounded-[1.25rem] border border-[#ddd5c8] bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-[#1a1612]">{item.label}</p>
                        <p className="text-sm leading-6 text-[#6b5e56]">{item.description}</p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-base font-bold text-[#1a1612]">{formatHKD(item.amount)}</p>
                        <Badge tone="gold">{item.rate}</Badge>
                      </div>
                    </div>
                  ))}

                  {result.notes.length > 0 ? (
                    <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
                        <Check className="h-4 w-4" />
                        Notes and 2024 changes
                      </div>
                      <div className="space-y-2">
                        {result.notes.map((note) => (
                          <div key={note} className="border-l-2 border-emerald-500 pl-3 text-sm leading-6 text-emerald-900">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-5">
                  <RateTable
                    title="Scale 1 - HK residents buying a first property"
                    rows={SCALE1_TABLE.map((row) => [row.range, row.rate])}
                    tone="green"
                  />
                  <RateTable
                    title="Scale 2 - All other buyer scenarios"
                    rows={SCALE2_TABLE.map((row) => [row.range, row.rate])}
                    tone="gold"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <ActionButton onClick={copyResult} icon={copied ? Check : Clipboard}>
                  {copied ? "Copied" : "Copy Result"}
                </ActionButton>
                <ActionButton onClick={() => window.print()} icon={Printer}>
                  Print
                </ActionButton>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[#ddd5c8] bg-[#f9f6f0] px-5 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2ede4] text-[#6b5e56]">
                <CalculatorIcon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm text-[#6b5e56]">Enter a property price above to calculate your stamp duty instantly.</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs leading-6 text-[#6b5e56]">
        Results are estimates only. Verify the final duty with a licensed solicitor or the Inland Revenue Department before transacting.
      </p>
    </div>
  );
}

function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#6b5e56]">
      {children}
    </label>
  );
}

function SegmentButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[1rem] px-3 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#b8973a] text-white shadow-[0_10px_22px_rgba(184,151,58,0.28)]"
          : "text-[#6b5e56] hover:bg-white hover:text-[#1a1612]"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function BuyerButton({
  item,
  selected,
  onSelect,
}: {
  item: (typeof BUYER_TYPES)[number];
  selected: boolean;
  onSelect: (value: BuyerType) => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.value)}
      className={`flex w-full items-center justify-between rounded-[1rem] border px-4 py-3 text-left transition ${
        selected
          ? "border-[#b8973a] bg-[#fff8e7] shadow-[0_10px_24px_rgba(184,151,58,0.08)]"
          : "border-[#ddd5c8] bg-white hover:border-[#d4af5a]/60 hover:bg-[#f9f6f0]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl ${selected ? "bg-[#b8973a] text-white" : "bg-[#f2ede4] text-[#6b5e56]"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className={`text-sm font-semibold ${selected ? "text-[#8a6e28]" : "text-[#1a1612]"}`}>{item.label}</p>
          <p className="text-xs text-[#6b5e56]">{item.sub}</p>
        </div>
      </div>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-[#b8973a] bg-[#b8973a]" : "border-[#ddd5c8]"}`}>
        {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
    </button>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: "green" | "gold" | "blue" }) {
  const styles = {
    green: "bg-emerald-100 text-emerald-800",
    gold: "bg-amber-100 text-amber-800",
    blue: "bg-sky-100 text-sky-800",
  }[tone];

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${styles}`}>{children}</span>;
}

function TabButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1rem] px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-[#b8973a] text-white shadow-[0_8px_18px_rgba(184,151,58,0.24)]" : "text-[#6b5e56] hover:bg-white hover:text-[#1a1612]"
      }`}
    >
      {children}
    </button>
  );
}

function RateTable({
  title,
  rows,
  tone,
}: {
  title: string;
  rows: Array<[string, string]>;
  tone: "green" | "gold";
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#1a1612]">{title}</p>
      <div className="overflow-hidden rounded-[1.25rem] border border-[#ddd5c8]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#1a1612] text-left text-white">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Price Range</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-[#ddd5c8]">
                <td className="px-4 py-3 text-[#3d3530]">{row[0]}</td>
                <td className="px-4 py-3">
                  <Badge tone={tone}>{row[1]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  icon: Icon,
  onClick,
}: {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1rem] border border-[#ddd5c8] bg-white px-4 py-3 text-sm font-semibold text-[#3d3530] transition hover:border-[#b8973a]/40 hover:text-[#1a1612]"
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );
}
