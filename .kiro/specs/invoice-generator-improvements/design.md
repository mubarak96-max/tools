# Design Document: Invoice Generator Improvements

## Overview

This document describes the technical design for upgrading the Invoice Generator from a minimal drafting tool into a professional-grade invoice builder. The changes span three layers:

1. **Calculation library** (`src/lib/tools/invoice.ts`) — extended interfaces and a richer `calculateInvoice` function supporting percentage discounts, shipping, and amount paid.
2. **React component** (`src/app/finance/invoice-generator/components/InvoiceGenerator.tsx`) — refactored into focused sub-components while keeping the single-file entry point.
3. **PDF export** — a new `buildInvoiceHtml` utility that produces a self-contained HTML string, posted to the existing `/api/html-to-pdf` endpoint.

The feature is entirely client-side except for the PDF export API call. No new API routes, database tables, or server actions are required.

---

## Architecture

```mermaid
graph TD
    A[InvoiceGenerator.tsx<br/>root state + layout] --> B[AddressBlock.tsx<br/>sender / recipient fields]
    A --> C[LineItemsTable.tsx<br/>items CRUD]
    A --> D[TotalsForm.tsx<br/>discount, tax, shipping, amount paid]
    A --> E[InvoicePreview.tsx<br/>read-only summary + PDF button]
    A --> F[invoice.ts<br/>calculateInvoice]
    E --> G[buildInvoiceHtml<br/>HTML template]
    G --> H[/api/html-to-pdf<br/>Puppeteer PDF]
```

All state lives in `InvoiceGenerator` and flows down as props. No context or external state library is introduced — the component tree is shallow enough that prop drilling is clean.

---

## Components and Interfaces

### Sub-component breakdown

| File | Responsibility |
|---|---|
| `InvoiceGenerator.tsx` | Root state, `useMemo` for calculation result, layout grid |
| `AddressBlock.tsx` | Renders one address block (sender or recipient) with 6 fields |
| `LineItemsTable.tsx` | Line item rows, add/remove, formatted line totals |
| `TotalsForm.tsx` | Discount mode toggle, discount value, tax %, shipping, amount paid, notes, payment terms |
| `InvoicePreview.tsx` | Read-only summary sidebar, "Download PDF" button, loading/error state |
| `buildInvoiceHtml.ts` | Pure function: `InvoiceState → string` (self-contained HTML) |

All sub-components live in `src/app/finance/invoice-generator/components/`.

### AddressBlock props

```typescript
interface AddressBlockProps {
  label: string;           // "From" | "Bill to"
  value: AddressBlock;
  onChange: (value: AddressBlock) => void;
}
```

### LineItemsTable props

```typescript
interface LineItemsTableProps {
  items: EditableInvoiceItem[];
  resultItems: InvoiceLineItemResult[];
  currency: InvoiceCurrency;
  onUpdate: (id: string, field: keyof InvoiceLineItemInput, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}
```

### TotalsForm props

```typescript
interface TotalsFormProps {
  discountMode: DiscountMode;
  discountValue: number | "";
  taxPercent: number | "";
  shipping: number | "";
  amountPaid: number | "";
  paymentTerms: string;
  notes: string;
  onDiscountModeChange: (mode: DiscountMode) => void;
  onDiscountValueChange: (value: number | "") => void;
  onTaxPercentChange: (value: number | "") => void;
  onShippingChange: (value: number | "") => void;
  onAmountPaidChange: (value: number | "") => void;
  onPaymentTermsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}
```

### InvoicePreview props

```typescript
interface InvoicePreviewProps {
  state: InvoiceState;
  result: InvoiceCalculationResult;
  currency: InvoiceCurrency;
  validationErrors: ValidationErrors;
  onDownloadPdf: () => void;
  pdfLoading: boolean;
  pdfError: string | null;
}
```

---

## Data Models

### `src/lib/tools/invoice.ts` — updated interfaces

