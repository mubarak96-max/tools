import type { AddressBlock, InvoiceCalculationResult, InvoiceCurrency, DiscountMode } from "@/lib/tools/invoice";

interface InvoiceState {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    sender: AddressBlock;
    recipient: AddressBlock;
    items: Array<{ id: string; description: string; quantity: number; unitPrice: number }>;
    discountMode: DiscountMode;
    discountValue: number | "";
    shipping: number | "";
    amountPaid: number | "";
    paymentTerms: string;
    notes: string;
}

function formatCurrency(value: number, currency: InvoiceCurrency): string {
    return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        maximumFractionDigits: 2,
    }).format(value);
}

function renderAddressLines(block: AddressBlock): string {
    const lines: string[] = [];
    if (block.name) lines.push(block.name);
    if (block.company) lines.push(block.company);
    if (block.address) lines.push(block.address);
    if (block.cityStateZip) lines.push(block.cityStateZip);
    if (block.email) lines.push(block.email);
    if (block.phone) lines.push(block.phone);

    return lines.map(line => `<p style="margin: 0; padding: 2px 0;">${escapeHtml(line)}</p>`).join('');
}

function escapeHtml(text: string): string {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
        div.textContent = text;
        return div.innerHTML;
    }
    // Fallback for server-side
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function buildInvoiceHtml(
    state: InvoiceState,
    result: InvoiceCalculationResult,
    currency: InvoiceCurrency
): string {
    const discountValue = typeof state.discountValue === "number" ? state.discountValue : 0;
    const shipping = typeof state.shipping === "number" ? state.shipping : 0;
    const amountPaid = typeof state.amountPaid === "number" ? state.amountPaid : 0;

    const lineItemsRows = result.items.map((item, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.description || `Item ${index + 1}`)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unitPrice, currency)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatCurrency(item.lineTotal, currency)}</td>
    </tr>
  `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${escapeHtml(state.invoiceNumber)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1f2937;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .header-left, .header-right {
      flex: 1;
    }
    .header-right {
      text-align: right;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .invoice-meta {
      color: #6b7280;
      font-size: 14px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .address-block {
      margin-bottom: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    th {
      background-color: #f9fafb;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }
    th.text-right {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 350px;
      margin-top: 20px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      border-top: 2px solid #1f2937;
      border-bottom: 2px solid #1f2937;
      font-size: 18px;
      font-weight: 700;
      padding: 15px 0;
      margin-top: 10px;
    }
    .totals-row.balance {
      font-size: 18px;
      font-weight: 700;
      padding: 15px 0;
      margin-top: 10px;
      border-bottom: none;
    }
    .footer-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .footer-section p {
      margin: 4px 0;
    }
    .notes {
      white-space: pre-wrap;
      color: #4b5563;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="section-title">From</div>
      ${renderAddressLines(state.sender)}
    </div>
    <div class="header-right">
      <div class="invoice-title">${escapeHtml(state.invoiceNumber)}</div>
      <div class="invoice-meta">
        <p>Issue Date: ${escapeHtml(state.issueDate || 'Not set')}</p>
        ${state.dueDate ? `<p>Due Date: ${escapeHtml(state.dueDate)}</p>` : ''}
      </div>
    </div>
  </div>

  <div class="address-block">
    <div class="section-title">Bill To</div>
    ${renderAddressLines(state.recipient)}
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-right">Quantity</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Line Total</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal</span>
      <span>${formatCurrency(result.subtotal, currency)}</span>
    </div>
    ${discountValue > 0 ? `
    <div class="totals-row">
      <span>Discount</span>
      <span>-${formatCurrency(result.discountAmount, currency)}</span>
    </div>
    ` : ''}
    ${shipping > 0 ? `
    <div class="totals-row">
      <span>Shipping</span>
      <span>${formatCurrency(shipping, currency)}</span>
    </div>
    ` : ''}
    <div class="totals-row">
      <span>Tax</span>
      <span>${formatCurrency(result.taxAmount, currency)}</span>
    </div>
    <div class="totals-row total">
      <span>Total</span>
      <span>${formatCurrency(result.total, currency)} ${currency.code}</span>
    </div>
    ${amountPaid > 0 ? `
    <div class="totals-row">
      <span>Amount Paid</span>
      <span>-${formatCurrency(amountPaid, currency)}</span>
    </div>
    <div class="totals-row balance">
      <span>Balance Due</span>
      <span>${formatCurrency(result.balanceDue, currency)}</span>
    </div>
    ` : ''}
  </div>

  ${state.paymentTerms || state.notes ? `
  <div class="footer-section">
    ${state.paymentTerms ? `
    <div style="margin-bottom: 20px;">
      <div class="section-title">Payment Terms</div>
      <p>${escapeHtml(state.paymentTerms)}</p>
    </div>
    ` : ''}
    ${state.notes ? `
    <div>
      <div class="section-title">Notes</div>
      <div class="notes">${escapeHtml(state.notes)}</div>
    </div>
    ` : ''}
  </div>
  ` : ''}
</body>
</html>`;
}
