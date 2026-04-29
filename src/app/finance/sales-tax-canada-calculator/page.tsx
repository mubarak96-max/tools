import { Metadata } from "next";
import SalesTaxCANClient from "./SalesTaxCANClient";

export const metadata: Metadata = {
  title: "Canada Sales Tax Calculator 2026 | GST HST PST by Province",
  description:
    "Free Canada sales tax calculator for 2026. Calculate GST, HST, and PST for all 13 provinces and territories — Ontario (13% HST), Quebec (14.975% GST+QST), BC (12% GST+PST), Alberta (5% GST) and more. Includes reverse tax calculator and full guide.",
  keywords: [
    "canada sales tax calculator",
    "canadian sales tax calculator",
    "gst hst pst calculator canada",
    "sales tax canada",
    "canada sales tax by province",
    "ontario sales tax calculator",
    "quebec sales tax calculator",
    "bc sales tax calculator",
    "alberta sales tax calculator",
    "hst calculator canada",
    "gst calculator canada",
    "pst calculator canada",
    "qst calculator quebec",
    "canada sales tax rate 2026",
    "canadian gst hst rates 2026",
    "reverse gst hst calculator",
    "how much is gst in canada",
    "how much is hst in ontario",
    "nova scotia hst 2025",
    "canada sales tax exemptions",
  ].join(", "),
  openGraph: {
    title: "Canada Sales Tax Calculator 2026 — GST, HST & PST by Province",
    description:
      "Calculate GST, HST, and PST for every Canadian province and territory. Includes reverse calculator, province comparison, tax breakdowns, and 2025 rate updates.",
    url: "https://findbest.tools/finance/sales-tax-canada-calculator",
    siteName: "FindBest Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Canada Sales Tax Calculator | GST HST PST 2026",
    description:
      "Instantly calculate Canadian sales tax (GST/HST/PST/QST) for all 13 provinces and territories. 2026 rates including Nova Scotia's April 2025 cut to 14%.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/sales-tax-canada-calculator",
  },
};

export default function SalesTaxCANPage() {
  return <SalesTaxCANClient />;
}