```typescript
// Unchanged
export interface InvoiceLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceLineItemResult extends InvoiceLineItemInput {
  lineTotal: number;
}

// New: discount mode
export type DiscountMode = "flat" | "percentage";

// Extended calculation input
export interface InvoiceCalculationInput {
  items: InvoiceLineItemInput[];
  taxPercent: number;
  discountMode: DiscountMode;
  discountValue: number;   // flat amount OR percentage (0–100)
  shipping: number;        // non-negative, added after discount before tax
  amountPaid: number;      // non-negative, subtracted from total for balance due
}

// Extended calculation result
export interface InvoiceCalculationResult {
  items: InvoiceLineItemResult[];
  subtotal: number;
  discountAmount: number;  // always the resolved currency amount
  taxableBase: number;     // subtotal - discountAmount + shipping
  taxAmount: number;
  total: number;           // taxableBase + taxAmount
  balanceDue: number;      // total - amountPaid
}
```

### Address block

```typescript
// src/lib/tools/invoice.ts (or co-located types file)
export interface AddressBlock {
  name: string;
  company: string;
  address: string;       // street address
  cityStateZip: string;
  email: string;
  phone: string;
}
```

### Currency config

A new `INVOICE_CURRENCIES` constant is defined in `src/lib/tools/invoice.ts`, separate from `emi.ts`. The EMI currencies carry loan/savings defaults that are irrelevant here, and the invoice tool needs currencies that EMI doesn't (CAD, AUD, JPY, CHF, SGD, MXN).

```typescript
export interface InvoiceCurrency {
  code: string;    // ISO 4217, e.g. "USD"
  label: string;   // e.g. "US Dollar"
  locale: string;  // BCP 47 locale for Intl.NumberFormat, e.g. "en-US"
}

export const INVOICE_CURRENCIES: InvoiceCurrency[] = [
  { code: "USD", label: "US Dollar",        locale: "en-US" },
  { code: "EUR", label: "Euro",             locale: "de-DE" },
  { code: "GBP", label: "British Pound",    locale: "en-GB" },
  { code: "CAD", label: "Canadian Dollar",  locale: "en-CA" },
  { code: "AUD", label: "Australian Dollar",locale: "en-AU" },
  { code: "JPY", label: "Japanese Yen",     locale: "ja-JP" },
  { code: "INR", label: "Indian Rupee",     locale: "en-IN" },
  { code: "CHF", label: "Swiss Franc",      locale: "de-CH" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG" },
  { code: "MXN", label: "Mexican Peso",     locale: "es-MX" },
];
```

`InvoiceGenerator.tsx` imports `INVOICE_CURRENCIES` from `invoice.ts` and removes its existing import of `CURRENCIES` from `emi.ts`.

### Full invoice state (component-level)

```typescript
// Lives in InvoiceGenerator.tsx — not exported from invoice.ts
interface InvoiceState {
  invoiceNumber: string;
  issueDate: string;       // ISO date string "YYYY-MM-DD"
  dueDate: string;         // ISO date string, may be ""
  currencyCode: string;    // matches InvoiceCurrency.code
  sender: AddressBlock;
  recipient: AddressBlock;
  items: EditableInvoiceItem[];
  discountMode: DiscountMode;
  discountValue: number | "";
  taxPercent: number | "";
  shipping: number | "";
  amountPaid: number | "";
  paymentTerms: string;
  notes: string;
}

type EditableInvoiceItem = InvoiceLineItemInput & { id: string };
```

### Validation errors

```typescript
interface ValidationErrors {
  dueDate?: string;        // "Due date must be on or after the issue date"
  amountPaid?: string;     // "Amount paid cannot exceed the invoice total"
}
```

Validation runs inside a `useMemo` in `InvoiceGenerator` whenever `issueDate`, `dueDate`, `amountPaid`, or `result.total` change. It does not block calculation — it only surfaces messages in the UI.

### Updated `calculateInvoice` logic

