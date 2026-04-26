import type { Metadata } from "next";
import SaudiEosCalculator from "@/components/SaudiEosCalculator";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Saudi End of Service Calculator — EOSB 2024 (مكافأة نهاية الخدمة)",
  description:
    "Free Saudi Arabia end of service benefit calculator. Accurate EOSB calculation per Saudi Labor Law Articles 84–88. Covers resignation, termination, and contract expiry for Saudi and non-Saudi employees.",
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
    title: "Saudi End of Service Calculator — EOSB 2024",
    description:
      "Calculate your Saudi Arabia end of service benefit (EOSB) accurately under Saudi Labor Law. Covers all departure reasons and includes the resignation reduction rules.",
    url: "https://yourdomain.com/saudi-end-of-service-calculator",
  },
  alternates: {
    canonical: "https://yourdomain.com/saudi-end-of-service-calculator",
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
    "Free Saudi Arabia end of service benefit (EOSB / مكافأة نهاية الخدمة) calculator under Saudi Labor Law Articles 84–88.",
  areaServed: "SA",
};

// ─── Content data ──────────────────────────────────────────────────

const RESIGNATION_TABLE = [
  { years: "Less than 2 years", entitlement: "No entitlement", factor: "0%", article: "Art. 84" },
  { years: "2 to less than 5", entitlement: "One-third (1/3)", factor: "33%", article: "Art. 84" },
  { years: "5 to less than 10", entitlement: "Two-thirds (2/3)", factor: "67%", article: "Art. 84" },
  { years: "10 years or more", entitlement: "Full benefit", factor: "100%", article: "Art. 84" },
];

const TERMINATION_TABLE = [
  { scenario: "Termination by employer (without cause)", entitlement: "Full benefit", factor: "100%", article: "Art. 85" },
  { scenario: "Fixed-term contract not renewed", entitlement: "Full benefit", factor: "100%", article: "Art. 85" },
  { scenario: "Retirement", entitlement: "Full benefit", factor: "100%", article: "Art. 85" },
  { scenario: "Death or permanent disability", entitlement: "Full benefit", factor: "100%", article: "Art. 85" },
  { scenario: "Termination for gross misconduct (Art. 80)", entitlement: "No entitlement", factor: "0%", article: "Art. 80" },
  { scenario: "Woman — resignation within 6 months of marriage", entitlement: "Full benefit", factor: "100%", article: "Art. 84 (exception)" },
  { scenario: "Woman — resignation within 3 months of childbirth", entitlement: "Full benefit", factor: "100%", article: "Art. 84 (exception)" },
];

