import type { Metadata } from "next";
import InvoiceGeneratorClient from "@/app/finance/invoice-generator/components/InvoiceGeneratorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Free Invoice Generator with VAT, GST & HST | Create Professional Invoices Online",
  description:
    "Free online invoice generator with automatic VAT, GST and HST calculation. Create professional invoices for UK, Australia, Canada, USA and more. Download as PDF instantly.",
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
    "invoice with VAT",
    "UK VAT invoice generator",
    "VAT invoice maker",
    "Australia GST invoice generator",
    "Canada HST invoice generator",
    "Canada GST invoice maker",
    "GST invoice template free",
    "HST invoice free",
    "New Zealand GST invoice",
    "Singapore GST invoice",
    "invoice generator with tax",
    "auto VAT calculator invoice",
  ],
  alternates: { canonical: "https://findbest.tools/finance/invoice-generator" },
  openGraph: {
    type: "website",
    url: "https://findbest.tools/finance/invoice-generator",
    title: "Free Invoice Generator with VAT, GST & HST | Create Professional Invoices Online",
    description:
      "Free online invoice generator with automatic VAT, GST and HST calculation. Create professional invoices for UK, Australia, Canada, USA and more. Download as PDF instantly.",
  },
};

export default function InvoiceGeneratorPage() {
  return (
    <>
      <InvoiceGeneratorClient />
      
      {/* Container for Related Tools with consistent background if needed */}
      <div style={{ background: "#f4f3ef", paddingBottom: "60px", paddingTop: "20px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 40px" }}>
          <div style={{ borderTop: "1px solid #e2e0da", paddingTop: "40px" }}>
            <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/invoice-generator" />
          </div>
        </div>
      </div>
    </>
  );
}