```
lineTotal(item)   = round2(item.quantity × item.unitPrice)
subtotal          = Σ lineTotal(item)
discountAmount    = discountMode === "flat"
                      ? clamp(discountValue, 0, subtotal)
                      : subtotal × clamp(discountValue, 0, 100) / 100
taxableBase       = subtotal − discountAmount + shipping
taxAmount         = taxableBase × (taxPercent / 100)
total             = taxableBase + taxAmount
balanceDue        = total − amountPaid
```

`round2(x)` = `Math.round(x * 100) / 100`

Note: shipping is added to the taxable base (before tax), matching the requirement in 8.2. This means tax applies to shipping, which is the most common invoice convention. If a future requirement needs tax-exempt shipping, the interface can be extended.

---

## PDF HTML Template

### Approach

`buildInvoiceHtml` is a pure function in `src/app/finance/invoice-generator/components/buildInvoiceHtml.ts`:

```typescript
export function buildInvoiceHtml(state: InvoiceState, result: InvoiceCalculationResult, currency: InvoiceCurrency): string
```

It returns a complete `<html>` document with all styles inlined (no external CSS, no Tailwind classes — Puppeteer renders the raw HTML without the app's stylesheet). The template uses a two-column header (sender left, invoice meta right), a line items table, a totals block, and optional sections for notes and payment terms.

### Why inline styles

The `/api/html-to-pdf` route calls `page.setContent(html)` directly — there is no Next.js rendering pipeline, so Tailwind utility classes produce no output. All visual styling must be embedded in `<style>` tags or `style=""` attributes within the returned HTML string.

### Template structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    /* reset + print-ready base styles */
    /* table, address block, totals layout */
  </style>
</head>
<body>
  <header>
    <div class="sender">   <!-- name, company, address, email, phone -->
    <div class="meta">     <!-- invoice number, issue date, due date -->
  </header>
  <div class="bill-to">   <!-- recipient address block -->
  <table class="items">   <!-- description, qty, unit price, line total -->
  <div class="totals">    <!-- subtotal, discount, tax, shipping, total, amount paid, balance due -->
  <footer>                <!-- payment terms, notes -->
</body>
</html>
```

Empty address fields are omitted from the template (same rule as the preview). Conditional sections (due date, discount, shipping, amount paid/balance due, payment terms, notes) are only rendered when their values are non-empty/non-zero.

### Filename

The download filename is `invoice-${invoiceNumber.replace(/[^\w-]+/g, "-").toLowerCase()}.pdf`, constructed in the click handler before the API call.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The calculation logic in `calculateInvoice` is a pure function with clear numeric inputs and outputs, making it well-suited for property-based testing. The address rendering helper and HTML template builder are also pure functions amenable to property tests. UI interaction tests use example-based tests instead.

### Property 1: Line total precision

*For any* non-negative quantity and unit price, the computed line total must equal `Math.round(quantity × unitPrice × 100) / 100` — i.e., rounded to exactly 2 decimal places.

**Validates: Requirements 10.1**

### Property 2: Subtotal is sum of line totals

*For any* list of line items, the subtotal returned by `calculateInvoice` must equal the sum of the individual `lineTotal` values in the result.

**Validates: Requirements 10.2**

### Property 3: Flat discount clamping invariant

*For any* subtotal and flat discount value, the taxable base must satisfy `taxableBase = max(0, subtotal − discountAmount)`, and `discountAmount` must never exceed `subtotal`.

**Validates: Requirements 4.2, 4.4, 10.3**

### Property 4: Percentage discount correctness

*For any* subtotal and discount percentage in [0, 100], the taxable base must equal `subtotal × (1 − percentage / 100)`, and the discount amount must equal `subtotal × (percentage / 100)`.

**Validates: Requirements 4.3, 10.4**

### Property 5: Percentage discount clamping

*For any* discount percentage outside [0, 100], the calculation must behave as if the percentage were clamped to the nearest boundary (0 or 100). No negative taxable base or discount exceeding subtotal should result.

**Validates: Requirements 4.5**

### Property 6: Total invariant

*For any* valid combination of line items, discount mode, discount value, tax percent, and shipping, the total must equal `taxableBase + taxAmount`, where `taxableBase = subtotal − discountAmount + shipping` and `taxAmount = taxableBase × (taxPercent / 100)`.

**Validates: Requirements 10.5, 10.6, 10.8**

### Property 7: Balance due correctness

*For any* total and amount paid in [0, total], the balance due must equal `total − amountPaid`.

**Validates: Requirements 9.2, 10.7**

### Property 8: Address rendering omits empty fields

*For any* `AddressBlock` where one or more fields are empty strings, the rendered HTML/text output for that block must not contain blank lines or empty `<p>` elements for those fields.

**Validates: Requirements 1.3**

### Property 9: Invoice HTML completeness

*For any* invoice state where a field is non-empty/non-zero, the HTML string produced by `buildInvoiceHtml` must contain that field's value as a substring.

**Validates: Requirements 7.2, 7.6**

### Property 10: Due date validation

*For any* (issueDate, dueDate) pair where both are valid ISO date strings and `dueDate < issueDate`, the validation function must return an error. For any pair where `dueDate >= issueDate` or `dueDate` is empty, no error must be returned.

**Validates: Requirements 2.4**

---

## Error Handling

| Scenario | Handling |
|---|---|
| Due date before issue date | Inline validation message below due date field; does not block calculation or PDF export |
| Amount paid exceeds total | Inline validation message below amount paid field; does not block PDF export |
| PDF API returns 4xx/5xx | Catch in click handler; set `pdfError` state; display "PDF generation failed. Please try again." below button |
| PDF API network failure | Same as above — `fetch` rejection caught in the same try/catch |
| Notes exceeds 1000 chars | `maxLength={1000}` on textarea + character counter; browser prevents further input |
| Negative numeric inputs | `normalize()` helper clamps to 0; no error shown (silent floor) |
| Non-finite numeric inputs (NaN, Infinity) | `normalize()` returns 0 |

Validation errors are display-only — they do not disable the PDF export button or prevent the invoice from being calculated. This matches the behaviour of tools like invoice-generator.com where the user can still export even with warnings.

---

## Testing Strategy

### Unit tests (example-based)

Located in `src/lib/tools/__tests__/invoice.test.ts` and `src/app/finance/invoice-generator/components/__tests__/`.

Focus areas:
- `calculateInvoice` with concrete inputs covering each branch (flat vs percentage discount, zero shipping, zero amount paid)
- `buildInvoiceHtml` with a fully-populated state and a minimal state (all optional fields empty)
- Validation function with specific date pairs and amount pairs
- Address rendering with all fields populated vs. some fields empty

### Property-based tests

Located in `src/lib/tools/__tests__/invoice.property.test.ts`.

Library: **fast-check** (already a common choice in TypeScript/Jest ecosystems; install with `npm install --save-dev fast-check`).

Each property test runs a minimum of **100 iterations**. Tests are tagged with a comment referencing the design property:

```typescript
// Feature: invoice-generator-improvements, Property 1: Line total precision
it("line total is rounded to 2 decimal places", () => {
  fc.assert(
    fc.property(
      fc.float({ min: 0, max: 1000, noNaN: true }),
      fc.float({ min: 0, max: 1000, noNaN: true }),
      (quantity, unitPrice) => {
        const result = calculateInvoice({ items: [{ description: "x", quantity, unitPrice }], ... });
        const expected = Math.round(quantity * unitPrice * 100) / 100;
        return Math.abs(result.items[0].lineTotal - expected) < Number.EPSILON;
      }
    ),
    { numRuns: 100 }
  );
});
```

One property-based test per correctness property (Properties 1–10 above).

### Integration / smoke tests

- Manual visual review of the PDF output for print-readiness (Requirement 7.7)
- Manual check that the currency selector renders all 10 required options (Requirement 3.1)

### What is NOT property-tested

- UI rendering (Tailwind layout, focus states, loading spinner) — these are example-based or visual tests
- PDF API integration — tested with a single example-based test mocking `fetch`
- Currency formatting display — tested with example-based tests for each currency code
