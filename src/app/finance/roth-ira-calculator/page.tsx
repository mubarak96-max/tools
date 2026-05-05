import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import RothIraCalculatorClient from "./RothIraCalculatorClient";

const PAGE_PATH = "/finance/roth-ira-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const revalidate = 43_200;

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Roth IRA Calculator 2026 | Tax-Free Growth and Income Eligibility",
    description:
      "Calculate 2026 Roth IRA balances, income eligibility, and Roth versus traditional IRA outcomes with current IRS contribution limits.",
    path: PAGE_PATH,
  }),
  keywords: [
    "roth ira calculator",
    "roth ira calculator 2026",
    "roth ira contribution limit 2026",
    "roth ira income limits 2026",
    "roth vs traditional ira calculator",
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
        name: "Roth IRA Calculator 2026",
      },
      {
        "@type": "SoftwareApplication",
        name: "Roth IRA Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: PAGE_URL,
      },
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Finance", path: "/finance" },
        { name: "Roth IRA Calculator", path: PAGE_PATH },
      ]),
    ],
  };
}

export default function RothIraCalculatorPage() {
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
            <li className="font-medium text-foreground">Roth IRA Calculator</li>
          </ol>
        </nav>

        <RothIraCalculatorClient />

        <div className="border-t border-border/70 pt-10">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
        </div>
      </div>
    </>
  );
}
