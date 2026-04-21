import Link from "next/link";
import type { Metadata } from "next";

import InvoiceGenerator from "@/app/finance/invoice-generator/components/InvoiceGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/invoice-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I create an invoice for free?",
    answer:
      "Enter your invoice number, dates, sender details, client details, and line items in the form above. Add tax, discount, shipping, and payment terms if needed, then download the finished invoice as a PDF. There is no sign-up flow on this page.",
  },
  {
    question: "What should an invoice include?",
    answer:
      "A complete invoice should include an invoice number, issue date, due date, your business details, your client details, itemized products or services, subtotal, any discount, tax, total due, payment terms, and optional notes.",
  },
  {
    question: "How do I number my invoices?",
    answer:
      "Use a simple numbering system that stays consistent over time, such as INV-2026-001, INV-2026-002, and so on. The main goal is uniqueness and a sequence you can understand later during bookkeeping or client follow-up.",
  },
  {
    question: "What payment terms should I use on an invoice?",
    answer:
      "Common payment terms include Due on Receipt, Net 7, Net 15, and Net 30. Shorter terms can improve cash flow, while longer terms may be expected by larger clients. Choose terms that fit your business and the agreement you made with the client.",
  },
  {
    question: "Can I add my logo to the invoice?",
    answer:
      "Yes. You can upload a business logo and it will appear in the live invoice preview and the downloaded PDF. Logo upload is optional, so you can still create a clean invoice quickly without branding if you prefer.",
  },
  {
    question: "Is the PDF invoice free and without a watermark?",
    answer:
      "Yes. The invoice PDF download from this page is free and does not add a watermark to the generated document.",
  },
  {
    question: "How do I calculate tax on an invoice?",
    answer:
      "This invoice generator applies tax as a percentage of the taxable base. The taxable base is the subtotal after discount, plus shipping if shipping is entered before tax. The page calculates the tax amount and final total automatically.",
  },
  {
    question: "What is the difference between invoice date and due date?",
    answer:
      "The invoice date is the date you issue the invoice. The due date is the date payment should be made by. Keeping both helps clients understand when the invoice was created and when payment becomes late.",
  },
  {
    question: "Can I save or reuse invoices on this page?",
    answer:
      "You can save your business details locally in this browser so repeat invoices are faster to create. For full invoice records, download the PDF and store it in your own bookkeeping or document system.",
  },
  {
    question: "Is this invoice generator suitable for freelancers?",
    answer:
      "Yes. Freelancers, consultants, agencies, contractors, and small businesses can all use it for straightforward invoice drafting, especially when they need a quick PDF without opening full accounting software.",
  },
  {
    question: "What currencies does this invoice generator support?",
    answer:
      "The tool includes ten predefined currencies: USD, EUR, GBP, CAD, AUD, JPY, INR, CHF, SGD, and MXN. It also supports a custom currency mode where you can set your own currency code, label, and symbol.",
  },
  {
    question: "Do I need to sign up to download the PDF?",
    answer:
      "No. You can fill in the invoice details and download the PDF directly from the page without creating an account.",
  },
  {
    question: "Does this replace accounting or tax software?",
    answer:
      "No. This page helps you create a clean invoice and calculate totals, but accounting treatment, compliance, tax reporting, and long-term records still depend on your own bookkeeping process and jurisdiction.",
  },
  {
    question: "Is discount applied before tax here?",
    answer:
      "Yes. This tool applies the discount before calculating tax, which is a common invoice structure for service and product invoices.",
  },
];

const howToSteps = [
  "Enter your invoice number, issue date, due date, and currency.",
  "Add your business details and your client or billing details.",
  "Create line items with descriptions, quantities, and unit prices.",
  "Add discount, tax, shipping, amount paid, payment terms, and notes if needed.",
  "Review the invoice preview, then download the finished invoice as a PDF.",
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to create an invoice online",
  description:
    "Create a professional invoice online by entering business details, client details, line items, tax, discount, and payment terms, then download the invoice as a PDF.",
  step: howToSteps.map((text, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: text,
    text,
    url: PAGE_URL,
  })),
};

export const metadata: Metadata = {
  title: "Free Invoice Generator - Create & Download PDF Invoices Online",
  description:
    "Generate professional invoices free online. Add line items, tax, discount, and shipping, then download a PDF instantly. No account, no watermark, no subscription needed.",
  keywords: [
    "free invoice generator",
    "invoice generator",
    "create invoice online free",
    "invoice maker",
    "free invoice maker",
    "invoice generator no sign up",
    "invoice generator pdf",
    "invoice generator no watermark",
    "invoice generator for freelancers",
    "simple invoice generator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Invoice Generator - Create & Download PDF Invoices Online",
    description:
      "Create invoice PDFs online for free with line items, tax, discount, shipping, and payment terms. No sign-up and no watermark.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator",
    description:
      "Create invoice PDFs online with no sign-up and no watermark. Add line items, tax, discount, shipping, and payment terms instantly.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Invoice Generator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free invoice generator for creating and downloading PDF invoices online with tax, discount, shipping, and payment terms.",
    featureList: [
      "Line items",
      "Multi-currency invoice drafting",
      "Custom currency support",
      "Flat and percentage discount support",
      "Tax calculation",
      "Shipping and amount paid fields",
      "Payment terms and notes",
      "Business logo upload",
      "Saved business details on this device",
      "Live invoice preview",
      "PDF invoice download",
      "No sign-up required",
      "No watermark",
    ],
  };
}

