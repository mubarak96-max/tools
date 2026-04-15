"use client";

import { useMemo, useState } from "react";

import {
  calculateInvoice,
  INVOICE_CURRENCIES,
  type AddressBlock,
  type DiscountMode,
  type InvoiceLineItemInput,
} from "@/lib/tools/invoice";
import AddressBlockComponent from "./AddressBlock";
import LineItemsTable from "./LineItemsTable";
import TotalsForm from "./TotalsForm";
import InvoicePreview from "./InvoicePreview";
import { buildInvoiceHtml } from "./buildInvoiceHtml";

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

function createItem(id: string, description: string, quantity: number, unitPrice: number): EditableInvoiceItem {
  return { id, description, quantity, unitPrice };
}

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [issueDate, setIssueDate] = useState("2026-04-10");
  const [dueDate, setDueDate] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");

  const [sender, setSender] = useState<AddressBlock>({
    name: "FindMyTool Studio",
    company: "",
    address: "",
    cityStateZip: "",
    email: "",
    phone: "",
  });

  const [recipient, setRecipient] = useState<AddressBlock>({
    name: "Client Name",
    company: "",
    address: "",
    cityStateZip: "",
    email: "",
    phone: "",
  });

  const [items, setItems] = useState<EditableInvoiceItem[]>([
    createItem("line-1", "Strategy workshop", 1, 650),
    createItem("line-2", "Landing page build", 1, 1200),
  ]);

  const [discountMode, setDiscountMode] = useState<DiscountMode>("flat");
  const [discountValue, setDiscountValue] = useState<number | "">(0);
  const [taxPercent, setTaxPercent] = useState<number | "">(5);
  const [shipping, setShipping] = useState<number | "">(0);
  const [amountPaid, setAmountPaid] = useState<number | "">(0);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const currency = INVOICE_CURRENCIES.find(c => c.code === currencyCode) || INVOICE_CURRENCIES[0];

  const result = useMemo(
    () =>
      calculateInvoice({
        items: items.map(({ description, quantity, unitPrice }) => ({
          description,
          quantity,
          unitPrice,
        })),
        taxPercent: taxPercent === "" ? 0 : taxPercent,
        discountMode,
        discountValue: discountValue === "" ? 0 : discountValue,
        shipping: shipping === "" ? 0 : shipping,
        amountPaid: amountPaid === "" ? 0 : amountPaid,
      }),
    [items, taxPercent, discountMode, discountValue, shipping, amountPaid],
  );

  const validationErrors = useMemo(() => {
    const errors: { dueDate?: string; amountPaid?: string } = {};

    if (dueDate && issueDate && dueDate < issueDate) {
      errors.dueDate = "Due date must be on or after the issue date";
    }

    const amountPaidNum = amountPaid === "" ? 0 : amountPaid;
    if (amountPaidNum > result.total) {
      errors.amountPaid = "Amount paid cannot exceed the invoice total";
    }

    return errors;
  }, [dueDate, issueDate, amountPaid, result.total]);

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
      createItem(`line-${Date.now()}`, "", 1, 0),
    ]);
  }

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.length > 1 ? currentItems.filter((item) => item.id !== id) : currentItems,
    );
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    setPdfError(null);

    try {
      const state = {
        invoiceNumber,
        issueDate,
        dueDate,
        sender,
        recipient,
        items,
        discountMode,
        discountValue,
        shipping,
        amountPaid,
        paymentTerms,
        notes,
      };

      const html = buildInvoiceHtml(state, result, currency);

      const response = await fetch("/api/html-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          title: `Invoice ${invoiceNumber}`,
          format: "A4",
        }),
      });

      if (!response.ok) {
        throw new Error("PDF generation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceNumber.replace(/[^\w-]+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      setPdfError("PDF generation failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
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
                <span className="text-sm font-medium text-muted-foreground">Currency</span>
                <select value={currencyCode} onChange={(event) => setCurrencyCode(event.target.value)} className={fieldClass}>
                  {INVOICE_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Issue date</span>
                <input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className={fieldClass} />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Due date</span>
                <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={fieldClass} />
                {validationErrors.dueDate && (
                  <p className="text-sm text-destructive">{validationErrors.dueDate}</p>
                )}
              </label>
            </div>

            <AddressBlockComponent label="From" value={sender} onChange={setSender} />
            <AddressBlockComponent label="Bill to" value={recipient} onChange={setRecipient} />

            <LineItemsTable
              items={items}
              resultItems={result.items}
              currency={currency}
              onUpdate={updateItem}
              onAdd={addItem}
              onRemove={removeItem}
            />

            <TotalsForm
              discountMode={discountMode}
              discountValue={discountValue}
              taxPercent={taxPercent}
              shipping={shipping}
              amountPaid={amountPaid}
              paymentTerms={paymentTerms}
              notes={notes}
              validationError={validationErrors.amountPaid}
              onDiscountModeChange={setDiscountMode}
              onDiscountValueChange={setDiscountValue}
              onTaxPercentChange={setTaxPercent}
              onShippingChange={setShipping}
              onAmountPaidChange={setAmountPaid}
              onPaymentTermsChange={setPaymentTerms}
              onNotesChange={setNotes}
            />
          </div>

          <InvoicePreview
            state={{
              invoiceNumber,
              issueDate,
              dueDate,
              sender,
              recipient,
              discountValue,
              shipping,
              amountPaid,
              paymentTerms,
              notes,
            }}
            result={result}
            currency={currency}
            validationErrors={validationErrors}
            onDownloadPdf={handleDownloadPdf}
            pdfLoading={pdfLoading}
            pdfError={pdfError}
          />
        </div>
      </section>
    </div>
  );
}
