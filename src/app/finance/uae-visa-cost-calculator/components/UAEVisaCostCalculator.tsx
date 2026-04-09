"use client";

import { useMemo, useState } from "react";

// ─── Visa data ────────────────────────────────────────────────────────────────

type VisaType = {
  id: string;
  label: string;
  description: string;
  govFee: number; // AED
  durationYears: number;
};

const VISA_TYPES: VisaType[] = [
  {
    id: "visit-30",
    label: "Visit Visa (30 days, single entry)",
    description: "Short stay for tourism or family visits",
    govFee: 300,
    durationYears: 0,
  },
  {
    id: "visit-60",
    label: "Visit Visa (60 days, single entry)",
    description: "Extended stay for tourism or family visits",
    govFee: 500,
    durationYears: 0,
  },
  {
    id: "visit-90",
    label: "Visit Visa (90 days, multiple entry)",
    description: "Long-stay multiple-entry tourism visa",
    govFee: 700,
    durationYears: 0,
  },
  {
    id: "employment-2yr",
    label: "Employment Residence Visa (2 years)",
    description: "Employer-sponsored. Includes work permit, entry permit & stamping. By law, employers must cover these costs.",
    govFee: 3500,
    durationYears: 2,
  },
  {
    id: "employment-3yr",
    label: "Employment Residence Visa (3 years)",
    description: "Employer-sponsored 3-year residency, common in free zones. By law, employers must cover these costs.",
    govFee: 4500,
    durationYears: 3,
  },
  {
    id: "green-5yr",
    label: "Green Visa (5 years)",
    description: "Self-sponsored for skilled workers and freelancers with qualifying income",
    govFee: 4350,
    durationYears: 5,
  },
  {
    id: "golden-10yr",
    label: "Golden Visa (10 years)",
    description: "Long-term residency for investors (AED 2M+), talented professionals & graduates",
    govFee: 6450,
    durationYears: 10,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const selectClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer";

function aed(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Use for estimated/market-average figures — appends "(estimated)" */
function aedEst(value: number) {
  return `${aed(value)} (estimated)`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UAEVisaCostCalculator() {
  const [visaTypeId, setVisaTypeId] = useState<string>("employment-2yr");
  const [statusChange, setStatusChange] = useState<boolean>(false);
  const [medicalUrgency, setMedicalUrgency] = useState<"standard" | "urgent">("standard");
  const [emiratesIdYears, setEmiratesIdYears] = useState<number>(2);
  const [typingFee, setTypingFee] = useState<number>(200);

  const visaType = VISA_TYPES.find((v) => v.id === visaTypeId) ?? VISA_TYPES[0];
  const isResidence = (visaType?.durationYears ?? 0) > 0;

  const medicalFee = useMemo(() => {
    if (!isResidence) return 0;
    return medicalUrgency === "urgent" ? 720 : 320;
  }, [isResidence, medicalUrgency]);

  const emiratesIdFee = useMemo(() => {
    if (!isResidence) return 0;
    const years = emiratesIdYears;
    if (years <= 1) return 170;
    if (years <= 2) return 220;
    if (years <= 3) return 270;
    return 370;
  }, [isResidence, emiratesIdYears]);

  // Status change fee: ~AED 640 for employment visas, ~AED 1,400-1,600 for self-sponsored (Green/Golden)
  const isEmployment = visaTypeId.startsWith("employment");
  const statusChangeFee = statusChange ? (isEmployment ? 640 : 1500) : 0;

  const breakdown = useMemo(() => {
    const gov = visaType?.govFee ?? 0;
    return [
      { label: "Visa & permit fees (est.)", value: gov },
      { label: "Status change fee", value: statusChangeFee, hidden: !statusChange },
      { label: "Medical fitness test", value: medicalFee, hidden: !isResidence },
      {
        label: `Emirates ID (${emiratesIdYears}yr)`,
        value: emiratesIdFee,
        hidden: !isResidence,
      },
      { label: "Typing / service centre", value: typingFee },
    ].filter((item) => !item.hidden);
  }, [visaType, statusChangeFee, statusChange, medicalFee, emiratesIdFee, emiratesIdYears, isResidence, typingFee]);

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_22rem]">
          {/* ── Inputs ── */}
          <div className="space-y-5">
            {/* Visa type */}
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Visa type</span>
              <div className="relative">
                <select
                  value={visaTypeId}
                  onChange={(e) => {
                    setVisaTypeId(e.target.value);
                    const selected = VISA_TYPES.find((v) => v.id === e.target.value);
                    if (selected) setEmiratesIdYears(selected.durationYears || 2);
                  }}
                  className={selectClass}
                >
                  {VISA_TYPES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">▾</span>
              </div>
              {visaType && (
                <p className="text-xs text-muted-foreground">{visaType.description}</p>
              )}
            </label>

            {/* Status change — only for residence visas */}
            {isResidence && (
            <label className="flex cursor-pointer items-start gap-3">
              <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  checked={statusChange}
                  onChange={(e) => setStatusChange(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-background checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Applying from inside the UAE (status change)</span>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {isEmployment ? "Adds ~AED 640 (employment status change)" : "Adds ~AED 1,500 (self-sponsored status change)"}
                </p>
              </div>
            </label>
            )}

            {/* Medical urgency — only for residence visas */}
            {isResidence && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Medical fitness test</span>
                <div className="grid grid-cols-2 gap-3">
                  {(["standard", "urgent"] as const).map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-[1rem] border px-4 py-3 text-sm font-medium transition-colors ${
                        medicalUrgency === opt
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="medical"
                        value={opt}
                        checked={medicalUrgency === opt}
                        onChange={() => setMedicalUrgency(opt)}
                        className="sr-only"
                      />
                      {opt === "standard" ? "Standard (~AED 320)" : "Urgent (~AED 720)"}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Emirates ID years — only for residence visas */}
            {isResidence && (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Emirates ID validity (years)
                </span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={emiratesIdYears}
                  onChange={(e) => setEmiratesIdYears(Math.max(1, Math.min(10, Number(e.target.value))))}
                  className={fieldClass}
                />
                <p className="text-xs text-muted-foreground">
                  Fee: 1yr = AED 170 · 2yr = AED 220 · 3yr = AED 270 · 4–10yr = AED 370
                </p>
              </label>
            )}

            {/* Typing fee */}
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Typing / service centre fee (AED)
              </span>
              <input
                type="number"
                min={0}
                value={typingFee}
                onChange={(e) => setTypingFee(Math.max(0, Number(e.target.value)))}
                className={fieldClass}
              />
              <p className="text-xs text-muted-foreground">
                Typically AED 150–350 depending on the application type and emirate
              </p>
            </label>
          </div>

          {/* ── Results aside ── */}
          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Estimated total cost
            </p>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {aedEst(total)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {visaType?.label}
            </p>

            <div className="mt-6 space-y-3 border-t border-border pt-5">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{aedEst(item.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-border pt-3 text-sm font-semibold">
                <span className="text-foreground">Total estimate</span>
                <span className="text-foreground">{aedEst(total)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-[1rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm leading-6 text-primary-soft-foreground">
                All figures are market estimates based on 2024–2025 averages. Actual costs vary by emirate, company type, and provider. Emirates ID fees reflect official ICP rates. Always verify with an official PRO service or the ICP portal before applying.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Visa & permit fees (est.)", value: aedEst(visaType?.govFee ?? 0) },
          { label: "Medical & Emirates ID", value: isResidence ? aedEst(medicalFee + emiratesIdFee) : "N/A" },
          { label: "Status change", value: statusChange ? aedEst(statusChangeFee) : "Not applicable" },
          { label: "Typing / service", value: aedEst(typingFee) },
        ].map((item) => (
          <article key={item.label} className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">{item.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
