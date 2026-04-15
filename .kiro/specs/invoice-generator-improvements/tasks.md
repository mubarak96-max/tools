# Implementation Plan: Invoice Generator Improvements

## Overview

Extend the existing invoice generator from a minimal drafting tool into a professional-grade invoice builder. The work proceeds in four incremental stages: (1) extend the calculation library, (2) build the new sub-components, (3) refactor the root component to wire everything together, and (4) add the PDF export capability. Tests are co-located with each stage so regressions are caught early.

## Tasks

- [x] 1. Extend the calculation library (`src/lib/tools/invoice.ts`)
  - Add `DiscountMode` type (`"flat" | "percentage"`)
  - Add `AddressBlock` interface (name, company, address, cityStateZip, email, phone)
  - Add `InvoiceCurrency` interface and `INVOICE_CURRENCIES` constant (USD, EUR, GBP, CAD, AUD, JPY, INR, CHF, SGD, MXN)
  - Replace `InvoiceCalculationInput` with the extended version: `discountMode`, `discountValue`, `shipping`, `amountPaid`
  - Replace `InvoiceCalculationResult` with the extended version: `taxableBase`, `balanceDue`
  - Update `calculateInvoice` to implement the new formula: `lineTotal = round2(qty × price)`, `discountAmount` clamped per mode, `taxableBase = subtotal − discountAmount + shipping`, `total = taxableBase + taxAmount`, `balanceDue = total − amountPaid`
  - Keep `normalize()` helper; add `round2()` helper
  - _Requirements: 3.1, 4.2, 4.3, 4.4, 4.5, 8.2, 9.2, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ]* 1.1 Write property test — line total precision (Property 1)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 1: Line total precision**
    - **Validates: Requirements 10.1**

  - [ ]* 1.2 Write property test — subtotal is sum of line totals (Property 2)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 2: Subtotal is sum of line totals**
    - **Validates: Requirements 10.2**

  - [ ]* 1.3 Write property test — flat discount clamping invariant (Property 3)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 3: Flat discount clamping invariant**
    - **Validates: Requirements 4.2, 4.4, 10.3**

  - [ ]* 1.4 Write property test — percentage discount correctness (Property 4)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 4: Percentage discount correctness**
    - **Validates: Requirements 4.3, 10.4**

  - [ ]* 1.5 Write property test — percentage discount clamping (Property 5)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 5: Percentage discount clamping**
    - **Validates: Requirements 4.5**

  - [ ]* 1.6 Write property test — total invariant (Property 6)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 6: Total invariant**
    - **Validates: Requirements 10.5, 10.6, 10.8**

  - [ ]* 1.7 Write property test — balance due correctness (Property 7)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 7: Balance due correctness**
    - **Validates: Requirements 9.2, 10.7**

  - [ ]* 1.8 Write unit tests for `calculateInvoice`
    - File: `src/lib/tools/__tests__/invoice.test.ts`
    - Cover: flat discount, percentage discount, zero shipping, non-zero shipping, zero amount paid, partial payment, empty items list
    - _Requirements: 4.2, 4.3, 8.2, 9.2, 10.1–10.8_

- [x] 2. Checkpoint — ensure all calculation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Create `AddressBlock.tsx` sub-component
  - File: `src/app/finance/invoice-generator/components/AddressBlock.tsx`
  - Accept `AddressBlockProps`: `label`, `value: AddressBlock`, `onChange`
  - Render six labelled inputs (name, company, address, city/state/zip, email, phone) using the existing `fieldClass` style pattern
  - _Requirements: 1.1, 1.2_

- [x] 4. Create `LineItemsTable.tsx` sub-component
  - File: `src/app/finance/invoice-generator/components/LineItemsTable.tsx`
  - Accept `LineItemsTableProps`: `items`, `resultItems`, `currency`, `onUpdate`, `onAdd`, `onRemove`
  - Render the existing line-item rows grid; format line totals using the selected `InvoiceCurrency` locale
  - Include "Add item" button and per-row "Remove" button (disable remove when only one item remains)
  - _Requirements: 3.2, 10.1_

- [x] 5. Create `TotalsForm.tsx` sub-component
  - File: `src/app/finance/invoice-generator/components/TotalsForm.tsx`
  - Accept `TotalsFormProps` as defined in the design
  - Render: discount mode toggle (Flat / Percentage), discount value input, tax % input, shipping input, amount paid input, payment terms text input, notes textarea
  - Add `maxLength={1000}` and a character counter on the notes textarea
  - Show inline validation messages for `amountPaid` when it exceeds total (passed via props)
  - _Requirements: 4.1, 5.1, 6.1, 6.4, 6.5, 8.1, 9.1, 9.4_

