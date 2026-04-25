"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import {
  calculateInvoice,
  formatInvoiceCurrency,
  INVOICE_CURRENCIES,
  type AddressBlock,
  type DiscountMode,
  type InvoiceCurrency,
  type InvoiceLineItemInput,
} from "@/lib/tools/invoice";
import AddressBlockComponent from "./AddressBlock";
import LineItemsTable from "./LineItemsTable";
import TotalsForm, { TAX_PRESETS, type TaxPreset } from "./TotalsForm";
import InvoicePreview from "./InvoicePreview";
import { buildInvoiceHtml } from "./buildInvoiceHtml";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

const BUSINESS_DETAILS_STORAGE_KEY = "findbest.invoice.business-details.v1";
const MAX_LOGO_FILE_SIZE = 2 * 1024 * 1024;
const CUSTOM_CURRENCY_OPTION = "__custom_currency__";
const DEFAULT_CUSTOM_LOCALE = "en-US";

type EditableInvoiceItem = InvoiceLineItemInput & { id: string };
type SavedBusinessDetails = {
  sender: AddressBlock;
  currencyCode: string;
  customCurrency?: InvoiceCurrency;
  logoDataUrl: string;
};

function normalizeCurrencyCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function buildCustomCurrency(code: string, label: string, symbol: string): InvoiceCurrency {
  const normalizedCode = normalizeCurrencyCode(code) || "CUSTOM";
  const cleanedLabel = label.trim() || `${normalizedCode} currency`;
  const cleanedSymbol = symbol.trim() || normalizedCode;

  return {
    code: normalizedCode,
    label: cleanedLabel,
    locale: DEFAULT_CUSTOM_LOCALE,
    symbol: cleanedSymbol,
  };
}

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
  const [customCurrencyCode, setCustomCurrencyCode] = useState("");
  const [customCurrencyLabel, setCustomCurrencyLabel] = useState("");
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const [sender, setSender] = useState<AddressBlock>({
    name: "My Company",
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
  const [taxPresetId, setTaxPresetId] = useState("manual");
  const [shipping, setShipping] = useState<number | "">(0);
  const [amountPaid, setAmountPaid] = useState<number | "">(0);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");

  const activeTaxPreset = TAX_PRESETS.find((p) => p.id === taxPresetId) ?? TAX_PRESETS[0];

  function handleTaxPresetChange(preset: TaxPreset) {
    setTaxPresetId(preset.id);
    if (preset.id !== "manual") {
      setTaxPercent(preset.rate);
      // Optionally suggest the matching currency
      if (preset.currencyHint) {
        const matchedCurrency = INVOICE_CURRENCIES.find((c) => c.code === preset.currencyHint);
        if (matchedCurrency) setCurrencyCode(matchedCurrency.code);
      }
    }
  }

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const currency = useMemo(() => {
    if (currencyCode === CUSTOM_CURRENCY_OPTION) {
      return buildCustomCurrency(customCurrencyCode, customCurrencyLabel, customCurrencySymbol);
    }

    return INVOICE_CURRENCIES.find((invoiceCurrency) => invoiceCurrency.code === currencyCode) || INVOICE_CURRENCIES[0];
  }, [currencyCode, customCurrencyCode, customCurrencyLabel, customCurrencySymbol]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(BUSINESS_DETAILS_STORAGE_KEY);
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as Partial<SavedBusinessDetails>;

      if (parsed.sender) {
        setSender({
          name: parsed.sender.name ?? "",
          company: parsed.sender.company ?? "",
          address: parsed.sender.address ?? "",
          cityStateZip: parsed.sender.cityStateZip ?? "",
          email: parsed.sender.email ?? "",
          phone: parsed.sender.phone ?? "",
        });
      }

      if (
        parsed.currencyCode &&
        INVOICE_CURRENCIES.some((invoiceCurrency) => invoiceCurrency.code === parsed.currencyCode)
      ) {
        setCurrencyCode(parsed.currencyCode);
      } else if (parsed.customCurrency || (parsed.currencyCode && parsed.currencyCode !== CUSTOM_CURRENCY_OPTION)) {
        const savedCustomCurrency = parsed.customCurrency ?? buildCustomCurrency(parsed.currencyCode ?? "", "", "");
        setCurrencyCode(CUSTOM_CURRENCY_OPTION);
        setCustomCurrencyCode(savedCustomCurrency.code ?? "");
        setCustomCurrencyLabel(savedCustomCurrency.label ?? "");
        setCustomCurrencySymbol(savedCustomCurrency.symbol ?? savedCustomCurrency.code ?? "");
      }

      if (typeof parsed.logoDataUrl === "string" && parsed.logoDataUrl.startsWith("data:image/")) {
        setLogoDataUrl(parsed.logoDataUrl);
      }

      setSaveMessage("Loaded saved business details.");
    } catch {
      window.localStorage.removeItem(BUSINESS_DETAILS_STORAGE_KEY);
    }
  }, []);

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

  function duplicateItem(id: string) {
    setItems((currentItems) => {
      const sourceItem = currentItems.find((item) => item.id === id);
      if (!sourceItem) {
        return currentItems;
      }

      return [
        ...currentItems,
        createItem(
          `line-${Date.now()}`,
          sourceItem.description,
          sourceItem.quantity,
          sourceItem.unitPrice,
        ),
      ];
    });
  }

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.length > 1 ? currentItems.filter((item) => item.id !== id) : currentItems,
    );
  }

  function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setLogoError("Upload a PNG, JPG, SVG, or other image file.");
      return;
    }

    if (file.size > MAX_LOGO_FILE_SIZE) {
      setLogoError("Logo file must be 2 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && reader.result.startsWith("data:image/")) {
        setLogoDataUrl(reader.result);
        setLogoError(null);
      } else {
        setLogoError("Logo could not be read. Try another image.");
      }
    };
    reader.onerror = () => {
      setLogoError("Logo could not be read. Try another image.");
    };
    reader.readAsDataURL(file);
  }

  function saveBusinessDetails() {
    try {
      const payload: SavedBusinessDetails = {
        sender,
        currencyCode,
        customCurrency: currencyCode === CUSTOM_CURRENCY_OPTION ? currency : undefined,
        logoDataUrl,
      };
      window.localStorage.setItem(BUSINESS_DETAILS_STORAGE_KEY, JSON.stringify(payload));
      setSaveMessage("Saved your business details on this device.");
    } catch {
      setSaveMessage("Could not save business details in this browser.");
    }
  }

  function clearSavedBusinessDetails() {
    window.localStorage.removeItem(BUSINESS_DETAILS_STORAGE_KEY);
    setSaveMessage("Removed saved business details from this device.");
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
        logoDataUrl,
        items,
        discountMode,
        discountValue,
        shipping,
        amountPaid,
        paymentTerms,
        notes,
      };

      const html = buildInvoiceHtml(state, result, currency, activeTaxPreset.taxName);

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
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(30rem,34rem)] 2xl:items-start">
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
                  <option value={CUSTOM_CURRENCY_OPTION}>Custom currency</option>
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

            {currencyCode === CUSTOM_CURRENCY_OPTION && (
              <section className="rounded-[1.5rem] border border-border/70 bg-muted/20 p-4 sm:p-5">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">Custom currency</h2>
                  <p className="text-sm text-muted-foreground">
                    Set your own currency code, label, and symbol when the built-in list does not fit your invoice.
                  </p>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Currency code</span>
                    <input
                      value={customCurrencyCode}
                      onChange={(event) => setCustomCurrencyCode(normalizeCurrencyCode(event.target.value))}
                      className={fieldClass}
                      placeholder="AED"
                      maxLength={8}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Label</span>
                    <input
                      value={customCurrencyLabel}
                      onChange={(event) => setCustomCurrencyLabel(event.target.value)}
                      className={fieldClass}
                      placeholder="UAE Dirham"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Symbol or prefix</span>
                    <input
                      value={customCurrencySymbol}
                      onChange={(event) => setCustomCurrencySymbol(event.target.value)}
                      className={fieldClass}
                      placeholder="AED"
                    />
                  </label>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  Preview format: {formatInvoiceCurrency(1234.56, currency)}
                </p>
              </section>
            )}

            <section className="rounded-[1.5rem] border border-border/70 bg-muted/20 p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">Branding and saved details</h2>
                  <p className="text-sm text-muted-foreground">
                    Save your business details locally so repeat invoices start faster. Your data stays in this browser.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={saveBusinessDetails}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                  >
                    Save my details
                  </button>
                  <button
                    type="button"
                    onClick={clearSavedBusinessDetails}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-destructive hover:text-destructive"
                  >
                    Clear saved details
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[13rem_minmax(0,1fr)]">
                <div className="rounded-[1.25rem] border border-dashed border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Logo preview
                  </p>
                  <div className="mt-3 flex min-h-32 items-center justify-center rounded-[1rem] border border-border/70 bg-muted/20 p-4">
                    {logoDataUrl ? (
                      <img
                        src={logoDataUrl}
                        alt="Business logo preview"
                        className="max-h-24 w-auto max-w-full object-contain"
                      />
                    ) : (
                      <p className="text-center text-sm text-muted-foreground">
                        Add a logo so the preview and PDF feel client-ready.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Business logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className={`${fieldClass} file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground`}
                    />
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Upload a PNG, JPG, or SVG up to 2 MB. The logo appears in the live invoice preview and downloaded PDF.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLogoDataUrl("");
                        setLogoError(null);
                      }}
                      disabled={!logoDataUrl}
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove logo
                    </button>
                  </div>
                  {logoError && <p className="text-sm text-destructive">{logoError}</p>}
                  {saveMessage && <p className="text-sm text-muted-foreground">{saveMessage}</p>}
                </div>
              </div>
            </section>

            <AddressBlockComponent label="From" value={sender} onChange={setSender} />
            <AddressBlockComponent label="Bill to" value={recipient} onChange={setRecipient} />

            <LineItemsTable
              items={items}
              resultItems={result.items}
              currency={currency}
              onUpdate={updateItem}
              onAdd={addItem}
              onDuplicate={duplicateItem}
              onRemove={removeItem}
            />

            <TotalsForm
              discountMode={discountMode}
              discountValue={discountValue}
              taxPercent={taxPercent}
              taxPresetId={taxPresetId}
              shipping={shipping}
              amountPaid={amountPaid}
              paymentTerms={paymentTerms}
              notes={notes}
              validationError={validationErrors.amountPaid}
              onDiscountModeChange={setDiscountMode}
              onDiscountValueChange={setDiscountValue}
              onTaxPercentChange={setTaxPercent}
              onTaxPresetChange={handleTaxPresetChange}
              onShippingChange={setShipping}
              onAmountPaidChange={setAmountPaid}
              onPaymentTermsChange={setPaymentTerms}
              onNotesChange={setNotes}
            />
          </div>

          <InvoicePreview
            className="2xl:sticky 2xl:top-6"
            state={{
              invoiceNumber,
              issueDate,
              dueDate,
              sender,
              recipient,
              logoDataUrl,
              items,
              discountValue,
              shipping,
              amountPaid,
              paymentTerms,
              notes,
            }}
            result={result}
            currency={currency}
            taxLabel={activeTaxPreset.taxName}
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
