# Discount Calculator — Next.js Implementation Guide
### For a Multi-Tool Site at `/free-tools/discount-calculator`

> **Prerequisites:** You have already built the EMI Calculator and Car Loan Calculator.
> This guide follows the same SSR + client component architecture.
> The discount calculator supports two modes: (1) calculate final price from
> original price + discount %, and (2) calculate what % off from original + sale price.

---

## Table of Contents

1. [Tool Overview & Differentiators](#1-tool-overview--differentiators)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Step 1 — Calculation Logic](#3-step-1--calculation-logic)
4. [Step 2 — Types](#4-step-2--types)
5. [Step 3 — Client Component (DiscountCalculator.tsx)](#5-step-3--client-component-discountcalculatortsx)
6. [Step 4 — Page (SSR + SEO)](#6-step-4--page-ssr--seo)
7. [Step 5 — Update Shared Layout & Index](#7-step-5--update-shared-layout--index)
8. [Step 6 — Update Sitemap](#8-step-6--update-sitemap)
9. [SEO Strategy — Discount Calculator](#9-seo-strategy--discount-calculator)
10. [Regional Keyword Targeting](#10-regional-keyword-targeting)
11. [On-Page SEO Checklist](#11-on-page-seo-checklist)
12. [Post-Launch Checklist](#12-post-launch-checklist)

---

## 1. Tool Overview & Differentiators

### What This Tool Does

Two calculation modes in one tool:

**Mode A — "What's the final price?"**
- Input: Original price + discount percentage
- Output: Discount amount saved, final price, effective saving as a % of original

**Mode B — "What % off is this?"**
- Input: Original price + sale price
- Output: Discount percentage, amount saved, whether it's worth it vs typical discounts

### What Makes This Better Than Competitors

| Feature | Most Competitors | **Your Tool** |
|---|---|---|
| Two modes in one page | Separate pages | ✅ Tab-based, single URL |
| Shows amount saved (not just %) | Sometimes | ✅ Always |
| Reverse calculation (% from prices) | Rare | ✅ Yes |
| Works with any currency symbol | No | ✅ Yes (user types symbol) |
| Real-time calculation (no submit button) | No | ✅ Yes |
| No sign-up required | Yes | ✅ Yes |
| JSON-LD structured data | No | ✅ Yes |
| Fast, SSR page | No | ✅ Yes |

### Why This Page Has SEO Value

"Discount calculator" gets millions of monthly searches globally — most during
retail events (Black Friday, Eid sales, Diwali, Boxing Day). The page has
strong seasonal spikes but solid year-round traffic. It is also a fast-win SEO
page: low implementation complexity, fast load time, and easy to differentiate
with good copy.

---

## 2. File & Folder Structure

Add only the files marked `← NEW`. Everything else already exists.

```
your-nextjs-project/
├── app/
│   └── free-tools/
│       ├── layout.tsx                              ← UPDATE
│       ├── page.tsx                                ← UPDATE
│       └── discount-calculator/
│           ├── page.tsx                            ← NEW: SSR page + SEO
│           └── components/
│               └── DiscountCalculator.tsx          ← NEW: client component
│
└── lib/
    └── tools/
        ├── emi.ts                                  ← existing
        ├── car-loan.ts                             ← existing
        └── discount.ts                             ← NEW: calculation logic
```

> **Rule:** Keep all pure logic in `lib/`. Keep all UI in `app/`. Never mix them.

---

## 3. Step 1 — Calculation Logic

**File:** `lib/tools/discount.ts`

```ts
/**
 * Mode A: Given original price and discount %, calculate final price.
 *
 * @param originalPrice  - Price before discount
 * @param discountPercent - Discount as a percentage (e.g. 20 for 20%)
 */
export function calculateFinalPrice(
  originalPrice: number,
  discountPercent: number
): DiscountFromPercentResult {
  if (originalPrice <= 0) {
    return { discountAmount: 0, finalPrice: 0, savingPercent: 0 };
  }

  const discountPercentClamped = Math.min(Math.max(discountPercent, 0), 100);
  const discountAmount = (originalPrice * discountPercentClamped) / 100;
  const finalPrice = originalPrice - discountAmount;

  return {
    discountAmount,
    finalPrice,
    savingPercent: discountPercentClamped,
  };
}

/**
 * Mode B: Given original price and sale price, calculate the discount %.
 *
 * @param originalPrice - Original (pre-sale) price
 * @param salePrice     - Actual price being charged
 */
export function calculateDiscountPercent(
  originalPrice: number,
  salePrice: number
): DiscountFromPricesResult {
  if (originalPrice <= 0 || salePrice < 0) {
    return { discountPercent: 0, amountSaved: 0, isGoodDeal: false };
  }

  // Sale price cannot exceed original price in this context
  const clampedSalePrice = Math.min(salePrice, originalPrice);
  const amountSaved = originalPrice - clampedSalePrice;
  const discountPercent = (amountSaved / originalPrice) * 100;

  // "Good deal" heuristic: 20%+ off is generally considered meaningful
  const isGoodDeal = discountPercent >= 20;

  return {
    discountPercent,
    amountSaved,
    isGoodDeal,
  };
}

// ── Types (also exported for use in components) ─────────────────────────────

export interface DiscountFromPercentResult {
  discountAmount: number;   // How much money is saved
  finalPrice: number;       // Price after discount
  savingPercent: number;    // Same as input discountPercent (clamped)
}

export interface DiscountFromPricesResult {
  discountPercent: number;  // Calculated % off
  amountSaved: number;      // Original minus sale price
  isGoodDeal: boolean;      // True if discountPercent >= 20%
}

export type CalculatorMode = "percent-to-price" | "price-to-percent";
```

---

## 4. Step 2 — Types

**File:** `types/tools.ts` — add to your existing types file.

```ts
// Add to types/tools.ts:

export interface DiscountFromPercentResult {
  discountAmount: number;
  finalPrice: number;
  savingPercent: number;
}

export interface DiscountFromPricesResult {
  discountPercent: number;
  amountSaved: number;
  isGoodDeal: boolean;
}

export type DiscountMode = "percent-to-price" | "price-to-percent";
```

> **Note:** These types are already exported from `lib/tools/discount.ts` as well.
> Import from whichever location suits your project structure — just be consistent.

---

## 5. Step 3 — Client Component (DiscountCalculator.tsx)

**File:** `app/free-tools/discount-calculator/components/DiscountCalculator.tsx`

This is the **only** `"use client"` file. Everything else is server-rendered.

```tsx
"use client";

import { useState, useMemo } from "react";
import {
  calculateFinalPrice,
  calculateDiscountPercent,
  type CalculatorMode,
} from "@/lib/tools/discount";

export default function DiscountCalculator() {
  // ── Mode ────────────────────────────────────────────────────
  const [mode, setMode] = useState<CalculatorMode>("percent-to-price");

  // ── Mode A state ────────────────────────────────────────────
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(20);

  // ── Mode B state ────────────────────────────────────────────
  const [originalPriceB, setOriginalPriceB] = useState<number>(100);
  const [salePrice, setSalePrice] = useState<number>(75);

  // ── Currency symbol ─────────────────────────────────────────
  // User can type any symbol — keeps the tool currency-agnostic
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  // ── Calculations ────────────────────────────────────────────
  const resultA = useMemo(
    () => calculateFinalPrice(originalPrice, discountPercent),
    [originalPrice, discountPercent]
  );

  const resultB = useMemo(
    () => calculateDiscountPercent(originalPriceB, salePrice),
    [originalPriceB, salePrice]
  );

  // ── Helpers ─────────────────────────────────────────────────
  const fmt = (n: number) =>
    `${currencySymbol}${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const fmtPct = (n: number) =>
    `${n.toFixed(2).replace(/\.00$/, "")}%`;

  const handleNumericInput = (
    value: string,
    setter: (n: number) => void,
    max?: number
  ) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return;
    setter(max !== undefined ? Math.min(parsed, max) : parsed);
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="discount-calculator">

      {/* Mode tabs */}
      <div role="tablist" aria-label="Calculator mode" className="mode-tabs">
        <button
          role="tab"
          aria-selected={mode === "percent-to-price"}
          onClick={() => setMode("percent-to-price")}
        >
          Final Price
        </button>
        <button
          role="tab"
          aria-selected={mode === "price-to-percent"}
          onClick={() => setMode("price-to-percent")}
        >
          % Off
        </button>
      </div>

      {/* Currency symbol selector */}
      <div className="currency-row">
        <label htmlFor="currency-symbol">Currency symbol</label>
        <input
          id="currency-symbol"
          type="text"
          maxLength={3}
          value={currencySymbol}
          onChange={(e) => setCurrencySymbol(e.target.value)}
          className="currency-symbol-input"
          aria-label="Currency symbol"
        />
      </div>

      {/* ── Mode A ─────────────────────────────────────────────── */}
      {mode === "percent-to-price" && (
        <div role="tabpanel" aria-label="Final price calculator">

          <div className="input-group">
            <label htmlFor="original-price-a">Original price</label>
            <div className="input-with-prefix">
              <span aria-hidden="true">{currencySymbol}</span>
              <input
                id="original-price-a"
                type="number"
                min={0}
                step={1}
                value={originalPrice}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setOriginalPrice)
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="discount-pct">Discount</label>
            <div className="input-with-suffix">
              <input
                id="discount-pct"
                type="number"
                min={0}
                max={100}
                step={1}
                value={discountPercent}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setDiscountPercent, 100)
                }
              />
              <span aria-hidden="true">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              aria-label="Discount percent slider"
              className="discount-slider"
            />
          </div>

          {/* Results */}
          <div className="results-card" aria-live="polite" aria-atomic="true">
            <div className="result-row result-primary">
              <span>Final price</span>
              <strong>{fmt(resultA.finalPrice)}</strong>
            </div>
            <div className="result-row">
              <span>You save</span>
              <span className="saving">{fmt(resultA.discountAmount)}</span>
            </div>
            <div className="result-row">
              <span>Discount applied</span>
              <span>{fmtPct(resultA.savingPercent)}</span>
            </div>
          </div>

        </div>
      )}

      {/* ── Mode B ─────────────────────────────────────────────── */}
      {mode === "price-to-percent" && (
        <div role="tabpanel" aria-label="Discount percent calculator">

          <div className="input-group">
            <label htmlFor="original-price-b">Original price</label>
            <div className="input-with-prefix">
              <span aria-hidden="true">{currencySymbol}</span>
              <input
                id="original-price-b"
                type="number"
                min={0}
                step={1}
                value={originalPriceB}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setOriginalPriceB)
                }
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="sale-price">Sale price</label>
            <div className="input-with-prefix">
              <span aria-hidden="true">{currencySymbol}</span>
              <input
                id="sale-price"
                type="number"
                min={0}
                step={1}
                value={salePrice}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setSalePrice)
                }
              />
            </div>
          </div>

          {/* Results */}
          <div className="results-card" aria-live="polite" aria-atomic="true">
            <div className="result-row result-primary">
              <span>Discount</span>
              <strong>{fmtPct(resultB.discountPercent)}</strong>
            </div>
            <div className="result-row">
              <span>You save</span>
              <span className="saving">{fmt(resultB.amountSaved)}</span>
            </div>
            <div className="result-row">
              <span>Deal rating</span>
              <span className={resultB.isGoodDeal ? "good-deal" : "weak-deal"}>
                {resultB.isGoodDeal ? "✓ Good deal (20%+ off)" : "Less than 20% off"}
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
```

> **Styling note:** The class names above (`mode-tabs`, `results-card`, `saving`, etc.)
> are intentionally plain. Apply your site's existing Tailwind classes or CSS
> module styles. The structure and ARIA roles are what matter here.

---

## 6. Step 4 — Page (SSR + SEO)

**File:** `app/free-tools/discount-calculator/page.tsx`

```tsx
import { Metadata } from "next";
import DiscountCalculator from "./components/DiscountCalculator";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Discount Calculator — Calculate Sale Price or % Off | YourSite",
  description:
    "Free discount calculator. Enter original price and discount % to find the final price — or enter original and sale price to find the % off. Instant results, no sign-up.",
  keywords: [
    "discount calculator",
    "sale price calculator",
    "percent off calculator",
    "how much is X% off",
    "calculate discount",
    "percentage discount calculator",
  ],
  alternates: {
    canonical: "https://yoursite.com/free-tools/discount-calculator",
  },
  openGraph: {
    title: "Discount Calculator — Find Sale Price or % Off",
    description:
      "Instantly calculate discounted prices or find what % off a sale is. Free, no sign-up required.",
    url: "https://yoursite.com/free-tools/discount-calculator",
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
      name: "Discount Calculator",
      url: "https://yoursite.com/free-tools/discount-calculator",
      description:
        "Calculate the final price after a discount, or find the percentage off between two prices.",
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
          name: "Discount Calculator",
          item: "https://yoursite.com/free-tools/discount-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I calculate a percentage discount?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Multiply the original price by the discount percentage, then divide by 100. That gives you the amount saved. Subtract it from the original price to get the final price. For example: 20% off $80 = $80 × 0.20 = $16 saved, so the final price is $64.",
          },
        },
        {
          "@type": "Question",
          name: "How do I find the percentage off between two prices?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Subtract the sale price from the original price to get the amount saved. Then divide by the original price and multiply by 100. For example: original $100, sale $75 → ($100 − $75) / $100 × 100 = 25% off.",
          },
        },
        {
          "@type": "Question",
          name: "What is considered a good discount?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Discounts of 20% or more are generally considered meaningful. Retail events like Black Friday typically offer 20–50% off. Discounts under 10% are often psychological pricing rather than genuine savings.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use this calculator for any currency?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The discount calculator works with any currency — just change the currency symbol field to match your local currency (e.g. £, €, ₹, د.إ). The percentage calculations are currency-agnostic.",
          },
        },
        {
          "@type": "Question",
          name: "What's the difference between discount % and markdown %?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Discount % is calculated off the original selling price. Markdown % in retail is sometimes calculated off the cost price. For shoppers, discount % off the listed price is the relevant figure — which is what this calculator uses.",
          },
        },
      ],
    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DiscountCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Breadcrumb — matches BreadcrumbList schema above */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/free-tools">Free Tools</a></li>
            <li aria-current="page">Discount Calculator</li>
          </ol>
        </nav>

        <h1>Discount Calculator</h1>
        <p>
          Calculate the final price after a percentage discount — or work
          backwards to find the percentage off between two prices.
          Free, instant, no sign-up required.
        </p>

        {/* Interactive calculator — only "use client" component on this page */}
        <DiscountCalculator />

        {/* SEO content below the fold */}
        <section aria-label="How to calculate discounts">

          <h2>How to Calculate a Percentage Discount</h2>
          <p>
            To find the final price after a discount, use this formula:
          </p>
          <pre>
            <code>
              Discount Amount = Original Price × (Discount % ÷ 100){"\n"}
              Final Price = Original Price − Discount Amount
            </code>
          </pre>
          <p>
            <strong>Example:</strong> A jacket originally priced at $120 is on
            sale for 25% off. The discount amount is $120 × 0.25 = $30.
            The final price is $120 − $30 = <strong>$90</strong>.
          </p>

          <h2>How to Find the Percentage Off</h2>
          <p>
            If you see an item with an original price and a sale price and want
            to know how good the deal is:
          </p>
          <pre>
            <code>
              Amount Saved = Original Price − Sale Price{"\n"}
              Discount % = (Amount Saved ÷ Original Price) × 100
            </code>
          </pre>
          <p>
            <strong>Example:</strong> A phone was $650 and is now $520.
            Amount saved = $130. Discount % = ($130 ÷ $650) × 100 = <strong>20% off</strong>.
          </p>

          <h2>What Is a Good Discount?</h2>
          <p>
            As a general benchmark: discounts of 10–15% are modest, 20–30% are
            meaningful, and anything above 40% off is unusually deep. During
            major retail events (Black Friday, Cyber Monday, Eid sales, Diwali
            sales, Boxing Day) discounts of 30–60% are common on electronics
            and apparel.
          </p>
          <p>
            Be cautious of inflated "original prices." A product listed at 70%
            off may have had its price artificially raised beforehand. Compare
            the sale price against prices on multiple retailers to verify the
            deal is real.
          </p>

          <h2>Discount Quick Reference Table</h2>
          <table>
            <caption>Final price at common discount percentages for a $100 item</caption>
            <thead>
              <tr>
                <th>Discount</th>
                <th>You Save</th>
                <th>Final Price</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>5% off</td><td>$5.00</td><td>$95.00</td></tr>
              <tr><td>10% off</td><td>$10.00</td><td>$90.00</td></tr>
              <tr><td>15% off</td><td>$15.00</td><td>$85.00</td></tr>
              <tr><td>20% off</td><td>$20.00</td><td>$80.00</td></tr>
              <tr><td>25% off</td><td>$25.00</td><td>$75.00</td></tr>
              <tr><td>30% off</td><td>$30.00</td><td>$70.00</td></tr>
              <tr><td>40% off</td><td>$40.00</td><td>$60.00</td></tr>
              <tr><td>50% off</td><td>$50.00</td><td>$50.00</td></tr>
              <tr><td>75% off</td><td>$75.00</td><td>$25.00</td></tr>
            </tbody>
          </table>

          <h2>Frequently Asked Questions</h2>

          <h3>How do I calculate a percentage discount?</h3>
          <p>
            Multiply the original price by the discount % divided by 100.
            For example, 20% off $80 = $80 × 0.20 = $16 saved → final price $64.
          </p>

          <h3>How do I find the percentage off between two prices?</h3>
          <p>
            Subtract the sale price from the original, divide by the original
            price, and multiply by 100. Example: original $100, sale $75 →
            $25 ÷ $100 × 100 = 25% off.
          </p>

          <h3>What is considered a good discount?</h3>
          <p>
            20% or more is generally considered a meaningful discount.
            Anything under 10% is often psychological pricing rather than a
            real saving.
          </p>

          <h3>Can I use this calculator for any currency?</h3>
          <p>
            Yes — change the currency symbol field to £, €, ₹, د.إ, or any
            other symbol. The percentage calculations are currency-agnostic.
          </p>

          <h3>What is the difference between discount % and markup %?</h3>
          <p>
            Discount % is calculated off the original selling price (what you
            see on the tag). Markup % is a retail term calculated from the cost
            price. For shoppers, discount % is the relevant figure.
          </p>

        </section>

        {/* Internal links */}
        <aside aria-label="Related tools">
          <h2>Related Financial Tools</h2>
          <ul>
            <li>
              <a href="/free-tools/emi-calculator">EMI Calculator</a>
              {" "}— Calculate monthly loan instalments for home, car and personal loans
            </li>
            <li>
              <a href="/free-tools/car-loan-calculator">Car Loan Calculator</a>
              {" "}— Monthly car payments with down payment and trade-in value
            </li>
            <li>
              <a href="/free-tools/salary-calculator">Salary After Tax Calculator</a>
              {" "}— See your take-home pay after tax in 12 countries
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

**File:** `app/free-tools/layout.tsx` — add one line to the Finance Calculators section.

```tsx
<li><a href="/free-tools/discount-calculator">Discount Calculator</a></li>
```

Full updated sidebar section:

```tsx
<section>
  <h3>Finance Calculators</h3>
  <ul>
    <li><a href="/free-tools/emi-calculator">EMI Calculator</a></li>
    <li><a href="/free-tools/car-loan-calculator">Car Loan Calculator</a></li>
    <li><a href="/free-tools/salary-calculator">Salary Calculator</a></li>
    <li><a href="/free-tools/discount-calculator">Discount Calculator</a></li>  {/* ← NEW */}
  </ul>
</section>
```

### Tools index page

**File:** `app/free-tools/page.tsx` — add to the tools array.

```ts
{
  name: "Discount Calculator",
  href: "/free-tools/discount-calculator",
  description:
    "Calculate the final price after a discount, or find the % off between two prices. Instant results.",
  category: "Finance",
},
```

---

## 8. Step 6 — Update Sitemap

**File:** `app/sitemap.ts` — add one entry.

```ts
{
  url: "https://yoursite.com/free-tools/discount-calculator",
  lastModified: new Date(),
  changeFrequency: "yearly" as const,  // Tax rates don't apply — rarely needs updating
  priority: 0.85,
},
```

> **Why `yearly`?** Unlike salary calculators, discount logic never changes.
> The only reason to update this page is to refresh the content or add new features.
> `yearly` signals to crawlers that this is stable content.

---

## 9. SEO Strategy — Discount Calculator

### Why This Page Wins on Search

Discount calculator queries are high-volume and low-competition compared to
loan or salary calculators. Most ranking pages are ad-heavy, slow, or built on
expired domains with outdated designs. A fast, clean, well-structured tool on
your existing domain will rank in this gap.

### Topical Authority Chain

```
/free-tools                         ← Hub
    ├── /salary-calculator          ← Flagship
    ├── /emi-calculator             ← Linked from discount page
    ├── /car-loan-calculator        ← Linked from discount page
    └── /discount-calculator        ← NEW: high-volume, fast win
```

### Seasonal Traffic Opportunity

This page will spike in traffic around:
- **Black Friday / Cyber Monday** (late November)
- **Christmas / Boxing Day** (December–January)
- **Eid al-Fitr / Eid al-Adha** (dates vary — major shopping period in UAE/Middle East)
- **Diwali** (October/November — major shopping period in India)
- **Amazon Prime Day** (July)
- **Back to School** (August)

Consider adding a seasonal note to the page (e.g., "Updated for Black Friday 2026")
in the weeks before each event to capture seasonal search intent.

### Content That Beats Competitors

Most discount calculator pages have a form and nothing else. Add these blocks:

```
✅ The quick reference discount table (already in the page above)
✅ "Is this a good deal?" explainer (already in the copy above)
✅ Seasonal shopping tips section (add before major retail events)
✅ Example calculations that match real searches:
    - "20% off $150" → $120
    - "30% off $200" → $140
    - "What is 15% off $85?" → $72.25
```

---

## 10. Regional Keyword Targeting

Include these keywords naturally in headings, body copy, and FAQ answers.

### United States
| Primary | Secondary |
|---|---|
| discount calculator | percent off calculator |
| sale price calculator | how much is X% off |
| calculate discount | percentage discount calculator |
| what is 20% off | price after discount calculator |

### United Kingdom
| Primary | Secondary |
|---|---|
| discount calculator UK | sale price calculator |
| percent off calculator | how much is X% off GBP |
| percentage discount calculator | Black Friday calculator |
| Boxing Day discount calculator | price reduction calculator |

### UAE / Middle East
| Primary | Secondary |
|---|---|
| discount calculator UAE | sale price calculator Dubai |
| حاسبة الخصم (Arabic: discount calculator) | Eid sale calculator |
| percent off calculator AED | how much is X% off dirhams |

### India
| Primary | Secondary |
|---|---|
| discount calculator India | sale price calculator INR |
| percent off calculator | Diwali discount calculator |
| how much is X% off rupees | price after discount India |

### Germany / Europe
| Primary | Secondary |
|---|---|
| Rabattrechner | Prozent Rabatt berechnen |
| Preisnachlass berechnen | calculateur de remise |
| discount calculator EUR | Black Friday Rabatt berechnen |

---

## 11. On-Page SEO Checklist

### Content
- [ ] H1 is "Discount Calculator" (exact match primary keyword)
- [ ] Intro paragraph includes "percentage discount", "final price", "% off"
- [ ] Both calculation formulas are written out in the content (not just in the calculator)
- [ ] Quick reference discount table is present
- [ ] At least 5 FAQ questions with FAQPage schema markup
- [ ] Seasonal shopping tip or example present
- [ ] Internal links to EMI, car loan, and salary calculator tools

### Technical
- [ ] `metadata.title` includes "Discount Calculator" and key use cases
- [ ] `metadata.description` is 150–160 characters
- [ ] `alternates.canonical` points to `/free-tools/discount-calculator`
- [ ] JSON-LD includes WebApplication + BreadcrumbList + FAQPage
- [ ] Breadcrumb in UI matches BreadcrumbList schema
- [ ] Only `<DiscountCalculator />` uses `"use client"` — page is SSR
- [ ] Entry added to `sitemap.xml`
- [ ] Entry added to tools sidebar in `layout.tsx`
- [ ] Entry added to tools grid on `/free-tools` index page
- [ ] Page loads under 1.5s (this is a simple page — should be fast)

### After Publishing
- [ ] Submit updated sitemap in Google Search Console
- [ ] Request indexing for `/free-tools/discount-calculator`
- [ ] Add link to discount calculator from EMI and car loan pages
- [ ] Add link from homepage or "Popular Tools" section

---

## 12. Post-Launch Checklist

### Submission
1. **Google Search Console** → request indexing of `/free-tools/discount-calculator`
2. **Bing Webmaster Tools** → submit updated sitemap

### Distribution
| Platform | Action |
|---|---|
| Reddit r/deals | Share before Black Friday / Eid / Diwali with a helpful post |
| Reddit r/personalfinance | Post about how to verify if sale discounts are real |
| Reddit r/india | Share for INR audience ahead of Diwali sales |
| Reddit r/dubai | Share for AED audience ahead of Eid sales |
| Quora | Answer "how do I calculate discount percentage?" and link the tool |
| Twitter/X | Tweet a quick tip about spotting fake discounts with your tool linked |

### Maintenance
Unlike salary or tax calculators, this page requires **no annual updates**.
The discount formula never changes. The only maintenance needed is:
- Updating seasonal content before major retail events
- Adding new FAQ questions based on Google Search Console query data
- Cross-linking to any new tools you add to the site

---

*Guide version 1.0 — covers Next.js 14+ App Router, TypeScript, two-mode discount calculator*
*Extends the EMI Calculator, Car Loan Calculator, and Salary Calculator guides for the same multi-tool site*