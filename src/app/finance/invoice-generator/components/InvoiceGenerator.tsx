"use client";

import { useMemo, useState } from "react";

import { CURRENCIES } from "@/lib/tools/emi";
import { calculateInvoice, type InvoiceLineItemInput } from "@/lib/tools/invoice";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

type EditableInvoiceItem = InvoiceLineItemInput & { id: string };

function optionalNum(value: string) {
  if (value.trim() === "") {
    return "";
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(CURRENCIES[0].locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function createItem(id: string, description: string, quantity: number, unitPrice: number): EditableInvoiceItem {
  return { id, description, quantity, unitPrice };
}

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [issueDate, setIssueDate] = useState("2026-04-10");
  const [sellerName, setSellerName] = useState("FindMyTool Studio");
  const [clientName, setClientName] = useState("Client Name");
  const [taxPercent, setTaxPercent] = useState<number | "">(5);
  const [discountAmount, setDiscountAmount] = useState<number | "">(0);
  const [items, setItems] = useState<EditableInvoiceItem[]>([
    createItem("line-1", "Strategy workshop", 1, 650),
    createItem("line-2", "Landing page build", 1, 1200),
  ]);

  const result = useMemo(
    () =>
      calculateInvoice({
        items: items.map(({ description, quantity, unitPrice }) => ({
          description,
          quantity,
          unitPrice,
        })),
        taxPercent: taxPercent === "" ? 0 : taxPercent,
        discountAmount: discountAmount === "" ? 0 : discountAmount,
      }),
    [discountAmount, items, taxPercent],
  );

  function updateItem(id: string, field: keyof InvoiceLineItemInput, value: string) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (field === "description") {
          return { ...item, description: value };
        }

        const parsed = optionalNum(value);
        return {
          ...item,
          [field]: parsed === "" ? 0 : parsed,
        };
      }),
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      createItem(`line-${currentItems.length + 1}`, "", 1, 0),
    ]);
  }

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.length > 1 ? currentItems.filter((item) => item.id !== id) : currentItems,
    );
  }

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Invoice number</span>
                <input value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className={fieldClass} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Issue date</span>
                <input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className={fieldClass} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">From</span>
                <input value={sellerName} onChange={(event) => setSellerName(event.target.value)} className={fieldClass} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Bill to</span>
                <input value={clientName} onChange={(event) => setClientName(event.target.value)} className={fieldClass} />
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-foreground">Line items</h2>
                <button
                  type="button"
                  onClick={addItem}
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
                          onChange={(event) => updateItem(item.id, "description", event.target.value)}
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
                          onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
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
                          onChange={(event) => updateItem(item.id, "unitPrice", event.target.value)}
                          className={fieldClass}
                        />
                      </label>
                      <div className="flex items-end gap-3">
                        <div className="min-w-0 flex-1 rounded-[1rem] border border-border bg-muted/30 px-4 py-3 text-sm font-semibold text-foreground">
                          {formatCurrency(result.items[index]?.lineTotal ?? 0)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-full border border-border px-3 py-3 text-sm font-semibold text-foreground transition hover:border-destructive hover:text-destructive"
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

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Discount amount</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={discountAmount}
                  onChange={(event) => setDiscountAmount(optionalNum(event.target.value))}
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
                  onChange={(event) => setTaxPercent(optionalNum(event.target.value))}
                  className={fieldClass}
                />
              </label>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Invoice summary
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-xl font-semibold tracking-tight text-foreground">{invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">{issueDate || "No issue date set"}</p>
            </div>
            <div className="mt-5 grid gap-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">From</p>
                <p className="mt-1 text-muted-foreground">{sellerName || "Your business name"}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Bill to</p>
                <p className="mt-1 text-muted-foreground">{clientName || "Client name"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(result.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-foreground">-{formatCurrency(result.discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">{formatCurrency(result.taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-xl font-semibold tracking-tight text-foreground">{formatCurrency(result.total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
