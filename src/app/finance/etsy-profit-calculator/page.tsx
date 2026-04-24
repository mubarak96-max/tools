import type { Metadata } from "next";
import EtsyProfitCalculator from "@/components/EtsyProfitCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { Landmark, TrendingUp, ShieldCheck, HelpCircle, Globe, Package, DollarSign } from "lucide-react";

export const revalidate = 43200;

const PAGE_PATH = "/finance/etsy-profit-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the Etsy transaction fee in 2025?",
    answer: "Etsy charges a 6.5% transaction fee on the full sale price including the item price, shipping you charge, and gift wrapping. This applies globally — US, UK, Canadian, and Australian sellers all pay this rate."
  },
  {
    question: "What are Etsy fees in the UK?",
    answer: "UK sellers pay a 6.5% transaction fee, a £0.16 listing fee (billed in USD equivalent at $0.20), and Etsy Payments processing of 4% + £0.20 per transaction. VAT may also apply depending on your registration status."
  },
  {
    question: "What are Etsy fees in Canada?",
    answer: "Canadian Etsy sellers pay 6.5% transaction fee, $0.20 CAD listing fee, and 3% + C$0.25 payment processing. If your shop is enrolled in Offsite Ads and your annual sales exceed $10,000 USD, a 15% mandatory offsite ads fee also applies."
  },
  {
    question: "What are Etsy fees in Australia?",
    answer: "Australian sellers on Etsy pay the 6.5% transaction fee, the $0.20 USD listing fee, and Etsy Payments processing of 3% + A$0.25. GST may apply on Etsy's fees depending on your ABN registration."
  },
  {
    question: "Are Etsy Offsite Ads mandatory?",
    answer: "Offsite Ads are mandatory for shops that have exceeded $10,000 USD in revenue in the past 12 months. These sellers pay 15% on any sale attributed to an offsite ad. Sellers below this threshold can opt out; if opted in, the rate is 12%."
  },
  {
    question: "How do I calculate Etsy profit?",
    answer: "Etsy Profit = Sale Price + Shipping Charged – Transaction Fee (6.5%) – Payment Processing – Listing Fee – Material Cost – Labor – Actual Shipping – Packaging – Other Costs. Our calculator handles all these deductions automatically, live in your browser."
  },
  {
    question: "What is a good profit margin on Etsy?",
    answer: "A healthy Etsy net margin is 20–30% or higher. Below 15% is considered a warning zone. Below 0% means you are losing money on every sale. The target depends on your product category: handmade jewelry and digital downloads typically achieve higher margins than woodworking or ceramics due to lower materials cost."
  },
  {
    question: "Does Etsy charge VAT or GST on fees?",
    answer: "Yes. Etsy adds VAT to its fees for UK and EU sellers, and GST for Australian sellers. VAT-registered UK sellers can reclaim VAT on Etsy's fees as input tax. Non-registered sellers must treat this as an additional cost. Our calculator does not include VAT/GST on fees — use the output as a pre-tax estimate."
  }
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Etsy Profit Calculator 2025 | Accurate Fee & Margin Tool for US, UK, AU, CA",
    description: "Calculate your true Etsy profit instantly. Accurate 2024/2025 Etsy fee calculator covering US, UK, Canada, and Australia — transaction fees, listing fees, offsite ads, and payment processing.",
    path: PAGE_PATH,
  }),
  keywords: [
    "etsy profit calculator",
    "etsy fee calculator 2025",
    "calculate etsy profit",
    "etsy margin calculator",
    "etsy seller fees uk",
    "etsy fees uk 2025",
    "etsy fees canada",
    "etsy fees australia",
    "etsy fees us 2025",
    "etsy offsite ads fee calculator",
    "etsy payment processing fees",
    "etsy breakeven price calculator",
    "how much does etsy take",
    "etsy profit margin calculator",
    "etsy fee calculator uk",
    "etsy calculator canada",
    "etsy calculator australia",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Etsy Profit Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description: "Accurate Etsy profit and fee calculator for handmade sellers in the US, UK, Canada, and Australia. Supports all 2024/2025 fee structures including transaction, listing, offsite ads, and payment processing.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
  };
}

const COUNTRY_FEES = [
  {
    country: "United States",
    flag: "🇺🇸",
    transaction: "6.5%",
    processing: "3% + $0.25",
    listing: "$0.20 USD",
    note: "The baseline. Etsy's home market offers the lowest payment processing rate among major English-speaking markets.",
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    transaction: "6.5%",
    processing: "4% + £0.20",
    listing: "$0.20 USD equivalent",
    note: "UK sellers pay a higher processing rate (4%) than US sellers. VAT-registered sellers can reclaim VAT on Etsy's fees as input tax, improving effective margins.",
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    transaction: "6.5%",
    processing: "3% + C$0.25",
    listing: "$0.20 USD equivalent",
    note: "Currency fluctuation matters here. A weak CAD relative to USD increases the real cost of listing fees and any USD-denominated charges.",
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    transaction: "6.5%",
    processing: "3% + A$0.25",
    listing: "$0.20 USD equivalent",
    note: "Australian sellers registered for GST may need to account for GST on Etsy fees. Etsy's Australian consumer base is growing, making it a high-opportunity market for unique handmade goods.",
  },
];

