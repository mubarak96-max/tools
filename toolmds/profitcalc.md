# Profit Margin Calculator — Next.js Implementation Guide
### For a Multi-Tool Site at `/free-tools/profit-margin-calculator`

> **Prerequisites:** You have already built the EMI Calculator, Car Loan Calculator,
> Salary Calculator, Discount Calculator, and VAT Calculator. This guide follows
> the same SSR + client component architecture.
> The profit margin calculator supports three modes: (1) calculate margin from
> cost and revenue, (2) calculate selling price from cost and target margin,
> and (3) calculate markup percentage.

---

## Table of Contents

1. [Tool Overview & Differentiators](#1-tool-overview--differentiators)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Step 1 — Calculation Logic](#3-step-1--calculation-logic)
4. [Step 2 — Types](#4-step-2--types)
5. [Step 3 — Client Component (ProfitMarginCalculator.tsx)](#5-step-3--client-component-profitmargincalculatortsx)
6. [Step 4 — Page (SSR + SEO)](#6-step-4--page-ssr--seo)
7. [Step 5 — Update Shared Layout & Index](#7-step-5--update-shared-layout--index)
8. [Step 6 — Update Sitemap](#8-step-6--update-sitemap)
9. [SEO Strategy — Profit Margin Calculator](#9-seo-strategy--profit-margin-calculator)
10. [Regional Keyword Targeting](#10-regional-keyword-targeting)
11. [On-Page SEO Checklist](#11-on-page-seo-checklist)
12. [Post-Launch Checklist](#12-post-launch-checklist)

---

## 1. Tool Overview & Differentiators

### What This Tool Does

Three calculation modes in one tool:

**Mode A — "What is my margin?" (Cost + Revenue → Margin)**
- Input: Cost price + selling price (or revenue)
- Output: Gross profit, profit margin %, markup %
- Use case: Retailers, freelancers, and business owners checking profitability

**Mode B — "What should I charge?" (Cost + Target Margin → Price)**
- Input: Cost price + desired profit margin %
- Output: Required selling price, profit amount, markup %
- Use case: Pricing a product or service from scratch

**Mode C — "What is my markup?" (Cost + Markup % → Price)**
- Input: Cost price + markup percentage
- Output: Selling price, profit amount, margin %
- Use case: Wholesale and manufacturing where markup % is the standard input

### The Margin vs Markup Distinction (Critical)

This is the single most common point of confusion in this category — and the
reason most competitors' tools are misleading:

- **Margin** = Profit ÷ Selling Price × 100
- **Markup** = Profit ÷ Cost Price × 100

A 50% markup does **not** equal a 50% margin. If cost is $100 and you mark up
50%, the selling price is $150 and the margin is 33.3%. Your tool must show
both figures simultaneously and explain the difference clearly in the page
content — this is what will differentiate it from every generic calculator.

### What Makes This Better Than Competitors

| Feature | Most Competitors | **Your Tool** |
|---|---|---|
| Three modes in one page | Separate calculators | ✅ Tab-based, single URL |
| Shows margin AND markup simultaneously | One or the other | ✅ Always both |
| Gross profit displayed in currency | Rare | ✅ Yes |
| Margin health indicator | No | ✅ Yes (by industry benchmark) |
| Markup ↔ Margin conversion | Separate tool | ✅ Inline |
| Real-time calculation | Rare | ✅ Yes |
| JSON-LD structured data | No | ✅ Yes |
| SSR for SEO | No | ✅ Yes |

---

## 2. File & Folder Structure

Add only the files marked `← NEW`.

```
your-nextjs-project/
├── app/
│   └── free-tools/
│       ├── layout.tsx                                    ← UPDATE
│       ├── page.tsx                                      ← UPDATE
│       └── profit-margin-calculator/
│           ├── page.tsx                                  ← NEW: SSR page + SEO
│           └── components/
│               └── ProfitMarginCalculator.tsx            ← NEW: client component
│
└── lib/
    └── tools/
        ├── emi.ts                                        ← existing
        ├── car-loan.ts                                   ← existing
        ├── discount.ts                                   ← existing
        ├── vat.ts                                        ← existing
        ├── salary/                                       ← existing
        └── profit-margin.ts                              ← NEW: calculation logic
```

---

## 3. Step 1 — Calculation Logic

**File:** `lib/tools/profit-margin.ts`

```ts
/**
 * Mode A: Calculate margin and markup from cost and selling price.
 *
 * @param costPrice    - Total cost to produce/acquire the product
 * @param sellingPrice - Price charged to the customer
 */
export function calcMarginFromPrices(
  costPrice: number,
  sellingPrice: number
): MarginFromPricesResult {
  if (costPrice < 0 || sellingPrice <= 0) {
    return {
      grossProfit: 0,
      marginPercent: 0,
      markupPercent: 0,
      costPrice,
      sellingPrice,
    };
  }

  const grossProfit = sellingPrice - costPrice;
  // Margin is always relative to selling price
  const marginPercent = (grossProfit / sellingPrice) * 100;
  // Markup is always relative to cost price
  const markupPercent = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  return {
    grossProfit,
    marginPercent,
    markupPercent,
    costPrice,
    sellingPrice,
  };
}

/**
 * Mode B: Calculate required selling price from cost and target margin.
 *
 * Formula: Selling Price = Cost ÷ (1 − Margin%)
 *
 * @param costPrice      - Total cost to produce/acquire the product
 * @param targetMargin   - Desired profit margin as a percentage (e.g. 30 for 30%)
 */
export function calcPriceFromMargin(
  costPrice: number,
  targetMargin: number
): PriceFromMarginResult {
  // Margin of 100% or more is mathematically undefined (infinite price)
  if (costPrice < 0 || targetMargin < 0 || targetMargin >= 100) {
    return {
      sellingPrice: 0,
      grossProfit: 0,
      markupPercent: 0,
      costPrice,
      targetMargin,
    };
  }

  const sellingPrice = costPrice / (1 - targetMargin / 100);
  const grossProfit = sellingPrice - costPrice;
  const markupPercent = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  return {
    sellingPrice,
    grossProfit,
    markupPercent,
    costPrice,
    targetMargin,
  };
}

/**
 * Mode C: Calculate selling price and margin from cost and markup %.
 *
 * Formula: Selling Price = Cost × (1 + Markup%)
 *
 * @param costPrice    - Total cost to produce/acquire the product
 * @param markupPercent - Markup as a percentage of cost (e.g. 50 for 50%)
 */
export function calcPriceFromMarkup(
  costPrice: number,
  markupPercent: number
): PriceFromMarkupResult {
  if (costPrice < 0 || markupPercent < 0) {
    return {
      sellingPrice: 0,
      grossProfit: 0,
      marginPercent: 0,
      costPrice,
      markupPercent,
    };
  }

  const sellingPrice = costPrice * (1 + markupPercent / 100);
  const grossProfit = sellingPrice - costPrice;
  // Derive the equivalent margin % for display
  const marginPercent = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

  return {
    sellingPrice,
    grossProfit,
    marginPercent,
    costPrice,
    markupPercent,
  };
}

/**
 * Returns a qualitative health label for a given margin %, based on
 * broad cross-industry benchmarks. Used for the margin health indicator.
 */
export function getMarginHealth(marginPercent: number): MarginHealth {
  if (marginPercent < 0)  return { label: "Loss",      color: "red",    description: "Selling below cost" };
  if (marginPercent < 5)  return { label: "Very thin",  color: "red",    description: "High risk — vulnerable to cost increases" };
  if (marginPercent < 15) return { label: "Thin",       color: "amber",  description: "Below average for most industries" };
  if (marginPercent < 30) return { label: "Healthy",    color: "green",  description: "Average for retail and services" };
  if (marginPercent < 50) return { label: "Strong",     color: "green",  description: "Above average — typical for SaaS and software" };
  return                         { label: "Excellent",  color: "green",  description: "High-margin business (luxury, IP, software)" };
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface MarginFromPricesResult {
  grossProfit: number;
  marginPercent: number;
  markupPercent: number;
  costPrice: number;
  sellingPrice: number;
}

export interface PriceFromMarginResult {
  sellingPrice: number;
  grossProfit: number;
  markupPercent: number;
  costPrice: number;
  targetMargin: number;
}

export interface PriceFromMarkupResult {
  sellingPrice: number;
  grossProfit: number;
  marginPercent: number;
  costPrice: number;
  markupPercent: number;
}

export interface MarginHealth {
  label: string;
  color: "green" | "amber" | "red";
  description: string;
}

export type MarginMode = "margin-from-prices" | "price-from-margin" | "price-from-markup";
```

---

## 4. Step 2 — Types

**File:** `types/tools.ts` — add to your existing types file.

```ts
export interface MarginFromPricesResult {
  grossProfit: number;
  marginPercent: number;
  markupPercent: number;
  costPrice: number;
  sellingPrice: number;
}

export interface PriceFromMarginResult {
  sellingPrice: number;
  grossProfit: number;
  markupPercent: number;
  costPrice: number;
  targetMargin: number;
}

export interface PriceFromMarkupResult {
  sellingPrice: number;
  grossProfit: number;
  marginPercent: number;
  costPrice: number;
  markupPercent: number;
}

export type MarginMode = "margin-from-prices" | "price-from-margin" | "price-from-markup";
```

---

## 5. Step 3 — Client Component (ProfitMarginCalculator.tsx)

**File:** `app/free-tools/profit-margin-calculator/components/ProfitMarginCalculator.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import {
  calcMarginFromPrices,
  calcPriceFromMargin,
  calcPriceFromMarkup,
  getMarginHealth,
  type MarginMode,
} from "@/lib/tools/profit-margin";

export default function ProfitMarginCalculator() {
  // ── Mode ────────────────────────────────────────────────────
  const [mode, setMode] = useState<MarginMode>("margin-from-prices");

  // ── Currency symbol ─────────────────────────────────────────
  const [currencySymbol, setCurrencySymbol] = useState("$");

  // ── Mode A state ────────────────────────────────────────────
  const [costA, setCostA] = useState(50);
  const [revenueA, setRevenueA] = useState(100);

  // ── Mode B state ────────────────────────────────────────────
  const [costB, setCostB] = useState(50);
  const [targetMargin, setTargetMargin] = useState(30);

  // ── Mode C state ────────────────────────────────────────────
  const [costC, setCostC] = useState(50);
  const [markupPct, setMarkupPct] = useState(50);

  // ── Calculations ────────────────────────────────────────────
  const resultA = useMemo(
    () => calcMarginFromPrices(costA, revenueA),
    [costA, revenueA]
  );

  const resultB = useMemo(
    () => calcPriceFromMargin(costB, targetMargin),
    [costB, targetMargin]
  );

  const resultC = useMemo(
    () => calcPriceFromMarkup(costC, markupPct),
    [costC, markupPct]
  );

  // Margin health is derived from whichever mode is active
  const activeMarginPct =
    mode === "margin-from-prices"  ? resultA.marginPercent  :
    mode === "price-from-margin"   ? resultB.targetMargin   :
    resultC.marginPercent;

  const health = useMemo(
    () => getMarginHealth(activeMarginPct),
    [activeMarginPct]
  );

  // ── Helpers ─────────────────────────────────────────────────
  const fmt = (n: number) =>
    `${currencySymbol}${Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const fmtPct = (n: number) =>
    `${n.toFixed(2).replace(/\.00$/, "")}%`;

  const handleNum = (
    val: string,
    setter: (n: number) => void,
    max?: number
  ) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed) || parsed < 0) return;
    setter(max !== undefined ? Math.min(parsed, max) : parsed);
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="profit-margin-calculator">

      {/* Mode tabs */}
      <div role="tablist" aria-label="Calculation mode" className="mode-tabs">
        <button
          role="tab"
          aria-selected={mode === "margin-from-prices"}
          onClick={() => setMode("margin-from-prices")}
        >
          Find Margin
        </button>
        <button
          role="tab"
          aria-selected={mode === "price-from-margin"}
          onClick={() => setMode("price-from-margin")}
        >
          Find Price
        </button>
        <button
          role="tab"
          aria-selected={mode === "price-from-markup"}
          onClick={() => setMode("price-from-markup")}
        >
          Markup → Price
        </button>
      </div>

      {/* Currency symbol */}
      <div className="currency-row">
        <label htmlFor="currency-symbol">Currency symbol</label>
        <input
          id="currency-symbol"
          type="text"
          maxLength={3}
          value={currencySymbol}
          onChange={(e) => setCurrencySymbol(e.target.value)}
          aria-label="Currency symbol"
        />
      </div>

      {/* ── Mode A ─────────────────────────────────────────────── */}
      {mode === "margin-from-prices" && (
        <div role="tabpanel" aria-label="Find margin">
          <div className="input-group">
            <label htmlFor="cost-a">Cost price</label>
            <div className="input-with-prefix">
              <span aria-hidden="true">{currencySymbol}</span>
              <input
                id="cost-a"
                type="number"
                min={0}
                step={1}
                value={costA}
                onChange={(e) => handleNum(e.target.value, setCostA)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="revenue-a">Selling price</label>
            <div className="input-with-prefix">
              <span aria-hidden="true">{currencySymbol}</span>
              <input
                id="revenue-a"
                type="number"
                min={0}
                step={1}
                value={revenueA}
                onChange={(e) => handleNum(e.target.value, setRevenueA)}
              />
            </div>
          </div>

          <div className="results-card" aria-live="polite" aria-atomic="true">
            <div className="result-row result-primary">
              <span>Profit margin</span>
              <strong>{fmtPct(resultA.marginPercent)}</strong>
            </div>
            <div className="result-row">
              <span>Gross profit</span>
              <span className={resultA.grossProfit >= 0 ? "profit" : "loss"}>
                {resultA.grossProfit < 0 ? "−" : ""}{fmt(resultA.grossProfit)}
              </span>
            </div>
            <div className="result-row">
              <span>Markup</span>
              <span>{fmtPct(resultA.markupPercent)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Mode B ─────────────────────────────────────────────── */}
      {mode === "price-from-margin" && (
        <div role="tabpanel" aria-label="Find selling price from margin">
          <div className="input-group">
            <label htmlFor="cost-b">Cost price</label>
            <div className="input-with-prefix">
              <span aria-hidden="true">{currencySymbol}</span>
              <input
                id="cost-b"
                type="number"
                min={0}
                step={1}
                value={costB}
                onChange={(e) => handleNum(e.target.value, setCostB)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="target-margin">Target profit margin</label>
            <div className="input-with-suffix">
              <input
                id="target-margin"
                type="number"
                min={0}
                max={99.99}
                step={0.5}
                value={targetMargin}
                onChange={(e) => handleNum(e.target.value, setTargetMargin, 99.99)}
              />
              <span aria-hidden="true">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={99}
              step={1}
              value={targetMargin}
              onChange={(e) => setTargetMargin(Number(e.target.value))}
              aria-label="Target margin slider"
              className="margin-slider"
            />
          </div>

          <div className="results-card" aria-live="polite" aria-atomic="true">
            <div className="result-row result-primary">
              <span>Selling price</span>
              <strong>{fmt(resultB.sellingPrice)}</strong>
            </div>
            <div className="result-row">
              <span>Gross profit</span>
              <span className="profit">{fmt(resultB.grossProfit)}</span>
            </div>
            <div className="result-row">
              <span>Equivalent markup</span>
              <span>{fmtPct(resultB.markupPercent)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Mode C ─────────────────────────────────────────────── */}
      {mode === "price-from-markup" && (
        <div role="tabpanel" aria-label="Find price from markup">
          <div className="input-group">
            <label htmlFor="cost-c">Cost price</label>
            <div className="input-with-prefix">
              <span aria-hidden="true">{currencySymbol}</span>
              <input
                id="cost-c"
                type="number"
                min={0}
                step={1}
                value={costC}
                onChange={(e) => handleNum(e.target.value, setCostC)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="markup-pct">Markup percentage</label>
            <div className="input-with-suffix">
              <input
                id="markup-pct"
                type="number"
                min={0}
                step={0.5}
                value={markupPct}
                onChange={(e) => handleNum(e.target.value, setMarkupPct)}
              />
              <span aria-hidden="true">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={5}
              value={markupPct}
              onChange={(e) => setMarkupPct(Number(e.target.value))}
              aria-label="Markup slider"
              className="markup-slider"
            />
          </div>

          <div className="results-card" aria-live="polite" aria-atomic="true">
            <div className="result-row result-primary">
              <span>Selling price</span>
              <strong>{fmt(resultC.sellingPrice)}</strong>
            </div>
            <div className="result-row">
              <span>Gross profit</span>
              <span className="profit">{fmt(resultC.grossProfit)}</span>
            </div>
            <div className="result-row">
              <span>Equivalent margin</span>
              <span>{fmtPct(resultC.marginPercent)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Margin health indicator — shown in all modes */}
      <div
        className={`margin-health margin-health--${health.color}`}
        aria-label={`Margin health: ${health.label}`}
      >
        <span className="health-label">{health.label}</span>
        <span className="health-description">{health.description}</span>
      </div>

    </div>
  );
}
```

---

## 6. Step 4 — Page (SSR + SEO)

**File:** `app/free-tools/profit-margin-calculator/page.tsx`

```tsx
import { Metadata } from "next";
import ProfitMarginCalculator from "./components/ProfitMarginCalculator";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Profit Margin Calculator — Margin, Markup & Selling Price | YourSite",
  description:
    "Free profit margin calculator. Calculate gross profit margin %, find the right selling price from a target margin, or convert markup % to margin. Instant results.",
  keywords: [
    "profit margin calculator",
    "gross profit margin calculator",
    "margin calculator",
    "markup calculator",
    "selling price calculator",
    "profit calculator",
    "margin vs markup",
    "gross margin formula",
    "how to calculate profit margin",
  ],
  alternates: {
    canonical: "https://yoursite.com/free-tools/profit-margin-calculator",
  },
  openGraph: {
    title: "Profit Margin Calculator — Margin, Markup & Selling Price",
    description:
      "Calculate profit margin %, find the right selling price, or convert between markup and margin. Free, instant, no sign-up.",
    url: "https://yoursite.com/free-tools/profit-margin-calculator",
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
      name: "Profit Margin Calculator",
      url: "https://yoursite.com/free-tools/profit-margin-calculator",
      description:
        "Calculate gross profit margin, find selling price from a target margin, or convert markup % to margin %.",
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://yoursite.com" },
        { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://yoursite.com/free-tools" },
        { "@type": "ListItem", position: 3, name: "Profit Margin Calculator", item: "https://yoursite.com/free-tools/profit-margin-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do you calculate profit margin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Profit margin = (Selling Price − Cost Price) ÷ Selling Price × 100. For example: cost $60, selling price $100 → profit $40 → margin = $40 ÷ $100 × 100 = 40%.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between margin and markup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Margin is profit as a percentage of the selling price. Markup is profit as a percentage of the cost price. They use different denominators, so the same profit produces different percentages. A 50% markup on a $100 cost gives a $150 selling price and a 33.3% margin — not 50%.",
          },
        },
        {
          "@type": "Question",
          name: "How do I calculate selling price from a target margin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the formula: Selling Price = Cost ÷ (1 − Margin%). For a 30% target margin on a $70 cost: Selling Price = $70 ÷ (1 − 0.30) = $70 ÷ 0.70 = $100.",
          },
        },
        {
          "@type": "Question",
          name: "What is a good profit margin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on the industry. Grocery retail operates on 2–5% margins. General retail is typically 10–30%. Services and consulting are often 20–40%. SaaS and software can exceed 60–80%. As a general rule, a gross margin below 10% is considered thin and risky.",
          },
        },
        {
          "@type": "Question",
          name: "How do I convert markup to margin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Margin = Markup ÷ (100 + Markup) × 100. For a 50% markup: Margin = 50 ÷ 150 × 100 = 33.3%.",
          },
        },
        {
          "@type": "Question",
          name: "How do I convert margin to markup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Markup = Margin ÷ (100 − Margin) × 100. For a 33.3% margin: Markup = 33.3 ÷ 66.7 × 100 ≈ 50%.",
          },
        },
      ],
    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfitMarginCalculatorPage() {
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
            <li aria-current="page">Profit Margin Calculator</li>
          </ol>
        </nav>

        <h1>Profit Margin Calculator</h1>
        <p>
          Calculate gross profit margin from cost and selling price, work out the
          right selling price for a target margin, or convert a markup percentage
          to a margin. Free, instant, no sign-up required.
        </p>

        {/* Interactive calculator */}
        <ProfitMarginCalculator />

        {/* SEO content */}
        <section aria-label="Profit margin explained">

          <h2>How to Calculate Profit Margin</h2>
          <p>
            Profit margin expresses profit as a percentage of the <strong>selling price</strong>:
          </p>
          <pre>
            <code>
              Gross Profit  = Selling Price − Cost Price{"\n"}
              Profit Margin = (Gross Profit ÷ Selling Price) × 100
            </code>
          </pre>
          <p>
            <strong>Example:</strong> You buy a product for $60 and sell it for $100.
            Gross profit = $40. Margin = ($40 ÷ $100) × 100 = <strong>40%</strong>.
          </p>

          <h2>Margin vs Markup — The Most Common Confusion</h2>
          <p>
            Margin and markup both measure profitability, but they use different
            denominators. Using them interchangeably is one of the most costly pricing
            mistakes a business can make.
          </p>
          <pre>
            <code>
              Margin  = (Profit ÷ Selling Price) × 100   ← based on revenue{"\n"}
              Markup  = (Profit ÷ Cost Price)    × 100   ← based on cost
            </code>
          </pre>
          <p>
            <strong>Example:</strong> Cost $100, selling price $150, profit $50.
          </p>
          <ul>
            <li>Margin = $50 ÷ $150 × 100 = <strong>33.3%</strong></li>
            <li>Markup = $50 ÷ $100 × 100 = <strong>50%</strong></li>
          </ul>
          <p>
            A 50% markup is <em>not</em> a 50% margin. Quoting a 50% margin when
            you mean a 50% markup means you are underpricing every product.
          </p>

          <h2>How to Find Selling Price from a Target Margin</h2>
          <p>
            If you know your costs and want to hit a specific profit margin, rearrange
            the margin formula:
          </p>
          <pre>
            <code>Selling Price = Cost ÷ (1 − Target Margin%)</code>
          </pre>
          <p>
            <strong>Example:</strong> Cost is $70 and you want a 30% margin.
            Selling price = $70 ÷ (1 − 0.30) = $70 ÷ 0.70 = <strong>$100</strong>.
          </p>

          <h2>How to Convert Markup to Margin (and Back)</h2>
          <pre>
            <code>
              Margin from Markup: Margin = Markup ÷ (100 + Markup) × 100{"\n"}
              Markup from Margin: Markup = Margin ÷ (100 − Margin) × 100
            </code>
          </pre>

          <h2>Margin Quick Reference Table</h2>
          <table>
            <caption>Equivalent markup for common profit margin targets</caption>
            <thead>
              <tr>
                <th>Target Margin</th>
                <th>Required Markup</th>
                <th>Selling Price (on $100 cost)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>10%</td><td>11.1%</td><td>$111.11</td></tr>
              <tr><td>20%</td><td>25.0%</td><td>$125.00</td></tr>
              <tr><td>25%</td><td>33.3%</td><td>$133.33</td></tr>
              <tr><td>30%</td><td>42.9%</td><td>$142.86</td></tr>
              <tr><td>40%</td><td>66.7%</td><td>$166.67</td></tr>
              <tr><td>50%</td><td>100%</td><td>$200.00</td></tr>
              <tr><td>60%</td><td>150%</td><td>$250.00</td></tr>
              <tr><td>75%</td><td>300%</td><td>$400.00</td></tr>
            </tbody>
          </table>

          <h2>What Is a Good Profit Margin?</h2>
          <p>
            There is no universal answer — margins vary dramatically by industry.
            What matters is whether your margin covers your operating costs and
            leaves room for reinvestment and profit.
          </p>
          <table>
            <caption>Typical gross profit margin ranges by industry</caption>
            <thead>
              <tr>
                <th>Industry</th>
                <th>Typical Gross Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Grocery / Supermarket</td><td>2–5%</td></tr>
              <tr><td>General Retail</td><td>10–30%</td></tr>
              <tr><td>E-commerce</td><td>20–40%</td></tr>
              <tr><td>Restaurants</td><td>3–9%</td></tr>
              <tr><td>Manufacturing</td><td>25–35%</td></tr>
              <tr><td>Consulting / Services</td><td>30–60%</td></tr>
              <tr><td>SaaS / Software</td><td>60–80%</td></tr>
              <tr><td>Pharmaceuticals</td><td>60–70%</td></tr>
              <tr><td>Luxury Goods</td><td>50–70%</td></tr>
            </tbody>
          </table>

          <h2>Frequently Asked Questions</h2>

          <h3>How do you calculate profit margin?</h3>
          <p>
            Profit margin = (Selling Price − Cost) ÷ Selling Price × 100.
            Example: cost $60, price $100 → margin = $40 ÷ $100 = 40%.
          </p>

          <h3>What is the difference between margin and markup?</h3>
          <p>
            Margin divides profit by the <em>selling price</em>. Markup divides
            profit by the <em>cost price</em>. A 50% markup on a $100 cost gives
            a $150 price and a 33.3% margin — not 50%.
          </p>

          <h3>How do I find a selling price from a target margin?</h3>
          <p>
            Selling Price = Cost ÷ (1 − Margin%). For a 30% margin on a $70
            cost: $70 ÷ 0.70 = $100.
          </p>

          <h3>How do I convert markup to margin?</h3>
          <p>
            Margin = Markup ÷ (100 + Markup) × 100.
            For a 50% markup: 50 ÷ 150 × 100 = 33.3%.
          </p>

          <h3>How do I convert margin to markup?</h3>
          <p>
            Markup = Margin ÷ (100 − Margin) × 100.
            For a 33.3% margin: 33.3 ÷ 66.7 × 100 ≈ 50%.
          </p>

          <h3>What is a good profit margin?</h3>
          <p>
            It depends on your industry. Grocery retail survives on 2–5%.
            General retail is 10–30%. SaaS and software can reach 60–80%.
            Below 10% is considered thin and risky for most businesses.
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
              <a href="/free-tools/vat-calculator">VAT Calculator</a>
              {" "}— Add or remove VAT from prices for 30+ countries
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

## 7. Step 5 — Update Shared Layout & Index

### Layout sidebar

**File:** `app/free-tools/layout.tsx`

```tsx
<li><a href="/free-tools/profit-margin-calculator">Profit Margin Calculator</a></li>
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
    <li><a href="/free-tools/vat-calculator">VAT Calculator</a></li>
    <li><a href="/free-tools/profit-margin-calculator">Profit Margin Calculator</a></li>  {/* ← NEW */}
  </ul>
</section>
```

### Tools index page

**File:** `app/free-tools/page.tsx`

```ts
{
  name: "Profit Margin Calculator",
  href: "/free-tools/profit-margin-calculator",
  description:
    "Calculate gross profit margin, find the right selling price, or convert markup % to margin %. Essential for pricing any product or service.",
  category: "Finance",
},
```

---

## 8. Step 6 — Update Sitemap

**File:** `app/sitemap.ts`

```ts
{
  url: "https://yoursite.com/free-tools/profit-margin-calculator",
  lastModified: new Date(),
  changeFrequency: "yearly" as const,
  priority: 0.85,
},
```

> **Note:** Like the discount calculator, the underlying formulas never change.
> The only reason to update this page is to add content or new features.
> Set `changeFrequency: "yearly"` — the page is evergreen.

---

## 9. SEO Strategy — Profit Margin Calculator

### Why This Page Wins on Search

"Profit margin calculator" has high search volume with strong commercial
intent — the audience is business owners, e-commerce sellers, and
freelancers actively making pricing decisions. Most ranking pages are generic
and do not explain the margin vs markup distinction, which is your primary
content differentiator.

### The Margin vs Markup Content Angle

The single highest-value SEO content you can add to this page is a clear,
accurate explanation of margin vs markup with examples. Searches like
"margin vs markup", "how to calculate margin from markup", and "markup to
margin formula" drive significant traffic and most results are either
incorrect or confusing. A clean, correct explanation with examples
positions your page as the authoritative answer.

### Topical Authority Chain

```
/free-tools                             ← Hub
    ├── /discount-calculator            ← Natural cross-link (pricing tools)
    ├── /vat-calculator                 ← Natural cross-link (pricing tools)
    └── /profit-margin-calculator       ← NEW: completes the pricing toolkit
```

These three tools — discount, VAT, and profit margin — form a natural
"pricing toolkit" cluster. Link between all three bidirectionally:
a business owner pricing a product needs all three.

### Audience Segments to Target

This tool serves several distinct audiences — write copy that speaks to all of them:

| Audience | Their Question | Mode to Highlight |
|---|---|---|
| E-commerce sellers | "Am I making enough on this product?" | Mode A (find margin) |
| Freelancers / consultants | "What should I charge for this project?" | Mode B (find price) |
| Wholesale buyers / retailers | "What's my margin on a 40% markup?" | Mode C (markup → price) |
| Business owners reviewing P&L | "What do these numbers actually mean?" | All modes + industry benchmarks |

### Content That Beats Competitors

```
✅ Margin vs markup explained with worked examples — almost no competitor does this well
✅ Markup-to-margin quick reference table — highly linkable, bookmarkable
✅ Industry benchmarks table — answers "what is a good margin?" definitively
✅ Margin health indicator in the calculator — no competitor has this
✅ All three formulas written out clearly — targets "how to calculate" searches
✅ Conversion formulas (markup ↔ margin) — captures conversion-specific queries
```

---

## 10. Regional Keyword Targeting

### United States
| Primary | Secondary |
|---|---|
| profit margin calculator | gross profit margin calculator |
| margin calculator | how to calculate profit margin |
| markup calculator | markup vs margin calculator |
| selling price calculator | gross margin formula |

### United Kingdom
| Primary | Secondary |
|---|---|
| profit margin calculator UK | gross margin calculator |
| margin calculator | markup to margin calculator |
| how to calculate margin | profit margin formula UK |
| selling price from margin | what is a good profit margin |

### UAE / Middle East
| Primary | Secondary |
|---|---|
| profit margin calculator UAE | gross margin calculator Dubai |
| margin calculator AED | business profit calculator UAE |
| markup calculator UAE | selling price calculator AED |

### India
| Primary | Secondary |
|---|---|
| profit margin calculator India | gross profit calculator INR |
| margin calculator | markup calculator India |
| profit percentage calculator | selling price calculator India |
| profit margin formula | how to calculate profit margin India |

### Australia
| Primary | Secondary |
|---|---|
| profit margin calculator Australia | gross margin calculator AUD |
| markup calculator Australia | margin vs markup Australia |
| business profit calculator | selling price calculator AUD |

---

## 11. On-Page SEO Checklist

### Content
- [ ] H1 is "Profit Margin Calculator" (exact match primary keyword)
- [ ] Intro mentions margin, markup, and selling price
- [ ] Profit margin formula is written out explicitly
- [ ] Markup formula is written out explicitly
- [ ] Margin vs markup distinction is clearly explained with an example
- [ ] "Find selling price from target margin" formula is present
- [ ] Markup ↔ margin conversion formulas are present
- [ ] Margin quick reference table (margin → markup → price) is present
- [ ] Industry benchmarks table is present
- [ ] "What is a good profit margin?" is answered explicitly
- [ ] At least 6 FAQ questions with FAQPage schema markup
- [ ] Internal links to discount calculator, VAT calculator, salary calculator, and EMI calculator

### Technical
- [ ] `metadata.title` includes "Profit Margin Calculator" and key use cases
- [ ] `metadata.description` is 150–160 characters
- [ ] `alternates.canonical` points to `/free-tools/profit-margin-calculator`
- [ ] JSON-LD includes WebApplication + BreadcrumbList + FAQPage
- [ ] Breadcrumb in UI matches BreadcrumbList schema
- [ ] Only `<ProfitMarginCalculator />` uses `"use client"` — page is SSR
- [ ] Entry added to `sitemap.xml`
- [ ] Entry added to tools sidebar in `layout.tsx`
- [ ] Entry added to tools grid on `/free-tools` index page
- [ ] Page loads under 1.5s — verify with Lighthouse

### After Publishing
- [ ] Submit updated sitemap in Google Search Console
- [ ] Request indexing for `/free-tools/profit-margin-calculator`
- [ ] Add link to profit margin calculator from discount calculator page
- [ ] Add link to profit margin calculator from VAT calculator page
- [ ] Add link from homepage or "Popular Tools" section

---

## 12. Post-Launch Checklist

### Submission
1. **Google Search Console** → request indexing of `/free-tools/profit-margin-calculator`
2. **Bing Webmaster Tools** → submit updated sitemap

### Distribution
| Platform | Action |
|---|---|
| Reddit r/entrepreneur | Post about the margin vs markup confusion — link the tool as the solution |
| Reddit r/smallbusiness | Share the tool for business owners pricing products |
| Reddit r/ecommerce | Share for e-commerce sellers calculating product margins |
| Reddit r/freelance | Frame as "how to price your services correctly" |
| Reddit r/india | Share for Indian business owners (high-volume market) |
| Quora | Answer "how do I calculate profit margin?" and "what is markup vs margin?" — link tool |
| Twitter/X | Thread on the margin vs markup misconception — high engagement topic |
| LinkedIn | Post for business audience — "Are you pricing your products correctly?" |

### Internal Linking (do immediately)
- Add link from discount calculator page to this tool
- Add link from VAT calculator page to this tool
- These three form a natural "pricing toolkit" — every pricing page should link to the others

### Maintenance
This page requires no annual updates — the formulas are mathematical constants.
Monitor Google Search Console for:
- New query variations to add to the FAQ (e.g., "profit margin for Shopify store")
- Industry-specific queries to answer (e.g., "good margin for dropshipping")
  which you can address by expanding the industry benchmarks table

---

*Guide version 1.0 — covers Next.js 14+ App Router, TypeScript, three-mode profit margin calculator*
*Extends the EMI, Car Loan, Salary, Discount, and VAT Calculator guides for the same multi-tool site*