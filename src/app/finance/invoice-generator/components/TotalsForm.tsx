import type { DiscountMode } from "@/lib/tools/invoice";

const fieldClass =
    "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";
const CUSTOM_PAYMENT_TERMS_OPTION = "__custom_payment_terms__";

export interface TaxPreset {
    id: string;
    label: string;        // shown in dropdown
    taxName: string;      // shown beside the rate row (e.g. "UK VAT (20%)")
    rate: number;         // percentage
    currencyHint?: string;
}

export const TAX_PRESETS: TaxPreset[] = [
    { id: "manual",        label: "Manual / Custom",        taxName: "Tax",                    rate: 0 },
    { id: "uk-vat-20",     label: "🇬🇧 UK VAT — 20%",        taxName: "UK VAT (20%)",           rate: 20,  currencyHint: "GBP" },
    { id: "uk-vat-5",      label: "🇬🇧 UK VAT reduced — 5%",  taxName: "UK VAT Reduced (5%)",    rate: 5,   currencyHint: "GBP" },
    { id: "au-gst",        label: "🇦🇺 Australia GST — 10%", taxName: "AU GST (10%)",           rate: 10,  currencyHint: "AUD" },
    { id: "ca-hst-on",     label: "🇨🇦 Canada HST Ontario — 13%",   taxName: "CA HST ON (13%)",  rate: 13,  currencyHint: "CAD" },
    { id: "ca-hst-ns",     label: "🇨🇦 Canada HST Nova Scotia — 15%", taxName: "CA HST NS (15%)", rate: 15,  currencyHint: "CAD" },
    { id: "ca-gst",        label: "🇨🇦 Canada GST only — 5%", taxName: "CA GST (5%)",           rate: 5,   currencyHint: "CAD" },
    { id: "nz-gst",        label: "🇳🇿 New Zealand GST — 15%",taxName: "NZ GST (15%)",          rate: 15,  currencyHint: "NZD" },
    { id: "sg-gst",        label: "🇸🇬 Singapore GST — 9%",  taxName: "SG GST (9%)",           rate: 9,   currencyHint: "SGD" },
    { id: "eu-vat-de",     label: "🇩🇪 Germany VAT — 19%",   taxName: "DE VAT (19%)",          rate: 19,  currencyHint: "EUR" },
    { id: "eu-vat-fr",     label: "🇫🇷 France VAT — 20%",    taxName: "FR VAT (20%)",          rate: 20,  currencyHint: "EUR" },
    { id: "us-no-tax",     label: "🇺🇸 US — No Sales Tax",   taxName: "Tax",                   rate: 0,   currencyHint: "USD" },
];
const PAYMENT_TERMS_OPTIONS = [
    "Due on receipt",
    "Net 7",
    "Net 15",
    "Net 30",
    "Net 45",
    "Net 60",
];

interface TotalsFormProps {
    discountMode: DiscountMode;
    discountValue: number | "";
    taxPercent: number | "";
    taxPresetId: string;
    shipping: number | "";
    amountPaid: number | "";
    paymentTerms: string;
    notes: string;
    validationError?: string;
    onDiscountModeChange: (mode: DiscountMode) => void;
    onDiscountValueChange: (value: number | "") => void;
    onTaxPercentChange: (value: number | "") => void;
    onTaxPresetChange: (preset: TaxPreset) => void;
    onShippingChange: (value: number | "") => void;
    onAmountPaidChange: (value: number | "") => void;
    onPaymentTermsChange: (value: string) => void;
    onNotesChange: (value: string) => void;
}

