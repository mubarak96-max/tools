import { Metadata } from "next";
import SalesTaxCAClient from "./SalesTaxCAClient";

export const metadata: Metadata = {
  title: "California Sales Tax Calculator 2026 | Sales Tax by City & County",
  description:
    "Free California sales tax calculator for 2026. Look up sales tax rates for any CA city or county — from Los Angeles (10.25%) to San Francisco (8.625%) to San Diego (7.75%). Includes reverse tax calculator, tax breakdown, and exemption guide.",
  keywords: [
    "sales tax california calculator",
    "california sales tax calculator",
    "california sales tax rate 2026",
    "california sales tax by city",
    "california sales tax by county",
    "los angeles sales tax calculator",
    "san francisco sales tax calculator",
    "san diego sales tax calculator",
    "california state sales tax rate",
    "how much is sales tax in california",
    "ca sales tax calculator",
    "california sales tax lookup",
    "reverse sales tax calculator california",
    "california sales tax exemptions",
    "california use tax calculator",
    "sales tax calculator with city",
    "california sales tax on cars",
    "california sales tax on food",
    "california sales tax rate by zip code",
    "what is california sales tax",
  ].join(", "),
  openGraph: {
    title: "California Sales Tax Calculator 2026 — By City & County",
    description:
      "Instantly calculate California sales tax for any city. Includes city + county + state breakdown, reverse calculator, and full exemption guide.",
    url: "https://findbest.tools/finance/sales-tax-california-calculator",
    siteName: "FindBest Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "California Sales Tax Calculator | FindBest Tools",
    description:
      "Calculate CA sales tax by city or county. Covers all 58 counties and 500+ cities with 2026 rates.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/sales-tax-california-calculator",
  },
};

export default function SalesTaxCAPage() {
  return <SalesTaxCAClient />;
}
