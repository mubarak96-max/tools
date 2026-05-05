import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import UkSeveranceCalculatorClient from "./UkSeveranceCalculatorClient";

const PAGE_PATH = "/finance/uk-severance-pay-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const revalidate = 43_200;

export const metadata: Metadata = {
  ...buildMetadata({
    title: "UK Severance Pay Calculator | Statutory Redundancy and Notice Pay",
    description:
      "Estimate UK statutory redundancy pay, notice entitlement, PILON treatment, and approximate tax using current statutory redundancy inputs.",
    path: PAGE_PATH,
  }),
  keywords: [
    "uk severance pay calculator",
    "uk redundancy pay calculator",
    "statutory redundancy pay calculator",
    "pilon calculator uk",
  ],
};

function buildSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": PAGE_URL,
        url: PAGE_URL,
        name: "UK Severance Pay Calculator",
      },
      {
        "@type": "SoftwareApplication",
        name: "UK Severance Pay Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
        url: PAGE_URL,
      },
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Finance", path: "/finance" },
        { name: "UK Severance Pay Calculator", path: PAGE_PATH },
      ]),
    ],
  };
}

export default function UkSeverancePayCalculatorPage() {
  return (
    <>
      <JsonLd data={serializeJsonLd(buildSchema())} />
      <div className="space-y-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">UK Severance Pay Calculator</li>
          </ol>
        </nav>

        <UkSeveranceCalculatorClient />

        <div className="border-t border-border/70 pt-10">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
        </div>
      </div>
    </>
  );
}