- [x] 6. Create `InvoicePreview.tsx` sub-component
  - File: `src/app/finance/invoice-generator/components/InvoicePreview.tsx`
  - Accept `InvoicePreviewProps`: `state`, `result`, `currency`, `validationErrors`, `onDownloadPdf`, `pdfLoading`, `pdfError`
  - Render read-only summary: invoice number, issue date, due date (omit if empty), sender block, recipient block, totals rows
  - Omit empty address fields (no blank lines)
  - Show discount line only when `discountValue > 0`; show shipping line only when `shipping > 0`; show amount paid / balance due only when `amountPaid > 0`
  - Show payment terms and notes sections only when non-empty
  - Render "Download PDF" button with loading state and disabled state during fetch; show `pdfError` inline below button
  - Display selected currency code alongside total (e.g. "USD")
  - _Requirements: 1.3, 1.4, 2.2, 2.3, 3.2, 3.5, 4.6, 5.2, 5.3, 6.2, 6.3, 7.1, 7.4, 7.5, 8.3, 9.3, 9.5_

- [x] 7. Create `buildInvoiceHtml.ts` pure function
  - File: `src/app/finance/invoice-generator/components/buildInvoiceHtml.ts`
  - Signature: `buildInvoiceHtml(state: InvoiceState, result: InvoiceCalculationResult, currency: InvoiceCurrency): string`
  - Return a complete `<!DOCTYPE html>` document with all styles inlined (no Tailwind, no external CSS)
  - Template structure: two-column header (sender left, invoice meta right), bill-to block, line items `<table>`, totals block, optional footer (payment terms, notes)
  - Omit empty address fields (no blank `<p>` elements)
  - Conditionally render due date, discount, shipping, amount paid / balance due, payment terms, notes only when non-empty/non-zero
  - _Requirements: 7.2, 7.6, 7.7_

  - [ ]* 7.1 Write property test — address rendering omits empty fields (Property 8)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 8: Address rendering omits empty fields**
    - **Validates: Requirements 1.3**

  - [ ]* 7.2 Write property test — invoice HTML completeness (Property 9)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 9: Invoice HTML completeness**
    - **Validates: Requirements 7.2, 7.6**

  - [ ]* 7.3 Write unit tests for `buildInvoiceHtml`
    - File: `src/app/finance/invoice-generator/components/__tests__/buildInvoiceHtml.test.ts`
    - Cover: fully-populated state (all fields present in output), minimal state (all optional fields empty, absent from output), currency symbol in output
    - _Requirements: 7.6, 7.7_

- [x] 8. Refactor `InvoiceGenerator.tsx` to use sub-components and new state shape
  - Replace single-line "From" / "Bill to" inputs with `<AddressBlock>` for sender and recipient
  - Add `dueDate` state field; add due date `<input type="date">` adjacent to issue date
  - Add `currencyCode` state; add currency `<select>` populated from `INVOICE_CURRENCIES`; remove import of `CURRENCIES` from `emi.ts`
  - Replace inline line-items markup with `<LineItemsTable>`
  - Replace inline discount/tax inputs with `<TotalsForm>` (adds discount mode toggle, shipping, amount paid, payment terms, notes)
  - Replace inline summary sidebar with `<InvoicePreview>`
  - Update `useMemo` call to pass the new `InvoiceCalculationInput` shape to `calculateInvoice`
  - Add `validationErrors` memo: due date before issue date → error message; amount paid > total → error message
  - Add `handleDownloadPdf` async function: call `buildInvoiceHtml`, POST to `/api/html-to-pdf`, trigger download with filename `invoice-{invoiceNumber}.pdf`; manage `pdfLoading` and `pdfError` state
  - _Requirements: 1.1, 1.2, 2.1, 2.4, 3.1, 3.3, 3.4, 4.1, 5.1, 6.1, 7.1, 7.3, 8.1, 9.1_

  - [ ]* 8.1 Write property test — due date validation (Property 10)
    - File: `src/lib/tools/__tests__/invoice.property.test.ts`
    - **Property 10: Due date validation**
    - **Validates: Requirements 2.4**

- [ ] 9. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- fast-check `^4.6.0` is already installed as a dev dependency — no install step needed
- The test runner is vitest; run tests with `npx vitest --run`
- All property tests go in `src/lib/tools/__tests__/invoice.property.test.ts`; each test references its property number and the requirements clause it validates
- `buildInvoiceHtml` must use only inline styles — Puppeteer renders the HTML without the app's Tailwind stylesheet
- The PDF download filename is constructed as `invoice-${invoiceNumber.replace(/[^\w-]+/g, "-").toLowerCase()}.pdf`
- `InvoiceState` and `EditableInvoiceItem` are component-level types in `InvoiceGenerator.tsx` and are not exported from `invoice.ts`
