export interface InvoiceLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceLineItemResult extends InvoiceLineItemInput {
  lineTotal: number;
}

export interface InvoiceCalculationInput {
  items: InvoiceLineItemInput[];
  taxPercent: number;
  discountAmount: number;
}

export interface InvoiceCalculationResult {
  items: InvoiceLineItemResult[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateInvoice(input: InvoiceCalculationInput): InvoiceCalculationResult {
  const items = input.items.map((item) => {
    const quantity = normalize(item.quantity);
    const unitPrice = normalize(item.unitPrice);
    return {
      description: item.description,
      quantity,
      unitPrice,
      lineTotal: quantity * unitPrice,
    };
  });
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const discountAmount = Math.min(normalize(input.discountAmount), subtotal);
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableBase * (normalize(input.taxPercent) / 100);

  return {
    items,
    subtotal,
    discountAmount,
    taxAmount,
    total: taxableBase + taxAmount,
  };
}
