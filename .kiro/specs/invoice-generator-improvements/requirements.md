# Requirements Document

## Introduction

The Invoice Generator at `/finance/invoice-generator` is a client-side tool that lets users draft invoices and calculate totals. The current implementation is functional but limited: it has single-line sender/recipient fields, no due date, no currency selection, only flat-amount discounts, no notes or payment terms, and no way to export the result. This spec covers the improvements needed to make it a genuinely useful, professional-grade invoice drafting tool — drawing on the feature set of leading tools like invoice-generator.com and Billdu.

## Glossary

- **Invoice_Generator**: The client-side React component at `src/app/finance/invoice-generator/components/InvoiceGenerator.tsx` that renders the invoice form and summary.
- **Invoice_Form**: The editable left-hand section of the Invoice_Generator containing all input fields.
- **Invoice_Preview**: The right-hand sidebar (currently "Invoice summary") that reflects the current state of the invoice.
- **Line_Item**: A single row in the invoice representing a product or service, with description, quantity, unit price, and calculated line total.
- **Discount**: A reduction applied to the invoice subtotal, expressed as either a flat currency amount or a percentage of the subtotal.
- **Tax**: A percentage applied to the taxable base (subtotal minus discount) to produce a tax amount.
- **Subtotal**: The sum of all Line_Item line totals before discount and tax.
- **Total**: The final payable amount: subtotal minus discount plus tax.
- **PDF_Export_API**: The existing server-side endpoint at `/api/html-to-pdf` that accepts HTML and returns a rendered PDF via Puppeteer.
- **Currency**: An ISO 4217 currency code (e.g. USD, EUR, GBP) used to format all monetary values in the invoice.
- **Address_Block**: A multi-line text area capturing name, company, address, email, and/or phone for a party on the invoice.
- **Payment_Terms**: A short label describing when payment is due (e.g. "Net 30", "Due on receipt").
- **Notes**: Free-form text appended to the bottom of the invoice for additional context or instructions.

---

## Requirements

### Requirement 1: Multi-line Address Fields

**User Story:** As a freelancer or business owner, I want to enter full address details for both myself and my client, so that the invoice looks professional and contains all the information a client needs to process payment.

#### Acceptance Criteria

1. THE Invoice_Form SHALL replace the single-line "From" input with an Address_Block containing separate fields for: name, company, street address, city/state/zip, email, and phone.
2. THE Invoice_Form SHALL replace the single-line "Bill to" input with an Address_Block containing the same set of fields as the sender Address_Block.
3. WHEN an Address_Block field is left empty, THE Invoice_Generator SHALL omit that field from the Invoice_Preview rather than displaying a blank line.
4. THE Invoice_Preview SHALL render each Address_Block as a formatted multi-line block matching the field order: name, company, address, email, phone.

---

### Requirement 2: Due Date Field

**User Story:** As an invoice sender, I want to specify a due date, so that my client knows exactly when payment is expected.

#### Acceptance Criteria

1. THE Invoice_Form SHALL include a due date input field of type `date`, positioned adjacent to the existing issue date field.
2. WHEN a due date is set, THE Invoice_Preview SHALL display the due date labelled "Due date".
3. WHEN the due date field is left empty, THE Invoice_Preview SHALL omit the due date line entirely.
4. IF the due date is earlier than the issue date, THEN THE Invoice_Generator SHALL display an inline validation message stating "Due date must be on or after the issue date".

---

### Requirement 3: Currency Selection

**User Story:** As a user billing clients in different countries, I want to select the invoice currency, so that all monetary values are formatted correctly for my locale.

#### Acceptance Criteria

1. THE Invoice_Form SHALL include a currency selector offering at minimum: USD, EUR, GBP, CAD, AUD, JPY, INR, CHF, SGD, and MXN.
2. WHEN a currency is selected, THE Invoice_Generator SHALL reformat all monetary values (line totals, subtotal, discount, tax, total) using the selected currency's symbol and locale-appropriate number formatting.
3. THE Invoice_Generator SHALL default to USD on initial load.
4. WHEN the currency is changed, THE Invoice_Generator SHALL NOT convert the numeric amounts — only the display formatting SHALL change.
5. THE Invoice_Preview SHALL display the selected currency code alongside the total amount.

---

### Requirement 4: Flexible Discount

**User Story:** As a seller, I want to apply a discount as either a flat amount or a percentage of the subtotal, so that I can match the discount structure I agreed with my client.

#### Acceptance Criteria

1. THE Invoice_Form SHALL provide a toggle or selector allowing the user to choose between "Flat amount" and "Percentage" discount modes.
2. WHEN "Flat amount" mode is selected, THE Invoice_Generator SHALL accept a numeric input representing a currency amount and deduct it directly from the subtotal.
3. WHEN "Percentage" mode is selected, THE Invoice_Generator SHALL accept a numeric input between 0 and 100 and compute the discount as that percentage of the subtotal.
4. THE Invoice_Generator SHALL clamp the flat discount so it does not exceed the subtotal, producing a minimum taxable base of zero.
5. THE Invoice_Generator SHALL clamp the percentage discount input to the range [0, 100].
6. THE Invoice_Preview SHALL display the discount line as a negative value with the mode indicated (e.g. "Discount (10%)" or "Discount").

