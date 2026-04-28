import type { Metadata } from "next";
import LttCalculator from "@/components/LttCalculator";

// ─── SEO metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Land Transfer Tax Calculator Toronto — Ontario & Toronto MLTT 2026",
  description:
    "Free land transfer tax calculator for Toronto and Ontario. Calculate Ontario LTT and Toronto Municipal LTT side by side. Includes first-time buyer rebates, NRST, and bracket breakdown. Accurate 2026 rates.",
  keywords: [
    "land transfer tax calculator toronto",
    "toronto land transfer tax calculator",
    "ontario land transfer tax calculator",
    "toronto municipal land transfer tax",
    "land transfer tax ontario 2026",
    "how much is land transfer tax in toronto",
    "first time home buyer land transfer tax rebate ontario",
    "toronto land transfer tax first time buyer",
    "non resident speculation tax ontario",
    "land transfer tax calculator ontario",
    "mltt calculator toronto",
    "how to calculate land transfer tax toronto",
    "toronto closing costs guide 2026",
    "land transfer tax rebate for new immigrants ontario",
  ],
  openGraph: {
    title: "Land Transfer Tax Calculator Toronto — Ontario & MLTT 2026",
    description:
      "Calculate Ontario LTT and Toronto Municipal LTT instantly. Includes first-time buyer rebates and NRST. Accurate 2026 rates.",
    url: "https://findbest.tools/land-transfer-tax-calculator-toronto",
  },
  alternates: {
    canonical: "https://findbest.tools/land-transfer-tax-calculator-toronto",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Land Transfer Tax Calculator Toronto",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
  description:
    "Free land transfer tax calculator for Toronto and Ontario. Calculates Ontario LTT and Toronto Municipal LTT with first-time buyer rebates and NRST.",
  areaServed: "CA-ON",
};

// ─── Content data ──────────────────────────────────────────────────

const ONTARIO_BRACKETS = [
  { range: "$0 – $55,000", rate: "0.5%", example: "$275 on $55k" },
  { range: "$55,001 – $250,000", rate: "1.0%", example: "+ $1,950 on next $195k" },
  { range: "$250,001 – $400,000", rate: "1.5%", example: "+ $2,250 on next $150k" },
  { range: "$400,001 – $2M", rate: "2.0%", example: "+ $32k on next $1.6M" },
  { range: "$2,000,001+", rate: "2.5%", example: "Residential only" },
];

const TORONTO_BRACKETS = [
  { range: "$0 – $55,000", rate: "0.5%", note: "Same brackets as Ontario" },
  { range: "$55,001 – $250,000", rate: "1.0%", note: "" },
  { range: "$250,001 – $400,000", rate: "1.5%", note: "" },
  { range: "$400,001 – $2M", rate: "2.0%", note: "" },
  { range: "$2,000,001+", rate: "2.5%", note: "Residential only" },
];

