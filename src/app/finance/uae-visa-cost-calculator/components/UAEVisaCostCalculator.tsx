"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Range = {
  min: number;
  max: number;
};

type VisaCategory = "tourist" | "employment" | "family" | "freelance";

type VisaPlan = {
  id: string;
  category: VisaCategory;
  label: string;
  shortLabel: string;
  durationLabel: string;
  description: string;
  baseLabel: string;
  baseFee: Range;
  years: number;
  insuranceFee?: Range;
  commonUse: string;
  note: string;
};

type BreakdownItem = {
  label: string;
  value: Range;
  note: string;
  optional?: boolean;
};

const VISA_PLANS: VisaPlan[] = [
  {
    id: "tourist-30",
    category: "tourist",
    label: "Tourist / visit visa - 30 days",
    shortLabel: "30-day tourist visa",
    durationLabel: "30 days",
    description: "Short visit for tourism, meetings, or family visits.",
    baseLabel: "Entry permit / visit visa fee",
    baseFee: { min: 200, max: 350 },
    years: 0,
    insuranceFee: { min: 40, max: 70 },
    commonUse: "Short stay, tourism, quick business trip",
    note: "Official visit visa fees depend on sponsor type, duration, insurance, and application channel.",
  },
  {
    id: "tourist-60",
    category: "tourist",
    label: "Tourist / visit visa - 60 days",
    shortLabel: "60-day tourist visa",
    durationLabel: "60 days",
    description: "Longer visit when 30 days is not enough.",
    baseLabel: "Entry permit / visit visa fee",
    baseFee: { min: 300, max: 500 },
    years: 0,
    insuranceFee: { min: 60, max: 110 },
    commonUse: "Family visit, longer tourism stay",
    note: "Some channels bundle insurance, typing, or agency service into the headline price.",
  },
  {
    id: "tourist-90",
    category: "tourist",
    label: "Tourist / visit visa - 90 days",
    shortLabel: "90-day visit visa",
    durationLabel: "90 days",
    description: "Long-stay visit option, often used for extended family visits.",
    baseLabel: "Entry permit / visit visa fee",
    baseFee: { min: 400, max: 700 },
    years: 0,
    insuranceFee: { min: 90, max: 180 },
    commonUse: "Extended visit, family stay, longer UAE trip",
    note: "A refundable security deposit may be required for some visit visa categories.",
  },
  {
    id: "employment-2",
    category: "employment",
    label: "Employment residence visa - 2 years",
    shortLabel: "Employment residence visa",
    durationLabel: "2 years",
    description: "Employer-sponsored residence visa for UAE employees.",
    baseLabel: "Work permit, entry permit, residence processing",
    baseFee: { min: 2500, max: 5000 },
    years: 2,
    commonUse: "New UAE job, employer sponsorship",
    note: "Employment visa costs are usually handled by the employer; do not treat this as a payroll deduction quote.",
  },
  {
    id: "family-2",
    category: "family",
    label: "Family residence visa - 2 years",
    shortLabel: "Family residence visa",
    durationLabel: "2 years",
    description: "Residence visa sponsored by a UAE resident for spouse, children, or parents.",
    baseLabel: "Entry permit and residence processing",
    baseFee: { min: 1200, max: 2200 },
    years: 2,
    commonUse: "Spouse or child sponsorship",
    note: "Sponsor salary, tenancy, attestation, insurance, and emirate-specific requirements can change the final total.",
  },
  {
    id: "freelance-1",
    category: "freelance",
    label: "Freelance / self-sponsored visa - 1 year",
    shortLabel: "Freelance visa",
    durationLabel: "1 year",
    description: "Self-sponsored route usually connected to a freelance permit or free zone package.",
    baseLabel: "Freelance permit and visa package",
    baseFee: { min: 3500, max: 7500 },
    years: 1,
    commonUse: "Freelancers, consultants, independent professionals",
    note: "Free zone, permit, establishment card, and package choices make freelance visa pricing highly variable.",
  },
];

const SERVICE_CHANNELS = {
  self: {
    label: "Self-service / official portal",
    description: "Lowest service cost, but you handle the process yourself.",
    fee: { min: 0, max: 100 },
  },
  typing: {
    label: "Typing centre",
    description: "Common option for document entry and application support.",
    fee: { min: 150, max: 350 },
  },
  pro: {
    label: "PRO / agency service",
    description: "Higher support level, useful for company, family, or freelance cases.",
    fee: { min: 500, max: 1200 },
  },
} as const;

