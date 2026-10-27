import type { Metadata } from "next";
import SaudiEosCalculator from "@/components/SaudiEosCalculator";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Saudi End of Service Calculator 2026 — EOSB (مكافأة نهاية الخدمة)",
  description:
    "Free Saudi end of service (EOSB) calculator under Labor Law Articles 84–88, as amended in 2025. Covers resignation, termination, contract expiry and Art. 87 exceptions.",
  keywords: [
    "saudi end of service calculator",
    "saudi end of service benefit calculator",
    "EOSB calculator saudi arabia",
    "end of service gratuity saudi arabia",
    "مكافأة نهاية الخدمة",
    "saudi labor law end of service",
    "how to calculate end of service in saudi arabia",
    "end of service benefit resignation saudi",
    "saudi gratuity calculator expat",
    "article 84 saudi labor law calculator",
  ],
  openGraph: {
    title: "Saudi End of Service Calculator 2026 — EOSB",
    description:
      "Calculate your Saudi Arabia end of service benefit (EOSB) under the Saudi Labor Law as amended in 2025, including the Article 85 resignation rules.",
    url: "https://findbest.tools/finance/saudi-end-of-service-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/saudi-end-of-service-calculator",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Saudi End of Service Benefit Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "SAR" },
  description:
    "Free Saudi Arabia end of service benefit (EOSB / مكافأة نهاية الخدمة) calculator under Saudi Labor Law Articles 84–88, as amended by Royal Decree M/44 (in force from 19 February 2025).",
  areaServed: "SA",
};

// ─── Content data ──────────────────────────────────────────────────

const RESIGNATION_TABLE = [
  { years: "Less than 2 years", entitlement: "No entitlement", factor: "0%", article: "Art. 85" },
  { years: "2 to 5 years", entitlement: "One-third (1/3)", factor: "33%", article: "Art. 85" },
  { years: "More than 5, less than 10", entitlement: "Two-thirds (2/3)", factor: "67%", article: "Art. 85" },
  { years: "10 years or more", entitlement: "Full benefit", factor: "100%", article: "Art. 85" },
];

const TERMINATION_TABLE = [
  { scenario: "Termination by employer (not under Art. 80)", entitlement: "Full benefit", factor: "100%", article: "Art. 84" },
  { scenario: "Fixed-term contract not renewed", entitlement: "Full benefit", factor: "100%", article: "Art. 84" },
  { scenario: "Retirement age reached", entitlement: "Full benefit", factor: "100%", article: "Art. 84" },
  { scenario: "Death or inability to work", entitlement: "Full benefit", factor: "100%", article: "Art. 84" },
  { scenario: "Worker leaves due to employer breach", entitlement: "Full benefit", factor: "100%", article: "Art. 81" },
  { scenario: "Leaving due to force majeure", entitlement: "Full benefit", factor: "100%", article: "Art. 87" },
  { scenario: "Woman — ends contract within 6 months of marriage", entitlement: "Full benefit", factor: "100%", article: "Art. 87" },
  { scenario: "Woman — ends contract within 3 months of childbirth", entitlement: "Full benefit", factor: "100%", article: "Art. 87" },
  { scenario: "Dismissal for misconduct grounds in Art. 80", entitlement: "No entitlement", factor: "0%", article: "Art. 80" },
  { scenario: "Contract ended during probation", entitlement: "No entitlement", factor: "0%", article: "Art. 54" },
];

const SOURCES = [
  { label: "HRSD — Labor Relations (current text of Articles 74–88, incl. 79 bis)", href: "https://www.hrsd.gov.sa/en/%D8%B9%D9%84%D8%A7%D9%82%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D9%85%D9%84" },
  { label: "HRSD — Awareness Guide on the Rights and Duties of Employers and Workers (2025)", href: "https://www.hrsd.gov.sa/sites/default/files/2025-12/awareness-guide-on-the-rights-and-duties-of-employers-and-workers---1-.pdf" },
  { label: "HRSD — Saudi Labor Law, English translation (Article 2 wage definitions)", href: "https://www.hrsd.gov.sa/sites/default/files/2023-02/Labor.pdf" },
];