const FAQS = [
  {
    q: "How much is land transfer tax in Toronto?",
    a: "In Toronto, buyers pay two land transfer taxes: the provincial Ontario Land Transfer Tax (LTT) and the City of Toronto Municipal Land Transfer Tax (MLTT). Both use the same rate structure, so Toronto buyers effectively pay double land transfer tax compared to buyers elsewhere in Ontario. On an $850,000 home, the Ontario LTT is approximately $16,475 and the Toronto MLTT is an additional $16,475 — totalling around $32,950. On a $1,000,000 home, combined LTT is approximately $40,950. Use the calculator above to get the exact figure for any purchase price.",
  },
  {
    q: "What is the first-time home buyer land transfer tax rebate in Ontario?",
    a: "First-time home buyers in Ontario are eligible for a rebate of up to $4,000 on the Ontario Land Transfer Tax. The rebate equals the full Ontario LTT payable if the purchase price results in less than $4,000 of tax — this threshold is approximately $368,333. Above this price, you still receive the $4,000 maximum rebate. To qualify, you must be a Canadian citizen or permanent resident, be 18 years of age or older, occupy the property as your principal residence within 9 months of registration, and have never previously owned a home anywhere in the world.",
  },
  {
    q: "What is the Toronto first-time home buyer land transfer tax rebate?",
    a: "First-time home buyers purchasing within the City of Toronto boundaries receive an additional Toronto MLTT rebate of up to $4,475 on top of the Ontario rebate. For properties priced at $400,000 or below, the full $4,475 rebate applies — completely eliminating the Toronto MLTT. For properties above $400,000, the rebate phases out proportionally. Combined with the Ontario rebate ($4,000), a Toronto first-time buyer can receive up to $8,475 in total LTT rebates. The Toronto rebate eligibility criteria are identical to the Ontario criteria.",
  },
  {
    q: "Do I pay land transfer tax if I buy outside Toronto but in the GTA?",
    a: "Outside the City of Toronto proper — in Mississauga, Brampton, Markham, Richmond Hill, Vaughan, Oakville, Burlington, or any other municipality in the Greater Toronto Area — only the provincial Ontario Land Transfer Tax applies. The Toronto Municipal LTT is a City of Toronto tax and is not charged anywhere outside the city limits. This is a significant consideration when comparing properties on either side of the Toronto boundary — a $900,000 home in Mississauga attracts about $16,975 in LTT, while the same price within Toronto attracts about $33,950.",
  },
  {
    q: "What is the Non-Resident Speculation Tax (NRST) in Ontario?",
    a: "The Non-Resident Speculation Tax (NRST) is a 25% tax on the purchase price of residential property in Ontario purchased by foreign nationals (those who are not Canadian citizens or permanent residents) or corporations. The rate was increased from 20% to 25% in October 2022. The NRST is in addition to the Ontario LTT and (if applicable) Toronto MLTT, meaning foreign buyers in Toronto could face three separate land transfer-related charges. Certain exemptions exist — for example, protected persons (refugees), Ontario Immigrant Nominee Program nominees, and spouses of Canadian citizens may be exempt or eligible for a refund.",
  },
  {
    q: "When is land transfer tax paid in Ontario?",
    a: "Land transfer tax is paid upon registration of the transfer of the property in Ontario's land registry system. In practice, your real estate lawyer collects the funds prior to closing and remits the tax to the province (and City of Toronto, if applicable) as part of the closing process. You will not receive a separate bill — it is paid as part of your closing costs on the date the transaction completes. First-time buyer rebates are also applied at the time of registration, so you typically pay the net amount after rebates.",
  },
  {
    q: "Are there any other closing costs in Toronto beyond land transfer tax?",
    a: "Yes — land transfer tax is the largest closing cost but not the only one. Additional closing costs for Toronto buyers typically include: legal fees and disbursements ($1,500–$3,000); title insurance ($200–$500); home inspection ($400–$600); adjustments for prepaid property tax and utilities; and if purchasing a new build, HST on the purchase price (less a new housing HST rebate). Buyers who require a mortgage also pay an appraisal fee ($300–$500). Total closing costs in Toronto, excluding land transfer tax, typically add another $3,000–$7,000 to the upfront purchase cost.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────
function H2({ children, id }: { children: React.ReactNode, id?: string }) {
  return <h2 id={id} className="text-3xl font-bold text-stone-900 mb-6 mt-16 scroll-mt-20 leading-tight">{children}</h2>;
}
function H3({ children, id }: { children: React.ReactNode, id?: string }) {
  return <h3 id={id} className="text-xl font-bold text-stone-800 mb-4 mt-10 scroll-mt-20">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-stone-600 leading-relaxed mb-6 text-[16px]">{children}</p>;
}
function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-3 mb-8 text-stone-600 text-[16px]">{children}</ul>;
}
function LI({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

// ─── Page ──────────────────────────────────────────────────────────
export default function LttPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-16">

        {/* Hero Section */}
        <div className="mb-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-[12px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
            2026 Updated Tax Guidelines
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-stone-900 tracking-tighter leading-[1.05] mb-6">
            Toronto Land Transfer Tax Calculator 2026
          </h1>
          <p className="text-xl text-stone-500 leading-relaxed font-medium max-w-3xl">
            Navigate the complexities of property taxes in Canada's largest city.
            Calculate provincial Ontario LTT and Municipal MLTT with 100% accuracy.
            Includes 2026 rates, first-time buyer rebates, and NRST assessments.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="mb-20">
          <LttCalculator />
        </div>

        {/* Table of Contents */}
        <div className="bg-stone-50 rounded-3xl p-8 mb-20 border border-stone-200">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-[0.2em] mb-6">Inside this guide</h2>
          <nav className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { label: "1. The Toronto Property Tax Landscape", id: "landscape" },
              { label: "2. Ontario Provincial LTT Explained", id: "ontario-ltt" },
              { label: "3. The Municipal MLTT 'Double Tax'", id: "municipal-mltt" },
              { label: "4. First-Time Home Buyer Rebates", id: "fthb-rebates" },
              { label: "5. Non-Resident Speculation Tax (NRST)", id: "nrst" },
              { label: "6. Buying in Toronto vs. Other GTA Cities", id: "regional" },
              { label: "7. Guide to 2026 Closing Costs", id: "closing-costs" },
              { label: "8. Commercial Property Tax Rates", id: "commercial" },
              { label: "9. Tax Planning & Legal Advice", id: "legal" },
              { label: "10. Related Real Estate Tools", id: "related" },
            ].map(item => (
              <a key={item.id} href={`#${item.id}`} className="text-[15px] font-semibold text-stone-700 hover:text-red-600 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-200" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ── CONTENT ── */}

        <div className="prose prose-stone max-w-none">

          <H2 id="landscape">1. The Toronto Property Tax Landscape: A 2026 Overview</H2>
          <P>
            Entering the Toronto real estate market in 2026 requires a sophisticated understanding of the unique taxation structure that governs the city. Unlike almost any other municipality in Canada, the City of Toronto operates under a "double tax" regime for property transfers. This means that every time a home or commercial building changes hands within the city's boundaries, the buyer is legally obligated to remit two separate payments: one to the Province of Ontario and a second, nearly identical payment to the City of Toronto.
          </P>
          <P>
            This dual-tier system was established to help the city fund its vast infrastructure and social service needs, but for the average home buyer, it represents a significant financial hurdle. On a typical Toronto detached home priced at $1.5 million, the combined land transfer taxes can exceed $55,000. When you add other closing costs like legal fees, title insurance, and potential adjustments, the "friction cost" of moving into a new home becomes a major consideration in your overall budget and mortgage strategy.
          </P>
          <P>
            Our 2026 calculator is designed to provide clarity in this complex environment. By breaking down the provincial and municipal portions side-by-side, we empower buyers to see exactly where their money is going and ensure they are taking full advantage of any available rebates or exemptions.
          </P>

          <H2 id="ontario-ltt">2. Deep Dive: Ontario Provincial Land Transfer Tax (LTT)</H2>
          <P>
            The Ontario Land Transfer Tax (LTT) is governed by the <em>Land Transfer Tax Act</em> and applies to all land transfers in the province, regardless of whether the property is in a major urban center like Toronto or a rural township in Northern Ontario. The tax is calculated using a marginal bracket system, which means that different portions of your purchase price are taxed at different rates.
          </P>
          <H3>Understanding the Marginal Bracket System</H3>
          <P>
            Many buyers mistakenly believe that the highest rate applies to the entire purchase price. In reality, the Ontario system works similarly to personal income tax. For a residential property, the rates for 2026 are as follows:
          </P>
          <UL>
            <LI><strong>First $55,000:</strong> Taxed at 0.5%. This is the most affordable tier, designed to keep taxes low for very entry-level properties.</LI>
            <LI><strong>$55,001 to $250,000:</strong> Taxed at 1.0%. This bracket covers the next $195,000 of the property value.</LI>
            <LI><strong>$250,001 to $400,000:</strong> Taxed at 1.5%. This applies to the $150,000 slice of value in the middle of the market.</LI>
            <LI><strong>$400,001 to $2,000,000:</strong> Taxed at 2.0%. This is the bracket where most Toronto transactions reside, covering up to $1.6 million of value.</LI>
            <LI><strong>Amounts over $2,000,000:</strong> Taxed at 2.5%. Introduced in 2017, this "luxury tax" bracket specifically targets high-end residential real estate.</LI>
          </UL>
          <P>
            By using our calculator, you don't need to manually calculate these slices. We instantly apply the correct rates to each bracket and show you the cumulative total. It is important to note that "Non-Residential" properties (commercial, industrial, or agricultural) have a different top-end structure, capping out at a 2.0% rate for all amounts above $400,000.
          </P>

          <H2 id="municipal-mltt">3. The Municipal MLTT: Why Toronto is Different</H2>
          <P>
            The Toronto Municipal Land Transfer Tax (MLTT) is the result of the <em>City of Toronto Act, 2006</em>, which gave the city council the authority to implement its own revenue-generating taxes. Since 2008, the MLTT has been a permanent fixture of the Toronto real estate market.
          </P>
          <H3>Geographic Boundaries: Where does MLTT apply?</H3>
          <P>
            A common point of confusion for buyers in the Greater Toronto Area (GTA) is exactly where the MLTT applies. The tax is levied only on properties located within the City of Toronto. This includes the following former municipalities:
          </P>
          <UL>
            <LI>Old City of Toronto (Downtown/Midtown)</LI>
            <LI>North York</LI>
            <LI>Scarborough</LI>
            <LI>Etobicoke</LI>
            <LI>East York</LI>
            <LI>York</LI>
          </UL>
          <P>
            If you are buying a home in Mississauga, Vaughan, Markham, Richmond Hill, or Brampton, you <strong>do not</strong> pay the MLTT. You only pay the provincial Ontario LTT. This geographic distinction is why you will often see properties just across the border (e.g., in Thornhill vs. North York) having significantly different closing costs despite similar purchase prices.
          </P>
          <H3>MLTT Rate Structure in 2026</H3>
          <P>
            In an effort to keep the system simple and predictable, the City of Toronto has historically mirrored the provincial rate brackets. This means that for residential properties, the MLTT brackets are identical to the Ontario LTT brackets. Effectively, you are paying double the tax for each bracket. For instance, the first $55,000 of a Toronto home is taxed at 0.5% by Ontario and 0.5% by Toronto, for a combined total of 1.0%.
          </P>

          <H2 id="fthb-rebates">4. Maximizing Your Savings: First-Time Home Buyer Rebates</H2>
          <P>
            To help offset the high cost of entry into the Toronto market, both levels of government provide substantial rebates for first-time home buyers. In 2026, these rebates remain a critical part of the financial planning for new entrants to the market.
          </P>
          <H3>The Ontario FTHB Rebate ($4,000)</H3>
          <P>
            The provincial rebate is worth up to $4,000. For a property priced at approximately $368,333 or less, this rebate completely covers the Ontario LTT. For any property priced above this amount, the buyer receives the maximum $4,000 credit.
          </P>
          <H3>The Toronto MLTT Rebate ($4,475)</H3>
          <P>
            The City of Toronto offers its own rebate of up to $4,475. This was designed to cover the MLTT on a $400,000 home (at the rates applicable when the rebate was set). Similar to the provincial rebate, if your purchase price is above $400,000, you still receive the full $4,475 credit.
          </P>
          <H3>Total Combined Savings: $8,475</H3>
          <P>
            A first-time buyer in Toronto can save a total of $8,475 in land transfer taxes. Our calculator automatically applies these rebates if you select the "First-Time Buyer" option.
          </P>
          <H3>The "Spousal Trap" and Eligibility Rules</H3>
          <P>
            Eligibility for these rebates is strict. To qualify in 2026, you must:
          </P>
          <UL>
            <LI>Be at least 18 years of age.</LI>
            <LI>Be a Canadian citizen or permanent resident of Canada.</LI>
            <LI>Occupy the home as your principal residence within 9 months of closing.</LI>
            <LI><strong>Never have owned a home or an interest in a home anywhere in the world.</strong></LI>
            <LI>If you have a spouse, your spouse must never have owned a home while they were your spouse.</LI>
          </UL>
          <P>
            If you are buying with a partner who <em>has</em> owned a home before, your rebate is proportioned based on your ownership percentage. For example, if you are a first-time buyer owning 50% and your partner is not, you will only receive 50% of the $8,475 total rebate ($4,237.50).
          </P>

          <H2 id="nrst">5. The Non-Resident Speculation Tax (NRST) – 25%</H2>
          <P>
            Introduced as part of Ontario's Fair Housing Plan, the Non-Resident Speculation Tax (NRST) is a significant cost for foreign nationals, foreign corporations, or taxable trustees purchasing residential property in Ontario. As of 2022, the rate was set at 25%, and it remains at this level for 2026 transactions.
          </P>
          <P>
            The NRST is calculated based on the full purchase price, not just the taxable brackets. On a $1,000,000 home, a non-resident buyer would owe $250,000 in NRST in addition to the standard provincial and municipal land transfer taxes.
          </P>
          <H3>Exemptions and Refunds</H3>
          <P>
            There are specific exemptions for "Protected Persons" (refugees) and nominees under the Ontario Immigrant Nominee Program. Furthermore, if a non-resident buyer becomes a Canadian citizen or permanent resident within 4 years of the purchase date, they may be eligible for a full refund of the NRST paid, provided the property was used as their principal residence.
          </P>

          <H2 id="regional">6. Buying in Toronto vs. Other GTA Cities: A Cost Comparison</H2>
          <P>
            One of the most effective ways to reduce your closing costs is to look at properties just outside the City of Toronto limits. In 2026, the "border effect" remains a major factor in GTA real estate decisions.
          </P>
          <UL>
            <LI><strong>Toronto:</strong> Pay Ontario LTT + Toronto MLTT. (e.g., $1M home ≈ $33,000 tax with no rebates).</LI>
            <LI><strong>Mississauga/Brampton (Peel Region):</strong> Pay only Ontario LTT. (e.g., $1M home ≈ $16,500 tax).</LI>
            <LI><strong>Vaughan/Markham/Richmond Hill (York Region):</strong> Pay only Ontario LTT. (e.g., $1M home ≈ $16,500 tax).</LI>
            <LI><strong>Pickering/Ajax (Durham Region):</strong> Pay only Ontario LTT. (e.g., $1M home ≈ $16,500 tax).</LI>
          </UL>
          <P>
            As you can see, simply moving across a street that defines the city boundary (like Steeles Avenue) can save a buyer nearly $17,000 on a million-dollar home. However, buyers must weigh these one-time tax savings against potential differences in property tax rates, commute times, and lifestyle amenities.
          </P>

          <H2 id="closing-costs">7. Comprehensive Guide to 2026 Closing Costs</H2>
          <P>
            Land transfer tax is often the largest closing cost, but it is far from the only one. A prepared buyer should budget for an additional 1.5% to 4.0% of the purchase price to cover all final expenses.
          </P>
          <H3>Key Closing Expenses in 2026</H3>
          <UL>
            <LI><strong>Legal Fees & Disbursements:</strong> Expect to pay between $1,500 and $3,000 for a real estate lawyer to handle the title search, registration, and fund transfers.</LI>
            <LI><strong>Title Insurance:</strong> A one-time fee (typically $300 - $600) that protects you against title defects, liens, or fraud.</LI>
            <LI><strong>Home Inspection:</strong> While not strictly a closing cost, paying $500 for a professional inspection before firming up your offer is essential for risk management.</LI>
            <LI><strong>Appraisal Fee:</strong> Your lender may require a professional appraisal (approx. $400 - $600) to confirm the property's value before issuing the mortgage.</LI>
            <LI><strong>Interest Adjustments:</strong> If there is a gap between your closing date and your first mortgage payment date, you may owe interest for those days.</LI>
            <LI><strong>Property Tax & Utility Adjustments:</strong> If the seller has pre-paid their property taxes for the year, you will need to reimburse them for the portion of the year that you will own the home.</LI>
          </UL>

          <H2 id="commercial">8. Commercial & Non-Residential Property Tax Rates</H2>
          <P>
            For investors looking at commercial assets, industrial warehouses, or mixed-use buildings in Toronto, the tax landscape is slightly different. The Ontario LTT for non-residential property uses a simplified bracket system:
          </P>
          <UL>
            <LI>0.5% on the first $55,000</LI>
            <LI>1.0% on the amount from $55,000 to $250,000</LI>
            <LI>1.5% on the amount from $250,000 to $400,000</LI>
            <LI>2.0% on any amount over $400,000</LI>
          </UL>
          <P>
            Notice that the 2.5% residential "luxury" bracket does not apply to commercial property. This can result in significant tax savings for high-value industrial or commercial transactions compared to residential properties of the same price.
          </P>

          <H2 id="legal">9. Tax Planning & Professional Legal Advice</H2>
          <P>
            While our 2026 Toronto Land Transfer Tax Calculator provides a highly accurate estimate based on current legislation, it is not a substitute for professional legal advice. Real estate laws and tax rates are subject to change by municipal and provincial governments.
          </P>
          <P>
            Your real estate lawyer is the only professional who can officially calculate your final tax liability and verify your eligibility for rebates during the registration process. We recommend engaging a lawyer early in your home-buying journey to ensure your "Statement of Adjustments" is accurate and that there are no surprises on closing day.
          </P>

          <H2>Frequently Asked Questions (Expanded for 2026)</H2>
          <div className="space-y-4 mb-14">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm transition-all hover:border-red-200">
                <summary className="flex items-center justify-between cursor-pointer px-8 py-6 text-[15px] font-bold text-stone-800 list-none select-none">
                  {faq.q}
                  <span className="text-stone-300 ml-4 flex-shrink-0 group-open:rotate-45 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  </span>
                </summary>
                <div className="px-8 pb-8 pt-2 text-[15px] text-stone-600 leading-relaxed border-t border-stone-50">
                  {faq.a}
                </div>
              </details>
            ))}
            <details className="group border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm transition-all hover:border-red-200">
              <summary className="flex items-center justify-between cursor-pointer px-8 py-6 text-[15px] font-bold text-stone-800 list-none select-none">
                Does land transfer tax apply to inherited property?
                <span className="text-stone-300 ml-4 flex-shrink-0 group-open:rotate-45 transition-transform duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </span>
              </summary>
              <div className="px-8 pb-8 pt-2 text-[15px] text-stone-600 leading-relaxed border-t border-stone-50">
                Generally, if a property is inherited through a will or by right of survivorship, no land transfer tax is payable in Ontario or Toronto. However, if there is a "consideration" involved (e.g., you buy out another heir's share), tax may be payable on the value of that consideration. Always consult with an estate lawyer in these scenarios.
              </div>
            </details>
            <details className="group border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-sm transition-all hover:border-red-200">
              <summary className="flex items-center justify-between cursor-pointer px-8 py-6 text-[15px] font-bold text-stone-800 list-none select-none">
                Can I add land transfer tax to my mortgage?
                <span className="text-stone-300 ml-4 flex-shrink-0 group-open:rotate-45 transition-transform duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </span>
              </summary>
              <div className="px-8 pb-8 pt-2 text-[15px] text-stone-600 leading-relaxed border-t border-stone-50">
                No. Land transfer tax must be paid in cash upon closing. Lenders will not allow you to "roll" this tax into your mortgage principal. You must prove to your lender and lawyer that you have the liquid funds available (separately from your down payment) to cover all land transfer taxes and closing costs.
              </div>
            </details>
          </div>

          <h4 id="related"> Explore Related Real Estate Tools</h4>

          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {[
              { name: "House Affordability Canada", href: "/real-estate/house-affordability-calculator-canada", desc: "Calculate the maximum home price you can afford with the Canadian stress test." },
              { name: "Mortgage Qualifier Canada", href: "/real-estate/mortgage-qualifier-canada", desc: "See if you qualify for a mortgage based on your GDS and TDS ratios." },
              { name: "Rent vs Buy Calculator", href: "/real-estate/rent-vs-buy-calculator", desc: "Analyze the long-term financial benefits of owning vs. renting in Toronto." },
              { name: "NYC Transfer Tax Calculator", href: "/real-estate/nyc-transfer-tax-calculator", desc: "Compare Toronto's tax rates with major US markets like New York City." },
              { name: "Florida Transfer Tax Calculator", href: "/real-estate/florida-transfer-tax-calculator", desc: "Understand closing costs for vacation properties in Florida." },
              { name: "Cap Rate Calculator 2026", href: "/real-estate/cap-rate-calculator", desc: "Analyze the yield and performance of Toronto investment properties." },
            ].map((tool) => (
              <a key={tool.href} href={tool.href} className="group p-5 rounded-2xl border border-stone-200 bg-white hover:border-red-200 hover:shadow-md transition-all">
                <h4 className="font-bold text-stone-800 group-hover:text-red-600 mb-1">{tool.name}</h4>
                <p className="text-xs text-stone-500 leading-normal">{tool.desc}</p>
              </a>
            ))}
          </div>

          {/* Final Disclaimer */}
          <div className="p-8 bg-stone-50 rounded-3xl border border-stone-200 mt-20">
            <p className="text-[12px] text-stone-500 leading-relaxed italic">
              <strong className="text-stone-700 uppercase tracking-widest text-[11px] block mb-2 font-black">Legal Disclaimer & Terms of Use</strong>
              The information provided on this page, including all calculations from the Toronto Land Transfer Tax Calculator 2026, is for illustrative and informational purposes only. While we strive for 100% accuracy, the City of Toronto and the Province of Ontario may update tax codes, rebate eligibility, or bracket thresholds at any time. This tool does not constitute financial, legal, or tax advice. A formal calculation of land transfer tax is performed by the Ministry of Finance and the City of Toronto Revenue Services at the time of registration. Users are strongly encouraged to verify all tax liabilities with a licensed Ontario real estate lawyer or qualified accountant prior to making financial commitments or signing a purchase agreement.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