export default function TotalsForm({
    discountMode,
    discountValue,
    taxPercent,
    taxPresetId,
    shipping,
    amountPaid,
    paymentTerms,
    notes,
    validationError,
    onDiscountModeChange,
    onDiscountValueChange,
    onTaxPercentChange,
    onTaxPresetChange,
    onShippingChange,
    onAmountPaidChange,
    onPaymentTermsChange,
    onNotesChange,
}: TotalsFormProps) {
    const activePreset = TAX_PRESETS.find((p) => p.id === taxPresetId) ?? TAX_PRESETS[0];
    const isManual = activePreset.id === "manual";
    const selectedPaymentTerms = PAYMENT_TERMS_OPTIONS.includes(paymentTerms)
        ? paymentTerms
        : paymentTerms
            ? CUSTOM_PAYMENT_TERMS_OPTION
            : "";

    return (
        <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Discount type</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onDiscountModeChange("flat")}
                            className={`flex-1 rounded-[1rem] border px-4 py-3 text-sm font-medium transition ${discountMode === "flat"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-background text-foreground hover:border-primary/50"
                                }`}
                        >
                            Flat amount
                        </button>
                        <button
                            type="button"
                            onClick={() => onDiscountModeChange("percentage")}
                            className={`flex-1 rounded-[1rem] border px-4 py-3 text-sm font-medium transition ${discountMode === "percentage"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-background text-foreground hover:border-primary/50"
                                }`}
                        >
                            Percentage
                        </button>
                    </div>
                </div>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        Discount {discountMode === "percentage" ? "(%)" : "amount"}
                    </span>
                    <input
                        type="number"
                        min={0}
                        max={discountMode === "percentage" ? 100 : undefined}
                        step="0.01"
                        value={discountValue}
                        onChange={(e) => onDiscountValueChange(e.target.value === "" ? "" : Number(e.target.value))}
                        className={fieldClass}
                    />
                </label>

                {/* Tax preset selector */}
                <div className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-muted-foreground">Tax type</span>
                    <select
                        value={taxPresetId}
                        onChange={(e) => {
                            const preset = TAX_PRESETS.find((p) => p.id === e.target.value) ?? TAX_PRESETS[0];
                            onTaxPresetChange(preset);
                        }}
                        className={fieldClass}
                    >
                        {TAX_PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                    {activePreset.id !== "manual" && (
                        <p className="text-xs text-muted-foreground">
                            Auto-set to <strong>{activePreset.rate}%</strong> ({activePreset.taxName})
                            {activePreset.currencyHint ? ` · invoice currency: ${activePreset.currencyHint}` : ""}
                        </p>
                    )}
                </div>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        {isManual ? "Tax (%)" : `${activePreset.taxName} rate (%)`}
                    </span>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={taxPercent}
                        readOnly={!isManual}
                        onChange={(e) => {
                            if (isManual) onTaxPercentChange(e.target.value === "" ? "" : Number(e.target.value));
                        }}
                        className={`${fieldClass} ${!isManual ? "cursor-not-allowed opacity-60" : ""}`}
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Shipping</span>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={shipping}
                        onChange={(e) => onShippingChange(e.target.value === "" ? "" : Number(e.target.value))}
                        className={fieldClass}
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Amount paid</span>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={amountPaid}
                        onChange={(e) => onAmountPaidChange(e.target.value === "" ? "" : Number(e.target.value))}
                        className={fieldClass}
                    />
                    {validationError && (
                        <p className="text-sm text-destructive">{validationError}</p>
                    )}
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Payment terms</span>
                    <select
                        value={selectedPaymentTerms}
                        onChange={(e) =>
                            onPaymentTermsChange(
                                e.target.value === CUSTOM_PAYMENT_TERMS_OPTION ? paymentTerms : e.target.value,
                            )
                        }
                        className={fieldClass}
                    >
                        <option value="">Select terms</option>
                        {PAYMENT_TERMS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                        <option value={CUSTOM_PAYMENT_TERMS_OPTION}>Custom terms</option>
                    </select>
                </label>
            </div>

            {selectedPaymentTerms === CUSTOM_PAYMENT_TERMS_OPTION && (
                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Custom payment terms</span>
                    <input
                        type="text"
                        value={paymentTerms}
                        onChange={(e) => onPaymentTermsChange(e.target.value)}
                        className={fieldClass}
                        placeholder="Net 21, 50% upfront, due in 10 days"
                    />
                </label>
            )}

            <label className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Notes</span>
                    <span className="text-xs text-muted-foreground">
                        {notes.length} / 1000
                    </span>
                </div>
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    className={fieldClass}
                    placeholder="Bank details, thank you message, or special instructions..."
                />
            </label>
        </div>
    );
}
