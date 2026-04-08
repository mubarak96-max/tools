# Salary After Tax Calculator — Next.js Implementation Guide
### For a Multi-Tool Site at `/free-tools/salary-calculator`

> **Prerequisites:** You have already built the EMI Calculator and Car Loan Calculator.
> This guide follows the same SSR + client component architecture.
> The salary calculator is the most complex tool in your suite — it handles
> country-specific tax logic, social contributions, and multiple pay periods.

---

## Table of Contents

1. [Tool Overview & Differentiators](#1-tool-overview--differentiators)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Supported Countries & What Makes Each Unique](#3-supported-countries--what-makes-each-unique)
4. [Step 1 — Country & Tax Config](#4-step-1--country--tax-config)
5. [Step 2 — Core Tax Calculation Engine](#5-step-2--core-tax-calculation-engine)
6. [Step 3 — Country-Specific Tax Logic](#6-step-3--country-specific-tax-logic)
7. [Step 4 — Types](#7-step-4--types)
8. [Step 5 — Client Component (SalaryCalculator.tsx)](#8-step-5--client-component-salarycalculatortsx)
9. [Step 6 — Page (SSR + SEO)](#9-step-6--page-ssr--seo)
10. [Step 7 — Regional Sub-Pages (Phase 2)](#10-step-7--regional-sub-pages-phase-2)
11. [Step 8 — Update Shared Layout & Index](#11-step-8--update-shared-layout--index)
12. [Step 9 — Update Sitemap](#12-step-9--update-sitemap)
13. [SEO Strategy — Salary Calculator](#13-seo-strategy--salary-calculator)
14. [Regional Keyword Targeting](#14-regional-keyword-targeting)
15. [On-Page SEO Checklist](#15-on-page-seo-checklist)
16. [Tax Data Maintenance Plan](#16-tax-data-maintenance-plan)

---

## 1. Tool Overview & Differentiators

### What This Tool Does

Takes a gross salary (annual, monthly, weekly, or hourly) and returns:
- **Net take-home pay** in all four time periods
- **Full tax breakdown** (income tax, social security, other contributions)
- **Effective tax rate** vs marginal tax rate
- **Employer cost** (total cost to employer vs what employee receives)
- **Tax bracket visualizer** (where the salary sits in each bracket)
- **Country-specific fields** (filing status for US, tax class for Germany, province for Canada, etc.)

### What Makes This Better Than Competitors

| Feature |  | **Your Tool** |
|---|---|---|---|
| Country-specific optional fields | Partial | No | ✅ Full |
| Employer cost breakdown | No | No | ✅ Yes |
| Hourly ↔ Annual conversion | Yes | Yes | ✅ Yes |
| Tax bracket visualizer | No | No | ✅ Yes |
| 2026 tax rates | Yes | Yes | ✅ Yes |
| Effective vs marginal rate | No | Yes | ✅ Yes |
| Works per-country + global page | Separate URLs | One URL | ✅ Both |
| No sign-up required | Yes | Yes | ✅ Yes |

---

## 2. File & Folder Structure

```
your-nextjs-project/
├── app/
│   └── free-tools/
│       ├── layout.tsx                              ← UPDATE
│       ├── page.tsx                                ← UPDATE
│       └── salary-calculator/
│           ├── page.tsx                            ← NEW: global SSR page
│           ├── components/
│           │   ├── SalaryCalculator.tsx            ← NEW: main client component
│           │   ├── TaxBreakdownTable.tsx           ← NEW: results table
│           │   └── BracketVisualizer.tsx           ← NEW: tax bracket bar chart
│           └── [country]/                          ← NEW: Phase 2 regional pages
│               └── page.tsx
│
└── lib/
    └── tools/
        ├── emi.ts                                  ← existing
        ├── car-loan.ts                             ← existing
        ├── salary/
        │   ├── index.ts                            ← NEW: main export
        │   ├── config.ts                           ← NEW: country config + tax data
        │   ├── engine.ts                           ← NEW: core calculation engine
        │   ├── countries/
        │   │   ├── us.ts                           ← NEW: US federal + state logic
        │   │   ├── canada.ts                       ← NEW: federal + province logic
        │   │   ├── uk.ts                           ← NEW: PAYE + NI logic
        │   │   ├── germany.ts                      ← NEW: Steuerklasse + social
        │   │   ├── france.ts                       ← NEW: IR + cotisations sociales
        │   │   ├── netherlands.ts                  ← NEW: Box 1 + tax credits
        │   │   ├── spain.ts                        ← NEW: IRPF + SS
        │   │   ├── italy.ts                        ← NEW: IRPEF + INPS
        │   │   ├── uae.ts                          ← NEW: zero tax logic
        │   │   ├── singapore.ts                    ← NEW: progressive + CPF
        │   │   ├── india.ts                        ← NEW: new vs old regime
        │   │   └── japan.ts                        ← NEW: income + resident tax
        │   └── types.ts                            ← NEW: shared types
```

---

## 3. Supported Countries & What Makes Each Unique

Understanding each country's tax system before coding prevents major calculation errors.
This section is your reference — read it before writing any calculation logic.

---

### 🇺🇸 United States

**Currency:** USD | **Tax Year:** 2026

**Income Tax:** Federal progressive, 7 brackets (10%–37%). Plus state income tax
(varies from 0% in Texas, Florida, Nevada to 13.3% in California).

**Social Contributions (Employee):**
- Social Security: 6.2% on wages up to $184,500 (2026 wage base)
- Medicare: 1.45% on all wages (+ 0.9% Additional Medicare Tax above $200,000 single)

**Standard Deduction (2026):**
- Single: $16,100
- Married Filing Jointly: $32,200
- Head of Household: $24,150

**Country-Specific Fields:**
- Filing status: Single / Married Filing Jointly / Head of Household
- State (dropdown of all 50 states + DC)
- Pre-tax deductions: 401(k) contribution (up to $23,500), HSA ($4,300 individual)

**Key 2026 Update:** OBBBA made TCJA provisions permanent. Standard deductions
increased ~2.7% for inflation. Social Security wage base increased to $184,500.

---

### 🇨🇦 Canada

**Currency:** CAD | **Tax Year:** 2025/2026

**Income Tax:** Federal progressive (15%–33%) PLUS provincial tax (varies by province).
Every province has its own brackets. Ontario and Quebec are the most complex.

**Federal brackets (2025):**
- Up to $57,375: 15%
- $57,375 – $114,750: 20.5%
- $114,750 – $158,519: 26%
- $158,519 – $220,000: 29%
- Above $220,000: 33%

**Basic Personal Amount (federal):** ~$16,129 (2025)

**Social Contributions (Employee):**
- CPP (Canada Pension Plan): 5.95% on earnings between $3,500 and $73,200
- EI (Employment Insurance): 1.66% on insurable earnings up to $65,700

**Country-Specific Fields:**
- Province (dropdown — each has own rates)
- RRSP contributions (reduces federal taxable income)

**Provinces to include:** Ontario, British Columbia, Alberta, Quebec, Manitoba,
Saskatchewan, Nova Scotia, New Brunswick, PEI, Newfoundland

---

### 🇬🇧 United Kingdom

**Currency:** GBP | **Tax Year:** 2025/26 (April–April)

**Income Tax (England/Wales/NI):**
- Personal Allowance: £12,570 (zero tax)
- Basic rate: 20% (£12,571–£50,270)
- Higher rate: 40% (£50,271–£125,140)
- Additional rate: 45% (above £125,140)
- Personal Allowance tapers to £0 for income above £125,140

**National Insurance (Employee):**
- 8% on earnings between £12,570 and £50,270
- 2% on earnings above £50,270

**Student Loan Repayments (optional):**
- Plan 1: 9% above £26,575
- Plan 2: 9% above £27,295
- Plan 5 (post-2023): 9% above £25,000

**Country-Specific Fields:**
- Scotland toggle (Scotland has its own income tax rates — 5 bands)
- Student loan plan (Plan 1, 2, 4, 5, or none)
- Pension contributions (reduces taxable income)
- Tax code (e.g., 1257L) — advanced option

---

### 🇩🇪 Germany

**Currency:** EUR | **Tax Year:** 2026

**Income Tax:** Progressive formula (not stepped brackets).
- Up to €12,348: 0% (Grundfreibetrag)
- €12,349–€68,430: progressively 14%–42%
- €68,431–€277,826: flat 42%
- Above €277,826: 45% (Reichensteuer)

**Solidarity Surcharge (Solidaritätszuschlag):**
5.5% of income tax, but only applies to high earners (effectively eliminated for most
since 2021). Still applies above ~€136,000.

**Social Insurance (Employee share):**
- Pension (Rentenversicherung): 9.3% (capped at €101,400/yr)
- Health (Krankenversicherung): 7.3% + 1.7% avg additional contribution (capped €69,750/yr)
- Unemployment (Arbeitslosenversicherung): 1.3% (capped €101,400/yr)
- Long-term care (Pflegeversicherung): 1.8% standard; childless 23+ pay 2.4% (capped €69,750/yr)

**Church Tax (Kirchensteuer):** 8–9% of income tax (Bavaria 8%, other states 9%).
Optional — only for registered church members.

**Country-Specific Fields:**
- Tax class (Steuerklasse 1–6)
  - Class 1: Single/separated
  - Class 2: Single parent
  - Class 3: Higher-earning married partner
  - Class 4: Both partners earn similarly
  - Class 5: Lower-earning married partner
  - Class 6: Second job
- State (for church tax rate)
- Number of children (reduces long-term care surcharge)
- Health insurance type: Public (GKV) / Private (PKV)
- Church member toggle

---

### 🇫🇷 France

**Currency:** EUR | **Tax Year:** 2025

**Income Tax (Impôt sur le Revenu):** Household-based (parts system).
- Up to €11,497: 0%
- €11,497–€29,315: 11%
- €29,315–€83,823: 30%
- €83,823–€180,294: 41%
- Above €180,294: 45%

**Quotient Familial:** Income is divided by "parts" based on family size, reducing
tax burden for families with children. Married = 2 parts, each child = 0.5 parts.

**Social Contributions (Employee — Cotisations Sociales):**
- Health: ~0.75%
- Unemployment: 2.4%
- Pension: 6.9%
- CSG/CRDS (non-deductible): ~7.9%
- Total employee contributions: ~22-23% of gross

**Country-Specific Fields:**
- Number of "parts" (family quotient)
- Employment type: Employee (Salarié) / Self-employed (Auto-entrepreneur)

---

### 🇳🇱 Netherlands

**Currency:** EUR | **Tax Year:** 2025

**Income Tax (Box 1):**
- Up to €75,518: 36.97%
- Above €75,518: 49.5%

**Tax Credits (reduce final tax):**
- General tax credit (heffingskorting): up to €3,362 (phases out above ~€22,000)
- Labour credit (arbeidskorting): up to €5,158 (phases out above €37,691)

**Social Contributions:** Included within the Box 1 rate (the 36.97% covers
income tax + national insurance contributions).

**30% Ruling:** Qualifying expats can receive 30% of salary tax-free.

**Country-Specific Fields:**
- 30% ruling toggle (for expats)
- Pension premium contributions

---

### 🇪🇸 Spain

**Currency:** EUR | **Tax Year:** 2025

**Income Tax (IRPF):** National + regional components.
National brackets:
- Up to €12,450: 9.5%
- €12,450–€20,200: 12%
- €20,200–€35,200: 15%
- €35,200–€60,000: 18.5%
- €60,000–€300,000: 22.5%
- Above €300,000: 24.5%

**Personal Allowance:** €5,550 (additional €1,150 if 65+, another €1,400 if 75+)

**Social Security (Employee):**
- General contribution: 6.35% (capped ~€56,000/yr)
- Unemployment: 1.55%
- Professional training: 0.1%

**Country-Specific Fields:**
- Region (affects regional tax component — Madrid has lower rates)
- Age (affects personal allowance)

---

### 🇮🇹 Italy

**Currency:** EUR | **Tax Year:** 2025

**Income Tax (IRPEF):**
- Up to €28,000: 23%
- €28,000–€50,000: 35%
- Above €50,000: 43%

**Regional & Municipal Tax:** ~1.23–3.33% regional + 0.08–0.9% municipal

**Social Security (Employee — INPS):**
~9.19% on gross salary (with ceiling)

**Country-Specific Fields:**
- Region (affects regional/municipal surcharges)

---

### 🇦🇪 UAE

**Currency:** AED | **Tax Year:** Calendar year

**Income Tax:** Zero. The UAE has no personal income tax.

**Social Security:**
- UAE Nationals: Employee contributes 5% to GPSSA (pension fund), employer 12.5%
- Expatriates: No social security contributions

**What to Show:** This is a "zero tax" calculator — show the gross = net story,
but also show what an equivalent salary is worth after tax in comparison countries.
This is a unique feature that other calculators miss for UAE users.

**Country-Specific Fields:**
- Employment type: UAE National / Expatriate
- Comparison country (show what this salary would net in US/UK/Germany)

---

### 🇸🇬 Singapore

**Currency:** SGD | **Tax Year:** YA 2025 (income earned in 2024, assessed 2025)

**Income Tax:** Progressive, low rates.
- Up to $20,000: 0%
- $20,001–$30,000: 2%
- $30,001–$40,000: 3.5%
- $40,001–$80,000: 7%
- $80,001–$120,000: 11.5%
- $120,001–$160,000: 15%
- $160,001–$200,000: 18%
- $200,001–$240,000: 19%
- $240,001–$280,000: 19.5%
- $280,001–$320,000: 20%
- Above $320,000: 22%

**CPF (Central Provident Fund):**
Mandatory for Singapore Citizens and PRs only.
- Employee contribution: 20% (under 55), reduces with age
- Employer contribution: 17% (under 55)
- CPF reduces take-home pay but is still YOUR money (savings/housing/healthcare)

**Country-Specific Fields:**
- Residency: Tax Resident / Non-Resident
- CPF status: Yes (Citizen/PR) / No (Foreigner)

---

### 🇮🇳 India

**Currency:** INR | **Tax Year:** FY 2025-26 (April–March)

**Two Tax Regimes — user must choose:**

**New Regime (default from FY 2024-25):**
- Up to ₹3,00,000: 0%
- ₹3,00,001–₹7,00,000: 5%
- ₹7,00,001–₹10,00,000: 10%
- ₹10,00,001–₹12,00,000: 15%
- ₹12,00,001–₹15,00,000: 20%
- Above ₹15,00,000: 30%
- Standard deduction: ₹75,000
- Rebate u/s 87A: Full rebate if income ≤ ₹7,00,000 (no tax payable)

**Old Regime (with deductions):**
- Up to ₹2,50,000: 0%
- ₹2,50,001–₹5,00,000: 5%
- ₹5,00,001–₹10,00,000: 20%
- Above ₹10,00,000: 30%
- Allows deductions: 80C (₹1.5L), 80D (health insurance), HRA, LTA, etc.

**Surcharge:** 10% on income above ₹50L, 15% above ₹1Cr, 25% above ₹2Cr

**Cess:** 4% Health & Education Cess on total income tax

**Employee PF (Provident Fund):** 12% of basic salary (capped ₹15,000 basic)

**Country-Specific Fields:**
- Tax regime: New / Old
- Old regime: 80C deductions, 80D (health insurance), HRA
- Age: Below 60 / Senior Citizen 60-79 / Super Senior 80+
- Surcharge applies automatically based on income

---

### 🇯🇵 Japan

**Currency:** JPY | **Tax Year:** January–December

**National Income Tax:**
- Up to ¥1,950,000: 5%
- ¥1,950,001–¥3,300,000: 10%
- ¥3,300,001–¥6,950,000: 20%
- ¥6,950,001–¥9,000,000: 23%
- ¥9,000,001–¥18,000,000: 33%
- ¥18,000,001–¥40,000,000: 40%
- Above ¥40,000,000: 45%

**Inhabitant Tax (Resident Tax):** 10% flat on taxable income
(paid to prefectural 4% + municipal 6% government)

**Employment Income Deduction:** Applies to salaried workers (reduces taxable income).
Ranges from ¥550,000 for low incomes to ¥1,950,000 for higher incomes.

**Basic Exemption:** ¥480,000

**Social Insurance (Employee):**
- Health Insurance: ~4.99% (varies by prefecture, capped ~¥1.39M/yr)
- Pension (Kosei Nenkin): 9.15% (capped ~¥650,000/month)
- Employment Insurance: 0.6%
- Nursing Care (age 40+): 0.91%

**Country-Specific Fields:**
- Residence status: Tokyo / Other prefecture (affects inhabitant tax slightly)
- Age (nursing care insurance kicks in at 40)
- Dependents (affects deductions)

---

## 4. Step 1 — Country & Tax Config

**File:** `lib/tools/salary/config.ts`

```ts
export const COUNTRIES = [
  // ── North America ─────────────────────────────
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    region: "north-america",
    slug: "us",
    defaultSalary: 75_000,
    taxYear: "2026",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "CA$",
    locale: "en-CA",
    region: "north-america",
    slug: "canada",
    defaultSalary: 70_000,
    taxYear: "2025",
  },

  // ── Europe ────────────────────────────────────
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    locale: "en-GB",
    region: "europe",
    slug: "uk",
    defaultSalary: 40_000,
    taxYear: "2025/26",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    locale: "de-DE",
    region: "europe",
    slug: "germany",
    defaultSalary: 55_000,
    taxYear: "2026",
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
    locale: "fr-FR",
    region: "europe",
    slug: "france",
    defaultSalary: 38_000,
    taxYear: "2025",
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    currency: "EUR",
    currencySymbol: "€",
    locale: "nl-NL",
    region: "europe",
    slug: "netherlands",
    defaultSalary: 50_000,
    taxYear: "2025",
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    currency: "EUR",
    currencySymbol: "€",
    locale: "es-ES",
    region: "europe",
    slug: "spain",
    defaultSalary: 30_000,
    taxYear: "2025",
  },
  {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
    currency: "EUR",
    currencySymbol: "€",
    locale: "it-IT",
    region: "europe",
    slug: "italy",
    defaultSalary: 28_000,
    taxYear: "2025",
  },

  // ── Middle East ───────────────────────────────
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "د.إ",
    locale: "ar-AE",
    region: "middle-east",
    slug: "uae",
    defaultSalary: 180_000,
    taxYear: "2025",
  },

  // ── Asia ──────────────────────────────────────
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    currencySymbol: "S$",
    locale: "en-SG",
    region: "asia",
    slug: "singapore",
    defaultSalary: 72_000,
    taxYear: "2025",
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    currencySymbol: "₹",
    locale: "en-IN",
    region: "asia",
    slug: "india",
    defaultSalary: 1_200_000,
    taxYear: "FY 2025-26",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    currencySymbol: "¥",
    locale: "ja-JP",
    region: "asia",
    slug: "japan",
    defaultSalary: 5_000_000,
    taxYear: "2025",
  },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];
export type Country = (typeof COUNTRIES)[number];

export const PAY_PERIODS = [
  { id: "annual",  label: "Per Year",  hoursMultiplier: 2080 },
  { id: "monthly", label: "Per Month", hoursMultiplier: 173  },
  { id: "weekly",  label: "Per Week",  hoursMultiplier: 40   },
  { id: "hourly",  label: "Per Hour",  hoursMultiplier: 1    },
] as const;

export type PayPeriodId = (typeof PAY_PERIODS)[number]["id"];

// Work hours per year — used for hourly conversion
export const WORK_HOURS_PER_YEAR = 2080; // 52 weeks × 40 hours
export const WORK_WEEKS_PER_YEAR = 52;
export const WORK_MONTHS_PER_YEAR = 12;
```

---

## 5. Step 2 — Core Tax Calculation Engine

**File:** `lib/tools/salary/engine.ts`

```ts
import type { TaxBracket, SalaryResult, TaxLine } from "./types";

/**
 * Apply progressive tax brackets to a given taxable income.
 * Returns total tax and an array of per-bracket breakdown lines.
 */
export function applyBrackets(
  taxableIncome: number,
  brackets: TaxBracket[]
): { totalTax: number; lines: TaxLine[] } {
  let totalTax = 0;
  const lines: TaxLine[] = [];

  for (const bracket of brackets) {
    if (taxableIncome <= 0) break;

    const { min, max, rate } = bracket;
    const bracketWidth = max === Infinity ? taxableIncome : Math.min(max, taxableIncome + min) - min;
    const taxableInBracket = Math.min(taxableIncome, max !== Infinity ? max - min : taxableIncome);

    if (taxableInBracket <= 0) continue;

    const taxInBracket = taxableInBracket * (rate / 100);
    totalTax += taxInBracket;
    taxableIncome -= taxableInBracket;

    if (taxInBracket > 0) {
      lines.push({
        label: `${rate}% bracket`,
        amount: taxInBracket,
        rate,
        taxableAmount: taxableInBracket,
      });
    }
  }

  return { totalTax, lines };
}

/**
 * Convert any pay period salary to annual.
 */
export function toAnnual(
  amount: number,
  period: "annual" | "monthly" | "weekly" | "hourly",
  hoursPerWeek = 40
): number {
  switch (period) {
    case "annual":  return amount;
    case "monthly": return amount * 12;
    case "weekly":  return amount * 52;
    case "hourly":  return amount * hoursPerWeek * 52;
  }
}

/**
 * Break annual figures into all four pay periods.
 */
export function toAllPeriods(annual: number, hoursPerWeek = 40) {
  return {
    annual,
    monthly: annual / 12,
    weekly:  annual / 52,
    hourly:  annual / (hoursPerWeek * 52),
  };
}

/**
 * Calculate effective tax rate (total tax / gross income).
 */
export function effectiveRate(totalTax: number, grossIncome: number): number {
  if (grossIncome === 0) return 0;
  return (totalTax / grossIncome) * 100;
}
```

---

## 6. Step 3 — Country-Specific Tax Logic

Each country gets its own file. Below are complete implementations for
each supported country. The function signature is always the same:
`calculate[Country](input: CountryInput): SalaryResult`

---

### `lib/tools/salary/countries/us.ts`

```ts
import { applyBrackets, effectiveRate } from "../engine";
import type { SalaryResult } from "../types";

// 2026 Federal brackets — Single filer (post-OBBBA, inflation-adjusted)
const FEDERAL_BRACKETS_SINGLE_2026 = [
  { min: 0,       max: 11_925,  rate: 10 },
  { min: 11_925,  max: 48_475,  rate: 12 },
  { min: 48_475,  max: 103_350, rate: 22 },
  { min: 103_350, max: 197_300, rate: 24 },
  { min: 197_300, max: 250_525, rate: 32 },
  { min: 250_525, max: 626_350, rate: 35 },
  { min: 626_350, max: Infinity,rate: 37 },
];

const FEDERAL_BRACKETS_MFJ_2026 = [
  { min: 0,       max: 23_850,  rate: 10 },
  { min: 23_850,  max: 96_950,  rate: 12 },
  { min: 96_950,  max: 206_700, rate: 22 },
  { min: 206_700, max: 394_600, rate: 24 },
  { min: 394_600, max: 501_050, rate: 32 },
  { min: 501_050, max: 751_600, rate: 35 },
  { min: 751_600, max: Infinity,rate: 37 },
];

// Standard deductions 2026
const STANDARD_DEDUCTION = {
  single:  16_100,
  mfj:     32_200,
  hoh:     24_150,
};

// Social Security wage base 2026
const SS_WAGE_BASE = 184_500;

export interface USInput {
  grossAnnual: number;
  filingStatus: "single" | "mfj" | "hoh";
  state: string;                    // Two-letter state code
  retirement401k: number;           // Annual pre-tax contribution
  hsa: number;                      // Annual HSA contribution
}

// Simplified state tax rates (flat or top rate for estimation)
// For production: use full bracket data per state
const STATE_RATES: Record<string, number> = {
  AL: 5.0, AK: 0, AZ: 2.5, AR: 4.7, CA: 13.3, CO: 4.4, CT: 6.99,
  DE: 6.6, FL: 0, GA: 5.49, HI: 11.0, ID: 5.8, IL: 4.95, IN: 3.05,
  IA: 6.0, KS: 5.7, KY: 4.0, LA: 4.25, ME: 7.15, MD: 5.75, MA: 5.0,
  MI: 4.25, MN: 9.85, MS: 4.7, MO: 4.8, MT: 6.75, NE: 6.84, NV: 0,
  NH: 0, NJ: 10.75, NM: 5.9, NY: 10.9, NC: 4.5, ND: 2.5, OH: 3.99,
  OK: 4.75, OR: 9.9, PA: 3.07, RI: 5.99, SC: 6.4, SD: 0, TN: 0,
  TX: 0, UT: 4.65, VT: 8.75, VA: 5.75, WA: 0, WV: 5.12, WI: 7.65,
  WY: 0, DC: 10.75,
};

export function calculateUS(input: USInput): SalaryResult {
  const { grossAnnual, filingStatus, state, retirement401k, hsa } = input;

  // Pre-tax deductions reduce AGI
  const preTaxDeductions = retirement401k + hsa;
  const agi = grossAnnual - preTaxDeductions;

  // Standard deduction
  const stdDeduction = STANDARD_DEDUCTION[filingStatus] ?? STANDARD_DEDUCTION.single;
  const federalTaxableIncome = Math.max(0, agi - stdDeduction);

  // Federal income tax
  const brackets = filingStatus === "mfj"
    ? FEDERAL_BRACKETS_MFJ_2026
    : FEDERAL_BRACKETS_SINGLE_2026;
  const { totalTax: federalTax } = applyBrackets(federalTaxableIncome, brackets);

  // State income tax (simplified flat-rate estimate)
  const stateRate = STATE_RATES[state.toUpperCase()] ?? 0;
  const stateTax = federalTaxableIncome * (stateRate / 100);

  // FICA
  const ssTax = Math.min(grossAnnual, SS_WAGE_BASE) * 0.062;
  const medicareTax = grossAnnual * 0.0145;
  const additionalMedicare = grossAnnual > 200_000 ? (grossAnnual - 200_000) * 0.009 : 0;
  const ficaTax = ssTax + medicareTax + additionalMedicare;

  const totalTax = federalTax + stateTax + ficaTax;
  const netAnnual = grossAnnual - totalTax - preTaxDeductions;

  return {
    country: "US",
    grossAnnual,
    netAnnual,
    totalTax,
    effectiveRate: effectiveRate(totalTax, grossAnnual),
    breakdown: [
      { label: "Federal Income Tax",    amount: federalTax,    category: "tax" },
      { label: `${state} State Tax`,    amount: stateTax,      category: "tax" },
      { label: "Social Security",       amount: ssTax,         category: "social" },
      { label: "Medicare",              amount: medicareTax + additionalMedicare, category: "social" },
      { label: "401(k) Contribution",   amount: retirement401k, category: "pretax" },
      { label: "HSA Contribution",      amount: hsa,           category: "pretax" },
    ].filter(l => l.amount > 0),
    employerContributions: [
      { label: "Social Security (Employer)", amount: ssTax },
      { label: "Medicare (Employer)",        amount: grossAnnual * 0.0145 },
    ],
  };
}
```

---

### `lib/tools/salary/countries/uk.ts`

```ts
import { applyBrackets, effectiveRate } from "../engine";
import type { SalaryResult } from "../types";

// 2025/26 England/Wales/NI brackets (after personal allowance)
const UK_BRACKETS_2025 = [
  { min: 12_570, max: 50_270,  rate: 20 },
  { min: 50_270, max: 125_140, rate: 40 },
  { min: 125_140,max: Infinity,rate: 45 },
];

// Scotland 2025/26
const SCOTLAND_BRACKETS_2025 = [
  { min: 12_570, max: 14_876,  rate: 19 },
  { min: 14_876, max: 26_561,  rate: 20 },
  { min: 26_561, max: 43_662,  rate: 21 },
  { min: 43_662, max: 75_000,  rate: 42 },
  { min: 75_000, max: 125_140, rate: 45 },
  { min: 125_140,max: Infinity,rate: 48 },
];

const STUDENT_LOAN_THRESHOLDS: Record<string, { threshold: number; rate: number }> = {
  plan1: { threshold: 26_575, rate: 9 },
  plan2: { threshold: 27_295, rate: 9 },
  plan4: { threshold: 31_395, rate: 9 },  // Scotland
  plan5: { threshold: 25_000, rate: 9 },
};

export interface UKInput {
  grossAnnual: number;
  scotland: boolean;
  studentLoanPlan: "none" | "plan1" | "plan2" | "plan4" | "plan5";
  pensionContribution: number; // Annual, pre-tax
}

export function calculateUK(input: UKInput): SalaryResult {
  const { grossAnnual, scotland, studentLoanPlan, pensionContribution } = input;

  const taxableIncome = Math.max(0, grossAnnual - pensionContribution);

  // Personal allowance tapers above £100,000 (£1 lost per £2 earned)
  const personalAllowance = taxableIncome > 125_140
    ? 0
    : taxableIncome > 100_000
    ? Math.max(0, 12_570 - Math.round((taxableIncome - 100_000) / 2))
    : 12_570;

  const incomeAboveAllowance = Math.max(0, taxableIncome - personalAllowance);
  const brackets = scotland ? SCOTLAND_BRACKETS_2025 : UK_BRACKETS_2025;

  // For UK brackets, income includes the personal allowance offset
  const { totalTax: incomeTax } = applyBrackets(taxableIncome, brackets);

  // National Insurance (2025/26)
  const niLower = 12_570;
  const niUpper = 50_270;
  const ni = grossAnnual <= niLower ? 0
    : grossAnnual <= niUpper
    ? (grossAnnual - niLower) * 0.08
    : (niUpper - niLower) * 0.08 + (grossAnnual - niUpper) * 0.02;

  // Student loan
  let studentLoan = 0;
  if (studentLoanPlan !== "none") {
    const plan = STUDENT_LOAN_THRESHOLDS[studentLoanPlan];
    if (plan && grossAnnual > plan.threshold) {
      studentLoan = (grossAnnual - plan.threshold) * (plan.rate / 100);
    }
  }

  const totalDeductions = incomeTax + ni + studentLoan + pensionContribution;
  const netAnnual = grossAnnual - totalDeductions;

  return {
    country: "GB",
    grossAnnual,
    netAnnual,
    totalTax: incomeTax + ni,
    effectiveRate: effectiveRate(incomeTax + ni, grossAnnual),
    breakdown: [
      { label: "Income Tax",           amount: incomeTax,          category: "tax" },
      { label: "National Insurance",   amount: ni,                 category: "social" },
      { label: "Student Loan",         amount: studentLoan,        category: "other" },
      { label: "Pension Contribution", amount: pensionContribution,category: "pretax" },
    ].filter(l => l.amount > 0),
    employerContributions: [
      { label: "Employer NI",      amount: Math.max(0, grossAnnual - 9_100) * 0.138 },
      { label: "Employer Pension", amount: pensionContribution * 0.3 }, // estimate
    ],
  };
}
```

---

### `lib/tools/salary/countries/germany.ts`

```ts
import { effectiveRate } from "../engine";
import type { SalaryResult } from "../types";

// Germany uses a formula, not fixed brackets.
// This is an approximation using the official polynomial formula.
function germanIncomeTax(taxableIncome: number, taxClass: number): number {
  const grundfreibetrag = 12_348; // 2026

  if (taxClass === 2) {
    // Single parent gets additional allowance
    return Math.max(0, germanIncomeTax(taxableIncome - 4_260, 1));
  }
  if (taxClass === 3) {
    // Double allowance for higher-earning married partner
    return Math.max(0, germanIncomeTax(taxableIncome - grundfreibetrag, 1));
  }
  if (taxClass === 5) {
    // No allowance, steeper initial rate
    return taxableIncome * 0.25; // Simplified
  }

  if (taxableIncome <= grundfreibetrag) return 0;

  const y = (taxableIncome - grundfreibetrag) / 10_000;

  if (taxableIncome <= 17_005) {
    return (979.18 * y + 1_400) * y;
  }
  if (taxableIncome <= 68_430) {
    const z = (taxableIncome - 17_006) / 10_000;
    return (192.59 * z + 2_397) * z + 966.53;
  }
  if (taxableIncome <= 277_826) {
    return taxableIncome * 0.42 - 10_602.13;
  }
  return taxableIncome * 0.45 - 18_936.88;
}

export interface GermanyInput {
  grossAnnual: number;
  taxClass: 1 | 2 | 3 | 4 | 5 | 6;
  state: string;       // For church tax rate (Bavaria = 8%, others = 9%)
  churchMember: boolean;
  childless: boolean;  // For long-term care surcharge
  privateHealthInsurance: boolean;
  privateHealthPremium: number; // Annual, only if PKV
}

export function calculateGermany(input: GermanyInput): SalaryResult {
  const { grossAnnual, taxClass, state, churchMember, childless, privateHealthInsurance, privateHealthPremium } = input;

  // Contribution ceilings 2026
  const pensionCeiling    = 101_400;
  const healthCeiling     = 69_750;
  const unemploymentCeil  = 101_400;

  // Social contributions (employee share)
  const pensionBase        = Math.min(grossAnnual, pensionCeiling);
  const healthBase         = Math.min(grossAnnual, healthCeiling);

  const pension            = pensionBase * 0.093;
  const healthInsurance    = privateHealthInsurance
    ? Math.min(privateHealthPremium / 2, 4_000)
    : healthBase * (0.073 + 0.017);      // 7.3% statutory + avg 1.7% add'l
  const unemployment       = Math.min(grossAnnual, unemploymentCeil) * 0.013;
  const ltcRate            = childless ? 0.024 : 0.018;
  const longTermCare       = healthBase * ltcRate;

  const totalSocialContributions = pension + healthInsurance + unemployment + longTermCare;

  // Taxable income
  const taxableIncome = Math.max(0, grossAnnual - totalSocialContributions - 1_230); // employee flat-rate deduction

  // Income tax
  const incomeTax = germanIncomeTax(taxableIncome, taxClass);

  // Solidarity surcharge (only high earners since 2021)
  const soliThreshold = 18_130; // Annual income tax threshold
  const soli = incomeTax > soliThreshold ? incomeTax * 0.055 : 0;

  // Church tax
  const churchTaxRate = state === "BY" || state === "BW" ? 0.08 : 0.09;
  const churchTax = churchMember ? incomeTax * churchTaxRate : 0;

  const totalTax = incomeTax + soli + churchTax;
  const netAnnual = grossAnnual - totalTax - totalSocialContributions;

  return {
    country: "DE",
    grossAnnual,
    netAnnual,
    totalTax,
    effectiveRate: effectiveRate(totalTax + totalSocialContributions, grossAnnual),
    breakdown: [
      { label: "Income Tax (Lohnsteuer)",         amount: incomeTax,            category: "tax" },
      { label: "Solidarity Surcharge",             amount: soli,                 category: "tax" },
      { label: "Church Tax",                       amount: churchTax,            category: "tax" },
      { label: "Pension (Rentenversicherung)",     amount: pension,              category: "social" },
      { label: "Health Insurance",                 amount: healthInsurance,      category: "social" },
      { label: "Unemployment Insurance",           amount: unemployment,         category: "social" },
      { label: "Long-term Care Insurance",         amount: longTermCare,         category: "social" },
    ].filter(l => l.amount > 0),
    employerContributions: [
      { label: "Employer Pension",           amount: pension },
      { label: "Employer Health Insurance",  amount: healthBase * 0.073 },
      { label: "Employer Unemployment",      amount: unemployment },
      { label: "Employer Long-term Care",    amount: healthBase * 0.018 },
    ],
  };
}
```

---

### `lib/tools/salary/countries/uae.ts`

```ts
import type { SalaryResult } from "../types";

export interface UAEInput {
  grossAnnual: number;
  employmentType: "expat" | "national";
}

export function calculateUAE(input: UAEInput): SalaryResult {
  const { grossAnnual, employmentType } = input;

  // UAE nationals contribute 5% to GPSSA pension fund
  const pensionContribution = employmentType === "national"
    ? grossAnnual * 0.05
    : 0;

  const netAnnual = grossAnnual - pensionContribution;

  return {
    country: "AE",
    grossAnnual,
    netAnnual,
    totalTax: 0,
    effectiveRate: 0,
    breakdown: employmentType === "national"
      ? [{ label: "GPSSA Pension Contribution (5%)", amount: pensionContribution, category: "social" }]
      : [],
    employerContributions: employmentType === "national"
      ? [{ label: "Employer GPSSA Contribution (12.5%)", amount: grossAnnual * 0.125 }]
      : [],
    note: "The UAE has no personal income tax. Your gross salary is your take-home pay.",
  };
}
```

---

### `lib/tools/salary/countries/india.ts`

```ts
import { applyBrackets, effectiveRate } from "../engine";
import type { SalaryResult } from "../types";

// New Tax Regime FY 2025-26
const NEW_REGIME_BRACKETS = [
  { min: 0,          max: 300_000,   rate: 0  },
  { min: 300_000,    max: 700_000,   rate: 5  },
  { min: 700_000,    max: 1_000_000, rate: 10 },
  { min: 1_000_000,  max: 1_200_000, rate: 15 },
  { min: 1_200_000,  max: 1_500_000, rate: 20 },
  { min: 1_500_000,  max: Infinity,  rate: 30 },
];

// Old Tax Regime
const OLD_REGIME_BRACKETS = [
  { min: 0,         max: 250_000,  rate: 0  },
  { min: 250_000,   max: 500_000,  rate: 5  },
  { min: 500_000,   max: 1_000_000,rate: 20 },
  { min: 1_000_000, max: Infinity, rate: 30 },
];

export interface IndiaInput {
  grossAnnual: number;
  regime: "new" | "old";
  ageCategory: "below60" | "senior" | "superSenior";
  // Old regime deductions
  section80C: number;     // Max ₹150,000
  section80D: number;     // Health insurance premium
  hra: number;            // HRA exemption (depends on city/rent)
  pfContribution: number; // Employee PF contribution (12% of basic, capped ₹21,600/yr)
}

export function calculateIndia(input: IndiaInput): SalaryResult {
  const { grossAnnual, regime, ageCategory, section80C, section80D, hra, pfContribution } = input;

  let taxableIncome: number;
  let incomeTax: number;
  let pfActual: number;

  if (regime === "new") {
    // New regime: standard deduction ₹75,000, no other deductions
    taxableIncome = Math.max(0, grossAnnual - 75_000);
    const { totalTax } = applyBrackets(taxableIncome, NEW_REGIME_BRACKETS);

    // Section 87A rebate: if income ≤ ₹7,00,000, tax = 0
    incomeTax = taxableIncome <= 700_000 ? 0 : totalTax;
    pfActual = pfContribution;
  } else {
    // Old regime: various deductions
    const section80CActual = Math.min(section80C, 150_000);
    taxableIncome = Math.max(0, grossAnnual - 50_000 - section80CActual - section80D - hra);

    // Senior/super-senior have higher basic exemption
    const seniorExemption = ageCategory === "superSenior" ? 500_000
      : ageCategory === "senior" ? 300_000 : 0;

    if (ageCategory !== "below60") {
      taxableIncome = Math.max(0, taxableIncome - (seniorExemption - 250_000));
    }

    const { totalTax } = applyBrackets(taxableIncome, OLD_REGIME_BRACKETS);
    // 87A rebate for old regime (income ≤ ₹5L)
    incomeTax = taxableIncome <= 500_000 ? 0 : totalTax;
    pfActual = pfContribution;
  }

  // Surcharge
  let surcharge = 0;
  if (grossAnnual > 50_000_000)     surcharge = incomeTax * 0.25;
  else if (grossAnnual > 20_000_000) surcharge = incomeTax * 0.25;
  else if (grossAnnual > 10_000_000) surcharge = incomeTax * 0.15;
  else if (grossAnnual > 5_000_000)  surcharge = incomeTax * 0.10;

  // Health & Education Cess: 4% on (income tax + surcharge)
  const cess = (incomeTax + surcharge) * 0.04;

  const totalTax = incomeTax + surcharge + cess;
  const netAnnual = grossAnnual - totalTax - pfActual;

  return {
    country: "IN",
    grossAnnual,
    netAnnual,
    totalTax,
    effectiveRate: effectiveRate(totalTax, grossAnnual),
    breakdown: [
      { label: "Income Tax",              amount: incomeTax,  category: "tax" },
      { label: "Surcharge",               amount: surcharge,  category: "tax" },
      { label: "Health & Education Cess", amount: cess,       category: "tax" },
      { label: "PF Contribution",         amount: pfActual,   category: "social" },
    ].filter(l => l.amount > 0),
    employerContributions: [
      { label: "Employer PF (12%)", amount: Math.min(grossAnnual * 0.12, 21_600) },
    ],
    note: regime === "new"
      ? "Calculated under the New Tax Regime (FY 2025-26). Standard deduction of ₹75,000 applied."
      : "Calculated under the Old Tax Regime. Includes itemised deductions.",
  };
}
```

---

## 7. Step 4 — Types

**File:** `lib/tools/salary/types.ts`

```ts
export interface TaxBracket {
  min: number;
  max: number;
  rate: number; // percentage
}

export interface TaxLine {
  label: string;
  amount: number;
  rate: number;
  taxableAmount: number;
}

export interface BreakdownLine {
  label: string;
  amount: number;
  category: "tax" | "social" | "pretax" | "other";
}

export interface EmployerContribution {
  label: string;
  amount: number;
}

export interface SalaryResult {
  country: string;
  grossAnnual: number;
  netAnnual: number;
  totalTax: number;
  effectiveRate: number;            // percentage
  breakdown: BreakdownLine[];
  employerContributions: EmployerContribution[];
  note?: string;                    // Country-specific disclaimer
}

export interface SalaryPeriods {
  annual: number;
  monthly: number;
  weekly: number;
  hourly: number;
}

// Country-specific extra fields shown in the UI
export interface CountryOptions {
  US: { filingStatus: string; state: string; retirement401k: number; hsa: number };
  CA: { province: string; rrsp: number };
  GB: { scotland: boolean; studentLoanPlan: string; pensionContribution: number };
  DE: { taxClass: number; state: string; churchMember: boolean; childless: boolean; privateHealthInsurance: boolean };
  FR: { parts: number };
  NL: { thirtyPercentRuling: boolean };
  ES: { region: string; age: number };
  IT: { region: string };
  AE: { employmentType: string };
  SG: { cpfMember: boolean; residency: string };
  IN: { regime: string; ageCategory: string; section80C: number; section80D: number };
  JP: { age: number; prefecture: string };
}
```

---

## 8. Step 5 — Client Component (SalaryCalculator.tsx)

**File:** `app/free-tools/salary-calculator/components/SalaryCalculator.tsx`

This is a long component. Below is the full structure with inline comments.

```tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { COUNTRIES, PAY_PERIODS, toAnnual, toAllPeriods } from "@/lib/tools/salary/config";
import { calculateUS }      from "@/lib/tools/salary/countries/us";
import { calculateUK }      from "@/lib/tools/salary/countries/uk";
import { calculateGermany } from "@/lib/tools/salary/countries/germany";
import { calculateUAE }     from "@/lib/tools/salary/countries/uae";
import { calculateIndia }   from "@/lib/tools/salary/countries/india";
// ... import other country calculators
import type { SalaryResult } from "@/lib/tools/salary/types";

export default function SalaryCalculator() {

  // ── Core state ──────────────────────────────────────────────────────
  const [countryCode, setCountryCode] = useState("US");
  const [salaryInput, setSalaryInput] = useState("75000");
  const [payPeriod, setPayPeriod]     = useState<"annual"|"monthly"|"weekly"|"hourly">("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmployerCost, setShowEmployerCost] = useState(false);

  // ── Country-specific options state ─────────────────────────────────
  // US
  const [usFilingStatus, setUsFilingStatus] = useState<"single"|"mfj"|"hoh">("single");
  const [usState, setUsState]               = useState("CA");
  const [us401k, setUs401k]                 = useState(0);
  const [usHsa, setUsHsa]                   = useState(0);
  // UK
  const [ukScotland, setUkScotland]         = useState(false);
  const [ukStudentLoan, setUkStudentLoan]   = useState<"none"|"plan1"|"plan2"|"plan4"|"plan5">("none");
  const [ukPension, setUkPension]           = useState(0);
  // Germany
  const [deTaxClass, setDeTaxClass]         = useState<1|2|3|4|5|6>(1);
  const [deState, setDeState]               = useState("BE"); // Berlin
  const [deChurch, setDeChurch]             = useState(false);
  const [deChildless, setDeChildless]       = useState(true);
  const [dePrivateHealth, setDePrivateHealth] = useState(false);
  const [dePrivatePremium, setDePrivatePremium] = useState(0);
  // India
  const [inRegime, setInRegime]             = useState<"new"|"old">("new");
  const [inAge, setInAge]                   = useState<"below60"|"senior"|"superSenior">("below60");
  const [in80C, setIn80C]                   = useState(150_000);
  const [in80D, setIn80D]                   = useState(0);
  // UAE
  const [aeEmploymentType, setAeEmploymentType] = useState<"expat"|"national">("expat");

  const country = COUNTRIES.find(c => c.code === countryCode)!;

  // ── Derived: annual gross ──────────────────────────────────────────
  const grossAnnual = useMemo(() => {
    const amount = parseFloat(salaryInput.replace(/,/g, "")) || 0;
    return toAnnual(amount, payPeriod, hoursPerWeek);
  }, [salaryInput, payPeriod, hoursPerWeek]);

  // ── Tax calculation ────────────────────────────────────────────────
  const result = useMemo((): SalaryResult | null => {
    if (grossAnnual <= 0) return null;

    switch (countryCode) {
      case "US": return calculateUS({
        grossAnnual, filingStatus: usFilingStatus, state: usState,
        retirement401k: us401k, hsa: usHsa,
      });
      case "GB": return calculateUK({
        grossAnnual, scotland: ukScotland,
        studentLoanPlan: ukStudentLoan, pensionContribution: ukPension,
      });
      case "DE": return calculateGermany({
        grossAnnual, taxClass: deTaxClass, state: deState,
        churchMember: deChurch, childless: deChildless,
        privateHealthInsurance: dePrivateHealth, privateHealthPremium: dePrivatePremium,
      });
      case "AE": return calculateUAE({ grossAnnual, employmentType: aeEmploymentType });
      case "IN": return calculateIndia({
        grossAnnual, regime: inRegime, ageCategory: inAge,
        section80C: in80C, section80D: in80D, hra: 0,
        pfContribution: Math.min(grossAnnual * 0.12, 21_600),
      });
      // Add CA, FR, NL, ES, IT, SG, JP equivalents
      default: return null;
    }
  }, [countryCode, grossAnnual, usFilingStatus, usState, us401k, usHsa,
      ukScotland, ukStudentLoan, ukPension, deTaxClass, deState, deChurch,
      deChildless, dePrivateHealth, dePrivatePremium, aeEmploymentType,
      inRegime, inAge, in80C, in80D]);

  // ── Formatted net in all periods ─────────────────────────────────
  const netPeriods = useMemo(() => {
    if (!result) return null;
    return toAllPeriods(result.netAnnual, hoursPerWeek);
  }, [result, hoursPerWeek]);

  const fmt = useCallback((n: number) =>
    new Intl.NumberFormat(country.locale, {
      style: "currency", currency: country.currency, maximumFractionDigits: 0,
    }).format(n), [country]);

  // ── Handle country change ─────────────────────────────────────────
  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    const c = COUNTRIES.find(x => x.code === code)!;
    setSalaryInput(String(c.defaultSalary));
    setPayPeriod("annual");
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="salary-calculator">

      {/* Country selector */}
      <div className="field">
        <label htmlFor="country">Country</label>
        <select id="country" value={countryCode} onChange={e => handleCountryChange(e.target.value)}>
          <optgroup label="North America">
            {COUNTRIES.filter(c => c.region === "north-america").map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Europe">
            {COUNTRIES.filter(c => c.region === "europe").map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Middle East">
            {COUNTRIES.filter(c => c.region === "middle-east").map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Asia">
            {COUNTRIES.filter(c => c.region === "asia").map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Salary input + pay period */}
      <div className="salary-input-row">
        <div className="field salary-field">
          <label htmlFor="salary">
            Gross Salary ({country.currencySymbol})
          </label>
          <input
            id="salary"
            type="text"
            inputMode="numeric"
            value={salaryInput}
            onChange={e => setSalaryInput(e.target.value)}
            placeholder={`e.g. ${country.defaultSalary.toLocaleString()}`}
          />
        </div>
        <div className="field period-field">
          <label htmlFor="period">Pay Period</label>
          <select id="period" value={payPeriod}
            onChange={e => setPayPeriod(e.target.value as typeof payPeriod)}>
            {PAY_PERIODS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        {payPeriod === "hourly" && (
          <div className="field hours-field">
            <label htmlFor="hours">Hours/Week</label>
            <input id="hours" type="number" min={1} max={80}
              value={hoursPerWeek} onChange={e => setHoursPerWeek(Number(e.target.value))} />
          </div>
        )}
      </div>

      {/* Country-specific options (shown/hidden toggle) */}
      <button
        className="options-toggle"
        onClick={() => setShowOptions(!showOptions)}
        aria-expanded={showOptions}
      >
        {showOptions ? "▲ Hide" : "▼ Show"} Additional Options
      </button>

      {showOptions && (
        <div className="country-options">
          {/* Render country-specific fields based on countryCode */}
          {countryCode === "US" && (
            <>
              <div className="field">
                <label>Filing Status</label>
                <select value={usFilingStatus} onChange={e => setUsFilingStatus(e.target.value as typeof usFilingStatus)}>
                  <option value="single">Single</option>
                  <option value="mfj">Married Filing Jointly</option>
                  <option value="hoh">Head of Household</option>
                </select>
              </div>
              <div className="field">
                <label>State</label>
                <select value={usState} onChange={e => setUsState(e.target.value)}>
                  {/* Map all 50 states + DC */}
                  <option value="CA">California</option>
                  <option value="TX">Texas (no state tax)</option>
                  <option value="NY">New York</option>
                  {/* ... all states */}
                </select>
              </div>
              <div className="field">
                <label>401(k) Contribution (annual)
                  <span className="hint"> up to $23,500</span>
                </label>
                <input type="number" min={0} max={23_500}
                  value={us401k} onChange={e => setUs401k(Number(e.target.value))} />
              </div>
              <div className="field">
                <label>HSA Contribution (annual)</label>
                <input type="number" min={0} max={8_550}
                  value={usHsa} onChange={e => setUsHsa(Number(e.target.value))} />
              </div>
            </>
          )}

          {countryCode === "GB" && (
            <>
              <div className="field">
                <label>
                  <input type="checkbox" checked={ukScotland}
                    onChange={e => setUkScotland(e.target.checked)} />
                  {" "}Scottish taxpayer (different income tax rates apply)
                </label>
              </div>
              <div className="field">
                <label>Student Loan Repayment</label>
                <select value={ukStudentLoan} onChange={e => setUkStudentLoan(e.target.value as typeof ukStudentLoan)}>
                  <option value="none">None</option>
                  <option value="plan1">Plan 1 (pre-2012 loans)</option>
                  <option value="plan2">Plan 2 (post-2012 loans)</option>
                  <option value="plan4">Plan 4 (Scottish loans)</option>
                  <option value="plan5">Plan 5 (post-2023 loans)</option>
                </select>
              </div>
              <div className="field">
                <label>Pension Contribution (annual)</label>
                <input type="number" min={0}
                  value={ukPension} onChange={e => setUkPension(Number(e.target.value))} />
              </div>
            </>
          )}

          {countryCode === "DE" && (
            <>
              <div className="field">
                <label>Tax Class (Steuerklasse)</label>
                <select value={deTaxClass} onChange={e => setDeTaxClass(Number(e.target.value) as typeof deTaxClass)}>
                  <option value={1}>Class 1 — Single / Divorced / Separated</option>
                  <option value={2}>Class 2 — Single Parent</option>
                  <option value={3}>Class 3 — Married (higher earner)</option>
                  <option value={4}>Class 4 — Married (similar income)</option>
                  <option value={5}>Class 5 — Married (lower earner)</option>
                  <option value={6}>Class 6 — Second job</option>
                </select>
              </div>
              <div className="field">
                <label>
                  <input type="checkbox" checked={deChurch}
                    onChange={e => setDeChurch(e.target.checked)} />
                  {" "}Church member (Kirchensteuer applies)
                </label>
              </div>
              <div className="field">
                <label>
                  <input type="checkbox" checked={deChildless}
                    onChange={e => setDeChildless(e.target.checked)} />
                  {" "}No children (long-term care surcharge applies)
                </label>
              </div>
              <div className="field">
                <label>
                  <input type="checkbox" checked={dePrivateHealth}
                    onChange={e => setDePrivateHealth(e.target.checked)} />
                  {" "}Private health insurance (PKV)
                </label>
              </div>
            </>
          )}

          {countryCode === "IN" && (
            <>
              <div className="field">
                <label>Tax Regime</label>
                <div className="toggle-group">
                  <button className={inRegime === "new" ? "active" : ""} onClick={() => setInRegime("new")}>
                    New Regime
                  </button>
                  <button className={inRegime === "old" ? "active" : ""} onClick={() => setInRegime("old")}>
                    Old Regime
                  </button>
                </div>
                <p className="hint">
                  {inRegime === "new"
                    ? "Standard deduction ₹75,000. No other deductions. Simple and often better for most salaried employees."
                    : "Allows deductions under 80C, 80D, HRA etc. Better if you have large investments/expenses."}
                </p>
              </div>
              {inRegime === "old" && (
                <>
                  <div className="field">
                    <label>Section 80C Deductions (max ₹1,50,000)</label>
                    <input type="number" min={0} max={150_000}
                      value={in80C} onChange={e => setIn80C(Number(e.target.value))} />
                  </div>
                  <div className="field">
                    <label>Section 80D — Health Insurance Premium</label>
                    <input type="number" min={0}
                      value={in80D} onChange={e => setIn80D(Number(e.target.value))} />
                  </div>
                </>
              )}
              <div className="field">
                <label>Age Category</label>
                <select value={inAge} onChange={e => setInAge(e.target.value as typeof inAge)}>
                  <option value="below60">Below 60</option>
                  <option value="senior">Senior Citizen (60–79)</option>
                  <option value="superSenior">Super Senior Citizen (80+)</option>
                </select>
              </div>
            </>
          )}

          {countryCode === "AE" && (
            <div className="field">
              <label>Employment Type</label>
              <div className="toggle-group">
                <button className={aeEmploymentType === "expat" ? "active" : ""} onClick={() => setAeEmploymentType("expat")}>
                  Expatriate
                </button>
                <button className={aeEmploymentType === "national" ? "active" : ""} onClick={() => setAeEmploymentType("national")}>
                  UAE National
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {result && netPeriods && (
        <div className="results">

          {/* Primary result: net pay in selected period */}
          <div className="result-hero">
            <div className="result-net">
              <span>Your take-home pay</span>
              <strong>{fmt(netPeriods[payPeriod])}</strong>
              <span className="period-label">per {payPeriod === "annual" ? "year" : payPeriod === "monthly" ? "month" : payPeriod === "weekly" ? "week" : "hour"}</span>
            </div>
            <div className="effective-rate">
              Effective tax rate: <strong>{result.effectiveRate.toFixed(1)}%</strong>
            </div>
          </div>

          {/* Pay in all periods */}
          <div className="periods-grid">
            {PAY_PERIODS.map(p => (
              <div key={p.id} className={`period-cell ${p.id === payPeriod ? "active" : ""}`}>
                <span>{p.label}</span>
                <strong>{fmt(netPeriods[p.id as keyof typeof netPeriods])}</strong>
              </div>
            ))}
          </div>

          {/* Gross vs Net summary */}
          <div className="gross-net-summary">
            <div><span>Gross</span><span>{fmt(result.grossAnnual)}</span></div>
            <div><span>Total Deductions</span><span>- {fmt(result.grossAnnual - result.netAnnual)}</span></div>
            <div className="total"><span>Net Take-Home</span><strong>{fmt(result.netAnnual)}</strong></div>
          </div>

          {/* Detailed tax breakdown */}
          <div className="breakdown">
            <h3>Tax & Deduction Breakdown</h3>
            {result.breakdown.map(line => (
              <div key={line.label} className={`breakdown-line ${line.category}`}>
                <span>{line.label}</span>
                <span>
                  {fmt(line.amount)}
                  <span className="pct">
                    {" "}({((line.amount / result.grossAnnual) * 100).toFixed(1)}%)
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Employer cost (optional) */}
          <button onClick={() => setShowEmployerCost(!showEmployerCost)}>
            {showEmployerCost ? "Hide" : "Show"} Employer Total Cost
          </button>
          {showEmployerCost && result.employerContributions.length > 0 && (
            <div className="employer-cost">
              <h3>What You Cost Your Employer</h3>
              <div><span>Your Salary</span><span>{fmt(result.grossAnnual)}</span></div>
              {result.employerContributions.map(ec => (
                <div key={ec.label}><span>{ec.label}</span><span>+ {fmt(ec.amount)}</span></div>
              ))}
              <div className="total">
                <span>Total Employer Cost</span>
                <strong>
                  {fmt(result.grossAnnual + result.employerContributions.reduce((s, c) => s + c.amount, 0))}
                </strong>
              </div>
            </div>
          )}

          {/* Country-specific note */}
          {result.note && (
            <p className="country-note">ℹ️ {result.note}</p>
          )}

        </div>
      )}

    </div>
  );
}
```

---

## 9. Step 6 — Page (SSR + SEO)

**File:** `app/free-tools/salary-calculator/page.tsx`

```tsx
import { Metadata } from "next";
import SalaryCalculator from "./components/SalaryCalculator";

export const metadata: Metadata = {
  title: "Salary After Tax Calculator 2026 — Take-Home Pay for US, UK, Germany, India, UAE & More",
  description:
    "Calculate your net salary after tax for 12 countries including USA, Canada, UK, Germany, France, Netherlands, Spain, UAE, Singapore, India and Japan. Supports annual, monthly, weekly and hourly pay. Free, no sign-up.",
  keywords: [
    "salary after tax calculator",
    "take home pay calculator",
    "net salary calculator",
    "income tax calculator",
    "salary calculator 2026",
    "salary calculator USA",
    "salary calculator UK",
    "salary calculator Germany",
    "salary calculator India",
    "salary calculator UAE",
    "salary calculator Singapore",
    "salary calculator Canada",
    "salary calculator France",
    "salary calculator Netherlands",
    "Gehaltsrechner",
    "Brutto Netto Rechner",
    "calculateur salaire net",
    "salaris netto berekenen",
    "in hand salary calculator",
    "after tax salary Japan",
  ],
  alternates: {
    canonical: "https://yoursite.com/free-tools/salary-calculator",
    languages: {
      "en-US": "https://yoursite.com/free-tools/salary-calculator",
      "en-GB": "https://yoursite.com/free-tools/salary-calculator/uk",
      "de":    "https://yoursite.com/free-tools/salary-calculator/germany",
      "en-IN": "https://yoursite.com/free-tools/salary-calculator/india",
      "en-AE": "https://yoursite.com/free-tools/salary-calculator/uae",
    },
  },
  openGraph: {
    title: "Salary After Tax Calculator 2026 — 12 Countries",
    description:
      "Free take-home pay calculator for US, UK, Germany, India, UAE, Singapore, Canada, France and more. Annual, monthly, weekly and hourly results.",
    url: "https://yoursite.com/free-tools/salary-calculator",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Salary After Tax Calculator",
      url: "https://yoursite.com/free-tools/salary-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Free salary after tax calculator for 12 countries. Calculate net take-home pay with full tax breakdown including income tax, social security, and other deductions.",
      featureList: [
        "12 countries: US, Canada, UK, Germany, France, Netherlands, Spain, Italy, UAE, Singapore, India, Japan",
        "Annual, monthly, weekly, and hourly pay periods",
        "Country-specific fields: US filing status, German tax class, Indian tax regime",
        "Full tax breakdown and effective tax rate",
        "Employer total cost calculation",
        "2026 tax rates",
      ],
      availableLanguage: ["English", "German", "French"],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",       item: "https://yoursite.com" },
        { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://yoursite.com/free-tools" },
        { "@type": "ListItem", position: 3, name: "Salary Calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is take-home pay calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Take-home pay is your gross salary minus income tax and social security contributions. The exact deductions depend on your country, income level, and personal circumstances such as filing status (US), tax class (Germany), or choice of tax regime (India).",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between gross salary and net salary?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Gross salary is your total pay before any deductions. Net salary is what you actually receive in your bank account after income tax, social security contributions, and other mandatory deductions. The difference between gross and net varies significantly by country — it is typically larger in Germany, France, and Belgium than in Singapore, the UAE, or India.",
          },
        },
        {
          "@type": "Question",
          name: "What is an effective tax rate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your effective tax rate is the percentage of your total gross income that goes to taxes. It is always lower than your marginal (top bracket) tax rate because progressive systems only apply higher rates to the income above each threshold, not to your full salary.",
          },
        },
        {
          "@type": "Question",
          name: "Does the UAE have income tax?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. The UAE has no personal income tax. Your gross salary equals your take-home pay. UAE nationals make a 5% pension contribution to the GPSSA, but expatriate employees have no mandatory contributions.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between India's New Tax Regime and Old Tax Regime?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "India's New Tax Regime (default from FY 2024-25) offers lower tax rates with fewer deductions — just a ₹75,000 standard deduction. The Old Regime has higher base rates but allows deductions under Section 80C (investments), 80D (health insurance), HRA, and others. The New Regime is simpler and often better for salaried employees without large deductions.",
          },
        },
        {
          "@type": "Question",
          name: "What is the German Steuerklasse (Tax Class)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Germany assigns every employed person a tax class (Steuerklasse 1-6) that determines monthly payroll tax withholding. Class 1 is for single people, Class 3 for the higher-earning spouse in a married couple, Class 5 for the lower-earning spouse. The final tax liability is settled in the annual tax return.",
          },
        },
      ],
    },
  ],
};

export default function SalaryCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/free-tools">Free Tools</a></li>
            <li aria-current="page">Salary Calculator</li>
          </ol>
        </nav>

        <h1>Salary After Tax Calculator 2026</h1>
        <p>
          Find out your exact take-home pay after income tax and social security
          contributions. Select your country, enter your salary, and see your
          net pay broken down annually, monthly, weekly, and hourly.
          Covers <strong>12 countries</strong> with 2026 tax rates.
        </p>

        <SalaryCalculator />

        {/* SEO Content */}
        <section>
          <h2>How Take-Home Pay Is Calculated</h2>
          <p>
            Your net salary is your gross pay minus income tax (applied progressively
            through tax brackets) and mandatory social contributions such as pension,
            health insurance, and unemployment insurance. Each country has a different
            combination of these deductions.
          </p>

          <h2>Country Tax Overview</h2>

          <h3>🇺🇸 United States</h3>
          <p>
            The US has seven federal income tax brackets from 10% to 37% (2026).
            On top of federal tax, most states charge their own income tax, ranging
            from 0% in Texas and Florida to over 13% in California. Social Security
            (6.2%) and Medicare (1.45%) are also deducted. A typical US salaried
            employee earning $75,000 in California takes home approximately $52,000–$55,000.
          </p>

          <h3>🇬🇧 United Kingdom</h3>
          <p>
            UK employees pay income tax at 20% (basic rate), 40% (higher rate), and
            45% (additional rate) on income above the personal allowance of £12,570.
            National Insurance is charged at 8% on earnings between £12,570 and £50,270.
            Scotland has its own income tax rates with five bands.
          </p>

          <h3>🇩🇪 Germany</h3>
          <p>
            Germany uses a continuous progressive tax formula rather than fixed brackets.
            The effective rate is always lower than the marginal rate. Employees also
            pay substantial social contributions — pension (9.3%), health insurance
            (around 9%), unemployment (1.3%), and long-term care (1.8%). A German
            salary of €55,000 typically yields a net of around €35,000–€37,000
            depending on tax class and health insurance type.
          </p>

          <h3>🇦🇪 UAE</h3>
          <p>
            The UAE is one of the few countries in the world with zero personal income
            tax. All employees, including expatriates, keep their full gross salary.
            UAE nationals contribute 5% to the GPSSA pension fund, and employers
            contribute 12.5%.
          </p>

          <h3>🇮🇳 India</h3>
          <p>
            India offers two tax regimes. The New Regime (default from FY 2024-25)
            offers lower rates with a simple ₹75,000 standard deduction. The Old Regime
            has higher base rates but allows deductions under Section 80C (up to
            ₹1,50,000), 80D, HRA, and others. Income up to ₹7 lakh under the New
            Regime attracts zero tax due to the Section 87A rebate.
          </p>

          <h3>🇸🇬 Singapore</h3>
          <p>
            Singapore has one of the lowest income tax rates in Asia, topping out at 22%.
            CPF (Central Provident Fund) contributions of 20% (employee) are mandatory
            for citizens and PRs — but this money stays in your CPF account for
            housing, healthcare, and retirement, so it is not truly a loss.
            Foreigners working on Employment Pass do not pay CPF.
          </p>

          <h2>Frequently Asked Questions</h2>
          {/* FAQ content mirrors jsonLd FAQ for consistency */}

        </section>

        <aside aria-label="Related tools">
          <h2>Related Financial Tools</h2>
          <ul>
            <li><a href="/free-tools/emi-calculator">EMI Calculator</a></li>
            <li><a href="/free-tools/car-loan-calculator">Car Loan Calculator</a></li>
            <li><a href="/free-tools/currency-converter">Currency Converter</a></li>
          </ul>
        </aside>
      </main>
    </>
  );
}
```

---

## 10. Step 7 — Regional Sub-Pages (Phase 2)

Create these **only when the global page has established traffic.**
Each sub-page reuses `<SalaryCalculator />` but pre-selects a country
and has unique SEO content specific to that market.

**File pattern:** `app/free-tools/salary-calculator/[country]/page.tsx`

```ts
// Slugs to create:
// /free-tools/salary-calculator/us
// /free-tools/salary-calculator/uk
// /free-tools/salary-calculator/germany
// /free-tools/salary-calculator/india
// /free-tools/salary-calculator/uae
// /free-tools/salary-calculator/singapore
// /free-tools/salary-calculator/canada
// /free-tools/salary-calculator/france
// /free-tools/salary-calculator/netherlands
```

Each sub-page must have:
- Unique H1: "Salary After Tax Calculator Germany 2026"
- Unique intro mentioning local context (Brutto/Netto, Steuerklasse for Germany)
- Local average salary as the default input
- Country-specific FAQ (4–5 questions about that market's tax system)
- Comparison note: "See how German salaries compare to UK or US after tax"
- hreflang pointing to all variant pages
- Canonical pointing to itself (not the global page)

---

## 11. Step 8 — Update Shared Layout & Index

**`app/free-tools/layout.tsx`** — add to sidebar:

```tsx
<li><a href="/free-tools/salary-calculator">Salary Calculator</a></li>
```

**`app/free-tools/page.tsx`** — add to tools array:

```ts
{
  name: "Salary After Tax Calculator",
  href: "/free-tools/salary-calculator",
  description:
    "Calculate your net take-home pay after income tax and social contributions for 12 countries.",
  category: "Finance",
},
```

---

## 12. Step 9 — Update Sitemap

```ts
// Add to your sitemap.ts array:
{
  url: "https://yoursite.com/free-tools/salary-calculator",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.95, // Highest priority tool — highest search volume
},
// Phase 2: add regional sub-pages at 0.85
{
  url: "https://yoursite.com/free-tools/salary-calculator/germany",
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.85,
},
// repeat for each country
```

---

## 13. SEO Strategy — Salary Calculator

### Why This Is Your Most Valuable SEO Tool

Salary calculators are the **single highest search volume category** across
all finance tools globally. Queries like "salary after tax" and "income tax
calculator" get millions of monthly searches. This tool should be your
flagship SEO page — link to it from your homepage and every other tool.

### Topical Authority Chain

```
/free-tools                         ← Hub
    ├── /salary-calculator          ← Flagship (highest traffic)
    ├── /emi-calculator             ← Linked from salary page
    └── /car-loan-calculator        ← Linked from salary page
```

### The Germany Opportunity (Your Inspiration Source)

The site you referenced (Salary Calculator Germany on arbeitnow.com) ranks
exceptionally well because it combines:
1. Deep country-specific content (Steuerklasse explanations, contribution ceilings)
2. A genuinely accurate calculator (not simplified)
3. Strong internal linking within a developer-jobs context

Your advantage: a multi-country tool beats single-country tools for
users researching relocation, international job offers, or expat finances.
Target the query "salary after tax calculator" + country combinations.

### Content That Beats Competitors

Most salary calculators show numbers and stop. Add these unique content blocks
to outrank them:

```
✅ "What does €55,000 look like after tax in Germany?" → Named examples
✅ "Germany vs Netherlands: which salary goes further?" → Comparison content
✅ "UAE salary for expats: what you keep vs what you'd keep in the UK" → Expat content
✅ Minimum wage context: "Germany's minimum wage is €13.90/hr = €1,712/month net"
✅ Average salary context: "Average salary in Singapore is ~S$72,000/year = ~S$57,000 net"
✅ Tax freedom day equivalent per country
```

---

## 14. Regional Keyword Targeting

### United States
| Primary | Secondary |
|---|---|
| salary after tax calculator USA | take home pay calculator |
| income tax calculator 2026 | paycheck calculator |
| net salary calculator US | federal income tax calculator |
| salary calculator by state | California salary after tax |

### United Kingdom
| Primary | Secondary |
|---|---|
| salary after tax calculator UK | take home pay calculator UK |
| income tax calculator 2025/26 | net pay calculator UK |
| PAYE calculator | salary calculator Scotland |
| UK salary calculator with student loan | how much will I take home |

### Germany
| Primary | Secondary |
|---|---|
| Gehaltsrechner | Brutto Netto Rechner |
| Gehaltsrechner 2026 | Netto Gehalt berechnen |
| salary calculator Germany | Steuerklasse Rechner |
| Lohnsteuerrechner | Germany net salary calculator |

### France
| Primary | Secondary |
|---|---|
| calculateur salaire net | simulateur salaire net |
| calcul salaire après impôt | net après prélèvements sociaux |
| France salary after tax | calculateur impôt sur le revenu |

### Netherlands
| Primary | Secondary |
|---|---|
| salaris netto berekenen | netto salaris calculator |
| Netherlands salary after tax | Dutch take-home pay calculator |
| 30% ruling calculator | arbeidskorting berekenen |

### UAE
| Primary | Secondary |
|---|---|
| UAE salary calculator | Dubai salary after tax |
| UAE take home pay | salary in UAE no tax |
| UAE expat salary calculator | AED salary calculator |

### Singapore
| Primary | Secondary |
|---|---|
| Singapore salary after tax | CPF calculator Singapore |
| Singapore take home pay | Singapore income tax calculator |
| net salary Singapore | Employment Pass salary calculator |

### India
| Primary | Secondary |
|---|---|
| salary after tax India | in hand salary calculator |
| income tax calculator India 2025-26 | new tax regime calculator |
| CTC to in hand salary | take home salary calculator India |
| income tax calculator FY 2025-26 | salary calculator INR |

### Japan
| Primary | Secondary |
|---|---|
| Japan salary after tax | Japan income tax calculator |
| Japan take home pay | 手取り計算 (tedori keisan) |
| Japan net salary calculator | Japan social insurance calculator |

---

## 15. On-Page SEO Checklist

### Content
- [ ] H1 includes "Salary After Tax Calculator 2026" and key countries
- [ ] H2s include: country-specific overviews, "How is take-home pay calculated", FAQ
- [ ] Average salary + typical net shown for each major country in content
- [ ] At least 6 FAQ questions with schema markup
- [ ] UAE zero-tax section explicitly explained (high-value search query)
- [ ] India New vs Old regime clearly explained
- [ ] Germany Steuerklasse explained
- [ ] Internal links to EMI, car loan, and currency converter tools

### Technical
- [ ] All country-specific calculation files created and tested
- [ ] Results match official government calculators within 2–5%
- [ ] Page is SSR — `<SalaryCalculator />` is the only `"use client"` component
- [ ] JSON-LD includes WebApplication + BreadcrumbList + FAQPage
- [ ] `metadata.canonical` set to `/free-tools/salary-calculator`
- [ ] `metadata.alternates.languages` set with hreflang for all regional variants
- [ ] Page loads in under 2.5s (large component — verify with Lighthouse)
- [ ] Entry in `sitemap.xml` with `priority: 0.95`

### After Publishing
- [ ] Submit updated sitemap in Google Search Console
- [ ] Request immediate indexing for `/free-tools/salary-calculator`
- [ ] Add link from homepage to this tool
- [ ] Add link to this tool from EMI and car loan pages
- [ ] Share on Reddit: r/personalfinance, r/india, r/dubai, r/germany, r/singapore

---

## 16. Tax Data Maintenance Plan

Tax rates change every year. This is the most important operational consideration
for a salary calculator. Here is a sustainable maintenance process:

### Annual Update Schedule

| Country | Tax Year Starts | Update Deadline |
|---|---|---|
| USA | January 1 | December — IRS publishes Rev. Proc. early November |
| UK | April 6 | March — Budget announcement typically February/March |
| Germany | January 1 | December — Jahressteuergesetz typically passed Q4 |
| India | April 1 | February/March — Union Budget presentation |
| Singapore | January 1 | October — Budget announcement |
| Japan | January 1 | December |
| Canada | January 1 | November |
| France | January 1 | December |
| UAE | No change needed | N/A — no income tax |

### Update Checklist Per Country (annual)
1. Update bracket thresholds in `lib/tools/salary/countries/[country].ts`
2. Update standard deductions / personal allowances
3. Update social contribution rates and ceilings
4. Update `taxYear` in `lib/tools/salary/config.ts` for the country
5. Update the `metadata.title` to include new year
6. Cross-check 3 salary examples against the official government calculator
7. Update the `lastModified` date in `sitemap.ts`
8. Add a "Updated for [Year]" note to the page content

### Data Sources Per Country
- **USA:** IRS Revenue Procedure (released October/November annually)
- **UK:** HMRC Tax Rates and Allowances page
- **Germany:** Bundesministerium der Finanzen (BMF)
- **India:** Income Tax India official website + Union Budget press release
- **Singapore:** IRAS (Inland Revenue Authority of Singapore)
- **Japan:** National Tax Agency (NTA) Japan
- **Canada:** Canada Revenue Agency (CRA)
- **France:** impots.gouv.fr
- **Netherlands:** Belastingdienst
- **Spain:** Agencia Tributaria

---

*Guide version 1.0 — covers Next.js 14+ App Router, TypeScript, 12 countries, 2026 tax rates*
*Extends the EMI Calculator and Car Loan Calculator guides for the same multi-tool site*