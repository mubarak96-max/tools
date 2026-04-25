import type { Metadata } from "next";
import CanadaTaxCalculator from "./components/CanadaTaxCalculator";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Canada HST/GST Calculator — All Provinces 2026",
  description:
    "Free Canada HST GST PST QST calculator for all provinces and territories. Add tax or reverse calculate. Accurate 2026 rates for Ontario, BC, Quebec, Alberta and all provinces.",
  keywords: [
    "canada hst gst calculator",
    "canada gst calculator",
    "hst calculator ontario",
    "canada sales tax calculator",
    "how to calculate hst in canada",
    "gst hst pst calculator",
    "reverse hst calculator canada",
    "quebec qst calculator",
    "bc gst pst calculator",
    "alberta gst calculator",
    "how much is hst in ontario",
    "canada tax calculator all provinces",
    "how to calculate gst in canada",
  ],
  openGraph: {
    title: "Canada HST/GST Calculator — All Provinces 2026",
    description:
      "Add or remove HST, GST, PST, and QST for every Canadian province and territory. Free, accurate, instant.",
    url: "https://findbest.tools/finance/canada-hst-gst-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/canada-hst-gst-calculator",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Canada HST GST Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
  description:
    "Free Canada HST/GST/PST/QST calculator for all provinces. Add tax to a price or reverse-calculate the tax included in a price.",
  areaServed: "CA",
};

// ─── Content data ──────────────────────────────────────────────────

const PROVINCE_TABLE = [
  { province: "Ontario",                   code: "ON", type: "HST",       rate: "13%",     components: "5% GST + 8% provincial" },
  { province: "New Brunswick",             code: "NB", type: "HST",       rate: "15%",     components: "5% GST + 10% provincial" },
  { province: "Nova Scotia",               code: "NS", type: "HST",       rate: "15%",     components: "5% GST + 10% provincial" },
  { province: "Newfoundland & Labrador",   code: "NL", type: "HST",       rate: "15%",     components: "5% GST + 10% provincial" },
  { province: "Prince Edward Island",      code: "PE", type: "HST",       rate: "15%",     components: "5% GST + 10% provincial" },
  { province: "British Columbia",          code: "BC", type: "GST + PST", rate: "12%",     components: "5% GST + 7% PST" },
  { province: "Saskatchewan",             code: "SK", type: "GST + PST", rate: "11%",     components: "5% GST + 6% PST" },
  { province: "Manitoba",                  code: "MB", type: "GST + RST", rate: "12%",     components: "5% GST + 7% RST" },
  { province: "Quebec",                    code: "QC", type: "GST + QST", rate: "14.975%", components: "5% GST + 9.975% QST" },
  { province: "Alberta",                   code: "AB", type: "GST only",  rate: "5%",      components: "No provincial tax" },
  { province: "Yukon",                     code: "YT", type: "GST only",  rate: "5%",      components: "No provincial tax" },
  { province: "Northwest Territories",     code: "NT", type: "GST only",  rate: "5%",      components: "No provincial tax" },
  { province: "Nunavut",                   code: "NU", type: "GST only",  rate: "5%",      components: "No provincial tax" },
];

