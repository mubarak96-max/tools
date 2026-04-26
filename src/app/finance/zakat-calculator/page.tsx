import type { Metadata } from "next";
import ZakatCalculatorClient from "@/components/ZakatCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Zakat Calculator 2024 — Calculate Zakat on Gold, Savings & Investments",
  description:
    "Free online zakat calculator. Calculate zakat on gold, silver, savings, salary, business inventory and investments. Up-to-date nisab threshold. Trusted by Muslims worldwide.",
  keywords: [
    "zakat calculator",
    "zakat on gold calculator",
    "zakat nisab 2024",
    "zakat on savings",
    "zakat on salary calculator",
    "calculate zakat al mal",
    "zakat percentage",
    "zakat silver nisab",
    "how to calculate zakat",
  ],
  openGraph: {
    title: "Zakat Calculator 2024",
    description: "Free online zakat calculator. Calculate zakat on gold, silver, savings, salary, business inventory and investments.",
    url: "https://findbest.tools/finance/zakat-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/zakat-calculator",
  },
};

export default function ZakatCalculatorPage() {
  return (
    <main className="bg-[#0e1a0e] min-h-screen">
      <ZakatCalculatorClient />
      
      <div className="max-w-[1160px] mx-auto px-5 pb-20">
        {/* Related Tools */}
        <div className="mt-12 border-t border-[#2a4a2a] pt-12">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/zakat-calculator" />
        </div>
      </div>
    </main>
  );
}
