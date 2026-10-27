import type { Metadata } from "next";
import ZakatCalculatorClient from "@/components/ZakatCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Zakat Calculator — Calculate Zakat on Gold, Savings & Investments",
  description:
    "Free zakat calculator for gold, silver, savings, salary, business stock and investments. Nisab worked out from today's gold or silver price at 2.5%.",
  keywords: [
    "zakat calculator",
    "zakat on gold calculator",
    "zakat nisab",
    "zakat on savings",
    "zakat on salary calculator",
    "calculate zakat al mal",
    "zakat percentage",
    "zakat silver nisab",
    "how to calculate zakat",
  ],
  openGraph: {
    title: "Zakat Calculator — Gold, Silver, Savings & Investments",
    description: "Free online zakat calculator. Calculate zakat on gold, silver, savings, salary, business inventory and investments using today's nisab.",
    url: "https://findbest.tools/finance/zakat-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/zakat-calculator",
  },
};

const SOURCES = [
  { label: "National Zakat Foundation — nisab values updated daily (87.48 g / 612.36 g)", href: "https://nzf.org.uk/nisab" },
  { label: "Qatar Charity — fatwa on the nisab of gold (85 g) and silver (595 g) and the 2.5% rate", href: "https://qcharity.org/en/qa/zakat/fatwa/details?Sid=12193" },
  { label: "Quran, Surah At-Tawbah 9:60 — the eight categories of zakat recipients", href: "https://quran.com/9/60" },
];

export default function ZakatCalculatorPage() {
  return (
    <main className="bg-[#0e1a0e] min-h-screen">
      <ZakatCalculatorClient />

      <div className="max-w-[1160px] mx-auto px-5 pb-20">
        <div className="mt-4 rounded-[14px] border border-[#2a4a2a] bg-[#1a2e1a] p-6">
          <p className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#c9a84c]">Sources &amp; last checked</p>
          <ul className="mb-3 space-y-2">
            {SOURCES.map((src) => (
              <li key={src.href} className="text-sm leading-relaxed">
                <a href={src.href} target="_blank" rel="noopener noreferrer" className="text-[#e8c97a] underline hover:text-[#c9a84c]">
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#7a9a7a]">Last checked: October 2026</p>
        </div>

        {/* Related Tools */}
        <div className="mt-12 border-t border-[#2a4a2a] pt-12">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/zakat-calculator" />
        </div>
      </div>
    </main>
  );
}
