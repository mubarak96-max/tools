import type { AddressBlock, InvoiceCalculationResult, InvoiceCurrency } from "@/lib/tools/invoice";

interface InvoiceState {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    sender: AddressBlock;
    recipient: AddressBlock;
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
    state: InvoiceState;
    result: InvoiceCalculationResult;
    currency: InvoiceCurrency;
    validationErrors: ValidationErrors;
    onDownloadPdf: () => void;
    pdfLoading: boolean;
    pdfError: string | null;
}

function formatCurrency(value: number, currency: InvoiceCurrency) {
    return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        maximumFractionDigits: 2,
    }).format(value);
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

    return (
        <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Invoice summary
            </p>

            <div className="mt-4 space-y-1">
                <p className="text-xl font-semibold tracking-tight text-foreground">{state.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">{state.issueDate || "No issue date set"}</p>
                {state.dueDate && (
                    <p className="text-sm text-muted-foreground">Due: {state.dueDate}</p>
                )}
                {validationErrors.dueDate && (
                    <p className="text-sm text-destructive">{validationErrors.dueDate}</p>
                )}
            </div>

            <div className="mt-5 grid gap-4 text-sm">
                <div>
                    <p className="font-semibold text-foreground">From</p>
                    <div className="mt-1 text-muted-foreground">
                        {renderAddressBlock(state.sender).map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-foreground">Bill to</p>
                    <div className="mt-1 text-muted-foreground">
                        {renderAddressBlock(state.recipient).map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatCurrency(result.subtotal, currency)}</span>
                </div>

                {discountValue > 0 && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-foreground">-{formatCurrency(result.discountAmount, currency)}</span>
                    </div>
                )}

                {shipping > 0 && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium text-foreground">{formatCurrency(shipping, currency)}</span>
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium text-foreground">{formatCurrency(result.taxAmount, currency)}</span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <span className="text-base font-semibold text-foreground">Total</span>
                    <span className="text-xl font-semibold tracking-tight text-foreground">
                        {formatCurrency(result.total, currency)} {currency.code}
                    </span>
                </div>

                {amountPaid > 0 && (
                    <>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Amount paid</span>
                            <span className="font-medium text-foreground">-{formatCurrency(amountPaid, currency)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                            <span className="text-base font-semibold text-foreground">Balance due</span>
                            <span className="text-xl font-semibold tracking-tight text-foreground">
                                {formatCurrency(result.balanceDue, currency)}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {state.paymentTerms && (
                <div className="mt-5 border-t border-border pt-5 text-sm">
                    <p className="font-semibold text-foreground">Payment terms</p>
                    <p className="mt-1 text-muted-foreground">{state.paymentTerms}</p>
                </div>
            )}

            {state.notes && (
                <div className="mt-5 border-t border-border pt-5 text-sm">
                    <p className="font-semibold text-foreground">Notes</p>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{state.notes}</p>
                </div>
            )}

            <button
                type="button"
                onClick={onDownloadPdf}
                disabled={pdfLoading}
                className="mt-6 w-full rounded-[1rem] border border-primary bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {pdfLoading ? "Generating PDF..." : "Download PDF"}
            </button>

            {pdfError && (
                <p className="mt-2 text-sm text-destructive">{pdfError}</p>
            )}
        </aside>
    );
}
