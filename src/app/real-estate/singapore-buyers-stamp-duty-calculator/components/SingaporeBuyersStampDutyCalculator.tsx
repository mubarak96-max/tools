"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import {
  Building2,
  Calculator,
  Check,
  Clipboard,
  FileText,
  Globe2,
  Home,
  Info,
  Landmark,
  Printer,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  ABSD_TABLE,
  BSD_TABLE,
  BUYER_PROFILES,
  calculateStampDuty,
  formatSGD,
  parsePrice,
  type BuyerProfile,
  type PropertyType,
} from "@/app/real-estate/singapore-buyers-stamp-duty-calculator/lib/stampDuty";

const PRESET_PRICES = [
  { label: "S$500k", value: 500_000 },
  { label: "S$1M", value: 1_000_000 },
  { label: "S$1.5M", value: 1_500_000 },
  { label: "S$2M", value: 2_000_000 },
  { label: "S$3M", value: 3_000_000 },
  { label: "S$5M", value: 5_000_000 },
];

const profileGroups = [
  { key: "citizen", label: "Singapore Citizen", icon: ShieldCheck },
  { key: "pr", label: "Singapore PR", icon: Users },
  { key: "other", label: "Other Buyers", icon: Globe2 },
] as const;

export default function SingaporeBuyersStampDutyCalculator() {
  const [priceInput, setPriceInput] = useState("");
  const [price, setPrice] = useState(0);
  const [profile, setProfile] = useState<BuyerProfile>("sc_first");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [activeTab, setActiveTab] = useState<"results" | "rates">("results");
  const [copied, setCopied] = useState(false);

  const result = price > 0 ? calculateStampDuty(price, profile, propertyType) : null;
  const selectedProfile = BUYER_PROFILES.find((item) => item.value === profile);

  function handlePriceChange(value: string) {
    setPriceInput(value);
    setPrice(parsePrice(value));
  }

  function handlePreset(value: number) {
    setPrice(value);
    setPriceInput(value.toLocaleString("en-SG"));
  }

  function handleCopy() {
    if (!result) return;

    const lines = [
      "Singapore Stamp Duty Calculation",
      `Property Price: ${formatSGD(price)}`,
      `Buyer Profile: ${selectedProfile?.label ?? profile}`,
      `Property Type: ${propertyType === "residential" ? "Residential" : "Non-residential"}`,
      "",
      ...result.breakdown.map((item) => `${item.label}: ${formatSGD(item.amount)} (${item.rate})`),
      "",
      `TOTAL STAMP DUTY: ${formatSGD(result.total)}`,
      `Effective Rate: ${result.effectiveRate}`,
      "",
      typeof window !== "undefined" ? `Calculated at ${window.location.href}` : "",
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
      <section className="xl:sticky xl:top-24">
        <div className="overflow-hidden rounded-[2rem] border border-[#d7dce7] bg-white shadow-[0_20px_60px_rgba(13,35,64,0.08)]">
          <div className="bg-[linear-gradient(135deg,#0d2340_0%,#1e3a5f_100%)] px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold tracking-tight">Stamp Duty Calculator</h2>
                <p className="text-sm text-white/70">BSD and ABSD using the April 2023 schedule</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
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
              <div className="space-y-4">
                <Label>Buyer Profile</Label>
                {profileGroups.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{label}</span>
                    </div>
                    <div className="space-y-2">
                      {BUYER_PROFILES.filter((item) => item.group === key).map((item) => (
                        <ProfileButton
                          key={item.value}
                          item={item}
                          selected={profile === item.value}
                          onSelect={setProfile}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                Buyer profile does not change the result for non-residential property because ABSD is not applied in this calculator.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sg-price">Purchase Price</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#c0152a]">
                  S$
                </span>
                <input
                  id="sg-price"
                  type="text"
                  inputMode="numeric"
                  value={priceInput}
                  onChange={(event) => handlePriceChange(event.target.value)}
                  placeholder="e.g. 1,500,000"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-[#c0152a] focus:ring-4 focus:ring-[#c0152a]/10"
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
                        ? "border-[#c0152a] bg-[#c0152a] text-white shadow-[0_8px_20px_rgba(192,21,42,0.2)]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-[#e8304a] hover:text-slate-900"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[#f1c6ce] bg-[linear-gradient(160deg,#fff_0%,#fdf0f2_100%)] px-5 py-6 text-center shadow-[0_16px_40px_rgba(192,21,42,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Total Stamp Duty Payable
                  </p>
                  <p className="mt-3 bg-[linear-gradient(135deg,#8a0f1e_0%,#e8304a_60%,#8a0f1e_100%)] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                    {formatSGD(result.total)}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge tone="red">Effective: {result.effectiveRate}</Badge>
                    {result.absd > 0 ? <Badge tone="blue">ABSD: {result.absdRate}</Badge> : null}
                    {result.absd === 0 && propertyType === "residential" ? <Badge tone="green">0% ABSD</Badge> : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricCard
                    label="BSD"
                    value={formatSGD(result.bsd)}
                    detail="progressive"
                    tone="slate"
                  />
                  <MetricCard
                    label="ABSD"
                    value={result.absd > 0 ? formatSGD(result.absd) : "None"}
                    detail={result.absd > 0 ? `flat ${result.absdRate}` : "not applicable"}
                    tone={result.absd > 0 ? "red" : "slate"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
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
                        key={item.label}
                        className="flex flex-col gap-4 rounded-[1.25rem] border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                        <div className="shrink-0 text-left sm:text-right">
                          <p className="text-base font-bold text-slate-900">{formatSGD(item.amount)}</p>
                          <Badge tone="red">{item.rate}</Badge>
                        </div>
                      </div>
                    ))}

                    {result.notes.length > 0 ? (
                      <div className="rounded-[1.25rem] border border-blue-200 bg-blue-50 p-4">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-900">
                          <Info className="h-4 w-4" />
                          Notes
                        </div>
                        <div className="space-y-2">
                          {result.notes.map((note) => (
                            <div
                              key={note}
                              className="border-l-2 border-blue-400 pl-3 text-sm leading-6 text-blue-900"
                            >
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
                      title="Buyer's Stamp Duty (BSD) - All properties"
                      headers={["Amount Band", "Rate"]}
                      rows={BSD_TABLE.map((row) => [row.range, row.rate])}
                    />
                    <RateTable
                      title="Additional Buyer's Stamp Duty (ABSD) - Residential only"
                      headers={["Buyer Profile", "ABSD Rate"]}
                      rows={ABSD_TABLE.map((row) => [row.profile, row.rate])}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <ActionButton onClick={handleCopy} icon={copied ? Check : Clipboard}>
                    {copied ? "Copied" : "Copy Result"}
                  </ActionButton>
                  <ActionButton onClick={() => window.print()} icon={Printer}>
                    Print
                  </ActionButton>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
                  <Calculator className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm text-slate-600">Enter a property price above to calculate instantly.</p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-6 text-slate-500">
          Estimate only. Confirm duty treatment with IRAS guidance and your conveyancing team before transacting.
        </p>
      </section>

      <section className="space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,#fff_0%,#f8fafc_100%)] p-6 shadow-[0_20px_60px_rgba(13,35,64,0.06)] sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Pill icon={Landmark}>BSD bands effective 15 Feb 2023</Pill>
            <Pill icon={TrendingUp}>ABSD revision effective 27 Apr 2023</Pill>
            <Pill icon={FileText}>Residential and non-residential modes</Pill>
          </div>

          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
            How Singapore buyer stamp duty works
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Singapore property acquisitions usually require two separate checks. BSD applies on a progressive
            basis to the full property value, while ABSD applies only to residential purchases and depends on
            buyer status plus existing residential ownership.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <GuideCard
              icon={FileText}
              title="BSD applies to everyone"
              body="The calculator uses the same 1% to 6% BSD bands for residential and non-residential property, with the effective rate shown for easier budgeting."
            />
            <GuideCard
              icon={Home}
              title="ABSD is residential-only"
              body="ABSD can range from 0% for a Singapore Citizen's first residential property to 65% for an entity purchase."
            />
            <GuideCard
              icon={Globe2}
              title="Foreigner treatment is severe"
              body="The supplied schedule models a 60% ABSD rate for foreigners after the 27 April 2023 cooling measures."
            />
            <GuideCard
              icon={Building2}
              title="Commercial property stays simpler"
              body="Non-residential property remains a BSD-only calculation here, which makes it useful for quick commercial acquisition budgeting."
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(13,35,64,0.06)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0d2340]/10 text-[#0d2340]">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">Worked examples</h3>
                <p className="text-sm text-slate-500">Using the same April 2023 buyer-duty schedule</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <ScenarioCard
                title="S$2,000,000 first home for a Singapore Citizen"
                summary="BSD only"
                total="S$64,600"
                details="No ABSD applies. The buyer pays progressive BSD only."
              />
              <ScenarioCard
                title="S$1,200,000 first residential property for a Singapore PR"
                summary="BSD + 5% ABSD"
                total="S$91,600"
                details="BSD is S$31,600 and ABSD is S$60,000 under the supplied schedule."
              />
              <ScenarioCard
                title="S$2,000,000 residential purchase by a foreigner"
                summary="BSD + 60% ABSD"
                total="S$1,264,600"
                details="A large majority of the tax burden comes from ABSD after the 27 Apr 2023 revision."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-200 bg-[linear-gradient(145deg,#fff8e8_0%,#fff2cd_100%)] p-6 shadow-[0_18px_40px_rgba(212,160,23,0.14)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                <TrendingUp className="h-4 w-4" />
                Key Measures Reflected Here
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-950">
                <li>ABSD rates reflect the 27 April 2023 revision.</li>
                <li>Foreigner purchases are modeled at 60% ABSD for residential property.</li>
                <li>Entity purchases are modeled at 65% ABSD before any remission analysis.</li>
                <li>Commercial and industrial purchases are treated as BSD-only in this tool.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(13,35,64,0.06)]">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Info className="h-4 w-4" />
                Practical Notes
              </div>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                <p>
                  Stamp duty is generally assessed on the higher of the purchase price and market value. This page
                  assumes those figures are the same because the provided logic uses a single price input.
                </p>
                <p>
                  Replacement-home remissions, free-trade-agreement treatment, and trust or developer remission issues
                  require legal review beyond a quick calculator estimate.
                </p>
                <p>
                  Use the output here for budgeting, scenario comparison, and negotiation planning, then confirm the
                  final treatment with your conveyancing solicitor before completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
    >
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
          ? "bg-[#c0152a] text-white shadow-[0_10px_24px_rgba(192,21,42,0.28)]"
          : "text-slate-600 hover:bg-white hover:text-slate-900"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function ProfileButton({
  item,
  selected,
  onSelect,
}: {
  item: (typeof BUYER_PROFILES)[number];
  selected: boolean;
  onSelect: (value: BuyerProfile) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.value)}
      className={`flex w-full items-center justify-between rounded-[1rem] border px-4 py-3 text-left transition ${
        selected
          ? "border-[#c0152a] bg-[#fdf0f2] shadow-[0_10px_24px_rgba(192,21,42,0.08)]"
          : "border-slate-200 bg-white hover:border-[#e8304a]/50 hover:bg-slate-50"
      }`}
    >
      <div>
        <p className={`text-sm font-semibold ${selected ? "text-[#8a0f1e]" : "text-slate-900"}`}>{item.label}</p>
        <p className="text-xs text-slate-500">{item.sub}</p>
      </div>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
          selected ? "border-[#c0152a] bg-[#c0152a]" : "border-slate-300"
        }`}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
    </button>
  );
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "red" | "green" | "blue";
}) {
  const styles = {
    red: "bg-rose-100 text-rose-800",
    green: "bg-emerald-100 text-emerald-800",
    blue: "bg-blue-100 text-blue-800",
  }[tone];

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${styles}`}>
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "slate" | "red";
}) {
  return (
    <div
      className={`rounded-[1.25rem] px-4 py-4 ${
        tone === "red" ? "bg-rose-50" : "bg-slate-100"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-2 text-lg font-bold ${tone === "red" ? "text-[#c0152a]" : "text-[#0d2340]"}`}>{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1rem] px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-[#c0152a] text-white shadow-[0_8px_20px_rgba(192,21,42,0.24)]" : "text-slate-600 hover:bg-white hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function RateTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: [string, string];
  rows: Array<[string, string]>;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="overflow-hidden rounded-[1.25rem] border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#0d2340] text-left text-white">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-700">{row[0]}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-800">
                    {row[1]}
                  </span>
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
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#c0152a]/40 hover:text-slate-950"
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );
}

function Pill({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function GuideCard({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0d2340]/10 text-[#0d2340]">
        <Icon className="h-5 w-5" />
      </div>
      <h4 className="mt-4 text-base font-semibold text-slate-950">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function ScenarioCard({
  title,
  summary,
  total,
  details,
}: {
  title: string;
  summary: string;
  total: string;
  details: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{summary}</p>
        </div>
        <span className="rounded-full bg-[#c0152a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
          {total}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{details}</p>
    </div>
  );
}