const MEDICAL_OPTIONS = {
  standard: {
    label: "Standard medical",
    fee: { min: 300, max: 350 },
  },
  urgent: {
    label: "Urgent medical",
    fee: { min: 650, max: 800 },
  },
} as const;

const PROCESSING_SPEEDS = {
  standard: {
    label: "Standard processing",
    description: "No extra urgency support added.",
    fee: { min: 0, max: 0 },
  },
  priority: {
    label: "Priority support",
    description: "Provider or agency handling estimate for faster turnaround.",
    fee: { min: 200, max: 500 },
  },
  urgent: {
    label: "Urgent turnaround",
    description: "Higher planning range for rush handling. Availability depends on the authority and service provider.",
    fee: { min: 500, max: 800 },
  },
} as const;

const TYPICAL_TYPING_RANGE: Range = { min: 150, max: 350 };

const VISA_TYPE_COMPARISON = [
  {
    label: "Tourist / visit",
    range: "AED 390 - AED 940",
    detail: "Best for short stays. Usually driven by duration, insurance, and whether the person is already inside the UAE.",
  },
  {
    label: "Employment residence",
    range: "AED 3,250 - AED 6,750",
    detail: "Includes residence processing, medical fitness, Emirates ID, and employer or service handling.",
  },
  {
    label: "Family residence",
    range: "AED 1,850 - AED 3,100",
    detail: "Often changes with sponsor documents, insurance, attestations, and dependent category.",
  },
  {
    label: "Freelance / self-sponsored",
    range: "AED 4,400 - AED 9,850",
    detail: "Usually the widest range because permit packages and free-zone requirements vary.",
  },
] as const;

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const selectClass =
  "w-full cursor-pointer appearance-none rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

function addRanges(...ranges: Range[]) {
  return ranges.reduce(
    (total, range) => ({
      min: total.min + range.min,
      max: total.max + range.max,
    }),
    { min: 0, max: 0 },
  );
}

