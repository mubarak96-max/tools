# VAT Calculator — Next.js Implementation Guide
### For a Multi-Tool Site at `/free-tools/vat-calculator`

> **Prerequisites:** You have already built the EMI Calculator, Car Loan Calculator,
> Salary Calculator, and Discount Calculator. This guide follows the same
> SSR + client component architecture.
> The VAT calculator supports two modes: (1) add VAT to a net price, and
> (2) remove VAT from a gross price to find the original net amount.

---

## Table of Contents

1. [Tool Overview & Differentiators](#1-tool-overview--differentiators)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Supported Countries & VAT Rates](#3-supported-countries--vat-rates)
4. [Step 1 — Calculation Logic](#4-step-1--calculation-logic)
5. [Step 2 — VAT Rate Config](#5-step-2--vat-rate-config)
6. [Step 3 — Types](#6-step-3--types)
7. [Step 4 — Client Component (VATCalculator.tsx)](#7-step-4--client-component-vatcalculatortsx)
8. [Step 5 — Page (SSR + SEO)](#8-step-5--page-ssr--seo)
9. [Step 6 — Update Shared Layout & Index](#9-step-6--update-shared-layout--index)
10. [Step 7 — Update Sitemap](#10-step-7--update-sitemap)
11. [SEO Strategy — VAT Calculator](#11-seo-strategy--vat-calculator)
12. [Regional Keyword Targeting](#12-regional-keyword-targeting)
13. [On-Page SEO Checklist](#13-on-page-seo-checklist)
14. [VAT Rate Maintenance Plan](#14-vat-rate-maintenance-plan)

---

## 1. Tool Overview & Differentiators

### What This Tool Does

Two calculation modes in one tool:

**Mode A — "Add VAT" (Net → Gross)**
- Input: Net price (ex-VAT) + VAT rate
- Output: VAT amount, gross price (inc-VAT)
- Use case: Businesses pricing products, freelancers writing invoices

**Mode B — "Remove VAT" (Gross → Net)**
- Input: Gross price (inc-VAT) + VAT rate
- Output: VAT amount, net price (ex-VAT)
- Use case: Consumers checking how much tax is in a price, accountants reconciling receipts

### What Makes This Better Than Competitors

| Feature | Most Competitors | **Your Tool** |
|---|---|---|
| Both add & remove VAT modes | Often separate pages | ✅ Tab-based, single URL |
| Pre-loaded country VAT rates | Rare | ✅ 30+ countries |
| Reduced & zero rate options | No | ✅ Yes (food, medical, etc.) |
| Custom rate input | Rare | ✅ Yes |
| Shows all three values at once | Partial | ✅ Net, VAT amount, Gross |
| Real-time calculation | No | ✅ Yes |
| JSON-LD structured data | No | ✅ Yes |
| SSR for SEO | No | ✅ Yes |

### Why This Page Has SEO Value

"VAT calculator" is one of the highest-volume finance tool searches in the UK
and Europe. It is a year-round query (not seasonal) with strong commercial
intent — businesses and freelancers use it daily. The UK alone drives hundreds
of thousands of monthly searches. UAE is a growing market since VAT was
introduced in 2018 and many businesses and consumers still look it up.

---

## 2. File & Folder Structure

Add only the files marked `← NEW`.

```
your-nextjs-project/
├── app/
│   └── free-tools/
│       ├── layout.tsx                              ← UPDATE
│       ├── page.tsx                                ← UPDATE
│       └── vat-calculator/
│           ├── page.tsx                            ← NEW: SSR page + SEO
│           └── components/
│               └── VATCalculator.tsx               ← NEW: client component
│
└── lib/
    └── tools/
        ├── emi.ts                                  ← existing
        ├── car-loan.ts                             ← existing
        ├── discount.ts                             ← existing
        ├── salary/                                 ← existing
        └── vat.ts                                  ← NEW: VAT logic + config
```

---

## 3. Supported Countries & VAT Rates

VAT (Value Added Tax) is called different things in different countries but
the underlying calculation is identical. This section is your reference for
the rate config you will build in Step 2.

| Country | Standard Rate | Reduced Rate(s) | Notes |
|---|---|---|---|
| 🇬🇧 United Kingdom | 20% | 5% (energy, children's car seats) | Zero rate for food, books, children's clothing |
| 🇩🇪 Germany | 19% | 7% (food, books, public transport) | Mehrwertsteuer (MwSt) |
| 🇫🇷 France | 20% | 10%, 5.5%, 2.1% | Multiple reduced bands |
| 🇳🇱 Netherlands | 21% | 9% (food, medicine, books) | BTW |
| 🇮🇹 Italy | 22% | 10%, 5%, 4% | IVA |
| 🇪🇸 Spain | 21% | 10%, 4% | IVA |
| 🇦🇹 Austria | 20% | 13%, 10% | MwSt |
| 🇧🇪 Belgium | 21% | 12%, 6% | BTW/TVA |
| 🇸🇪 Sweden | 25% | 12%, 6% | Moms |
| 🇩🇰 Denmark | 25% | — | Moms (no reduced rate) |
| 🇳🇴 Norway | 25% | 15%, 12% | MVA |
| 🇨🇭 Switzerland | 8.1% | 3.8%, 2.6% | MWST — not EU VAT |
| 🇵🇱 Poland | 23% | 8%, 5% | VAT |
| 🇵🇹 Portugal | 23% | 13%, 6% | IVA |
| 🇮🇪 Ireland | 23% | 13.5%, 9%, 4.8% | VAT |
| 🇬🇷 Greece | 24% | 13%, 6% | ΦΠΑ |
| 🇦🇪 UAE | 5% | — | VAT (introduced Jan 2018) |
| 🇸🇦 Saudi Arabia | 15% | — | VAT (increased from 5% in 2020) |
| 🇦🇺 Australia | 10% | — | GST (not VAT, but same calc) |
| 🇳🇿 New Zealand | 15% | — | GST |
| 🇨🇦 Canada | 5% (GST) | — | Federal GST only; provinces vary |
| 🇸🇬 Singapore | 9% | — | GST (increased from 8% in 2024) |
| 🇮🇳 India | 18% (GST) | 12%, 5%, 0% | GST replaces VAT; 4 slabs |
| 🇯🇵 Japan | 10% | 8% (food & non-alcoholic drinks) | 消費税 (Consumption Tax) |
| 🇿🇦 South Africa | 15% | — | VAT |
| 🇲🇾 Malaysia | 8% (SST) | 5% | Sales & Service Tax |
| 🇵🇭 Philippines | 12% | — | VAT |
| 🇲🇽 Mexico | 16% | — | IVA |
| 🇧🇷 Brazil | ~17% (ICMS) | Varies by state | Complex — use as estimate only |
| 🇷🇺 Russia | 20% | 10% | НДС |
| Custom | User input | — | Any rate the user types |

> **Design decision:** Show the top 10 most-searched countries as quick-select
> buttons, and put the rest in a searchable dropdown. This balances UX with coverage.

---

## 4. Step 1 — Calculation Logic

**File:** `lib/tools/vat.ts`

The VAT formula is simple and universal. Both modes derive from the same
relationship: **Gross = Net × (1 + Rate)**.

```ts
/**
 * Mode A: Add VAT to a net (ex-VAT) price.
 *
 * @param netPrice  - Price before VAT
 * @param vatRate   - VAT rate as a percentage (e.g. 20 for 20%)
 */
export function addVAT(netPrice: number, vatRate: number): VATResult {
  if (netPrice < 0 || vatRate < 0) {
    return { netPrice: 0, vatAmount: 0, grossPrice: 0, vatRate: 0 };
  }

  const rate = vatRate / 100;
  const vatAmount = netPrice * rate;
  const grossPrice = netPrice + vatAmount;

  return {
    netPrice,
    vatAmount,
    grossPrice,
    vatRate,
  };
}

/**
 * Mode B: Remove VAT from a gross (inc-VAT) price.
 * Uses the "VAT fraction" method: VAT = Gross × (Rate / (100 + Rate))
 *
 * @param grossPrice - Price including VAT
 * @param vatRate    - VAT rate as a percentage (e.g. 20 for 20%)
 */
export function removeVAT(grossPrice: number, vatRate: number): VATResult {
  if (grossPrice < 0 || vatRate < 0) {
    return { netPrice: 0, vatAmount: 0, grossPrice: 0, vatRate: 0 };
  }

  // The VAT fraction: correct method for extracting VAT from a gross price.
  // For 20% VAT: fraction = 20/120 = 1/6. NOT 20% of the gross price.
  const vatAmount = grossPrice * (vatRate / (100 + vatRate));
  const netPrice = grossPrice - vatAmount;

  return {
    netPrice,
    vatAmount,
    grossPrice,
    vatRate,
  };
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface VATResult {
  netPrice: number;    // Price excluding VAT
  vatAmount: number;   // The VAT portion only
  grossPrice: number;  // Price including VAT
  vatRate: number;     // The rate used (for display)
}

export type VATMode = "add" | "remove";
```

> **Critical:** The "remove VAT" formula is a common source of errors.
> To extract VAT from a gross price, use `Gross × Rate / (100 + Rate)`,
> **not** `Gross × Rate / 100`. For 20% VAT: the fraction is 20/120 (= 1/6),
> not 20/100. Both formulas produce different results and only the former is correct.

---

## 5. Step 2 — VAT Rate Config

**File:** `lib/tools/vat.ts` (add below the functions)

```ts
export interface VATCountry {
  code: string;             // ISO 3166-1 alpha-2
  name: string;             // Display name
  flag: string;             // Emoji flag
  currency: string;         // ISO 4217 currency code
  currencySymbol: string;   // Display symbol
  locale: string;           // BCP 47 locale for number formatting
  standardRate: number;     // Primary VAT rate (%)
  reducedRates: VATRate[];  // Additional rates (may be empty)
  taxName: string;          // Local name (VAT, GST, MwSt, etc.)
  featured: boolean;        // Show as quick-select button
}

export interface VATRate {
  rate: number;
  label: string;            // e.g. "Reduced rate", "Food & books"
}

export const VAT_COUNTRIES: VATCountry[] = [
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    locale: "en-GB",
    standardRate: 20,
    reducedRates: [
      { rate: 5, label: "Reduced rate (energy, children's car seats)" },
      { rate: 0, label: "Zero rate (food, books, children's clothing)" },
    ],
    taxName: "VAT",
    featured: true,
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    locale: "de-DE",
    standardRate: 19,
    reducedRates: [
      { rate: 7, label: "Ermäßigter Satz (Lebensmittel, Bücher)" },
    ],
    taxName: "MwSt",
    featured: true,
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
    locale: "fr-FR",
    standardRate: 20,
    reducedRates: [
      { rate: 10, label: "Taux intermédiaire (restaurants, travaux)" },
      { rate: 5.5, label: "Taux réduit (alimentation, livres)" },
      { rate: 2.1, label: "Taux super réduit (médicaments remboursables)" },
    ],
    taxName: "TVA",
    featured: true,
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    currency: "EUR",
    currencySymbol: "€",
    locale: "nl-NL",
    standardRate: 21,
    reducedRates: [
      { rate: 9, label: "Laag tarief (voeding, medicijnen, boeken)" },
    ],
    taxName: "BTW",
    featured: true,
  },
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "د.إ",
    locale: "ar-AE",
    standardRate: 5,
    reducedRates: [],
    taxName: "VAT",
    featured: true,
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    currency: "AUD",
    currencySymbol: "A$",
    locale: "en-AU",
    standardRate: 10,
    reducedRates: [],
    taxName: "GST",
    featured: true,
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    currencySymbol: "₹",
    locale: "en-IN",
    standardRate: 18,
    reducedRates: [
      { rate: 12, label: "Standard slab" },
      { rate: 5, label: "Reduced slab" },
      { rate: 0, label: "Exempt" },
    ],
    taxName: "GST",
    featured: true,
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    currency: "SGD",
    currencySymbol: "S$",
    locale: "en-SG",
    standardRate: 9,
    reducedRates: [],
    taxName: "GST",
    featured: true,
  },
  {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
    currency: "EUR",
    currencySymbol: "€",
    locale: "it-IT",
    standardRate: 22,
    reducedRates: [
      { rate: 10, label: "Aliquota ridotta (alimentari, turismo)" },
      { rate: 5, label: "Aliquota ridotta speciale" },
      { rate: 4, label: "Aliquota super ridotta (generi di prima necessità)" },
    ],
    taxName: "IVA",
    featured: false,
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    currency: "EUR",
    currencySymbol: "€",
    locale: "es-ES",
    standardRate: 21,
    reducedRates: [
      { rate: 10, label: "Tipo reducido (alimentación, turismo)" },
      { rate: 4, label: "Tipo superreducido (básicos)" },
    ],
    taxName: "IVA",
    featured: false,
  },
  {
    code: "SE",
    name: "Sweden",
    flag: "🇸🇪",
    currency: "SEK",
    currencySymbol: "kr",
    locale: "sv-SE",
    standardRate: 25,
    reducedRates: [
      { rate: 12, label: "Livsmedel, hotell" },
      { rate: 6, label: "Tidningar, böcker, persontransport" },
    ],
    taxName: "Moms",
    featured: false,
  },
  {
    code: "DK",
    name: "Denmark",
    flag: "🇩🇰",
    currency: "DKK",
    currencySymbol: "kr",
    locale: "da-DK",
    standardRate: 25,
    reducedRates: [],
    taxName: "Moms",
    featured: false,
  },
  {
    code: "NO",
    name: "Norway",
    flag: "🇳🇴",
    currency: "NOK",
    currencySymbol: "kr",
    locale: "nb-NO",
    standardRate: 25,
    reducedRates: [
      { rate: 15, label: "Matvarer" },
      { rate: 12, label: "Persontransport, kino, overnatting" },
    ],
    taxName: "MVA",
    featured: false,
  },
  {
    code: "CH",
    name: "Switzerland",
    flag: "🇨🇭",
    currency: "CHF",
    currencySymbol: "Fr",
    locale: "de-CH",
    standardRate: 8.1,
    reducedRates: [
      { rate: 3.8, label: "Beherbergungsleistungen" },
      { rate: 2.6, label: "Lebensmittel, Medikamente, Bücher" },
    ],
    taxName: "MWST",
    featured: false,
  },
  {
    code: "PL",
    name: "Poland",
    flag: "🇵🇱",
    currency: "PLN",
    currencySymbol: "zł",
    locale: "pl-PL",
    standardRate: 23,
    reducedRates: [
      { rate: 8, label: "Stawka obniżona (budownictwo, usługi)" },
      { rate: 5, label: "Stawka obniżona (żywność, książki)" },
    ],
    taxName: "VAT",
    featured: false,
  },
  {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    currency: "EUR",
    currencySymbol: "€",
    locale: "pt-PT",
    standardRate: 23,
    reducedRates: [
      { rate: 13, label: "Taxa intermédia" },
      { rate: 6, label: "Taxa reduzida (alimentação, medicamentos)" },
    ],
    taxName: "IVA",
    featured: false,
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    currency: "EUR",
    currencySymbol: "€",
    locale: "en-IE",
    standardRate: 23,
    reducedRates: [
      { rate: 13.5, label: "Reduced rate (construction, tourism)" },
      { rate: 9, label: "Second reduced rate (newspapers, food services)" },
      { rate: 4.8, label: "Livestock rate" },
    ],
    taxName: "VAT",
    featured: false,
  },
  {
    code: "GR",
    name: "Greece",
    flag: "🇬🇷",
    currency: "EUR",
    currencySymbol: "€",
    locale: "el-GR",
    standardRate: 24,
    reducedRates: [
      { rate: 13, label: "Μειωμένος (τρόφιμα, φάρμακα, ξενοδοχεία)" },
      { rate: 6, label: "Υπερ-μειωμένος (βιβλία, θέατρο)" },
    ],
    taxName: "ΦΠΑ",
    featured: false,
  },
  {
    code: "AT",
    name: "Austria",
    flag: "🇦🇹",
    currency: "EUR",
    currencySymbol: "€",
    locale: "de-AT",
    standardRate: 20,
    reducedRates: [
      { rate: 13, label: "Ermäßigt (Kunst, Tiergärten, Saatgut)" },
      { rate: 10, label: "Ermäßigt (Lebensmittel, Bücher, Miete)" },
    ],
    taxName: "MwSt",
    featured: false,
  },
  {
    code: "BE",
    name: "Belgium",
    flag: "🇧🇪",
    currency: "EUR",
    currencySymbol: "€",
    locale: "fr-BE",
    standardRate: 21,
    reducedRates: [
      { rate: 12, label: "Taux intermédiaire (restaurants)" },
      { rate: 6, label: "Taux réduit (alimentation, médicaments)" },
    ],
    taxName: "BTW/TVA",
    featured: false,
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    currency: "NZD",
    currencySymbol: "NZ$",
    locale: "en-NZ",
    standardRate: 15,
    reducedRates: [],
    taxName: "GST",
    featured: false,
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    currency: "SAR",
    currencySymbol: "﷼",
    locale: "ar-SA",
    standardRate: 15,
    reducedRates: [],
    taxName: "VAT",
    featured: false,
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    currency: "ZAR",
    currencySymbol: "R",
    locale: "en-ZA",
    standardRate: 15,
    reducedRates: [],
    taxName: "VAT",
    featured: false,
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    currency: "JPY",
    currencySymbol: "¥",
    locale: "ja-JP",
    standardRate: 10,
    reducedRates: [
      { rate: 8, label: "軽減税率 (食料品・新聞)" },
    ],
    taxName: "消費税",
    featured: false,
  },
  {
    code: "PH",
    name: "Philippines",
    flag: "🇵🇭",
    currency: "PHP",
    currencySymbol: "₱",
    locale: "en-PH",
    standardRate: 12,
    reducedRates: [],
    taxName: "VAT",
    featured: false,
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    currency: "MXN",
    currencySymbol: "$",
    locale: "es-MX",
    standardRate: 16,
    reducedRates: [],
    taxName: "IVA",
    featured: false,
  },
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    currency: "RUB",
    currencySymbol: "₽",
    locale: "ru-RU",
    standardRate: 20,
    reducedRates: [
      { rate: 10, label: "Пониженная ставка (продукты, медикаменты)" },
    ],
    taxName: "НДС",
    featured: false,
  },
  // Custom entry — always last, rendered as manual input
  {
    code: "CUSTOM",
    name: "Custom rate",
    flag: "🌐",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    standardRate: 10,
    reducedRates: [],
    taxName: "VAT",
    featured: false,
  },
];

// Convenience export: featured countries for quick-select UI
export const FEATURED_VAT_COUNTRIES = VAT_COUNTRIES.filter((c) => c.featured);

// Default country on first load
export const DEFAULT_VAT_COUNTRY = VAT_COUNTRIES.find((c) => c.code === "GB")!;
```

---

## 6. Step 3 — Types

**File:** `types/tools.ts` — add to your existing types file.

```ts
export interface VATResult {
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  vatRate: number;
}

export type VATMode = "add" | "remove";
```

---

## 7. Step 4 — Client Component (VATCalculator.tsx)

**File:** `app/free-tools/vat-calculator/components/VATCalculator.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import {
  addVAT,
  removeVAT,
  VAT_COUNTRIES,
  FEATURED_VAT_COUNTRIES,
  DEFAULT_VAT_COUNTRY,
  type VATMode,
  type VATCountry,
} from "@/lib/tools/vat";

export default function VATCalculator() {
  // ── Mode ────────────────────────────────────────────────────
  const [mode, setMode] = useState<VATMode>("add");

  // ── Country & rate ──────────────────────────────────────────
  const [country, setCountry] = useState<VATCountry>(DEFAULT_VAT_COUNTRY);
  const [vatRate, setVatRate] = useState<number>(country.standardRate);
  const [isCustomRate, setIsCustomRate] = useState(false);

  // ── Price input ─────────────────────────────────────────────
  const [price, setPrice] = useState<number>(100);

  // ── Calculation ─────────────────────────────────────────────
  const result = useMemo(() => {
    return mode === "add"
      ? addVAT(price, vatRate)
      : removeVAT(price, vatRate);
  }, [mode, price, vatRate]);

  // ── Helpers ─────────────────────────────────────────────────
  const fmt = (n: number) =>
    new Intl.NumberFormat(country.locale, {
      style: "currency",
      currency: country.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const fmtPct = (n: number) =>
    `${n % 1 === 0 ? n : n.toFixed(1)}%`;

  const handleCountryChange = (code: string) => {
    const selected = VAT_COUNTRIES.find((c) => c.code === code);
    if (!selected) return;
    setCountry(selected);
    if (selected.code === "CUSTOM") {
      setIsCustomRate(true);
    } else {
      setIsCustomRate(false);
      setVatRate(selected.standardRate);
    }
  };

  const handleRateSelect = (rate: number) => {
    setVatRate(rate);
    setIsCustomRate(false);
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="vat-calculator">

      {/* Mode tabs */}
      <div role="tablist" aria-label="Calculation mode" className="mode-tabs">
        <button
          role="tab"
          aria-selected={mode === "add"}
          onClick={() => setMode("add")}
        >
          Add VAT
        </button>
        <button
          role="tab"
          aria-selected={mode === "remove"}
          onClick={() => setMode("remove")}
        >
          Remove VAT
        </button>
      </div>

      {/* Country selector */}
      <div className="input-group">
        <label htmlFor="country-select">Country / Region</label>

        {/* Featured quick-select buttons */}
        <div className="featured-countries" role="group" aria-label="Featured countries">
          {FEATURED_VAT_COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => handleCountryChange(c.code)}
              aria-pressed={country.code === c.code}
              title={`${c.name} ${c.taxName} ${fmtPct(c.standardRate)}`}
            >
              {c.flag} {c.code}
            </button>
          ))}
        </div>

        {/* Full country dropdown */}
        <select
          id="country-select"
          value={country.code}
          onChange={(e) => handleCountryChange(e.target.value)}
          aria-label="Select country"
        >
          <optgroup label="Featured">
            {FEATURED_VAT_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} — {c.taxName} {fmtPct(c.standardRate)}
              </option>
            ))}
          </optgroup>
          <optgroup label="All countries">
            {VAT_COUNTRIES.filter((c) => !c.featured).map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} — {c.taxName} {fmtPct(c.standardRate)}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* VAT rate selector */}
      <div className="input-group">
        <label>
          {country.taxName} rate
        </label>

        {/* Rate quick-select: standard + reduced rates */}
        <div className="rate-buttons" role="group" aria-label="VAT rate options">
          <button
            onClick={() => handleRateSelect(country.standardRate)}
            aria-pressed={vatRate === country.standardRate && !isCustomRate}
          >
            {fmtPct(country.standardRate)} Standard
          </button>
          {country.reducedRates.map((r) => (
            <button
              key={r.rate}
              onClick={() => handleRateSelect(r.rate)}
              aria-pressed={vatRate === r.rate && !isCustomRate}
              title={r.label}
            >
              {fmtPct(r.rate)} Reduced
            </button>
          ))}
          <button
            onClick={() => setIsCustomRate(true)}
            aria-pressed={isCustomRate}
          >
            Custom
          </button>
        </div>

        {/* Custom rate input */}
        {isCustomRate && (
          <div className="input-with-suffix">
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={vatRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0 && val <= 100) setVatRate(val);
              }}
              aria-label="Custom VAT rate"
            />
            <span aria-hidden="true">%</span>
          </div>
        )}
      </div>

      {/* Price input */}
      <div className="input-group">
        <label htmlFor="price-input">
          {mode === "add"
            ? `Net price (ex-${country.taxName})`
            : `Gross price (inc-${country.taxName})`}
        </label>
        <div className="input-with-prefix">
          <span aria-hidden="true">{country.currencySymbol}</span>
          <input
            id="price-input"
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val >= 0) setPrice(val);
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="results-card" aria-live="polite" aria-atomic="true">
        <div className="result-row">
          <span>Net price (ex-{country.taxName})</span>
          <span className={mode === "remove" ? "result-primary" : ""}>
            {fmt(result.netPrice)}
          </span>
        </div>
        <div className="result-row">
          <span>{country.taxName} ({fmtPct(vatRate)})</span>
          <span className="vat-amount">{fmt(result.vatAmount)}</span>
        </div>
        <div className="result-row result-primary">
          <span>Gross price (inc-{country.taxName})</span>
          <strong>{fmt(result.grossPrice)}</strong>
        </div>
      </div>

    </div>
  );
}
```

---

## 8. Step 5 — Page (SSR + SEO)

**File:** `app/free-tools/vat-calculator/page.tsx`

```tsx
import { Metadata } from "next";
import VATCalculator from "./components/VATCalculator";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "VAT Calculator — Add or Remove VAT for 30+ Countries | YourSite",
  description:
    "Free VAT calculator. Add VAT to a net price or remove VAT from a gross price. Covers UK (20%), Germany (19%), UAE (5%), Australia (10%), India GST and 30+ countries. Instant results.",
  keywords: [
    "VAT calculator",
    "VAT calculator UK",
    "add VAT calculator",
    "remove VAT calculator",
    "reverse VAT calculator",
    "GST calculator",
    "MwSt Rechner",
    "TVA calculateur",
    "VAT calculator UAE",
    "inclusive VAT calculator",
    "exclusive VAT calculator",
  ],
  alternates: {
    canonical: "https://yoursite.com/free-tools/vat-calculator",
  },
  openGraph: {
    title: "VAT Calculator — Add or Remove VAT for 30+ Countries",
    description:
      "Calculate VAT for UK, Germany, UAE, Australia, India and 30+ countries. Add VAT to net price or extract VAT from gross price. Free, no sign-up.",
    url: "https://yoursite.com/free-tools/vat-calculator",
    siteName: "YourSite",
    type: "website",
  },
};

// ── JSON-LD ────────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "VAT Calculator",
      url: "https://yoursite.com/free-tools/vat-calculator",
      description:
        "Add VAT to a net price or remove VAT from a gross price. Supports 30+ countries including UK, Germany, UAE, Australia and India.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://yoursite.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Free Tools",
          item: "https://yoursite.com/free-tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "VAT Calculator",
          item: "https://yoursite.com/free-tools/vat-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I add VAT to a price?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Multiply the net (ex-VAT) price by the VAT rate divided by 100, then add the result to the original price. For example: £100 net + 20% VAT = £100 × 0.20 = £20 VAT, so the gross price is £120.",
          },
        },
        {
          "@type": "Question",
          name: "How do I remove VAT from a price?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To extract VAT from a gross (VAT-inclusive) price, use the VAT fraction: VAT amount = Gross price × (Rate ÷ (100 + Rate)). For 20% UK VAT: VAT = £120 × (20 ÷ 120) = £20. Net price = £120 − £20 = £100. Do not simply multiply the gross price by 20% — that gives the wrong answer.",
          },
        },
        {
          "@type": "Question",
          name: "What is the VAT rate in the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The standard UK VAT rate is 20%. A reduced rate of 5% applies to domestic energy and children's car seats. A zero rate (0%) applies to most food, books, children's clothing, and public transport.",
          },
        },
        {
          "@type": "Question",
          name: "What is the VAT rate in the UAE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The UAE introduced VAT on 1 January 2018 at a standard rate of 5%. There is no reduced rate. Some supplies are zero-rated (exports, international transport) or exempt (certain financial services, residential property).",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between VAT-inclusive and VAT-exclusive prices?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A VAT-exclusive price (also called net price or ex-VAT price) does not include VAT — it is the base price before tax is added. A VAT-inclusive price (also called gross price or inc-VAT price) already includes the VAT. Businesses typically quote ex-VAT prices to other businesses, while consumer-facing prices are inc-VAT.",
          },
        },
        {
          "@type": "Question",
          name: "Is GST the same as VAT?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GST (Goods and Services Tax) and VAT (Value Added Tax) are the same type of consumption tax, just named differently in different countries. Australia, New Zealand, Canada, Singapore, and India use the term GST. The calculation method is identical, so this calculator works for both.",
          },
        },
      ],
    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VATCalculatorPage() {
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
            <li aria-current="page">VAT Calculator</li>
          </ol>
        </nav>

        <h1>VAT Calculator</h1>
        <p>
          Add VAT to a net price or remove VAT from a gross price.
          Supports 30+ countries including the UK, Germany, UAE, Australia,
          and India (GST). Instant results — no sign-up required.
        </p>

        {/* Interactive calculator */}
        <VATCalculator />

        {/* SEO content */}
        <section aria-label="VAT explained">

          <h2>How to Add VAT to a Price</h2>
          <p>
            To calculate the gross (VAT-inclusive) price from a net price:
          </p>
          <pre>
            <code>
              VAT Amount = Net Price × (VAT Rate ÷ 100){"\n"}
              Gross Price = Net Price + VAT Amount
            </code>
          </pre>
          <p>
            <strong>Example (UK, 20%):</strong> A service costs £500 net.
            VAT = £500 × 0.20 = £100. Gross price = £500 + £100 = <strong>£600</strong>.
          </p>

          <h2>How to Remove VAT from a Price (Reverse VAT)</h2>
          <p>
            To find the net price from a VAT-inclusive gross price, use the
            VAT fraction. <strong>Do not simply multiply the gross price by the
            VAT rate</strong> — that gives the wrong answer.
          </p>
          <pre>
            <code>
              VAT Amount = Gross Price × (VAT Rate ÷ (100 + VAT Rate)){"\n"}
              Net Price  = Gross Price − VAT Amount
            </code>
          </pre>
          <p>
            <strong>Example (UK, 20%):</strong> A receipt shows £360 inc-VAT.
            VAT fraction = 20 ÷ 120 = 1/6. VAT amount = £360 ÷ 6 = £60.
            Net price = £360 − £60 = <strong>£300</strong>.
          </p>
          <p>
            The common mistake is calculating 20% of £360 = £72, which is incorrect.
            The correct VAT amount is £60 because the 20% rate was applied to the
            net price (£300), not the gross.
          </p>

          <h2>VAT Rates by Country (2026)</h2>
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Tax Name</th>
                <th>Standard Rate</th>
                <th>Reduced Rate(s)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>🇬🇧 United Kingdom</td><td>VAT</td><td>20%</td><td>5%, 0%</td></tr>
              <tr><td>🇩🇪 Germany</td><td>MwSt</td><td>19%</td><td>7%</td></tr>
              <tr><td>🇫🇷 France</td><td>TVA</td><td>20%</td><td>10%, 5.5%, 2.1%</td></tr>
              <tr><td>🇳🇱 Netherlands</td><td>BTW</td><td>21%</td><td>9%</td></tr>
              <tr><td>🇮🇹 Italy</td><td>IVA</td><td>22%</td><td>10%, 5%, 4%</td></tr>
              <tr><td>🇪🇸 Spain</td><td>IVA</td><td>21%</td><td>10%, 4%</td></tr>
              <tr><td>🇸🇪 Sweden</td><td>Moms</td><td>25%</td><td>12%, 6%</td></tr>
              <tr><td>🇩🇰 Denmark</td><td>Moms</td><td>25%</td><td>—</td></tr>
              <tr><td>🇨🇭 Switzerland</td><td>MWST</td><td>8.1%</td><td>3.8%, 2.6%</td></tr>
              <tr><td>🇦🇪 UAE</td><td>VAT</td><td>5%</td><td>—</td></tr>
              <tr><td>🇸🇦 Saudi Arabia</td><td>VAT</td><td>15%</td><td>—</td></tr>
              <tr><td>🇦🇺 Australia</td><td>GST</td><td>10%</td><td>—</td></tr>
              <tr><td>🇳🇿 New Zealand</td><td>GST</td><td>15%</td><td>—</td></tr>
              <tr><td>🇸🇬 Singapore</td><td>GST</td><td>9%</td><td>—</td></tr>
              <tr><td>🇮🇳 India</td><td>GST</td><td>18%</td><td>12%, 5%, 0%</td></tr>
              <tr><td>🇯🇵 Japan</td><td>消費税</td><td>10%</td><td>8%</td></tr>
            </tbody>
          </table>

          <h2>VAT-Inclusive vs VAT-Exclusive Prices</h2>
          <p>
            Businesses quoting to other VAT-registered businesses typically use
            ex-VAT (net) prices, since the recipient can reclaim VAT. Consumer-facing
            prices must be shown inc-VAT in most countries. When comparing prices,
            always check whether quoted figures include or exclude VAT.
          </p>

          <h2>Frequently Asked Questions</h2>

          <h3>How do I add VAT to a price?</h3>
          <p>
            Multiply the net price by the VAT rate (as a decimal) and add it to the
            original. For UK 20%: £100 × 0.20 = £20 VAT → gross price £120.
          </p>

          <h3>How do I remove VAT from a price?</h3>
          <p>
            Use the VAT fraction: VAT = Gross × (Rate ÷ (100 + Rate)).
            For UK 20%: £120 × (20 ÷ 120) = £20 VAT → net price £100.
            Do not multiply the gross by the rate directly — it gives the wrong answer.
          </p>

          <h3>What is the VAT rate in the UK?</h3>
          <p>
            The standard UK VAT rate is 20%. A reduced rate of 5% applies to
            domestic energy and children's car seats. Most food, books, and
            children's clothing are zero-rated (0%).
          </p>

          <h3>What is the VAT rate in the UAE?</h3>
          <p>
            The UAE standard VAT rate is 5%, introduced on 1 January 2018.
            There is no reduced rate. Exports and some financial services are zero-rated.
          </p>

          <h3>Is GST the same as VAT?</h3>
          <p>
            Yes — GST (Goods and Services Tax) and VAT are the same type of tax,
            with different names in different countries. The calculation is identical.
            Australia, New Zealand, Canada, Singapore, and India use GST.
          </p>

          <h3>What is the difference between inc-VAT and ex-VAT?</h3>
          <p>
            Ex-VAT (exclusive) means the price does not include VAT — VAT will be
            added on top. Inc-VAT (inclusive) means VAT is already included in the
            stated price. Consumer prices are typically shown inc-VAT.
          </p>

        </section>

        {/* Internal links */}
        <aside aria-label="Related tools">
          <h2>Related Financial Tools</h2>
          <ul>
            <li>
              <a href="/free-tools/discount-calculator">Discount Calculator</a>
              {" "}— Calculate sale prices and percentage savings
            </li>
            <li>
              <a href="/free-tools/salary-calculator">Salary After Tax Calculator</a>
              {" "}— Take-home pay after income tax in 12 countries
            </li>
            <li>
              <a href="/free-tools/emi-calculator">EMI Calculator</a>
              {" "}— Monthly loan instalments for home, car and personal loans
            </li>
          </ul>
        </aside>

      </main>
    </>
  );
}
```

---

## 9. Step 6 — Update Shared Layout & Index

### Layout sidebar

**File:** `app/free-tools/layout.tsx`

```tsx
<li><a href="/free-tools/vat-calculator">VAT Calculator</a></li>
```

Full updated Finance Calculators sidebar section:

```tsx
<section>
  <h3>Finance Calculators</h3>
  <ul>
    <li><a href="/free-tools/emi-calculator">EMI Calculator</a></li>
    <li><a href="/free-tools/car-loan-calculator">Car Loan Calculator</a></li>
    <li><a href="/free-tools/salary-calculator">Salary Calculator</a></li>
    <li><a href="/free-tools/discount-calculator">Discount Calculator</a></li>
    <li><a href="/free-tools/vat-calculator">VAT Calculator</a></li>   {/* ← NEW */}
  </ul>
</section>
```

### Tools index page

**File:** `app/free-tools/page.tsx`

```ts
{
  name: "VAT Calculator",
  href: "/free-tools/vat-calculator",
  description:
    "Add or remove VAT for 30+ countries. Supports UK, Germany, UAE, Australia, India (GST) and more.",
  category: "Finance",
},
```

---

## 10. Step 7 — Update Sitemap

**File:** `app/sitemap.ts`

```ts
{
  url: "https://yoursite.com/free-tools/vat-calculator",
  lastModified: new Date(),
  changeFrequency: "yearly" as const,
  priority: 0.85,
},
```

> **Note:** VAT rates do change (Singapore raised GST from 8% to 9% in 2024;
> Saudi Arabia raised from 5% to 15% in 2020). Set `changeFrequency: "yearly"`
> but follow the maintenance plan in Section 14 to catch rate changes.

---

## 11. SEO Strategy — VAT Calculator

### Why This Page Wins on Search

"VAT calculator" is a high-volume, year-round query dominated by slow,
ad-heavy tools. It has strong commercial intent — the main audience is
small business owners, freelancers, and accountants who use it daily.

A fast, clean, SSR-rendered tool on your existing domain will outperform
most ranking pages on page speed and UX alone.

### Your UAE Advantage

You are based in Dubai. UAE VAT (5%) was introduced in 2018 and many
businesses and consumers still search for UAE VAT calculators regularly.
Your site has geographic relevance — lean into this by making UAE the
visible default for UAE visitors, or by adding a dedicated section
explaining UAE VAT rules clearly.

### Topical Authority Chain

```
/free-tools                         ← Hub
    ├── /salary-calculator          ← Links income tax → VAT (both are tax tools)
    ├── /discount-calculator        ← Cross-links naturally (pricing tools)
    └── /vat-calculator             ← NEW: strong organic search demand
```

### Content That Beats Competitors

```
✅ The "common mistake" section (removing VAT incorrectly) — very searchable
✅ VAT rates table covering 16+ countries — targets "[country] VAT rate" queries
✅ UK-specific breakdown (standard / reduced / zero rates) — #1 market
✅ UAE VAT section — your geographic advantage
✅ GST vs VAT explanation — targets Australia, NZ, Singapore, India queries
✅ Inc-VAT vs Ex-VAT explainer — a very common confusion search
```

---

## 12. Regional Keyword Targeting

### United Kingdom (highest priority)
| Primary | Secondary |
|---|---|
| VAT calculator | VAT calculator UK |
| add VAT calculator | remove VAT calculator |
| reverse VAT calculator | VAT inclusive calculator |
| how to calculate VAT | VAT exclusive calculator |
| 20% VAT calculator | how much is VAT on £X |

### UAE / Middle East
| Primary | Secondary |
|---|---|
| VAT calculator UAE | VAT calculator Dubai |
| 5% VAT calculator | UAE VAT calculator AED |
| how to calculate VAT UAE | remove VAT UAE |
| VAT inclusive price UAE | VAT exclusive price UAE |

### Germany
| Primary | Secondary |
|---|---|
| MwSt Rechner | Mehrwertsteuer Rechner |
| Brutto Netto MwSt berechnen | 19% MwSt berechnen |
| MwSt herausrechnen | VAT calculator Germany |

### France
| Primary | Secondary |
|---|---|
| calculateur TVA | calcul TVA |
| TVA à déduire | prix HT TTC calculateur |
| calculateur de taxe France | 20% TVA calculateur |

### Australia / New Zealand
| Primary | Secondary |
|---|---|
| GST calculator Australia | GST calculator NZ |
| add GST calculator | remove GST calculator |
| 10% GST calculator | GST inclusive price calculator |
| how to calculate GST | GST exclusive price |

### India
| Primary | Secondary |
|---|---|
| GST calculator India | GST calculator online |
| 18% GST calculator | GST inclusive price calculator |
| remove GST from price | GST on invoice calculator |

### Singapore
| Primary | Secondary |
|---|---|
| GST calculator Singapore | 9% GST calculator |
| Singapore GST inclusive | GST exclusive Singapore |

---

## 13. On-Page SEO Checklist

### Content
- [ ] H1 is "VAT Calculator" (exact match primary keyword)
- [ ] Intro mentions UK, Germany, UAE, Australia, India — top search markets
- [ ] "Add VAT" formula is written out in the content
- [ ] "Remove VAT" (reverse/extract) formula is written out — with the common mistake called out
- [ ] VAT rates country table is present with at least 12 countries
- [ ] UK section: standard 20%, reduced 5%, zero rate explained
- [ ] UAE section: 5% VAT, January 2018 introduction noted
- [ ] GST vs VAT section is present
- [ ] Inc-VAT vs Ex-VAT explanation is present
- [ ] At least 6 FAQ questions with FAQPage schema markup
- [ ] Internal links to discount calculator, salary calculator, and EMI calculator

### Technical
- [ ] `metadata.title` includes "VAT Calculator" + key countries
- [ ] `metadata.description` mentions add/remove VAT and key countries (150–160 chars)
- [ ] `alternates.canonical` points to `/free-tools/vat-calculator`
- [ ] JSON-LD includes WebApplication + BreadcrumbList + FAQPage
- [ ] Breadcrumb in UI matches BreadcrumbList schema
- [ ] Only `<VATCalculator />` uses `"use client"` — page is SSR
- [ ] Entry added to `sitemap.xml`
- [ ] Entry added to tools sidebar in `layout.tsx`
- [ ] Entry added to tools grid on `/free-tools` index page
- [ ] Page loads under 1.5s — verify with Lighthouse

### After Publishing
- [ ] Submit updated sitemap in Google Search Console
- [ ] Request indexing for `/free-tools/vat-calculator`
- [ ] Add link to VAT calculator from discount calculator page
- [ ] Add link to VAT calculator from salary calculator page (both are "tax" tools)
- [ ] Add link from homepage or "Popular Tools" section

---

## 14. VAT Rate Maintenance Plan

Unlike income tax, VAT rates change infrequently — but when they do, it is
newsworthy and search volume for that country's VAT calculator spikes.
Catching rate changes promptly is both a correctness obligation and an SEO
opportunity.

### How VAT Rates Change

VAT rate changes are always announced in advance via a government budget or
legislative process — there are no surprise overnight changes. Typical lead
time is 3–12 months. Subscribe to tax news for your key markets or set a
Google Alert for "VAT rate change [country]".

### Update Checklist (when a rate changes)

1. Update the affected country object in `VAT_COUNTRIES` in `lib/tools/vat.ts`
2. Update the VAT rates table in the page content (`page.tsx`)
3. Update `lastModified` in `sitemap.ts`
4. Update the `metadata.description` if you reference specific rates
5. Add a "Updated for [Year]" note to the page H1 or intro paragraph
6. Submit the updated URL for re-indexing in Google Search Console

### Known Rate Change History (for reference)

| Country | Change | Date |
|---|---|---|
| Saudi Arabia | 5% → 15% | July 2020 |
| Singapore | 7% → 8% | January 2023 |
| Singapore | 8% → 9% | January 2024 |
| Switzerland | 7.7% → 8.1% (standard) | January 2024 |
| UK | Temporary 5% energy rate extended | Multiple extensions |

### Data Sources Per Country

- **UK:** HMRC VAT rates — gov.uk/vat-rates
- **EU countries:** European Commission VAT rates database
- **UAE:** Federal Tax Authority — tax.gov.ae
- **Saudi Arabia:** Zakat, Tax and Customs Authority — zatca.gov.sa
- **Australia:** ATO — ato.gov.au
- **Singapore:** IRAS — iras.gov.sg
- **India:** GST Council — gstcouncil.gov.in
- **Japan:** National Tax Agency — nta.go.jp

---

*Guide version 1.0 — covers Next.js 14+ App Router, TypeScript, 30+ countries, 2026 VAT rates*
*Extends the EMI, Car Loan, Salary, and Discount Calculator guides for the same multi-tool site*