const FAQS = [
  {
    q: "How is the end of service benefit calculated in Saudi Arabia?",
    a: "The Saudi end of service benefit (EOSB) is calculated based on the employee's last drawn basic salary and their total length of service. The accrual rate is half a month's salary per year for the first five years, and one full month's salary per year for each year beyond five. For example, an employee earning SAR 10,000 per month who served exactly 7 years would receive: (5 × 5,000) + (2 × 10,000) = SAR 45,000 gross. If they resigned voluntarily after 7 years (between 5 and 10 years), two-thirds of SAR 45,000 = SAR 30,000 would be payable. Partial years are prorated based on the number of days in the incomplete year.",
  },
  {
    q: "What is the end of service benefit for resignation in Saudi Arabia?",
    a: "Employees who voluntarily resign receive a reduced end of service benefit under Article 84 of the Saudi Labor Law. The reduction depends on total years of service: less than 2 years — no entitlement; 2 to 5 years — one-third of the calculated benefit; 5 to 10 years — two-thirds of the calculated benefit; 10 or more years — full benefit. There are two important exceptions: a woman who resigns within 6 months of her marriage, or within 3 months of childbirth, is entitled to the full benefit regardless of how many years she has served.",
  },
  {
    q: "Does end of service include housing and transport allowances?",
    a: "Under the standard provisions of the Saudi Labor Law, the EOSB is calculated on the basic salary only — not on the total package. Housing allowances, transport allowances, commission, bonuses, and other benefits are excluded from the calculation base unless the employment contract or company policy explicitly states that these components should be included. Always refer to your employment contract. If your contract states that EOSB is based on your 'total salary' or lists specific allowances as part of the calculation base, those amounts should be added.",
  },
  {
    q: "What is the difference between Article 84 and Article 85 of the Saudi Labor Law?",
    a: "Article 84 governs situations where the employee chooses to leave — voluntary resignation and mutual agreement. It applies a sliding reduction scale based on years of service. Article 85 governs situations where the employment ends due to the employer's action or circumstances outside the employee's choice — termination by the employer, expiry of a fixed-term contract, retirement, and death or disability. Under Article 85, the employee receives the full calculated benefit with no reduction, regardless of how many years they have served.",
  },
  {
    q: "What happens to my end of service if I am a Saudi national enrolled in GOSI?",
    a: "Saudi nationals who are enrolled in GOSI (General Organisation for Social Insurance) have their end of service benefit handled through the Muʿāwadha (معاوضة) programme, introduced as part of the Vision 2030 labour reforms. Rather than the employer maintaining a provision for EOSB, contributions are made to GOSI on the employee's behalf. Upon leaving employment, the EOSB is paid through GOSI rather than directly by the employer. The statutory calculation formula remains the same — the mechanism of collection and payment changes. Non-Saudi (expatriate) employees remain under the traditional direct employer obligation.",
  },
  {
    q: "Can my employer deduct money from my end of service benefit?",
    a: "Saudi Labor Law limits what can be deducted from an EOSB. Employers may deduct amounts owed by the employee such as outstanding salary advances, documented loans provided by the employer, damages established by a court or official body, and certain other specific amounts. An employer cannot unilaterally reduce the EOSB for reasons such as performance, notice period violations, or general 'damages' without legal basis. If an employee believes their EOSB has been wrongfully reduced, they can file a complaint with the Ministry of Human Resources and Social Development.",
  },
  {
    q: "Is end of service benefit taxable in Saudi Arabia?",
    a: "Saudi Arabia does not levy personal income tax on wages or employment benefits for individuals. End of service benefits are therefore not subject to income tax for employees working in Saudi Arabia, whether Saudi nationals or expatriates. The EOSB is paid gross with no tax deductions at source. However, expatriates should check whether their home country taxes foreign-sourced income on their return — some countries tax worldwide income regardless of where it was earned.",
  },
  {
    q: "What is the end of service benefit for an employee terminated without cause?",
    a: "An employee who is dismissed by their employer without cause (i.e., not under Article 80 for gross misconduct) is entitled to the full calculated EOSB under Article 85, regardless of how long they have served — even if they served less than 2 years. In addition, they are entitled to a notice period payment (or payment in lieu of notice), which is at least 60 days' salary for indefinite contracts. The employer must also pay all outstanding wages, accrued vacation pay, and any other contractual entitlements.",
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
            Saudi Labor Law. Covers all departure reasons — resignation, termination, and
            contract expiry — with the correct reduction rules applied automatically.
            Accurate for both Saudi nationals and expatriate employees.
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
          of their employment. It is governed by the Saudi Labor Law under Royal Decree
          No. M/51 and its amendments, specifically Articles 84 to 88.
        </P>
        <P>
          Unlike a pension or savings scheme, the EOSB is a lump sum payment calculated
          purely on the length of service and the employee's last basic salary. It applies
          to all private sector employees in Saudi Arabia regardless of nationality —
          Saudi nationals, Gulf Cooperation Council (GCC) nationals, and third-country
          nationals (expatriates) are all entitled to EOSB under the same statutory formula.
          The mechanism of payment differs for Saudi nationals enrolled in the GOSI
          Muʿāwadha programme, but the underlying calculation is identical.
        </P>

        <H2>EOSB calculation formula</H2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-stone-800 mb-3">First 5 years of service</p>
            <code className="block text-sm bg-white rounded-lg px-4 py-3 border border-stone-200 text-stone-700 font-mono mb-3">
              EOSB = Years × (Basic Salary ÷ 2)
            </code>
            <p className="text-xs text-stone-500">½ month's salary for each completed year. Example: 4 years at SAR 8,000/month = SAR 16,000.</p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-stone-800 mb-3">After 5 years of service</p>
            <code className="block text-sm bg-white rounded-lg px-4 py-3 border border-stone-200 text-stone-700 font-mono mb-3">
              EOSB = (5 × Salary/2) + (Extra Years × Salary)
            </code>
            <p className="text-xs text-stone-500">1 full month's salary per year beyond 5. Example: 8 years at SAR 10,000 = SAR 25,000 + SAR 30,000 = SAR 55,000.</p>
          </div>
        </div>

        <P>
          Partial years are prorated based on the actual number of days in the incomplete
          year. The accrual rate for the partial year follows the same rule — half a month
          per year if total service is under 5 years, or a full month per year if total
          service exceeds 5 years. The calculation base is the last drawn basic salary —
          not the total compensation package — unless the employment contract explicitly
          states otherwise.
        </P>

        <H2>Resignation vs termination — the critical difference</H2>
        <P>
          The single most impactful variable in any Saudi end of service calculation is the
          reason for leaving. The Saudi Labor Law applies very different rules depending on
          whether the employee chose to leave or was required to leave.
        </P>

        <H3>Resignation (Article 84) — entitlement by years served</H3>
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

        <H3>Termination and other departure scenarios (Article 85)</H3>
        <P>
          When employment ends for reasons other than voluntary resignation, the employee
          generally receives the full calculated benefit. This includes dismissal by the
          employer without cause, expiry of a fixed-term contract that is not renewed, and
          retirement. The only exception is termination for gross misconduct under Article 80
          — the specific grounds listed in that article (such as assault, theft, or
          abandonment of work for 20+ days) — which can result in forfeiture of the EOSB.
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

        <H2>Important notes for expatriate employees</H2>
        <P>
          Expatriate (non-Saudi) employees make up a large portion of the Saudi private
          sector workforce. Their EOSB rights are identical to those of Saudi nationals
          under the Labor Law — the same calculation formula, the same resignation
          reduction rules, and the same termination protections apply. The key practical
          difference is that expatriate employees must receive their EOSB directly from
          their employer, rather than through GOSI.
        </P>
        <P>
          Employers are required by law to maintain sufficient reserves to cover EOSB
          obligations to expatriate staff. If an employer fails to pay the EOSB on
          termination of employment, the employee can file a labour complaint with the
          Ministry of Human Resources and Social Development (MHRSD) through the Musaned
          portal or directly at a labour office. Saudi Arabia has significantly strengthened
          enforcement of wage and EOSB obligations in recent years, including through the
          Wage Protection System (WPS).
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
            <strong className="text-stone-700">Disclaimer:</strong> This calculator is based
            on the Saudi Labor Law as amended and publicly available interpretations as of
            2024. It is provided for informational purposes only and does not constitute
            legal advice. Individual employment contracts, company policies, collective
            agreements, and GOSI programme rules may alter the calculation. The GOSI
            Muʿāwadha programme rules for Saudi nationals are subject to change. For
            disputes or complex cases, consult a licensed Saudi labour lawyer or contact
            the Ministry of Human Resources and Social Development (MHRSD).
          </p>
        </div>

      </main>
    </>
  );
}
