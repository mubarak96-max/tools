import type { Metadata } from "next";
import Link from "next/link";
import CarLoanCalculator from "./CarLoanCalculator";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/finance/car-loan-emi-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Car Loan EMI Calculator 2026 | Interest by Credit Score & Amortization",
  description: "Free car loan EMI calculator with 2026 rates by credit score. Calculate exact monthly payments, total interest, and full amortization schedule. No sign-up.",
  keywords: [
    "car loan calculator",
    "auto loan EMI calculator",
    "car payment calculator 2026",
    "car loan interest rate by credit score",
    "car loan amortization schedule",
    "monthly car payment formula",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Car Loan EMI Calculator 2026 | Visual Amortization & Credit Rates",
    description: "Model your car loan with precision. Includes 2026 APR estimates by credit score, sales tax, and dealer fees.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Loan EMI Calculator 2026",
    description: "Calculate your monthly car payment and see the full cost breakdown instantly.",
  },
};

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4 px-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/finance" className="hover:text-primary">
                Finance
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Car Loan EMI Calculator</li>
          </ol>
        </nav>
      </section>

      <CarLoanCalculator />
    </div>
  );
}