---

### Requirement 5: Payment Terms Field

**User Story:** As an invoice sender, I want to specify payment terms, so that my client understands the payment schedule without needing a separate communication.

#### Acceptance Criteria

1. THE Invoice_Form SHALL include a payment terms field that accepts free-form text, with placeholder suggestions such as "Net 30", "Net 15", "Due on receipt".
2. WHEN a payment terms value is entered, THE Invoice_Preview SHALL display it labelled "Payment terms".
3. WHEN the payment terms field is empty, THE Invoice_Preview SHALL omit the payment terms line.

---

### Requirement 6: Notes Field

**User Story:** As an invoice sender, I want to add free-form notes to the bottom of the invoice, so that I can include bank details, thank-you messages, or special instructions.

#### Acceptance Criteria

1. THE Invoice_Form SHALL include a multi-line notes textarea at the bottom of the form, below the discount and tax fields.
2. WHEN notes text is entered, THE Invoice_Preview SHALL render the notes below the totals section, labelled "Notes".
3. WHEN the notes field is empty, THE Invoice_Preview SHALL omit the notes section entirely.
4. THE Invoice_Generator SHALL accept up to 1000 characters in the notes field.
5. WHEN the notes input exceeds 1000 characters, THE Invoice_Generator SHALL display a character count and prevent further input beyond the limit.

---

### Requirement 7: PDF Export

**User Story:** As a user, I want to download my invoice as a PDF, so that I can send it to clients or keep it for my records.

#### Acceptance Criteria

1. THE Invoice_Generator SHALL provide a "Download PDF" button visible in the Invoice_Preview sidebar.
2. WHEN the "Download PDF" button is clicked, THE Invoice_Generator SHALL construct a self-contained HTML representation of the current invoice state and POST it to the PDF_Export_API at `/api/html-to-pdf`.
3. WHEN the PDF_Export_API returns a successful response, THE Invoice_Generator SHALL trigger a browser file download with the filename `invoice-{invoiceNumber}.pdf`.
4. WHILE the PDF is being generated, THE Invoice_Generator SHALL display a loading indicator on the "Download PDF" button and disable it to prevent duplicate submissions.
5. IF the PDF_Export_API returns an error, THEN THE Invoice_Generator SHALL display an inline error message stating "PDF generation failed. Please try again."
6. THE generated PDF SHALL include all visible invoice fields: sender address, recipient address, invoice number, issue date, due date, line items table, subtotal, discount, tax, total, payment terms, and notes.
7. THE generated PDF SHALL use clean, print-ready styling with the invoice number and total prominently displayed.

---

### Requirement 8: Shipping Field (Optional)

**User Story:** As a seller of physical goods, I want to add a shipping charge to the invoice, so that I can recover delivery costs from my client.

#### Acceptance Criteria

1. WHERE a shipping amount is needed, THE Invoice_Form SHALL provide an optional shipping field that accepts a non-negative numeric value.
2. WHEN a shipping amount is entered, THE Invoice_Generator SHALL add it to the taxable base after discount, before tax is applied.
3. WHEN the shipping field is zero or empty, THE Invoice_Preview SHALL omit the shipping line.

---

### Requirement 9: Amount Paid / Balance Due

**User Story:** As an invoice sender, I want to record a partial payment already received, so that the invoice clearly shows the remaining balance due.

#### Acceptance Criteria

1. THE Invoice_Form SHALL include an "Amount paid" field accepting a non-negative numeric value.
2. THE Invoice_Generator SHALL compute the balance due as: total minus amount paid.
3. WHEN amount paid is greater than zero, THE Invoice_Preview SHALL display both "Amount paid" and "Balance due" lines below the total.
4. IF the amount paid exceeds the total, THEN THE Invoice_Generator SHALL display an inline validation message stating "Amount paid cannot exceed the invoice total".
5. WHEN amount paid is zero or empty, THE Invoice_Preview SHALL omit the amount paid and balance due lines.

---

### Requirement 10: Calculation Correctness

**User Story:** As a user, I want all invoice totals to be calculated accurately, so that I can trust the numbers I send to clients.

#### Acceptance Criteria

1. THE Invoice_Generator SHALL compute line totals as: quantity × unit price, rounded to 2 decimal places.
2. THE Invoice_Generator SHALL compute the subtotal as the sum of all line totals.
3. WHEN discount mode is "Flat amount", THE Invoice_Generator SHALL compute the taxable base as: max(0, subtotal − discount amount).
4. WHEN discount mode is "Percentage", THE Invoice_Generator SHALL compute the taxable base as: subtotal × (1 − discount percentage / 100).
5. THE Invoice_Generator SHALL compute the tax amount as: taxable base × (tax percentage / 100).
6. THE Invoice_Generator SHALL compute the total as: taxable base + tax amount + shipping amount.
7. THE Invoice_Generator SHALL compute the balance due as: total − amount paid.
8. FOR ALL valid invoice inputs, the displayed total in the Invoice_Preview SHALL equal the sum of taxable base, tax amount, and shipping amount.