const FAQS = [
  {
    q: "How do I calculate HST in Canada?",
    a: "To calculate HST in Canada, multiply the pre-tax price by the HST rate for your province. In Ontario, where HST is 13%, a $100 item costs $113 with tax. The formula is: Total = Price × (1 + HST rate). For Ontario: $100 × 1.13 = $113.00. To find just the tax amount: Tax = Price × HST rate. In Ontario: $100 × 0.13 = $13.00. Our calculator handles this automatically for all provinces — just enter your amount and select your province.",
  },
  {
    q: "How do I reverse calculate HST in Canada (remove HST from a price)?",
    a: "To reverse-calculate HST — that is, find the pre-tax amount inside a tax-inclusive price — divide the total by (1 + HST rate). In Ontario at 13%: Pre-tax = Total ÷ 1.13. So if you paid $113 for something, the pre-tax amount was $113 ÷ 1.13 = $100, and the HST was $13. Use the 'Remove tax' mode in the calculator above to do this instantly for any province.",
  },
  {
    q: "How much is HST in Ontario?",
    a: "HST in Ontario is 13%. It is a harmonized tax that combines the 5% federal GST and an 8% Ontario provincial portion into a single 13% rate, collected together. Ontario joined the HST system in 2010, replacing its previous 8% Retail Sales Tax (RST). On a $100 purchase, you pay $13 in HST — $5.38 of which is the federal portion and $7.62 is the provincial portion (these exact proportions are set by the federal-provincial agreement).",
  },
  {
    q: "What is the difference between GST, HST, PST, and QST?",
    a: "GST (Goods and Services Tax) is Canada's 5% federal sales tax, applied in every province. HST (Harmonized Sales Tax) is used in provinces that merged their provincial sales tax with the federal GST into one combined rate — Ontario (13%), New Brunswick, Nova Scotia, Newfoundland, and PEI (all 15%). PST (Provincial Sales Tax) is a separate provincial tax charged on top of GST in BC (7%), Saskatchewan (6%), and Manitoba (7%). QST (Quebec Sales Tax) is Quebec's provincial tax at 9.975%, also charged on top of GST, making Quebec's total rate 14.975%.",
  },
  {
    q: "Which Canadian province has no sales tax?",
    a: "Alberta is the only Canadian province with no provincial sales tax. Residents and businesses in Alberta pay only the 5% federal GST — there is no PST, RST, or HST. This makes Alberta the most tax-friendly province for consumers from a sales tax perspective. The three territories — Yukon, Northwest Territories, and Nunavut — also have no territorial sales tax, meaning they too only charge the 5% federal GST.",
  },
  {
    q: "How is Quebec's QST different from other provinces?",
    a: "Quebec's tax system is unique in two ways. First, Quebec uses the QST (Quebec Sales Tax) at 9.975% rather than merging with the federal HST system, so GST and QST are administered separately (QST is administered by Revenu Québec, not the CRA). Second, QST is calculated on the pre-GST amount — not stacked on top of GST — which means the effective combined rate is 14.975% (5% + 9.975%) rather than a higher compounded rate. Businesses operating in Quebec must register separately for both GST (with CRA) and QST (with Revenu Québec) once they exceed the registration thresholds.",
  },
  {
    q: "What is the GST/HST registration threshold in Canada?",
    a: "Businesses must register for GST/HST if their total taxable revenues exceed $30,000 in a single calendar quarter or over four consecutive quarters. This threshold applies to most businesses — once you pass it, you must charge and remit GST or HST, and you can also claim input tax credits (ITCs) on business purchases. Below $30,000, registration is optional (you can voluntarily register to claim ITCs even before hitting the threshold). Quebec's QST registration threshold is similarly $30,000, but registered separately with Revenu Québec.",
  },
  {
    q: "Are there items exempt from GST/HST in Canada?",
    a: "Yes. Many essential goods are zero-rated (taxed at 0%) or exempt from GST/HST. Zero-rated supplies include: basic groceries (most unprocessed foods), prescription drugs, medical devices, farming equipment, and most exports. Exempt supplies (on which no GST/HST is charged and no input tax credits can be claimed) include: residential rent, most health care services, childcare services, educational services, and most financial services. Individual provinces may also exempt specific items from their PST that are still subject to GST.",
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
export default function CanadaHstGstCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            All 13 provinces & territories · 2026 rates · Free
          </div>
          <h1 className="text-4xl font-bold text-stone-900 leading-tight mb-3">
            Canada HST / GST Calculator
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            Calculate GST, HST, PST, and QST for every Canadian province and territory.
            Add tax to a pre-tax price, or use reverse mode to extract the tax from a
            tax-inclusive amount. Accurate 2026 rates, updated for all provinces.
          </p>
        </div>

        {/* Calculator */}
        <CanadaTaxCalculator />

        {/* ── CONTENT ── */}

        <H2>Canada sales tax rates by province (2026)</H2>
        <P>
          Canada's sales tax system is one of the most varied in the world. Depending on
          which province or territory you're in, you could be dealing with HST (a single
          harmonized federal-provincial tax), a combination of GST and PST charged separately,
          Quebec's unique GST + QST system, or simply the 5% federal GST on its own.
          Here is the complete rate table for every province and territory:
        </P>

        {/* Province table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-red-50 border border-red-100">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Province / Territory</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Tax type</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-600">Total rate</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-600">Components</th>
              </tr>
            </thead>
            <tbody className="border border-stone-200">
              {PROVINCE_TABLE.map((row) => (
                <tr key={row.code} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="py-2.5 px-4 font-medium text-stone-800 text-xs">
                    {row.province}
                    <span className="ml-1.5 text-stone-400 font-normal">({row.code})</span>
                  </td>
                  <td className="py-2.5 px-4 text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      row.type === "HST" ? "bg-blue-100 text-blue-700" :
                      row.type.includes("PST") || row.type.includes("RST") ? "bg-emerald-100 text-emerald-700" :
                      row.type.includes("QST") ? "bg-purple-100 text-purple-700" :
                      "bg-stone-100 text-stone-600"
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-stone-900 text-sm">{row.rate}</td>
                  <td className="py-2.5 px-4 text-stone-500 text-xs">{row.components}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>How Canada's sales tax system works</H2>
        <P>
          Canada operates a multi-layered sales tax system that can be confusing for businesses,
          consumers, and newcomers to the country. Understanding which taxes apply, who collects
          them, and how to calculate them is essential whether you're a small business owner
          trying to figure out how to calculate GST in Canada, a shopper checking your receipt,
          or a freelancer determining what to charge clients across provincial borders.
        </P>

        <H3>The federal GST: Canada's base-level tax</H3>
        <P>
          The Goods and Services Tax (GST) is a 5% federal tax administered by the Canada Revenue
          Agency (CRA). It applies to most goods and services sold in Canada. Every province pays
          the GST — the question is whether it is collected as a standalone 5% charge (in Alberta
          and the territories) or bundled into a higher harmonized rate (in HST provinces) or
          alongside a separate provincial tax (in BC, Saskatchewan, Manitoba, and Quebec).
          Businesses registered for GST can claim Input Tax Credits (ITCs) to recover the GST
          they paid on business purchases, which prevents tax-on-tax cascading.
        </P>

        <H3>HST provinces: harmonized tax</H3>
        <P>
          Five provinces — Ontario, New Brunswick, Nova Scotia, Newfoundland and Labrador, and
          Prince Edward Island — have harmonized their provincial sales tax with the federal GST
          into a single HST. This means businesses collect and remit one tax to the CRA rather than
          filing separately with the province. Ontario's HST rate is 13% (5% federal + 8%
          provincial). The Atlantic provinces charge 15% HST (5% federal + 10% provincial). For
          consumers, this simplifies the receipt — you see one HST line rather than two. For
          businesses, it streamlines administration significantly.
        </P>

        <H3>GST + PST provinces: two separate taxes</H3>
        <P>
          British Columbia, Saskatchewan, and Manitoba have not harmonized with the federal GST.
          Instead, they charge PST (Provincial Sales Tax) separately alongside the 5% federal
          GST. Importantly, PST is administered by the provincial government — not the CRA —
          meaning businesses must register and remit separately to both the federal government
          (for GST) and the provincial government (for PST). BC's PST is 7%, Saskatchewan's is
          6%, and Manitoba's Retail Sales Tax (RST) is 7%. The PST in these provinces also has
          its own list of exemptions that differ from the federal GST exemptions, adding
          complexity for businesses operating across multiple provinces.
        </P>

        <H3>Quebec: the GST + QST system</H3>
        <P>
          Quebec operates the most distinctive tax regime in Canada. The province charges both
          the 5% federal GST and the Quebec Sales Tax (QST) at 9.975%, for a combined rate of
          14.975%. What makes Quebec unique is that QST is administered entirely by Revenu
          Québec — a provincial agency — which also collects the federal GST on behalf of the
          CRA for businesses in Quebec. This means Quebec businesses file one return with
          Revenu Québec covering both taxes. Critically, QST is calculated on the pre-GST price
          (not stacked on top of GST), so the effective rate is exactly 14.975% — not a
          compounded figure.
        </P>

        <H3>Alberta and the territories: GST only</H3>
        <P>
          Alberta is the only Canadian province with no provincial sales tax, making it the most
          straightforward jurisdiction for sales tax purposes: businesses simply charge and
          remit 5% GST to the CRA. The three territories — Yukon, Northwest Territories, and
          Nunavut — also have no territorial sales tax, meaning they too only charge the 5% federal GST.
        </P>

        <H2>How to calculate GST and HST in Canada</H2>
        <P>
          The formulas for calculating Canadian sales tax are straightforward once you know
          your province's rate. Here are the three calculations you'll use most often:
        </P>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              title: "Add tax to a price",
              formula: "Total = Price × (1 + rate)",
              example: "Ontario: $150 × 1.13 = $169.50",
              sub: "Tax = $169.50 − $150 = $19.50",
            },
            {
              title: "Remove tax from a price",
              formula: "Pre-tax = Total ÷ (1 + rate)",
              example: "Ontario: $169.50 ÷ 1.13 = $150.00",
              sub: "Tax = $169.50 − $150 = $19.50",
            },
            {
              title: "Find just the tax amount",
              formula: "Tax = Price × rate",
              example: "Ontario: $150 × 0.13 = $19.50",
              sub: "Or: Total − Pre-tax = tax",
            },
          ].map((c) => (
            <div key={c.title} className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-stone-800 mb-2">{c.title}</p>
              <code className="block text-xs bg-white rounded-lg px-3 py-2 border border-stone-200 text-stone-700 mb-2 font-mono">
                {c.formula}
              </code>
              <p className="text-xs text-stone-600">{c.example}</p>
              <p className="text-xs text-stone-400 mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        <P>
          For Quebec's QST, because the two taxes are applied separately (both on the pre-tax
          base, not stacked), the formula is: Total = Price × (1 + 0.05 + 0.09975) = Price ×
          1.14975. To reverse this: Pre-tax = Total ÷ 1.14975. The calculator above handles all
          of these formulas automatically, including the Quebec-specific calculation.
        </P>

        {/* FAQ */}
        <H2>Frequently asked questions</H2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group border border-stone-200 rounded-xl overflow-hidden"
            >
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

        {/* Related Tools */}
        <div className="mt-20 border-t border-stone-100 pt-12">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/canada-hst-gst-calculator" />
        </div>

        {/* Trust Signal */}
        <div className="mt-16 rounded-3xl border border-stone-200 bg-stone-50/50 p-8">
          <div className="flex items-start gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 text-xl font-black text-red-600 italic">
              FB
            </div>
            <div>
              <p className="font-black text-stone-900 uppercase tracking-tight">Verified by FindBest Tools</p>
              <p className="mt-2 text-sm font-medium text-stone-500 leading-relaxed">
                Tax rates shown are accurate as of 2026 and sourced from the 
                Canada Revenue Agency (CRA) and provincial revenue authorities. 
                Calculations are verified against current federal and provincial 
                sales tax legislation. Last reviewed: 25 April 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-4 bg-stone-50 rounded-xl border border-stone-200">
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> Tax rates shown are accurate
            as of 2026 and sourced from the Canada Revenue Agency (CRA) and provincial revenue
            authorities. Rates may change — always verify current rates at{" "}
            <span className="text-stone-700">canada.ca/en/revenue-agency</span> or your
            provincial revenue authority before filing or remitting taxes. This tool is for
            informational purposes only and does not constitute tax advice. Businesses with
            complex multi-provincial operations should consult a qualified Canadian tax professional.
          </p>
        </div>

      </main>
    </>
  );
}
