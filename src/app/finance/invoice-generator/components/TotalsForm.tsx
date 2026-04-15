import type { DiscountMode } from "@/lib/tools/invoice";

const fieldClass =
    "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

interface TotalsFormProps {
    discountMode: DiscountMode;
    discountValue: number | "";
    taxPercent: number | "";
    shipping: number | "";
    amountPaid: number | "";
    paymentTerms: string;
    notes: string;
    validationError?: string;
    onDiscountModeChange: (mode: DiscountMode) => void;
    onDiscountValueChange: (value: number | "") => void;
    onTaxPercentChange: (value: number | "") => void;
    onShippingChange: (value: number | "") => void;
    onAmountPaidChange: (value: number | "") => void;
    onPaymentTermsChange: (value: string) => void;
    onNotesChange: (value: string) => void;
}

export default function TotalsForm({
    discountMode,
    discountValue,
    taxPercent,
    shipping,
    amountPaid,
    paymentTerms,
    notes,
    validationError,
    onDiscountModeChange,
    onDiscountValueChange,
    onTaxPercentChange,
    onShippingChange,
    onAmountPaidChange,
    onPaymentTermsChange,
    onNotesChange,
}: TotalsFormProps) {
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

                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Tax (%)</span>
                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={taxPercent}
                        onChange={(e) => onTaxPercentChange(e.target.value === "" ? "" : Number(e.target.value))}
                        className={fieldClass}
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
                    <input
                        type="text"
                        value={paymentTerms}
                        onChange={(e) => onPaymentTermsChange(e.target.value)}
                        className={fieldClass}
                        placeholder="Net 30, Net 15, Due on receipt"
                    />
                </label>
            </div>

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