export default function EtsyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Finance Tools", path: "/finance" },
            { name: "Etsy Profit Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd && <JsonLd data={serializeJsonLd(faqJsonLd)} />}

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="mb-12 max-w-3xl">

          <h1 className="text-5xl font-black text-stone-900 leading-[1.1] mb-6 tracking-tight">
            Etsy Profit <span className="text-orange-500">Calculator</span>
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed font-medium">
            The most accurate Etsy profit calculator for sellers in the <strong>United States, United Kingdom, Canada,</strong> and <strong>Australia</strong>. Model your true net profit after every Etsy fee — transaction, payment processing, listing, and offsite ads — in seconds.
          </p>
        </div>

        {/* Calculator */}
        <div className="mb-20">
          <EtsyProfitCalculator />
        </div>

        {/* Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
          <div className="space-y-16">

            {/* Section 1: Fee overview */}
            <section>
              <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <Landmark className="w-8 h-8 text-orange-500" />
                How Etsy Calculates Its Fees in 2025
              </h2>
              <div className="prose prose-stone max-w-none text-stone-600">
                <p className="text-lg leading-relaxed">
                  Every Etsy sale involves at least three separate fee deductions before you see a penny of profit: a transaction fee, a payment processing fee, and a listing fee. For sellers using Offsite Ads, a fourth significant charge applies. Understanding each layer — and how they compound — is the difference between a thriving handmade shop and one that unknowingly loses money on every sale.
                </p>
                <h3 className="text-xl font-bold text-stone-900 mt-8 mb-3">The 6.5% Transaction Fee</h3>
                <p>
                  Etsy&apos;s transaction fee is 6.5% of the <strong>total transaction value</strong> — this means the item price plus shipping you charge the buyer plus any gift wrapping. Many sellers mistakenly assume the fee only applies to the item price. Including shipping in the fee base is a common source of margin leakage. For a $30 item sold with $6 shipping, the transaction fee is $2.34 (6.5% × $36), not $1.95 (6.5% × $30). Our calculator applies the fee correctly on the full gross revenue amount.
                </p>
                <h3 className="text-xl font-bold text-stone-900 mt-8 mb-3">The $0.20 Listing Fee</h3>
                <p>
                  Etsy charges $0.20 USD to create or renew a listing. The fee renews automatically every four months and also when an item sells if you have auto-renew enabled. For low-priced items sold in high volume, the listing fee becomes negligible. For a $5 item, $0.20 represents 4% of revenue before any other fees. Always include it in your cost modelling.
                </p>
                <h3 className="text-xl font-bold text-stone-900 mt-8 mb-3">Payment Processing Fees</h3>
                <p>
                  Etsy Payments processing fees vary by country. In the <strong>United States</strong>, the rate is 3% + $0.25 per transaction. In the <strong>United Kingdom</strong>, the rate is 4% + £0.20. In <strong>Canada</strong>, it is 3% + C$0.25, and in <strong>Australia</strong>, it is 3% + A$0.25. These fees are non-negotiable — all sellers using Etsy Payments must pay them. The flat component ($0.25, £0.20, etc.) is especially punishing for very low-priced listings.
                </p>
              </div>
            </section>

            {/* Section 2: Country fee table */}
            <section>
              <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <Globe className="w-8 h-8 text-orange-500" />
                Etsy Fees by Country: US, UK, Canada & Australia
              </h2>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Your payment processing rate is determined by the country where your Etsy Payments account is registered — not where your buyer is located. Below is the full breakdown for the four largest English-speaking Etsy markets.
              </p>
              <div className="grid gap-5">
                {COUNTRY_FEES.map((c) => (
                  <div key={c.country} className="p-6 rounded-3xl bg-white border border-stone-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{c.flag}</span>
                      <h3 className="text-lg font-black text-stone-900">{c.country}</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Transaction</p>
                        <p className="font-bold text-stone-900">{c.transaction}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Processing</p>
                        <p className="font-bold text-stone-900">{c.processing}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Listing Fee</p>
                        <p className="font-bold text-stone-900">{c.listing}</p>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-3">{c.note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Offsite Ads */}
            <section>
              <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                The Offsite Ads Fee: Etsy&apos;s Hidden Margin Killer
              </h2>
              <div className="prose prose-stone max-w-none text-stone-600">
                <p>
                  Offsite Ads is Etsy&apos;s programme where your listings are advertised across Google Shopping, Facebook, Instagram, Pinterest, and Bing. You pay only when an ad leads to a sale — but that fee can be substantial. Offsite Ads fees apply on top of all other fees, so a UK seller with a mandatory 15% Offsite Ads fee is effectively paying 6.5% + 4% + 15% = 25.5% of the item price in Etsy fees alone, before processing flat fees and listing costs.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 my-8 not-prose">
                  <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                    <h4 className="font-bold text-amber-900 mb-2">Under $10,000 USD/year</h4>
                    <p className="text-2xl font-black text-amber-700 mb-2">12%</p>
                    <p className="text-sm text-amber-800 leading-relaxed">Optional. You can opt out of Offsite Ads entirely. If opted in, 12% is charged on sales attributed to an ad click within 30 days.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
                    <h4 className="font-bold text-red-900 mb-2">Over $10,000 USD/year</h4>
                    <p className="text-2xl font-black text-red-700 mb-2">15%</p>
                    <p className="text-sm text-red-800 leading-relaxed">Mandatory. Once your shop crosses the $10k revenue threshold, Offsite Ads become compulsory and cannot be disabled. The fee drops from 12% to 15% once you hit this tier — but it cannot be turned off.</p>
                  </div>
                </div>
                <p>
                  The 30-day attribution window is critical: a buyer who sees your ad on Google on Monday but purchases two weeks later on a Friday is still counted as an Offsite Ads sale. This means you may attribute a significant percentage of your &quot;organic&quot; sales to Offsite Ads. For sellers approaching the $10k threshold, it is worth modelling what your margins look like once the mandatory 15% rate kicks in before you scale further.
                </p>
              </div>
            </section>

            {/* Section 4: Labor & Pricing */}
            <section>
              <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <Package className="w-8 h-8 text-orange-500" />
                Pricing Your Handmade Products Correctly
              </h2>
              <div className="prose prose-stone max-w-none text-stone-600">
                <p>
                  Pricing handmade goods is one of the most challenging aspects of running an Etsy shop, especially for sellers in high-cost markets like the UK, Canada, and Australia where minimum wage expectations are higher. The most dangerous mistake a handmade seller makes is pricing to compete with mass-produced factory goods rather than pricing to reflect genuine value.
                </p>
                <h3 className="text-xl font-bold text-stone-900 mt-8 mb-3">The Handmade Pricing Formula</h3>
                <p>
                  A widely accepted pricing baseline for Etsy sellers is:
                </p>
                <div className="bg-stone-900 rounded-2xl p-6 my-6 not-prose">
                  <code className="text-orange-400 font-mono text-sm block leading-relaxed">
                    Sale Price = (Materials + Labor) × 2.5 + Etsy Fees + Packaging + Shipping
                  </code>
                </div>
                <p>
                  The 2.5× multiplier accounts for overhead, Etsy fees, and a reasonable profit margin. For premium or one-of-a-kind items, 3× or higher is appropriate. Australian and Canadian sellers often need to apply a higher multiplier to account for their higher domestic cost of living and shipping costs relative to US-based competitors.
                </p>
                <h3 className="text-xl font-bold text-stone-900 mt-8 mb-3">Free Shipping Strategy</h3>
                <p>
                  Etsy encourages sellers to offer free shipping, particularly to buyers in the same country. However, &quot;free shipping&quot; is never truly free — the cost is just relocated. When you bake shipping into the item price, Etsy&apos;s 6.5% transaction fee applies to the higher item price, so you may pay slightly more in transaction fees than if you listed shipping separately. Use our calculator to model both scenarios and choose the one with the better net margin.
                </p>
                <h3 className="text-xl font-bold text-stone-900 mt-8 mb-3">Pricing for UK Sellers: VAT Considerations</h3>
                <p>
                  UK sellers registered for VAT must carefully manage how VAT interacts with Etsy fees. Etsy charges its transaction and processing fees on the VAT-inclusive sale price, which means Amazon&apos;s fees effectively increase your VAT cost. However, VAT-registered sellers can reclaim VAT paid on Etsy&apos;s fees as input tax, partially offsetting this. Sellers below the £90,000 VAT registration threshold face a steeper effective fee burden because they cannot reclaim input VAT.
                </p>
                <div className="bg-stone-900 rounded-[2rem] p-8 my-8 text-white not-prose">
                  <h4 className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-4">The Underpricing Trap</h4>
                  <p className="text-stone-300 leading-relaxed italic m-0">
                    &quot;If your prices are only covering materials and Etsy fees, you are not running a business — you are running a hobby subsidy. Every hour of labor has a real cost, even if you enjoy the work. Price accordingly or Etsy will always win.&quot;
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Etsy Plus & Monthly Costs */}
            <section>
              <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-orange-500" />
                Etsy Plus and Monthly Overhead
              </h2>
              <div className="prose prose-stone max-w-none text-stone-600">
                <p>
                  Etsy Plus is an optional subscription at $10 USD per month. It provides 15 listing credits and $5 in Etsy Ads credits monthly, along with access to advanced shop customization features. Whether it is worth the cost depends entirely on your sales volume. If you sell 50 units per month, Etsy Plus adds just $0.20 per unit in overhead — negligible. If you sell 5 units per month, it adds $2.00 per unit, which meaningfully compresses your margin.
                </p>
                <p>
                  Our calculator lets you toggle Etsy Plus on and input your monthly unit sales to automatically apportion the cost per listing. This gives you a true per-unit profit figure rather than misleading you with a number that ignores fixed monthly overhead.
                </p>
              </div>
            </section>

            {/* Section 6: Break-even */}
            <section>
              <h2 className="text-3xl font-black text-stone-900 mb-6 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-orange-500" />
                How to Calculate Your Break-Even Price on Etsy
              </h2>
              <div className="prose prose-stone max-w-none text-stone-600">
                <p>
                  The break-even price is the minimum listing price at which you make exactly zero profit after all Etsy fees and your costs. Setting a price below break-even means you lose money on every single sale.
                </p>
                <p>
                  The formula must account for the fact that Etsy fees are percentage-based, so you cannot simply add your costs and fees together — you need to solve for the price algebraically:
                </p>
                <div className="bg-stone-100 rounded-2xl p-6 my-6 not-prose">
                  <code className="text-stone-800 font-mono text-xs block leading-relaxed">
                    Break-even Price = (Total Costs + Fixed Fees) ÷ (1 − Transaction Rate − Processing Rate − Ads Rate)
                  </code>
                </div>
                <p>
                  For a US seller with no Offsite Ads, the denominator is 1 − 0.065 − 0.03 = 0.905. Every $1 in costs requires a listing price of at least $1.10 just to break even. Add in the $0.25 flat processing fee and your break-even climbs further. Our calculator performs this algebra automatically and displays the result prominently so you never price below it.
                </p>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            <div className="p-6 bg-stone-900 rounded-3xl text-white">
              <h4 className="text-lg font-bold mb-5">Target Benchmarks</h4>
              <div className="space-y-4">
                {[
                  { val: "30%", label: "Ideal Net Margin", desc: "Covers returns, slow periods, and reinvestment." },
                  { val: "15%", label: "Minimum Margin", desc: "Below this, any fee increase or slow month threatens viability." },
                  { val: "2.5×", label: "Markup Factor", desc: "Price = (Materials + Labor) × 2.5 as a baseline." },
                  { val: "33", label: "Etsy Plus Break-even", desc: "Sales per month where Plus credits offset its $10 cost." },
                ].map((b) => (
                  <div key={b.label} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <p className="text-orange-400 text-2xl font-black mb-1">{b.val}</p>
                    <p className="text-[10px] uppercase font-bold text-white/50 tracking-wider">{b.label}</p>
                    <p className="text-xs text-white/70 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
              <h4 className="text-orange-900 font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                UK Seller Tip
              </h4>
              <p className="text-xs text-orange-800 leading-relaxed">
                If you are VAT-registered, reclaim input VAT on your Etsy processing and transaction fees quarterly. At 20% VAT, this can recover a meaningful amount annually on high-volume shops.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <h4 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                AU & CA Seller Note
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Currency risk is real. If the AUD or CAD weakens against the USD, your $0.20 listing fee costs more in local terms. Hedge by keeping a USD buffer in your Etsy Payments balance to cover listing renewals.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 border-t border-stone-100 pt-16">
          <h2 className="text-4xl font-black text-stone-900 mb-12">Etsy Seller FAQ</h2>
          <div className="grid gap-5">
            {faq.map((item) => (
              <div key={item.question} className="p-8 rounded-3xl bg-white border border-stone-100 shadow-sm hover:border-orange-200 transition-colors">
                <h3 className="text-lg font-bold text-stone-900 mb-3">{item.question}</h3>
                <p className="text-stone-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-24">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
        </div>

        {/* Disclaimer */}
        <div className="mt-20 p-8 bg-stone-50 rounded-3xl border border-stone-200">
          <p className="text-[11px] text-stone-400 leading-relaxed">
            <strong className="text-stone-700">Disclaimer:</strong> This Etsy Profit Calculator uses fee data from published Etsy fee schedules as of 2024/2025. Fees may change — always verify at{" "}
            <a href="https://www.etsy.com/seller-fees" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500 transition-colors">
              etsy.com/seller-fees
            </a>
            {" "}before making business decisions. VAT, GST, and currency conversion impacts are not included. Not affiliated with Etsy, Inc.
          </p>
        </div>
      </div>
    </>
  );
}
