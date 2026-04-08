# Compound Interest Calculator — Next.js Implementation Guide
### For a Multi-Tool Site at `/free-tools/compound-interest-calculator`

> **Prerequisites:** You have already built the EMI Calculator at `/free-tools/emi-calculator`.
> This guide reuses `CURRENCIES` from `lib/tools/emi.ts` and follows the same
> SSR + client component pattern. Only the differences and new concepts are explained in detail.

---

## Table of Contents

1. [What's Different vs EMI Calculator](#1-whats-different-vs-emi-calculator)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Step 1 — Extend Shared Currency Config](#3-step-1--extend-shared-currency-config)
4. [Step 2 — Compound Interest Calculation Logic](#4-step-2--compound-interest-calculation-logic)
5. [Step 3 — Types](#5-step-3--types)
6. [Step 4 — Client Component (CompoundInterestCalculator.tsx)](#6-step-4--client-component-compoundinterestcalculatortsx)
7. [Step 5 — Page (SSR + SEO)](#7-step-5--page-ssr--seo)
8. [Step 6 — Update Shared Tools Layout](#8-step-6--update-shared-tools-layout)
9. [Step 7 — Update Free Tools Index Page](#9-step-7--update-free-tools-index-page)
10. [Step 8 — Update Sitemap](#10-step-8--update-sitemap)
11. [SEO Strategy — Compound Interest Calculator](#11-seo-strategy--compound-interest-calculator)
12. [Regional Keyword Targeting](#12-regional-keyword-targeting)
13. [On-Page SEO Checklist](#13-on-page-seo-checklist)
14. [Cross-linking with Other Tools](#14-cross-linking-with-other-tools)

---

## 1. What's Different vs EMI Calculator

| Feature | EMI Calculator | Compound Interest Calculator |
|---|---|---|
| Core question answered | "What do I owe each month?" | "What will my money grow to?" |
| User intent | Borrower planning repayments | Saver / investor projecting growth |
| Input: principal | Loan amount | Initial deposit / investment |
| Input: periodic contribution | ✗ | ✓ Regular monthly/annual additions |
| Input: compounding frequency | ✗ (monthly, fixed) | ✓ Daily / Monthly / Quarterly / Annually |
| Output: amortization table | ✓ Loan payoff schedule | ✗ |
| Output: growth table | ✗ | ✓ Year-by-year balance breakdown |
| Output: interest earned | Total interest paid | Total interest earned |
| Output: future value | ✗ | ✓ Final balance at end of term |
| Inflation adjustment toggle | ✗ | ✓ Optional real vs nominal value |
| Currency defaults | Loan-sized amounts | Savings-sized amounts |

The compound interest formula is completely different from the EMI formula —
this is a new `lib/tools/compound-interest.ts` file, not an extension of `emi.ts`.

---

## 2. File & Folder Structure

Add only the files marked `← NEW`. Everything else already exists.

```
your-nextjs-project/
├── app/
│   └── free-tools/
│       ├── layout.tsx                                    ← UPDATE (add to sidebar)
│       ├── page.tsx                                      ← UPDATE (add tool card)
│       ├── emi-calculator/                               ← existing, no changes
│       └── compound-interest-calculator/                 ← NEW folder
│           ├── page.tsx                                  ← NEW: SSR page + SEO
│           └── components/
│               └── CompoundInterestCalculator.tsx        ← NEW: client component
│
└── lib/
    └── tools/
        ├── emi.ts                                        ← UPDATE (add savings defaults)
        └── compound-interest.ts                          ← NEW: calculation logic
```

> **Rule:** Keep all pure logic in `lib/`. Keep all UI in `app/`. Never mix them.

---

## 3. Step 1 — Extend Shared Currency Config

**File:** `lib/tools/emi.ts` — add `savingsDefaults` to each currency entry.

This keeps all currency/market data in one place. Do not duplicate the
`CURRENCIES` array — extend it. The `savingsDefaults` values represent
realistic starting points for savers in each market.

```ts
// Replace your existing CURRENCIES array with this extended version:

export const CURRENCIES = [
  {
    code: "USD",
    symbol: "$",
    label: "US Dollar",
    locale: "en-US",
    // EMI defaults (existing)
    defaultLoan: 200_000,
    defaultRate: 7.5,
    defaultTenure: 240,
    // Car loan defaults (existing)
    carDefaults: {
      vehiclePrice: 35_000,
      downPayment: 5_000,
      tradeIn: 0,
      newCarRate: 6.5,
      usedCarRate: 9.5,
      tenure: 60,
    },
    // Compound interest defaults (new)
    savingsDefaults: {
      principal: 10_000,
      monthlyContribution: 500,
      rate: 7.0,        // Typical long-term stock market average
      years: 10,
    },
  },
  {
    code: "EUR",
    symbol: "€",
    label: "Euro",
    locale: "de-DE",
    defaultLoan: 150_000,
    defaultRate: 4.5,
    defaultTenure: 240,
    carDefaults: {
      vehiclePrice: 25_000,
      downPayment: 3_000,
      tradeIn: 0,
      newCarRate: 5.5,
      usedCarRate: 8.0,
      tenure: 48,
    },
    savingsDefaults: {
      principal: 10_000,
      monthlyContribution: 300,
      rate: 5.0,
      years: 10,
    },
  },
  {
    code: "GBP",
    symbol: "£",
    label: "British Pound",
    locale: "en-GB",
    defaultLoan: 200_000,
    defaultRate: 5.5,
    defaultTenure: 300,
    carDefaults: {
      vehiclePrice: 25_000,
      downPayment: 3_000,
      tradeIn: 0,
      newCarRate: 7.5,
      usedCarRate: 10.0,
      tenure: 48,
    },
    savingsDefaults: {
      principal: 5_000,
      monthlyContribution: 200,
      rate: 6.0,
      years: 10,
    },
  },
  {
    code: "AED",
    symbol: "د.إ",
    label: "UAE Dirham",
    locale: "ar-AE",
    defaultLoan: 800_000,
    defaultRate: 5.0,
    defaultTenure: 240,
    carDefaults: {
      vehiclePrice: 100_000,
      downPayment: 20_000,
      tradeIn: 0,
      newCarRate: 4.5,
      usedCarRate: 7.0,
      tenure: 60,
    },
    savingsDefaults: {
      principal: 50_000,
      monthlyContribution: 2_000,
      rate: 6.0,        // Typical returns for UAE-based savings / investment accounts
      years: 10,
    },
  },
  {
    code: "INR",
    symbol: "₹",
    label: "Indian Rupee",
    locale: "en-IN",
    defaultLoan: 5_000_000,
    defaultRate: 8.5,
    defaultTenure: 240,
    carDefaults: {
      vehiclePrice: 800_000,
      downPayment: 100_000,
      tradeIn: 0,
      newCarRate: 8.5,
      usedCarRate: 12.0,
      tenure: 60,
    },
    savingsDefaults: {
      principal: 100_000,
      monthlyContribution: 10_000,
      rate: 12.0,       // Typical SIP/mutual fund long-term average in India
      years: 10,
    },
  },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];
export type Currency = (typeof CURRENCIES)[number];
```

> **Note on rates:** `savingsDefaults.rate` is pre-filled with realistic long-term
> investment return averages per market, not bank deposit rates. Users should
> always adjust this to match their actual savings vehicle.

---

## 4. Step 2 — Compound Interest Calculation Logic

**File:** `lib/tools/compound-interest.ts` ← create this new file

```ts
// ── Compounding Frequency Options ─────────────────────────────────────────────

export const COMPOUNDING_FREQUENCIES = [
  { label: "Annually",    timesPerYear: 1  },
  { label: "Semi-Annually", timesPerYear: 2 },
  { label: "Quarterly",   timesPerYear: 4  },
  { label: "Monthly",     timesPerYear: 12 },
  { label: "Daily",       timesPerYear: 365 },
] as const;

export type CompoundingFrequency = typeof COMPOUNDING_FREQUENCIES[number];

// ── Contribution Frequency Options ────────────────────────────────────────────

export const CONTRIBUTION_FREQUENCIES = [
  { label: "Monthly",  paymentsPerYear: 12 },
  { label: "Annually", paymentsPerYear: 1  },
] as const;

export type ContributionFrequency = typeof CONTRIBUTION_FREQUENCIES[number];

// ── Input / Output Types ──────────────────────────────────────────────────────

export interface CompoundInterestInput {
  principal: number;              // Initial lump-sum deposit
  annualRate: number;             // Annual interest rate (e.g. 7 for 7%)
  years: number;                  // Investment time horizon in years
  contribution: number;           // Periodic contribution amount
  contributionFrequency: number;  // Payments per year (1 or 12)
  compoundingFrequency: number;   // Times compounded per year (1, 2, 4, 12, 365)
  inflationRate?: number;         // Optional: annual inflation rate for real value (e.g. 2.5)
}

export interface YearlySnapshot {
  year: number;
  balance: number;           // Nominal balance at end of year
  totalContributions: number; // Cumulative contributions made (incl. principal)
  totalInterest: number;     // Cumulative interest earned
  realBalance?: number;      // Inflation-adjusted balance (if inflationRate provided)
}

export interface CompoundInterestResult {
  futureValue: number;         // Final balance (nominal)
  totalContributions: number;  // Principal + all periodic contributions
  totalInterest: number;       // Interest earned (futureValue − totalContributions)
  realFutureValue?: number;    // Inflation-adjusted final balance
  schedule: YearlySnapshot[];  // Year-by-year breakdown
}

// ── Core Calculation ──────────────────────────────────────────────────────────

/**
 * Calculate compound interest with optional periodic contributions.
 *
 * Formula (lump sum only):
 *   A = P × (1 + r/n)^(n×t)
 *
 * Formula (with regular contributions):
 *   A = P × (1 + r/n)^(n×t)
 *     + C × [((1 + r/n)^(n×t) − 1) / (r/n)]
 *
 * Where:
 *   P = principal
 *   r = annual interest rate as decimal
 *   n = compounding periods per year
 *   t = time in years
 *   C = contribution per compounding period (normalised)
 *
 * @param input - CompoundInterestInput
 * @returns CompoundInterestResult
 */
export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const {
    principal,
    annualRate,
    years,
    contribution,
    contributionFrequency,
    compoundingFrequency,
    inflationRate,
  } = input;

  const r = annualRate / 100;
  const n = compoundingFrequency;

  // Normalise contribution to per-compounding-period amount.
  // E.g. $500/month contribution with monthly compounding = $500 per period.
  // E.g. $500/month contribution with annual compounding = $6,000 per period.
  const contributionPerPeriod =
    (contribution * contributionFrequency) / n;

  let balance = principal;
  const schedule: YearlySnapshot[] = [];
  let totalContributions = principal;

  for (let year = 1; year <= years; year++) {
    // Compound for one year (n periods)
    for (let period = 0; period < n; period++) {
      balance = balance * (1 + r / n) + contributionPerPeriod;
      totalContributions +=
        period < n ? contributionPerPeriod : 0;
    }

    // Annual contributions already accumulated above — track cumulative total
    const annualContributionAdded = contribution * contributionFrequency;
    // (totalContributions is updated inside the inner loop; snapshot here)
    const cumulativeContributions = principal + annualContributionAdded * year;
    const totalInterest = balance - cumulativeContributions;

    let realBalance: number | undefined;
    if (inflationRate !== undefined && inflationRate > 0) {
      realBalance = balance / Math.pow(1 + inflationRate / 100, year);
    }

    schedule.push({
      year,
      balance,
      totalContributions: cumulativeContributions,
      totalInterest,
      realBalance,
    });
  }

  const finalSnapshot = schedule[schedule.length - 1];

  return {
    futureValue: finalSnapshot.balance,
    totalContributions: finalSnapshot.totalContributions,
    totalInterest: finalSnapshot.totalInterest,
    realFutureValue: finalSnapshot.realBalance,
    schedule,
  };
}

/**
 * A cleaner, closed-form implementation that avoids floating-point
 * accumulation over many compounding periods. Prefer this for display;
 * use the loop above for the year-by-year schedule.
 *
 * Useful for a quick summary card before rendering the full schedule.
 */
export function calculateFutureValueClosedForm(
  input: CompoundInterestInput
): number {
  const { principal, annualRate, years, contribution, contributionFrequency, compoundingFrequency } = input;

  const r = annualRate / 100;
  const n = compoundingFrequency;
  const t = years;

  // Growth factor for the lump sum
  const growthFactor = Math.pow(1 + r / n, n * t);

  // Lump sum future value
  const lumpsumFV = principal * growthFactor;

  // Contribution future value (annuity formula)
  // Normalise: convert contribution to per-period amount
  const contributionPerPeriod = (contribution * contributionFrequency) / n;
  let contributionFV = 0;
  if (r > 0) {
    contributionFV =
      contributionPerPeriod * ((growthFactor - 1) / (r / n));
  } else {
    // Edge case: 0% interest
    contributionFV = contributionPerPeriod * n * t;
  }

  return lumpsumFV + contributionFV;
}

/**
 * Available time horizon presets for the duration slider.
 * Displayed as quick-select buttons in the UI.
 */
export const DURATION_PRESETS = [1, 3, 5, 10, 15, 20, 30] as const;
```

---

## 5. Step 3 — Types

**File:** `types/tools.ts` — add these to your existing types file.

```ts
// Add to existing types/tools.ts:

export interface CompoundInterestFormState {
  principal: number;
  contribution: number;
  contributionFrequency: number; // payments per year
  rate: number;
  years: number;
  compoundingFrequency: number;  // times compounded per year
  inflationRate: number;
  showInflation: boolean;
  showSchedule: boolean;
}

export interface CompoundInterestSummary {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  realFutureValue?: number;
  interestPercent: number;  // totalInterest / futureValue * 100
}
```

---

## 6. Step 4 — Client Component (CompoundInterestCalculator.tsx)

**File:** `app/free-tools/compound-interest-calculator/components/CompoundInterestCalculator.tsx`

This is the **only** `"use client"` file for this tool. Everything else is server-rendered.

```tsx
"use client";

import { useState, useMemo } from "react";
import { CURRENCIES, type Currency } from "@/lib/tools/emi";
import {
  calculateCompoundInterest,
  COMPOUNDING_FREQUENCIES,
  CONTRIBUTION_FREQUENCIES,
  DURATION_PRESETS,
} from "@/lib/tools/compound-interest";

export default function CompoundInterestCalculator() {

  // ── Currency state ─────────────────────────────────────────
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]); // Default: USD

  // ── Core inputs ────────────────────────────────────────────
  const [principal, setPrincipal] = useState(currency.savingsDefaults.principal);
  const [contribution, setContribution] = useState(currency.savingsDefaults.monthlyContribution);
  const [contributionFrequency, setContributionFrequency] = useState(12); // monthly
  const [rate, setRate] = useState(currency.savingsDefaults.rate);
  const [years, setYears] = useState(currency.savingsDefaults.years);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12); // monthly

  // ── Optional features ──────────────────────────────────────
  const [showInflation, setShowInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [showSchedule, setShowSchedule] = useState(false);

  // ── Handle currency switch ─────────────────────────────────
  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find((c) => c.code === code)!;
    setCurrency(selected);
    setPrincipal(selected.savingsDefaults.principal);
    setContribution(selected.savingsDefaults.monthlyContribution);
    setRate(selected.savingsDefaults.rate);
    setYears(selected.savingsDefaults.years);
  };

  // ── Core calculation ───────────────────────────────────────
  const result = useMemo(
    () =>
      calculateCompoundInterest({
        principal,
        annualRate: rate,
        years,
        contribution,
        contributionFrequency,
        compoundingFrequency,
        inflationRate: showInflation ? inflationRate : undefined,
      }),
    [principal, rate, years, contribution, contributionFrequency, compoundingFrequency, showInflation, inflationRate]
  );

  // ── Helpers ────────────────────────────────────────────────
  const fmt = (n: number) =>
    new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(n);

  const interestPercent = Math.round(
    (result.totalInterest / result.futureValue) * 100
  );

  // Slider ranges by currency (principal and contribution amounts)
  const principalRange = {
    USD: { min: 0,     max: 500_000,   step: 1_000  },
    EUR: { min: 0,     max: 500_000,   step: 1_000  },
    GBP: { min: 0,     max: 500_000,   step: 1_000  },
    AED: { min: 0,     max: 2_000_000, step: 5_000  },
    INR: { min: 0,     max: 5_000_000, step: 10_000 },
  }[currency.code];

  const contributionRange = {
    USD: { min: 0, max: 10_000, step: 50   },
    EUR: { min: 0, max: 10_000, step: 50   },
    GBP: { min: 0, max: 10_000, step: 50   },
    AED: { min: 0, max: 50_000, step: 500  },
    INR: { min: 0, max: 200_000, step: 1_000 },
  }[currency.code];

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="compound-interest-calculator">

      {/* Currency Selector */}
      <div className="field">
        <label htmlFor="currency">Currency</label>
        <select
          id="currency"
          value={currency.code}
          onChange={(e) => handleCurrencyChange(e.target.value)}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.label} ({c.code})
            </option>
          ))}
        </select>
      </div>

      {/* Initial Deposit */}
      <div className="field">
        <label htmlFor="principal">
          Initial Deposit: <strong>{fmt(principal)}</strong>
        </label>
        <input
          id="principal"
          type="range"
          min={principalRange.min}
          max={principalRange.max}
          step={principalRange.step}
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
        />
      </div>

      {/* Regular Contribution */}
      <div className="field">
        <label htmlFor="contribution">
          Regular Contribution:{" "}
          <strong>
            {fmt(contribution)}{" "}
            /{" "}
            {CONTRIBUTION_FREQUENCIES.find((f) => f.paymentsPerYear === contributionFrequency)?.label.toLowerCase()}
          </strong>
        </label>
        <input
          id="contribution"
          type="range"
          min={contributionRange.min}
          max={contributionRange.max}
          step={contributionRange.step}
          value={contribution}
          onChange={(e) => setContribution(Number(e.target.value))}
        />
        {/* Contribution frequency toggle */}
        <div className="toggle-group" role="group" aria-label="Contribution frequency">
          {CONTRIBUTION_FREQUENCIES.map((f) => (
            <button
              key={f.paymentsPerYear}
              className={contributionFrequency === f.paymentsPerYear ? "active" : ""}
              onClick={() => setContributionFrequency(f.paymentsPerYear)}
              aria-pressed={contributionFrequency === f.paymentsPerYear}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Annual Interest Rate */}
      <div className="field">
        <label htmlFor="rate">
          Annual Return: <strong>{rate}%</strong>
        </label>
        <input
          id="rate"
          type="range"
          min={0.1}
          max={30}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <p className="hint">
          Typical benchmarks: savings account ~4–5%, index fund ~7–10%, fixed deposit ~6–8%
        </p>
      </div>

      {/* Time Horizon */}
      <div className="field">
        <label htmlFor="years">
          Time Period: <strong>{years} year{years !== 1 ? "s" : ""}</strong>
        </label>
        <input
          id="years"
          type="range"
          min={1}
          max={40}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />
        {/* Quick-select preset buttons */}
        <div className="preset-buttons" role="group" aria-label="Time horizon presets">
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset}
              className={years === preset ? "active" : ""}
              onClick={() => setYears(preset)}
              aria-pressed={years === preset}
            >
              {preset}yr
            </button>
          ))}
        </div>
      </div>

      {/* Compounding Frequency */}
      <div className="field">
        <label htmlFor="compounding">Compounding Frequency</label>
        <select
          id="compounding"
          value={compoundingFrequency}
          onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
        >
          {COMPOUNDING_FREQUENCIES.map((f) => (
            <option key={f.timesPerYear} value={f.timesPerYear}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Inflation Adjustment (optional) */}
      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={showInflation}
            onChange={(e) => setShowInflation(e.target.checked)}
          />{" "}
          Adjust for inflation
        </label>
        {showInflation && (
          <div className="sub-field">
            <label htmlFor="inflation">
              Annual Inflation Rate: <strong>{inflationRate}%</strong>
            </label>
            <input
              id="inflation"
              type="range"
              min={0}
              max={15}
              step={0.1}
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {/* ── Results ──────────────────────────────────────────── */}
      <div className="results">

        {/* Primary result */}
        <div className="result-primary">
          <span>Future Value</span>
          <strong>{fmt(result.futureValue)}</strong>
        </div>

        {/* Secondary breakdown */}
        <div className="result-secondary">
          <div>
            <span>Total Deposited</span>
            <span>{fmt(result.totalContributions)}</span>
          </div>
          <div>
            <span>Total Interest Earned</span>
            <span>
              {fmt(result.totalInterest)}{" "}
              <span className="hint">({interestPercent}% of final value)</span>
            </span>
          </div>
          {showInflation && result.realFutureValue !== undefined && (
            <div>
              <span>Real Value (inflation-adjusted)</span>
              <span>{fmt(result.realFutureValue)}</span>
            </div>
          )}
        </div>

        {/* Visual bar: deposits vs interest */}
        <div
          className="growth-bar"
          role="img"
          aria-label={`${100 - interestPercent}% deposits, ${interestPercent}% interest earned`}
        >
          <div
            className="bar-segment bar-deposits"
            style={{ width: `${100 - interestPercent}%` }}
            title={`Deposits: ${fmt(result.totalContributions)}`}
          />
          <div
            className="bar-segment bar-interest"
            style={{ width: `${interestPercent}%` }}
            title={`Interest: ${fmt(result.totalInterest)}`}
          />
        </div>
        <div className="bar-legend">
          <span className="legend-deposits">■ Deposits ({100 - interestPercent}%)</span>
          <span className="legend-interest">■ Interest earned ({interestPercent}%)</span>
        </div>

      </div>

      {/* Year-by-year growth table (toggle) */}
      <button onClick={() => setShowSchedule(!showSchedule)}>
        {showSchedule ? "Hide" : "Show"} Year-by-Year Breakdown
      </button>

      {showSchedule && (
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Balance</th>
              <th>Total Deposited</th>
              <th>Interest Earned</th>
              {showInflation && <th>Real Value</th>}
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{fmt(row.balance)}</td>
                <td>{fmt(row.totalContributions)}</td>
                <td>{fmt(row.totalInterest)}</td>
                {showInflation && (
                  <td>{row.realBalance !== undefined ? fmt(row.realBalance) : "—"}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
```

---

## 7. Step 5 — Page (SSR + SEO)

**File:** `app/free-tools/compound-interest-calculator/page.tsx`

This is a **Server Component** (no `"use client"`). It handles all metadata,
structured data, and static SEO content. The interactive part is delegated
to `<CompoundInterestCalculator />`.

```tsx
import { Metadata } from "next";
import CompoundInterestCalculator from "./components/CompoundInterestCalculator";

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Compound Interest Calculator — Investment Growth | USD EUR GBP AED INR",
  description:
    "Calculate compound interest and see how your savings grow over time. Add regular contributions, choose compounding frequency, and adjust for inflation. Free, no sign-up.",
  keywords: [
    "compound interest calculator",
    "investment calculator",
    "savings calculator",
    "compound interest formula",
    "compound interest calculator with monthly contributions",
    "how much will my savings grow",
    "future value calculator",
    "SIP calculator India",
    "savings calculator UAE",
    "investment growth calculator UK",
    "compound interest calculator INR",
    "Zinseszinsrechner",
    "calculateur intérêts composés",
    "interest calculator AED",
    "retirement savings calculator",
  ],
  alternates: {
    canonical: "https://yoursite.com/free-tools/compound-interest-calculator",
  },
  openGraph: {
    title: "Free Compound Interest Calculator — See Your Investment Grow",
    description:
      "Calculate how your savings grow with compound interest. Supports monthly contributions, multiple compounding frequencies, and inflation adjustment. USD, EUR, GBP, AED & INR.",
    url: "https://yoursite.com/free-tools/compound-interest-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Compound Interest Calculator",
    description:
      "See how your money grows over time with compound interest. Monthly contributions, inflation adjustment included.",
  },
};

// ── JSON-LD Structured Data ───────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Compound Interest Calculator",
      url: "https://yoursite.com/free-tools/compound-interest-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Free compound interest calculator with regular contributions, multiple compounding frequencies, and inflation adjustment. Supports USD, EUR, GBP, AED, and INR.",
      featureList: [
        "Compound interest calculation",
        "Monthly and annual contributions",
        "Daily, monthly, quarterly, and annual compounding",
        "Inflation adjustment (real vs nominal value)",
        "Year-by-year growth schedule",
        "Multi-currency: USD, EUR, GBP, AED, INR",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",       item: "https://yoursite.com" },
        { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://yoursite.com/free-tools" },
        { "@type": "ListItem", position: 3, name: "Compound Interest Calculator",
          item: "https://yoursite.com/free-tools/compound-interest-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is compound interest?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which is only calculated on the principal, compound interest grows exponentially over time — which is why Albert Einstein reportedly called it the eighth wonder of the world.",
          },
        },
        {
          "@type": "Question",
          name: "What is the compound interest formula?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The compound interest formula is: A = P × (1 + r/n)^(n×t), where A is the future value, P is the principal, r is the annual interest rate as a decimal, n is the number of times interest compounds per year, and t is the time in years.",
          },
        },
        {
          "@type": "Question",
          name: "How does compounding frequency affect my returns?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The more frequently interest compounds, the more you earn. Daily compounding yields slightly more than monthly, which yields more than annual. However, the difference between daily and monthly compounding is usually very small compared to the impact of the interest rate itself.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Rule of 72?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Rule of 72 is a quick mental shortcut: divide 72 by your annual interest rate to estimate how many years it takes to double your money. For example, at 8% annual return, your money doubles in approximately 72 ÷ 8 = 9 years.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between compound interest and simple interest?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus all previously accumulated interest. Over long periods, compound interest can produce dramatically larger results — this is the core principle behind long-term investing.",
          },
        },
        {
          "@type": "Question",
          name: "How does this calculator account for regular contributions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The calculator supports regular monthly or annual contributions added on top of the initial deposit. Each contribution is then compounded for the remaining period, significantly accelerating growth. This mirrors how systematic investment plans (SIPs) and 401(k) contributions work.",
          },
        },
      ],
    },
  ],
};

// ── Page Component ────────────────────────────────────────────────────────────
export default function CompoundInterestCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/free-tools">Free Tools</a></li>
            <li aria-current="page">Compound Interest Calculator</li>
          </ol>
        </nav>

        <h1>Compound Interest Calculator</h1>
        <p>
          See how your savings and investments grow over time with the power
          of compound interest. Add regular contributions, choose how often
          interest compounds, and optionally adjust for inflation to see your
          money's real purchasing power. Supports{" "}
          <strong>USD, EUR, GBP, AED, and INR</strong>.
        </p>

        {/* Interactive Calculator (client-side only) */}
        <CompoundInterestCalculator />

        {/* ── SEO Content (server-rendered, fully indexable) ─────────────── */}

        <section aria-label="About compound interest">

          <h2>What Is Compound Interest?</h2>
          <p>
            Compound interest is interest calculated on both your initial
            deposit and the interest you have already earned. Because you earn
            interest on your interest, your money grows exponentially rather
            than in a straight line. This is the fundamental mechanism behind
            long-term wealth building.
          </p>
          <p>
            The longer your money is invested, the more dramatic the effect.
            A 30-year investment at 7% does not grow three times as much as a
            10-year investment — it grows more than nine times as much, because
            the compounding accelerates over time.
          </p>

          <h2>The Compound Interest Formula</h2>
          <p>
            The standard formula for compound interest (lump sum, no contributions) is:
          </p>
          <pre><code>A = P × (1 + r/n)^(n × t)</code></pre>
          <ul>
            <li><strong>A</strong> — Future value (what you end up with)</li>
            <li><strong>P</strong> — Principal (your initial deposit)</li>
            <li><strong>r</strong> — Annual interest rate as a decimal (e.g. 0.07 for 7%)</li>
            <li><strong>n</strong> — Compounding frequency per year (12 = monthly)</li>
            <li><strong>t</strong> — Time in years</li>
          </ul>
          <p>
            Example: $10,000 invested at 7% annual return, compounded monthly,
            over 10 years grows to approximately $20,097 — your money more than
            doubles with zero additional contributions.
          </p>

          <h2>The Impact of Regular Contributions</h2>
          <p>
            Adding consistent contributions dramatically amplifies compound
            interest. Consider a $10,000 starting balance at 7% annual return
            over 20 years:
          </p>

          <table>
            <caption>Growth comparison: lump sum vs. with monthly contributions (7% annual, 20 years)</caption>
            <thead>
              <tr>
                <th>Monthly Contribution</th>
                <th>Total Deposited</th>
                <th>Future Value</th>
                <th>Interest Earned</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>$0</td><td>$10,000</td><td>$38,697</td><td>$28,697</td></tr>
              <tr><td>$100</td><td>$34,000</td><td>$90,185</td><td>$56,185</td></tr>
              <tr><td>$300</td><td>$82,000</td><td>$193,163</td><td>$111,163</td></tr>
              <tr><td>$500</td><td>$130,000</td><td>$296,141</td><td>$166,141</td></tr>
            </tbody>
          </table>

          <h2>Compounding Frequency: Does It Matter?</h2>
          <p>
            More frequent compounding means slightly higher returns. However,
            the effect is much smaller than most people expect. Here is what
            $10,000 at 7% over 10 years produces at different compounding
            frequencies:
          </p>

          <table>
            <caption>Effect of compounding frequency on $10,000 at 7% over 10 years</caption>
            <thead>
              <tr>
                <th>Compounding Frequency</th>
                <th>Future Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Annually</td><td>$19,672</td></tr>
              <tr><td>Quarterly</td><td>$20,016</td></tr>
              <tr><td>Monthly</td><td>$20,097</td></tr>
              <tr><td>Daily</td><td>$20,137</td></tr>
            </tbody>
          </table>
          <p>
            The difference between annual and daily compounding over 10 years
            is only $465 on a $10,000 investment. The interest rate and the
            time horizon matter far more than the compounding frequency.
          </p>

          <h2>The Rule of 72</h2>
          <p>
            The Rule of 72 is a quick mental shortcut to estimate how long it
            takes for your money to double: divide 72 by your annual interest
            rate. At 6%, your money doubles in 12 years. At 9%, it doubles
            in 8 years. Use the calculator above to get the exact figure.
          </p>

          <h2>Compound Interest vs Simple Interest</h2>
          <p>
            Simple interest is calculated only on the original principal.
            Compound interest is calculated on the principal plus all
            previously accumulated interest. Over long periods, the gap
            between the two becomes enormous:
          </p>

          <table>
            <caption>Simple vs compound interest on $10,000 at 7% over time</caption>
            <thead>
              <tr>
                <th>Years</th>
                <th>Simple Interest</th>
                <th>Compound Interest (Monthly)</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>5</td><td>$13,500</td><td>$14,176</td><td>+$676</td></tr>
              <tr><td>10</td><td>$17,000</td><td>$20,097</td><td>+$3,097</td></tr>
              <tr><td>20</td><td>$24,000</td><td>$40,388</td><td>+$16,388</td></tr>
              <tr><td>30</td><td>$31,000</td><td>$81,165</td><td>+$50,165</td></tr>
            </tbody>
          </table>

          <h2>Inflation and Real Returns</h2>
          <p>
            A future value of $100,000 in 20 years is not the same as
            $100,000 today. Inflation erodes purchasing power over time.
            The calculator's inflation adjustment shows you the{" "}
            <strong>real value</strong> of your future balance — what it is
            worth in today's money. At 2.5% annual inflation, $100,000 in
            20 years has the purchasing power of about $61,000 today.
          </p>

          <h2>How to Use This Calculator</h2>
          <ol>
            <li>Select your currency.</li>
            <li>Enter your initial deposit (can be $0 if starting from scratch).</li>
            <li>Set your regular contribution amount and whether you contribute monthly or annually.</li>
            <li>Enter your expected annual return rate.</li>
            <li>Set your investment time horizon using the slider or preset buttons.</li>
            <li>Choose how frequently interest compounds (monthly is most common).</li>
            <li>Optionally enable inflation adjustment to see real purchasing power.</li>
            <li>Click "Show Year-by-Year Breakdown" for a detailed growth schedule.</li>
          </ol>

          <h2>Frequently Asked Questions</h2>

          <h3>What interest rate should I use?</h3>
          <p>
            Use the actual rate your savings vehicle offers. For a savings
            account, use the current APY offered by your bank. For investments
            tracking a broad stock index, a long-term average of 7–10% per
            year is commonly used — but past returns do not guarantee future
            results. For fixed deposits, use the advertised rate.
          </p>

          <h3>What is the difference between APR and APY?</h3>
          <p>
            APR (Annual Percentage Rate) is the stated interest rate before
            compounding. APY (Annual Percentage Yield) accounts for
            compounding and represents the effective annual return. If a
            savings account advertises 6% APR compounded monthly, the actual
            APY is approximately 6.17%. The calculator uses the APR — if your
            bank quotes APY, it is slightly higher than the APR input you
            should use.
          </p>

          <h3>Is this calculator the same as a SIP calculator?</h3>
          <p>
            Yes, for practical purposes. A SIP (Systematic Investment Plan)
            calculator used in India is a compound interest calculator with
            regular monthly contributions. Set your monthly SIP amount in the
            contribution field, enter your expected XIRR or CAGR, and select
            monthly compounding to replicate a SIP calculation.
          </p>

          <h3>Can I use this as a retirement calculator?</h3>
          <p>
            Yes. Set your current savings as the initial deposit, your monthly
            savings as the regular contribution, your expected investment return
            as the rate, and the number of years until retirement as the time
            horizon. Enable inflation adjustment to see what the resulting
            balance is worth in today's money.
          </p>

          <h3>Is this calculator free?</h3>
          <p>
            Yes, completely free. No sign-up, no limits. Use it as many times
            as you need.
          </p>

        </section>

        {/* Internal links to related tools */}
        <aside aria-label="Related tools">
          <h2>Related Financial Tools</h2>
          <ul>
            <li>
              <a href="/free-tools/emi-calculator">EMI Calculator</a>
              {" "}— Calculate monthly loan repayments for home, car, and personal loans
            </li>
            <li>
              <a href="/free-tools/car-loan-calculator">Car Loan Calculator</a>
              {" "}— Monthly auto loan payments with down payment and trade-in support
            </li>
            <li>
              <a href="/free-tools/salary-calculator">Salary After Tax Calculator</a>
              {" "}— See your net take-home pay after tax in 12 countries
            </li>
          </ul>
        </aside>

      </main>
    </>
  );
}
```

---

## 8. Step 6 — Update Shared Tools Layout

**File:** `app/free-tools/layout.tsx` — add compound interest to the sidebar.

```tsx
// In your existing Finance Calculators section, add:
<li><a href="/free-tools/compound-interest-calculator">Compound Interest Calculator</a></li>
```

Full updated Finance Calculators section:

```tsx
<section>
  <h3>Finance Calculators</h3>
  <ul>
    <li><a href="/free-tools/emi-calculator">EMI Calculator</a></li>
    <li><a href="/free-tools/car-loan-calculator">Car Loan Calculator</a></li>
    <li><a href="/free-tools/compound-interest-calculator">Compound Interest Calculator</a></li>  {/* ← NEW */}
    <li><a href="/free-tools/salary-calculator">Salary After Tax Calculator</a></li>
  </ul>
</section>
```

---

## 9. Step 7 — Update Free Tools Index Page

**File:** `app/free-tools/page.tsx` — add the compound interest card to the tools array.

```ts
// Add to your existing tools array:
{
  name: "Compound Interest Calculator",
  href: "/free-tools/compound-interest-calculator",
  description:
    "See how your savings and investments grow over time. Supports regular contributions, multiple compounding frequencies, and inflation adjustment.",
  category: "Finance",
},
```

---

## 10. Step 8 — Update Sitemap

**File:** `app/sitemap.ts` — add one entry.

```ts
// Add to your existing sitemap array:
{
  url: "https://yoursite.com/free-tools/compound-interest-calculator",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.9,
},
```

---

## 11. SEO Strategy — Compound Interest Calculator

### Why This Tool Has High Organic Potential

Compound interest queries span multiple high-volume intent categories:

- **Educational intent:** "what is compound interest", "compound interest formula" —
  millions of monthly global searches, dominated by Investopedia and Wikipedia.
  A calculator page with strong explanatory content can compete in the top 10.

- **Tool intent:** "compound interest calculator", "investment growth calculator" —
  users want to use a tool, not just read. This is the core traffic source.

- **Product-specific intent:** "SIP calculator", "savings calculator UK",
  "FD interest calculator India" — high intent, regional, less competitive.

### Topical Authority Chain

```
/free-tools                              ← Hub
    ├── /compound-interest-calculator    ← Flagship savings tool
    ├── /emi-calculator                  ← Cross-links here (borrowing ↔ saving)
    ├── /car-loan-calculator             ← Cross-links here
    └── /salary-calculator               ← Cross-links here (earnings → savings)
```

This tool bridges the borrowing tools (EMI, car loan) and the income tool
(salary calculator). A user who calculates their take-home salary naturally
wants to see what investing that surplus earns — link these pages together.

### Content Differentiation

Most compound interest calculators show a result and stop. Add these to
outrank them:

```
✅ Named worked examples: "What does $500/month at 8% look like after 30 years?"
✅ The Rule of 72 explained with interactive examples
✅ Simple vs compound interest comparison table (included above in SEO content)
✅ Inflation adjustment — rare feature, targets "real return calculator" queries
✅ SIP framing for the Indian market (high search volume, easy to add a section)
✅ Country-specific context: "Average savings rate in UAE", "UK ISA allowance 2026"
```

### Unique Angle: The "Savings Mirror" for Loan Users

Every person calculating an EMI is also a potential savings calculator user.
Frame it this way in the internal link: *"Your car loan costs $4,752 in
interest over 5 years. What if that same $495/month went into an investment
instead?"* This contextual cross-linking increases time-on-site and
strengthens topical authority.

---

## 12. Regional Keyword Targeting

### United States
| Primary | Secondary |
|---|---|
| compound interest calculator | investment calculator |
| savings growth calculator | compound interest formula |
| compound interest calculator with monthly contributions | future value calculator |
| retirement savings calculator | 401k growth calculator |

### United Kingdom
| Primary | Secondary |
|---|---|
| compound interest calculator UK | savings calculator UK |
| investment growth calculator | ISA calculator |
| compound interest calculator GBP | how much will my savings grow |
| savings calculator with contributions | returns calculator UK |

### India
| Primary | Secondary |
|---|---|
| compound interest calculator | SIP calculator |
| SIP calculator India | mutual fund calculator |
| compound interest calculator INR | FD interest calculator |
| investment calculator India | CAGR calculator |
| Jankari interest calculator | lump sum calculator |

### UAE / Middle East
| Primary | Secondary |
|---|---|
| savings calculator UAE | compound interest calculator AED |
| investment calculator Dubai | savings growth calculator UAE |
| compound interest AED | UAE savings plan calculator |
| returns calculator UAE | fixed deposit calculator UAE |

### Germany
| Primary | Secondary |
|---|---|
| Zinseszinsrechner | Sparrechner |
| Zinsrechner | Zinseszins Formel |
| compound interest calculator Deutschland | Anlagerechner |
| Zinseszinsrechner mit Sparrate | Renditerechner |

### France
| Primary | Secondary |
|---|---|
| calculateur intérêts composés | calculateur épargne |
| simulateur placement | intérêts composés formule |
| calculateur rendement | France savings calculator |

### Singapore
| Primary | Secondary |
|---|---|
| compound interest calculator Singapore | savings calculator SGD |
| investment calculator Singapore | CPF calculator growth |
| compound interest SGD | Singapore savings plan |

---

## 13. On-Page SEO Checklist

### Content
- [ ] H1 contains "Compound Interest Calculator" (primary keyword)
- [ ] H2s include: "What Is Compound Interest", "Compound Interest Formula",
  "Rule of 72", "Compound vs Simple Interest"
- [ ] Formula is written out in a `<pre><code>` block (targets formula searches)
- [ ] At least 3 comparison tables with real numbers (generates rich snippet candidates)
- [ ] FAQ section has at least 5 questions (matching FAQPage schema)
- [ ] SIP calculator framing present (targets high-volume Indian queries)
- [ ] Inflation adjustment feature is mentioned in the intro (unique differentiator)
- [ ] Internal links to EMI calculator, car loan calculator, and salary calculator

### Technical
- [ ] `metadata.title` includes "Compound Interest Calculator" + currencies
- [ ] `metadata.description` mentions "monthly contributions" and "inflation"
- [ ] `alternates.canonical` points to `/free-tools/compound-interest-calculator`
- [ ] JSON-LD includes WebApplication + BreadcrumbList + FAQPage (6 questions)
- [ ] Breadcrumb visible in UI matches BreadcrumbList schema exactly
- [ ] Only `<CompoundInterestCalculator />` uses `"use client"` — page is SSR
- [ ] No `noindex` meta tags accidentally present
- [ ] Page loads in under 2.5s (check with Lighthouse — growth table can be heavy)
- [ ] Entry added to `sitemap.xml`
- [ ] Entry added to tools sidebar in `layout.tsx`
- [ ] Entry added to tools grid on `/free-tools` index page

### After Publishing
- [ ] Submit updated sitemap in Google Search Console
- [ ] Request indexing for `/free-tools/compound-interest-calculator`
- [ ] Add link from EMI calculator page to this tool
- [ ] Add link from car loan calculator page to this tool
- [ ] Add link from salary calculator page to this tool (savings angle)
- [ ] Add link from homepage if you have a "Popular Tools" section

---

## 14. Cross-linking with Other Tools

Cross-linking between related tools is one of the highest-ROI SEO actions
for a multi-tool site. Do all directions.

### On the EMI Calculator page — add:

```tsx
<li>
  <a href="/free-tools/compound-interest-calculator">Compound Interest Calculator</a>
  {" "}— See how your money grows while you pay off your loan
</li>
```

### On the Car Loan Calculator page — add:

```tsx
<li>
  <a href="/free-tools/compound-interest-calculator">Compound Interest Calculator</a>
  {" "}— See how the same monthly payment could grow as an investment
</li>
```

### On the Salary Calculator page — add:

```tsx
<li>
  <a href="/free-tools/compound-interest-calculator">Compound Interest Calculator</a>
  {" "}— Put your take-home pay to work and see how it grows
</li>
```

### On this Compound Interest Calculator page — add (already included in page.tsx above):

```tsx
<li>
  <a href="/free-tools/emi-calculator">EMI Calculator</a>
  {" "}— Calculate monthly loan repayments for home, car, and personal loans
</li>
<li>
  <a href="/free-tools/car-loan-calculator">Car Loan Calculator</a>
  {" "}— Monthly auto loan payments with down payment and trade-in support
</li>
<li>
  <a href="/free-tools/salary-calculator">Salary After Tax Calculator</a>
  {" "}— See your net take-home pay after tax in 12 countries
</li>
```

### Anchor text rules

- Use descriptive, keyword-rich anchor text: "Compound Interest Calculator" not "click here"
- Vary anchor text slightly across pages to avoid over-optimization
- Link from the related tools aside, not mid-paragraph

---

*Guide version 1.0 — extends the EMI Calculator and Car Loan Calculator guides for the same multi-tool Next.js site*
*Tech stack: Next.js 14+ App Router, TypeScript, Tailwind CSS (optional)*