const FAQS = [
  {
    q: "How is the end of service benefit calculated in Saudi Arabia?",
    a: "Under Article 84 of the Saudi Labor Law, the end of service award is half a month's wage for each of the first five years of service and one month's wage for each year after that, calculated on the last wage. Parts of a year count in proportion. For example, an employee whose last monthly wage is SAR 10,000 and who served exactly 7 years would have a full award of (5 × 5,000) + (2 × 10,000) = SAR 45,000. If they resigned after 7 years (more than 5 but under 10), Article 85 gives two-thirds: SAR 30,000.",
  },
  {
    q: "What is the end of service benefit for resignation in Saudi Arabia?",
    a: "Article 85 reduces the award when the employee resigns: less than 2 years of service — no award; 2 to 5 years — one-third; more than 5 but less than 10 years — two-thirds; 10 years or more — the full award. Article 87 makes the full award payable regardless of service if the worker leaves due to force majeure beyond their control, or if a female worker ends her contract within 6 months of her marriage contract or within 3 months of giving birth.",
  },
  {
    q: "Does end of service include housing and transport allowances?",
    a: "Article 84 calculates the award on the 'last wage', and Article 2 of the Labor Law defines 'wage' as the actual wage: the basic wage plus allowances and other increments due under the contract. In practice that means fixed allowances such as housing and transport normally form part of the calculation base. Article 86 lets the parties agree to exclude commissions, sales percentages and similar pay that naturally goes up and down. Check your contract and, if in doubt, ask HRSD or a Saudi labour lawyer.",
  },
  {
    q: "What did the 2025 Labor Law amendments change for end of service?",
    a: "Royal Decree M/44, in force from 19 February 2025, did not change the end of service formula in Article 84 or the resignation scale in Article 85. It did change how resignation works: resignation is now defined as a written, unconditional request by the worker, Article 79 bis treats it as accepted if the employer does not reply within 30 days (the employer may postpone acceptance by up to 60 days in writing), and the worker can withdraw it within 7 days if not yet accepted. Article 75 notice for indefinite contracts is now at least 30 days from the worker and 60 days from the employer.",
  },
  {
    q: "What is the difference between Article 84 and Article 85 of the Saudi Labor Law?",
    a: "Article 84 sets the end of service award itself: half a month's wage per year for the first five years and one month's wage per year after that, on the last wage. Article 85 applies only when the employment ends through the worker's resignation and pays a fraction of that award depending on years of service. When the employer terminates the contract (other than under Article 80), a fixed-term contract expires, or the worker reaches retirement age, the full Article 84 award is due.",
  },
  {
    q: "Do Saudi nationals and expatriates get the same end of service benefit?",
    a: "Yes. The Labor Law's end of service provisions (Articles 84–88) apply to workers covered by the law regardless of nationality, and the award is paid by the employer as part of the final settlement. GOSI social insurance is a separate system and does not replace the employer's end of service obligation under the Labor Law.",
  },
  {
    q: "When must my employer pay the end of service benefit, and can it be reduced?",
    a: "Article 88 requires the employer to pay wages and settle all entitlements within one week of the end of the employment relationship, or within two weeks if the worker ended the contract. The employer may deduct work-related debts owed to it from the worker's entitlements. If you believe your award has been withheld or reduced without a legal basis, you can raise a labour complaint with the Ministry of Human Resources and Social Development (HRSD).",
  },
  {
    q: "Is end of service benefit taxable in Saudi Arabia?",
    a: "Saudi Arabia does not levy personal income tax on individuals' employment income, so end of service benefits are not taxed in Saudi Arabia for Saudi nationals or expatriates. Expatriates should check whether their home country taxes foreign employment income when they return.",
  },
  {
    q: "What do I get if my employer terminates me without a valid reason?",
    a: "An employee dismissed other than under Article 80 receives the full Article 84 award, even with less than 2 years of service (the Article 85 reduction applies only to resignation). For an indefinite contract the employer must also give at least 60 days' written notice (Article 75). If the termination is for no legitimate reason and the contract does not set compensation, Article 77 provides 15 days' wage for each year of service for indefinite contracts, or the wage for the remaining term of a fixed-term contract, and not less than two months' wage. Outstanding wages and accrued leave must also be paid.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-stone-900 mb-4 mt-12">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-stone-800 mb-2 mt-6">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-4 text-[15px]">{children}</p>;
}

// ─── Page ──────────────────────────────────────────────────────────
export default function SaudiEosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Saudi Labor Law Arts. 84–88
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-2">
            Saudi End of Service Calculator
          </h1>
          <p className="text-lg text-stone-400 font-medium mb-3">مكافأة نهاية الخدمة</p>
          <p className="text-lg text-stone-500 leading-relaxed">
            Calculate your Saudi Arabia end of service benefit (EOSB) accurately under the
            Saudi Labor Law, including the 2025 amendments. Covers resignation, termination,
            contract expiry and the Article 87 exceptions, with the Article 85 resignation
            rules applied automatically.
          </p>
        </div>

        {/* Calculator */}
        <SaudiEosCalculator />

        {/* ── CONTENT ── */}

        <H2>What is the Saudi end of service benefit?</H2>
        <P>
          The end of service benefit (EOSB), known in Arabic as مكافأة نهاية الخدمة
          (mukāfaʾat nihāyat al-khidmah), is a statutory payment that every employer in
          Saudi Arabia is legally required to make to an employee upon the termination
          of their employment. It is governed by the Saudi Labor Law (Royal Decree
          No. M/51) and its amendments — including Royal Decree M/44, in force from
          19 February 2025 — specifically Articles 84 to 88.
        </P>
        <P>
          Unlike a pension or savings scheme, the EOSB is a lump sum paid by the employer,
          calculated on the length of service and the employee&apos;s last wage. The same
          statutory formula applies to workers covered by the Labor Law regardless of
          nationality — Saudi nationals and expatriates alike. GOSI social insurance is a
          separate system and does not replace the employer&apos;s end of service obligation.
        </P>

        <H2>EOSB calculation formula</H2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-stone-800 mb-3">First 5 years of service</p>
            <code className="block text-sm bg-white rounded-lg px-4 py-3 border border-stone-200 text-stone-700 font-mono mb-3">
              EOSB = Years × (Last Wage ÷ 2)
            </code>
            <p className="text-xs text-stone-500">½ month's salary for each completed year. Example: 4 years at SAR 8,000/month = SAR 16,000.</p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-stone-800 mb-3">After 5 years of service</p>
            <code className="block text-sm bg-white rounded-lg px-4 py-3 border border-stone-200 text-stone-700 font-mono mb-3">
              EOSB = (5 × Wage/2) + (Extra Years × Wage)
            </code>
            <p className="text-xs text-stone-500">1 full month's salary per year beyond 5. Example: 8 years at SAR 10,000 = SAR 25,000 + SAR 30,000 = SAR 55,000.</p>
          </div>
        </div>

        <P>
          Partial years are prorated based on the actual number of days in the incomplete
          year. The accrual rate for the partial year follows the same rule — half a month
          per year if total service is under 5 years, or a full month per year if total
          service exceeds 5 years. The calculation base is the last wage, which Article 2
          of the Labor Law defines as the actual wage — basic pay plus allowances such as
          housing and transport. Under Article 86, commissions and similar variable pay may
          be excluded from the base by agreement.
        </P>

        <H2>Resignation vs termination — the critical difference</H2>
        <P>
          The single most impactful variable in any Saudi end of service calculation is the
          reason for leaving. The Saudi Labor Law applies very different rules depending on
          whether the employee chose to leave or was required to leave.
        </P>

        <H3>Resignation (Article 85) — entitlement by years served</H3>
        <P>
          When an employee voluntarily resigns, the EOSB entitlement is scaled based on total
          years of service. This is one of the most frequently misunderstood aspects of Saudi
          employment law — many employees assume they are entitled to the full calculated
          amount, when in fact the resignation rules significantly reduce it for employees
          with fewer than 10 years of service.
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50 border border-green-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Years of service</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">EOSB entitlement</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">% of gross benefit</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Legal basis</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {RESIGNATION_TABLE.map((row) => (
                <tr key={row.years} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 font-medium text-stone-800 text-xs">{row.years}</td>
                  <td className="py-2.5 px-4 text-stone-600 text-xs">{row.entitlement}</td>
                  <td className="py-2.5 px-4 text-right text-xs">
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${row.factor === "0%" ? "bg-red-100 text-red-700" : row.factor === "100%" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {row.factor}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-stone-400 text-xs">{row.article}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>Termination and other departure scenarios (Articles 84, 81 and 87)</H3>
        <P>
          When employment ends for reasons other than resignation, the employee receives the
          full Article 84 award. This includes dismissal by the employer, expiry of a
          fixed-term contract that is not renewed, and reaching retirement age. A worker who
          leaves without notice under Article 81 because the employer breached its
          obligations keeps all statutory rights. No award is due on dismissal under
          Article 80 — for grounds such as assault, forgery, or absence of more than 30 days
          in a contract year or 15 consecutive days without a valid reason after a written
          warning — or when the contract ends during probation (Article 54).
        </P>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50 border border-green-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Scenario</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Entitlement</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">% of benefit</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Legal basis</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {TERMINATION_TABLE.map((row) => (
                <tr key={row.scenario} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 text-stone-700 text-xs">{row.scenario}</td>
                  <td className="py-2.5 px-4 text-stone-600 text-xs">{row.entitlement}</td>
                  <td className="py-2.5 px-4 text-right text-xs">
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${row.factor === "0%" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {row.factor}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-stone-400 text-xs">{row.article}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>What changed with the 2025 Labor Law amendments</H2>
        <P>
          Royal Decree M/44 amended the Labor Law with effect from 19 February 2025. The end
          of service formula (Article 84), the resignation scale (Article 85) and the
          Article 87 exceptions were not changed. The amendments did change the resignation
          process: resignation is now defined as a written request by the worker, made
          without coercion or conditions. Under Article 79 bis it is treated as accepted if
          the employer does not respond within 30 days; the employer may postpone acceptance
          by up to 60 days with a written reason, and the worker may withdraw it within 7
          days if it has not been accepted. For indefinite contracts, Article 75 notice is now
          at least 30 days when the worker ends the contract and 60 days when the employer
          does.
        </P>

        <H2>Getting paid</H2>
        <P>
          The employer must settle wages and all entitlements, including the end of service
          award, within one week of the contract ending — or within two weeks if the worker
          ended the contract (Article 88). The employer may deduct work-related debts owed to
          it. If your award is not paid, you can raise a labour complaint with the Ministry
          of Human Resources and Social Development (HRSD).
        </P>

        <H2>Frequently asked questions</H2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group border border-stone-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5 text-sm font-medium text-stone-800 list-none select-none hover:bg-stone-50">
                {faq.q}
                <span className="text-stone-400 ml-3 flex-shrink-0 group-open:rotate-45 transition-transform duration-150">+</span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This calculator follows
            the Saudi Labor Law as amended, including Royal Decree M/44 (in force from
            19 February 2025). It is provided for informational purposes only and does not
            constitute legal advice. Contract terms more favourable to the worker, company
            policies and court rulings on specific facts (for example, how a mutual-agreement
            termination is treated) can change the result. For disputes or complex cases,
            consult a licensed Saudi labour lawyer or contact the Ministry of Human Resources
            and Social Development (HRSD).
          </p>
        </div>

        <div className="mt-6 p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-sm font-semibold text-stone-800 mb-2">Sources &amp; last checked</p>
          <ul className="space-y-1.5 mb-3">
            {SOURCES.map((src) => (
              <li key={src.href} className="text-xs leading-relaxed">
                <a href={src.href} target="_blank" rel="noopener noreferrer" className="text-green-700 underline hover:text-green-800">
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-stone-500">Last checked: October 2026</p>
        </div>

        {/* Related Tools */}
        <div className="mt-20 border-t border-stone-100 pt-12">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/saudi-end-of-service-calculator" />
        </div>

      </main>
    </>
  );
}
