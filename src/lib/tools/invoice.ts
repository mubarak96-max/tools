// Line item interfaces
export interface InvoiceLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceLineItemResult extends InvoiceLineItemInput {
  lineTotal: number;
}

// Discount mode
export type DiscountMode = "flat" | "percentage";

// Address block
export interface AddressBlock {
  name: string;
  company: string;
  address: string;       // street address
  cityStateZip: string;
  email: string;
  phone: string;
}

// Currency configuration
export interface InvoiceCurrency {
  code: string;    // ISO 4217, e.g. "USD"
  label: string;   // e.g. "US Dollar"
  locale: string;  // BCP 47 locale for Intl.NumberFormat, e.g. "en-US"
}

export const INVOICE_CURRENCIES: InvoiceCurrency[] = [
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "EUR", label: "Euro", locale: "de-DE" },
  { code: "GBP", label: "British Pound", locale: "en-GB" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP" },
  { code: "INR", label: "Indian Rupee", locale: "en-IN" },
  { code: "CHF", label: "Swiss Franc", locale: "de-CH" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG" },
  { code: "MXN", label: "Mexican Peso", locale: "es-MX" },
];

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

// Helper functions
function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateInvoice(input: InvoiceCalculationInput): InvoiceCalculationResult {
  // Calculate line totals with 2 decimal precision
  const items = input.items.map((item) => {
    const quantity = normalize(item.quantity);
    const unitPrice = normalize(item.unitPrice);
    return {
      description: item.description,
      quantity,
      unitPrice,
      lineTotal: round2(quantity * unitPrice),
    };
  });

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

  // Calculate discount amount based on mode
  let discountAmount: number;
  if (input.discountMode === "flat") {
    // Flat discount: clamp to [0, subtotal]
    discountAmount = Math.min(normalize(input.discountValue), subtotal);
  } else {
    // Percentage discount: clamp percentage to [0, 100], then compute amount
    const percentage = Math.max(0, Math.min(100, normalize(input.discountValue)));
    discountAmount = subtotal * (percentage / 100);
  }

  // Calculate taxable base (subtotal - discount + shipping)
  const shipping = normalize(input.shipping);
  const taxableBase = Math.max(0, subtotal - discountAmount + shipping);

  // Calculate tax amount
  const taxAmount = taxableBase * (normalize(input.taxPercent) / 100);

  // Calculate total
  const total = taxableBase + taxAmount;

  // Calculate balance due
  const amountPaid = normalize(input.amountPaid);
  const balanceDue = Math.max(0, total - amountPaid);

  return {
    items,
    subtotal,
    discountAmount,
    taxableBase,
    taxAmount,
    total,
    balanceDue,
  };
}