export default function InvoiceGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Invoice Generator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <JsonLd data={serializeJsonLd(howToJsonLd)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Invoice Generator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Business Finance
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Free Invoice Generator
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Create and download PDF invoices online for free. Add line items, tax, discount, shipping, and payment terms in one place with no sign-up, no watermark, and no subscription gate.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            This invoice maker is built for freelancers, consultants, contractors, agencies, and small businesses that need a clean invoice fast. Add your logo, save your business details for repeat use, review the live invoice preview, and export a print-ready PDF directly from the browser.
          </p>
        </div>
      </section>

      <InvoiceGenerator />

      <section className="space-y-10 border-t border-border/60 pt-8">
        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What to include on an invoice</h2>
          <p className="text-base leading-7 text-muted-foreground">
            A strong invoice is more than a total number. It should clearly tell the client who is billing them, what work or products are being billed, when payment is due, and how the final amount was calculated. At minimum, a professional invoice should include an invoice number, issue date, due date, your business details, the client or billing details, itemized line items, subtotal, any discount, any tax, and the final amount due. If you accept multiple payment methods or need to clarify late-fee expectations, the notes area is the right place to include that guidance.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            The reason this matters for both operations and trust is simple: invoices are payment documents, not casual summaries. A vague invoice slows approval, creates unnecessary back-and-forth, and can delay cash collection. A clean itemized structure reduces disputes because the client can see exactly what they are paying for. That is why this page includes line items, discount handling, tax, shipping, amount paid, payment terms, and notes instead of only one total field. A better invoice is easier to approve, easier to file, and easier to reconcile later.
          </p>
        </div>

        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to write an invoice with this tool</h2>
          <ol className="space-y-3 text-base leading-7 text-muted-foreground">
            {howToSteps.map((step, index) => (
              <li key={step}>
                <span className="font-semibold text-foreground">{index + 1}. </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="text-base leading-7 text-muted-foreground">
            This workflow is intentionally simple because most users searching for an invoice generator are not looking for a full accounting suite at that moment. They want to create invoice PDFs quickly, keep the layout professional, and avoid the friction that comes with account creation, branding limits, or watermark restrictions. Once the invoice is ready, download the PDF and store it in your own record system for bookkeeping, tax, or client history.
          </p>
        </div>

        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Invoice payment terms explained</h2>
          <p className="text-base leading-7 text-muted-foreground">
            Payment terms tell the client when payment is expected. "Due on Receipt" means the invoice should be paid immediately. "Net 7" means payment is due seven days after the invoice date. "Net 15" and "Net 30" work the same way and are common for service businesses and business-to-business billing. The right choice depends on your cash flow, the relationship with the client, and the norms of your industry. Shorter terms usually help smaller businesses get paid faster, while longer terms are more common when working with larger organizations that have internal payment cycles.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            The important thing is consistency. If one client gets Net 30 and another gets Due on Receipt, that should be a conscious business decision rather than random invoice wording. Clear payment terms reduce ambiguity and help when follow-up is needed. They also make the due date field meaningful instead of optional decoration. For many freelancers and consultants, one of the easiest wins is to move from vague wording such as "please pay soon" to explicit invoice terms and dates.
          </p>
        </div>

        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Who this invoice maker is for</h2>
          <p className="text-base leading-7 text-muted-foreground">
            This invoice generator is especially useful for freelancers, consultants, contractors, agencies, and small businesses that want a simple invoice maker without the overhead of a full platform. If you invoice occasionally, need to send a clean document quickly, or want a free invoice generator with no sign-up and no watermark, this page fits that use case well. It is also a practical option for teams that already manage accounting elsewhere but still need a quick invoice draft or one-off PDF.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            It is not trying to replace full accounting software. Instead, it solves a narrower and more immediate job: create invoice documents quickly, calculate totals correctly, and hand the user a PDF they can send. That focus is part of the value proposition. Many invoice tools bury basic functionality behind onboarding, logos, plan limits, or branding restrictions. This page works best when speed, clarity, and direct output matter more than long-term bookkeeping automation.
          </p>
        </div>

        <div className="max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Download a clean PDF invoice without account friction</h2>
          <p className="text-base leading-7 text-muted-foreground">
            One of the biggest reasons users leave invoice tools is not missing math. It is friction. A lot of competing tools force sign-up before download, apply a watermark to the exported invoice, or present a design that looks more like a gated product trial than a usable document. This page is intentionally positioned differently. You can create the invoice, review it, and download a clean PDF from the browser without going through an account wall first.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            That matters because invoice creation is usually a task performed in a real operational moment: a freelancer needs to bill a client, a consultant needs to send an invoice after a workshop, or a small business needs a quick invoice while traveling or working from a lightweight device. In those moments, the fastest reliable tool wins. Making that benefit explicit on the page is not only good conversion messaging, it also aligns with how users actually search: free invoice generator, invoice maker, invoice generator no sign up, invoice PDF, and invoice generator no watermark.
          </p>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
