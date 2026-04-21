import type {
  AddressBlock,
  InvoiceCalculationResult,
  InvoiceCurrency,
  InvoiceLineItemInput,
} from "@/lib/tools/invoice";
import { formatInvoiceCurrency } from "@/lib/tools/invoice";

type EditableInvoiceItem = InvoiceLineItemInput & { id: string };

interface InvoiceState {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  sender: AddressBlock;
  recipient: AddressBlock;
  logoDataUrl: string;
  items: EditableInvoiceItem[];
  discountValue: number | "";
  shipping: number | "";
  amountPaid: number | "";
  paymentTerms: string;
  notes: string;
}

interface ValidationErrors {
  dueDate?: string;
  amountPaid?: string;
}

interface InvoicePreviewProps {
  className?: string;
  state: InvoiceState;
  result: InvoiceCalculationResult;
  currency: InvoiceCurrency;
  validationErrors: ValidationErrors;
  onDownloadPdf: () => void;
  pdfLoading: boolean;
  pdfError: string | null;
}

function renderAddressBlock(block: AddressBlock) {
  const lines: string[] = [];
  if (block.name) lines.push(block.name);
  if (block.company) lines.push(block.company);
  if (block.address) lines.push(block.address);
  if (block.cityStateZip) lines.push(block.cityStateZip);
  if (block.email) lines.push(block.email);
  if (block.phone) lines.push(block.phone);

  return lines.length > 0 ? lines : ["No address provided"];
}

export default function InvoicePreview({
  className,
  state,
  result,
  currency,
  validationErrors,
  onDownloadPdf,
  pdfLoading,
  pdfError,
}: InvoicePreviewProps) {
  const discountValue = typeof state.discountValue === "number" ? state.discountValue : 0;
  const shipping = typeof state.shipping === "number" ? state.shipping : 0;
  const amountPaid = typeof state.amountPaid === "number" ? state.amountPaid : 0;
  const hasTotalsBreakdown = discountValue > 0 || shipping > 0 || amountPaid > 0;

  return (
    <aside className={className ? `${className} space-y-4` : "space-y-4"}>
      <div className="rounded-[1.5rem] border border-border bg-background p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Live invoice preview
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This mirrors the structure of your PDF so you can catch issues before you download it.
            </p>
          </div>
          <div className="rounded-full border border-border bg-muted/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            PDF-ready
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-border/70 bg-white text-slate-900">
          <div className="flex flex-col gap-6 border-b border-slate-200 px-6 py-6 sm:flex-row sm:justify-between">
            <div className="max-w-[16rem] space-y-4">
              {state.logoDataUrl ? (
                <img
                  src={state.logoDataUrl}
                  alt="Business logo"
                  className="max-h-16 w-auto max-w-full object-contain"
                />
              ) : null}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  From
                </p>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  {renderAddressBlock(state.sender).map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-3xl font-semibold tracking-tight text-slate-950">
                {state.invoiceNumber || "Invoice"}
              </p>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p>Issue date: {state.issueDate || "Not set"}</p>
                <p>Due date: {state.dueDate || "Not set"}</p>
                {validationErrors.dueDate ? (
                  <p className="font-medium text-red-600">{validationErrors.dueDate}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Bill to
              </p>
              <div className="mt-2 space-y-1 text-sm text-slate-600">
                {renderAddressBlock(state.recipient).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1rem] border border-slate-200">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Unit price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item, index) => (
                    <tr key={`${state.items[index]?.id ?? index}-${index}`} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-slate-700">
                        {item.description || `Item ${index + 1}`}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatInvoiceCurrency(item.unitPrice, currency)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {formatInvoiceCurrency(item.lineTotal, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-sm space-y-3 rounded-[1rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatInvoiceCurrency(result.subtotal, currency)}
                  </span>
                </div>

                {discountValue > 0 ? (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-600">Discount</span>
                    <span className="font-medium text-slate-900">
                      -{formatInvoiceCurrency(result.discountAmount, currency)}
                    </span>
                  </div>
                ) : null}

                {shipping > 0 ? (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium text-slate-900">
                      {formatInvoiceCurrency(shipping, currency)}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium text-slate-900">
                    {formatInvoiceCurrency(result.taxAmount, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="text-base font-semibold text-slate-950">Total</span>
                  <span className="text-lg font-semibold text-slate-950">
                    {formatInvoiceCurrency(result.total, currency)}
                  </span>
                </div>

                {amountPaid > 0 ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Amount paid</span>
                      <span className="font-medium text-slate-900">
                        -{formatInvoiceCurrency(amountPaid, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                      <span className="text-base font-semibold text-slate-950">Balance due</span>
                      <span className="text-lg font-semibold text-slate-950">
                        {formatInvoiceCurrency(result.balanceDue, currency)}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {state.paymentTerms || state.notes ? (
              <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Payment terms
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {state.paymentTerms || "No payment terms added"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Notes
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                    {state.notes || "No notes added"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Download-ready summary</p>
            <p className="text-sm text-muted-foreground">
              {hasTotalsBreakdown
                ? "You can verify discounts, shipping, tax, and paid amounts before exporting the PDF."
                : "The invoice is ready to export as a clean PDF."}
            </p>
          </div>
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={pdfLoading}
            className="rounded-[1rem] border border-primary bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pdfLoading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        {validationErrors.amountPaid ? (
          <p className="mt-3 text-sm text-destructive">{validationErrors.amountPaid}</p>
        ) : null}
        {pdfError ? <p className="mt-3 text-sm text-destructive">{pdfError}</p> : null}
      </div>
    </aside>
  );
}
