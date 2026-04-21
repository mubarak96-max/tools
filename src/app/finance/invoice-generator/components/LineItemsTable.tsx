import { formatInvoiceCurrency, type InvoiceLineItemInput, type InvoiceLineItemResult, type InvoiceCurrency } from "@/lib/tools/invoice";

const fieldClass =
    "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

type EditableInvoiceItem = InvoiceLineItemInput & { id: string };

interface LineItemsTableProps {
    items: EditableInvoiceItem[];
    resultItems: InvoiceLineItemResult[];
    currency: InvoiceCurrency;
    onUpdate: (id: string, field: keyof InvoiceLineItemInput, value: string) => void;
    onAdd: () => void;
    onDuplicate: (id: string) => void;
    onRemove: (id: string) => void;
}

export default function LineItemsTable({
    items,
    resultItems,
    currency,
    onUpdate,
    onAdd,
    onDuplicate,
    onRemove,
}: LineItemsTableProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground">Line items</h2>
                <button
                    type="button"
                    onClick={onAdd}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                >
                    Add item
                </button>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={item.id} className="rounded-[1.25rem] border border-border/70 bg-background p-4">
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_9rem_10rem_auto]">
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Description</span>
                                <input
                                    value={item.description}
                                    onChange={(event) => onUpdate(item.id, "description", event.target.value)}
                                    className={fieldClass}
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={item.quantity}
                                    onChange={(event) => onUpdate(item.id, "quantity", event.target.value)}
                                    className={fieldClass}
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Unit price</span>
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={item.unitPrice}
                                    onChange={(event) => onUpdate(item.id, "unitPrice", event.target.value)}
                                    className={fieldClass}
                                />
                            </label>
                            <div className="flex items-end gap-3">
                                <div className="min-w-0 flex-1 rounded-[1rem] border border-border bg-muted/30 px-4 py-3 text-sm font-semibold text-foreground">
                                    {formatInvoiceCurrency(resultItems[index]?.lineTotal ?? 0, currency)}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onDuplicate(item.id)}
                                    className="rounded-full border border-border px-3 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                                    aria-label={`Duplicate item ${index + 1}`}
                                >
                                    Duplicate
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemove(item.id)}
                                    disabled={items.length === 1}
                                    className="rounded-full border border-border px-3 py-3 text-sm font-semibold text-foreground transition hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:text-foreground"
                                    aria-label={`Remove item ${index + 1}`}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