function formatAed(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRange(range: Range) {
  if (range.min === range.max) return formatAed(range.min);
  return `${formatAed(range.min)} - ${formatAed(range.max)}`;
}

function getInsideUaeFee(plan: VisaPlan): Range {
  if (plan.category === "tourist") return { min: 520, max: 700 };
  if (plan.category === "employment") return { min: 640, max: 1200 };
  return { min: 1000, max: 1600 };
}

function getEmiratesIdFee(years: number): Range {
  if (years <= 0) return { min: 0, max: 0 };
  const officialYearsFee = years * 100;
  return {
    min: officialYearsFee + 100,
    max: officialYearsFee + 200,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function UAEVisaCostCalculator() {
  const [visaPlanId, setVisaPlanId] = useState("tourist-60");
  const [applicantLocation, setApplicantLocation] = useState<"outside" | "inside">("outside");
  const [serviceChannel, setServiceChannel] = useState<keyof typeof SERVICE_CHANNELS>("typing");
  const [processingSpeed, setProcessingSpeed] = useState<keyof typeof PROCESSING_SPEEDS>("standard");
  const [medicalSpeed, setMedicalSpeed] = useState<keyof typeof MEDICAL_OPTIONS>("standard");
  const [includeDeposit, setIncludeDeposit] = useState(false);
  const [customServiceMin, setCustomServiceMin] = useState(150);
  const [customServiceMax, setCustomServiceMax] = useState(350);

  const selectedPlan = VISA_PLANS.find((plan) => plan.id === visaPlanId) ?? VISA_PLANS[0];
  const isResidence = selectedPlan.years > 0;
  const serviceFee = SERVICE_CHANNELS[serviceChannel].fee;
  const serviceRange = {
    min: serviceChannel === "typing" ? clamp(customServiceMin, 0, 5000) : serviceFee.min,
    max: serviceChannel === "typing" ? clamp(Math.max(customServiceMax, customServiceMin), 0, 5000) : serviceFee.max,
  };

  const breakdown = useMemo<BreakdownItem[]>(() => {
    const items: BreakdownItem[] = [
      {
        label: selectedPlan.baseLabel,
        value: selectedPlan.baseFee,
        note: selectedPlan.note,
      },
      {
        label: "Typing, portal, or service support",
        value: serviceRange,
        note: SERVICE_CHANNELS[serviceChannel].description,
      },
      {
        label: "Processing speed or urgency support",
        value: PROCESSING_SPEEDS[processingSpeed].fee,
        note: PROCESSING_SPEEDS[processingSpeed].description,
      },
    ];

    if (selectedPlan.insuranceFee) {
      items.push({
        label: "Visit visa insurance estimate",
        value: selectedPlan.insuranceFee,
        note: "Insurance is often required or bundled with visit visa applications.",
      });
    }

    if (applicantLocation === "inside") {
      items.push({
        label: selectedPlan.category === "tourist" ? "Inside-country visit visa fee" : "Inside-UAE status change",
        value: getInsideUaeFee(selectedPlan),
        note:
          selectedPlan.category === "tourist"
            ? "GDRFA visit visa schedules include an extra fee when the applicant is already inside the UAE."
            : "Used when converting from an existing UAE entry status to the new residence status.",
      });
    }

    if (isResidence) {
      items.push(
        {
          label: MEDICAL_OPTIONS[medicalSpeed].label,
          value: MEDICAL_OPTIONS[medicalSpeed].fee,
          note: "Medical fitness testing is required for UAE residence visa processing.",
        },
        {
          label: `Emirates ID estimate (${selectedPlan.years} ${selectedPlan.years === 1 ? "year" : "years"})`,
          value: getEmiratesIdFee(selectedPlan.years),
          note: "ICP lists Emirates ID resident card fees by year, with separate smart service and delivery charges.",
        },
      );
    }

    if (includeDeposit && selectedPlan.category === "tourist") {
      items.push({
        label: "Refundable security deposit",
        value: { min: 1000, max: 1000 },
        note: "Some visit visa categories require a refundable financial security deposit.",
        optional: true,
      });
    }

    return items;
  }, [selectedPlan, serviceRange, serviceChannel, processingSpeed, applicantLocation, isResidence, medicalSpeed, includeDeposit]);

  const total = useMemo(() => addRanges(...breakdown.map((item) => item.value)), [breakdown]);

  const typicalRange = useMemo(() => {
    const items: Range[] = [selectedPlan.baseFee, TYPICAL_TYPING_RANGE];

    if (selectedPlan.insuranceFee) {
      items.push(selectedPlan.insuranceFee);
    }

    if (applicantLocation === "inside") {
      items.push(getInsideUaeFee(selectedPlan));
    }

    if (isResidence) {
      items.push(MEDICAL_OPTIONS.standard.fee, getEmiratesIdFee(selectedPlan.years));
    }

    return addRanges(...items);
  }, [selectedPlan, applicantLocation, isResidence]);

  const decisionState = useMemo(() => {
    if (total.max < typicalRange.min) return "below";
    if (total.min > typicalRange.max) return "above";
    return "within";
  }, [total, typicalRange]);

  const decisionCopy = {
    below: {
      title: "Below typical range",
      description: "Your setup is cheaper than a common assisted application. This usually happens with self-service or lower support fees.",
      className: "border-emerald-300/50 bg-emerald-50 text-emerald-950",
    },
    within: {
      title: "Within typical range",
      description: "Your estimate sits inside a normal planning range for this visa route.",
      className: "border-sky-300/50 bg-sky-50 text-sky-950",
    },
    above: {
      title: "Above typical range",
      description: "Your total is higher than the baseline range, usually because of inside-UAE processing, urgent handling, PRO service, or optional deposits.",
      className: "border-amber-300/50 bg-amber-50 text-amber-950",
    },
  }[decisionState];

  const insights = useMemo(() => {
    const messages = [
      selectedPlan.category === "employment"
        ? "Employment visa costs are normally employer-managed. Use this estimate to understand the cost structure, not as a payroll deduction figure."
        : "This estimate is for planning only. Confirm the final amount with ICP, GDRFA, an Amer centre, typing centre, free zone, or licensed PRO before applying.",
    ];

    if (applicantLocation === "inside") {
      messages.push("Inside-UAE applications usually cost more because status change or inside-country fees are added.");
    }

    if (processingSpeed !== "standard") {
      messages.push("Faster handling usually adds provider or agency charges. Treat urgency fees as planning ranges, not guaranteed official authority prices.");
    }

    if (selectedPlan.category === "freelance") {
      messages.push("Freelance pricing varies the most because permit packages, free zone rules, and establishment card fees differ.");
    }

    if (selectedPlan.category === "family") {
      messages.push("Family visa totals can change if document attestation, health insurance, tenancy proof, or deposits are required.");
    }

    return messages;
  }, [selectedPlan, applicantLocation, processingSpeed]);

  const quickScenarios = [
    { label: "30-day visit", value: "AED 390 - AED 940", detail: "Visa, insurance, typing; outside UAE" },
    { label: "Family residence", value: "AED 1,850 - AED 3,100", detail: "Base fees, medical, Emirates ID, typing" },
    { label: "Employment visa", value: "AED 3,250 - AED 6,750", detail: "Typical full processing range" },
    { label: "Freelance route", value: "AED 4,400 - AED 9,850", detail: "Permit package plus residence steps" },
  ];

  return (
    <div className="space-y-6">
      <section className="tool-frame overflow-hidden p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_24rem]">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-primary/15 bg-primary-soft p-4">
              <p className="text-sm font-semibold text-primary-soft-foreground">
                Step 1: select the visa type. UAE visa cost changes most by category, duration, sponsor, and whether the applicant is inside or outside the country.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">Visa type</span>
              <div className="relative">
                <select
                  value={visaPlanId}
                  onChange={(event) => setVisaPlanId(event.target.value)}
                  className={selectClass}
                >
                  {VISA_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  v
                </span>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">{selectedPlan.description}</p>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {(["outside", "inside"] as const).map((location) => (
                <label
                  key={location}
                  className={`cursor-pointer rounded-[1.25rem] border p-4 transition-colors ${
                    applicantLocation === location
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="applicant-location"
                    value={location}
                    checked={applicantLocation === location}
                    onChange={() => setApplicantLocation(location)}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold">
                    {location === "outside" ? "Applicant outside UAE" : "Applicant inside UAE"}
                  </span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">
                    {location === "outside"
                      ? "Base estimate without status change."
                      : "Adds status change or inside-country fees."}
                  </span>
                </label>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {(Object.keys(SERVICE_CHANNELS) as Array<keyof typeof SERVICE_CHANNELS>).map((channel) => (
                <label
                  key={channel}
                  className={`cursor-pointer rounded-[1.25rem] border p-4 transition-colors ${
                    serviceChannel === channel
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="service-channel"
                    value={channel}
                    checked={serviceChannel === channel}
                    onChange={() => setServiceChannel(channel)}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold">{SERVICE_CHANNELS[channel].label}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">
                    {formatRange(SERVICE_CHANNELS[channel].fee)}
                  </span>
                </label>
              ))}
            </div>

            {serviceChannel === "typing" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Typing fee low estimate</span>
                  <input
                    type="number"
                    min={0}
                    value={customServiceMin}
                    onChange={(event) => setCustomServiceMin(Number(event.target.value))}
                    className={fieldClass}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Typing fee high estimate</span>
                  <input
                    type="number"
                    min={0}
                    value={customServiceMax}
                    onChange={(event) => setCustomServiceMax(Number(event.target.value))}
                    className={fieldClass}
                  />
                </label>
              </div>
            ) : null}

            {isResidence ? (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-foreground">Medical fitness processing</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(MEDICAL_OPTIONS) as Array<keyof typeof MEDICAL_OPTIONS>).map((speed) => (
                    <label
                      key={speed}
                      className={`cursor-pointer rounded-[1.25rem] border p-4 transition-colors ${
                        medicalSpeed === speed
                          ? "border-primary bg-primary-soft text-primary-soft-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="medical-speed"
                        value={speed}
                        checked={medicalSpeed === speed}
                        onChange={() => setMedicalSpeed(speed)}
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold">{MEDICAL_OPTIONS[speed].label}</span>
                      <span className="mt-1 block text-xs leading-5 opacity-80">
                        {formatRange(MEDICAL_OPTIONS[speed].fee)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Processing speed</span>
              <div className="grid gap-3 lg:grid-cols-3">
                {(Object.keys(PROCESSING_SPEEDS) as Array<keyof typeof PROCESSING_SPEEDS>).map((speed) => (
                  <label
                    key={speed}
                    className={`cursor-pointer rounded-[1.25rem] border p-4 transition-colors ${
                      processingSpeed === speed
                        ? "border-primary bg-primary-soft text-primary-soft-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="processing-speed"
                      value={speed}
                      checked={processingSpeed === speed}
                      onChange={() => setProcessingSpeed(speed)}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{PROCESSING_SPEEDS[speed].label}</span>
                    <span className="mt-1 block text-xs leading-5 opacity-80">
                      {formatRange(PROCESSING_SPEEDS[speed].fee)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedPlan.category === "tourist" ? (
              <label className="flex cursor-pointer items-start gap-3 rounded-[1.25rem] border border-border bg-background p-4">
                <input
                  type="checkbox"
                  checked={includeDeposit}
                  onChange={(event) => setIncludeDeposit(event.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Include possible refundable security deposit
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    Some visit visa categories require a refundable deposit. Keep it off if you only want expected non-refundable costs.
                  </span>
                </span>
              </label>
            ) : null}
          </div>

          <aside className="rounded-[1.75rem] border border-border bg-background p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Total estimated cost
            </p>
            <div className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
              {formatRange(total)}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {selectedPlan.shortLabel} - {selectedPlan.durationLabel}
            </p>
            <div className={`mt-4 rounded-[1.25rem] border p-4 ${decisionCopy.className}`}>
              <p className="text-sm font-semibold">{decisionCopy.title}</p>
              <p className="mt-1 text-xs leading-5">
                Typical planning range for this route: {formatRange(typicalRange)}.
              </p>
              <p className="mt-2 text-xs leading-5">{decisionCopy.description}</p>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              {breakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="shrink-0 font-semibold text-foreground">{formatRange(item.value)}</span>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {item.note}
                    {item.optional ? " Optional line item." : ""}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-amber-300/40 bg-amber-50 p-4 text-amber-950">
              <p className="text-sm font-semibold">Estimate only</p>
              <p className="mt-1 text-xs leading-5">
                Visa fees change by emirate, sponsor, nationality, processing speed, insurance, and service provider.
                This calculator is for planning and does not replace official ICP, GDRFA, Amer, free zone, or PRO quotations.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Visa selected</p>
          <p className="mt-3 text-xl font-semibold text-foreground">{selectedPlan.shortLabel}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedPlan.commonUse}</p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Medical + ID</p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {isResidence ? formatRange(addRanges(MEDICAL_OPTIONS[medicalSpeed].fee, getEmiratesIdFee(selectedPlan.years))) : "Not required"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isResidence ? "Applies to residence visas." : "Tourist and visit visas usually do not require Emirates ID or residence medical."}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Inside UAE impact</p>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {applicantLocation === "inside" ? formatRange(getInsideUaeFee(selectedPlan)) : "AED 0"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {applicantLocation === "inside" ? "Added for status change or inside-country processing." : "No inside-country fee included."}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Urgency impact</p>
          <p className="mt-3 text-xl font-semibold text-foreground">{formatRange(PROCESSING_SPEEDS[processingSpeed].fee)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {PROCESSING_SPEEDS[processingSpeed].description}
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">What this means</h2>
          <div className="mt-4 space-y-3">
            {insights.map((insight) => (
              <p key={insight} className="rounded-[1rem] border border-border/70 bg-muted/20 p-3 text-sm leading-6 text-muted-foreground">
                {insight}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Next steps</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/finance/uae-salary-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Estimate UAE salary
            </Link>
            <Link href="/finance/budget-planner" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Plan relocation budget
            </Link>
            <Link href="/finance/savings-goal-calculator" className="rounded-xl border border-border px-3 py-2 text-foreground hover:border-primary">
              Save for visa costs
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickScenarios.map((scenario) => (
          <article key={scenario.label} className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{scenario.label}</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{scenario.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{scenario.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Visa type comparison</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {VISA_TYPE_COMPARISON.map((item) => (
              <article
                key={item.label}
                className={`rounded-[1.25rem] border p-4 ${
                  selectedPlan.label.toLowerCase().includes(item.label.split(" ")[0].toLowerCase())
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-muted/10"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-foreground">{item.range}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">What is included and what is not</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3">
              Included: visa or permit fees, typing or service support, inside-UAE status change where relevant,
              residence medical, Emirates ID, visit insurance estimates, and optional refundable deposit.
            </p>
            <p className="rounded-[1rem] border border-border/70 bg-muted/20 p-3">
              Not included by default: document attestation, sponsor salary compliance costs, tenancy paperwork,
              health insurance for residence cases, free-zone package extras, courier add-ons, and employer-specific charges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
