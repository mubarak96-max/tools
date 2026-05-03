import type { Metadata } from "next";
import StampDutyCalculator from "@/components/uk-stamp-duty/StampDutyCalculator";

export const metadata: Metadata = {
  title: "UK Stamp Duty Calculator 2025–2026 | SDLT for England, Scotland & Wales",
  description:
    "Free UK stamp duty calculator for 2025–2026. Calculate SDLT, LBTT, and LTT instantly. Updated with April 2025 rate changes, first-time buyer relief, 5% second home surcharge, and non-resident rates. Accurate for England, Scotland, and Wales.",
  keywords: [
    "uk stamp duty calculator",
    "stamp duty calculator 2025",
    "SDLT calculator",
    "how much stamp duty will i pay",
    "stamp duty rates 2025 2026",
    "first time buyer stamp duty",
    "second home stamp duty",
    "buy to let stamp duty",
    "stamp duty on 400k house",
    "stamp duty surcharge 5%",
    "non resident stamp duty uk",
    "stamp duty changes april 2025",
    "LBTT calculator scotland",
    "land transaction tax wales",
    "stamp duty threshold 125000",
  ],
  alternates: {
    canonical: "https://findbest.tools/real-estate/uk-stamp-duty-calculator",
  },
  openGraph: {
    title: "UK Stamp Duty Calculator 2025–2026",
    description:
      "Calculate SDLT, LBTT & LTT instantly. Updated with April 2025 changes. Free, accurate, and mobile-friendly.",
    url: "https://findbest.tools/real-estate/uk-stamp-duty-calculator",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "UK Stamp Duty Calculator",
      url: "https://findbest.tools/real-estate/uk-stamp-duty-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
      description:
        "Calculate Stamp Duty Land Tax (SDLT), Land and Buildings Transaction Tax (LBTT), and Land Transaction Tax (LTT) for UK property purchases.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the current UK stamp duty rates from April 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "From 1 April 2025, standard SDLT rates in England and Northern Ireland are: 0% up to £125,000, 2% on £125,001–£250,000, 5% on £250,001–£925,000, 10% on £925,001–£1,500,000, and 12% above £1,500,000. First-time buyers pay 0% up to £300,000 and 5% on £300,001–£500,000.",
          },
        },
        {
          "@type": "Question",
          name: "How much stamp duty do I pay on a £400,000 house in 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For a £400,000 house: a standard buyer pays £7,500 SDLT (£2,500 on the £125,001–£250,000 band plus £5,000 on the £250,001–£400,000 band). A first-time buyer pays £5,000 (5% on the £100,000 above £300,000). A buy-to-let investor pays £27,500 including the 5% surcharge.",
          },
        },
        {
          "@type": "Question",
          name: "What is the second home stamp duty surcharge in 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "From 31 October 2024, buyers purchasing an additional residential property (second home, buy-to-let, or holiday home) pay a 5% surcharge on top of standard SDLT rates across all bands. This increased from the previous 3% surcharge.",
          },
        },
        {
          "@type": "Question",
          name: "Do first-time buyers pay stamp duty in 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "First-time buyers in England and Northern Ireland pay no stamp duty on properties up to £300,000. On purchases between £300,001 and £500,000, they pay 5% on the amount above £300,000. If the property exceeds £500,000, standard rates apply and first-time buyer relief is lost entirely.",
          },
        },
      ],
    },
  ],
};

export default function UKStampDutyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
              Updated April 2025
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide">
              HMRC-Aligned
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            UK Stamp Duty Calculator
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
            Calculate <strong>Stamp Duty Land Tax (SDLT)</strong> for England and Northern Ireland, <strong>LBTT</strong> for Scotland, and <strong>LTT</strong> for Wales. Updated with the{" "}
            <strong>April 2025 threshold changes</strong>, reduced first-time buyer relief, and the new 5% additional property surcharge.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="max-w-5xl mx-auto px-4 py-8 -mt-6">
        <StampDutyCalculator />
      </section>

      {/* Long-Form SEO Content */}
      <article className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">
        
        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900">Understanding UK Stamp Duty in 2025–2026</h2>
          <p className="text-slate-600 leading-relaxed">
            Stamp Duty Land Tax (SDLT) is one of the largest upfront costs when buying property in England and Northern Ireland. Whether you are a first-time buyer searching for a starter home in Manchester, a family upsizing to a four-bedroom house in the Home Counties, or an investor building a buy-to-let portfolio in Birmingham, knowing exactly how much stamp duty you will pay is critical for accurate budgeting and mortgage planning.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our <strong>UK stamp duty calculator</strong> gives you instant, accurate estimates based on the latest government rates. The tool covers all buyer types — first-time buyers, home movers, additional property purchasers, and non-UK residents — and reflects the significant changes that took effect on <strong>1 April 2025</strong>, when the nil-rate threshold dropped from £250,000 back to £125,000 and first-time buyer relief was substantially reduced.
          </p>
        </div>

        {/* What Changed in April 2025 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What Changed on 1 April 2025? The New SDLT Rules Explained</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The April 2025 stamp duty changes reversed the temporary measures introduced in the September 2022 mini-budget. For standard buyers, the nil-rate band — the portion of a property's price on which no tax is paid — halved from £250,000 to <strong>£125,000</strong>. This means anyone buying a home worth more than £125,000 now pays SDLT where previously they would not have.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            First-time buyers were hit even harder. The zero-rate threshold for first-time buyer relief fell from £425,000 to <strong>£300,000</strong>, and the maximum property value eligible for any relief dropped from £625,000 to <strong>£500,000</strong>. A first-time buyer purchasing a £400,000 home now pays £5,000 in stamp duty, whereas before April 2025 they would have paid nothing.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            For property investors and second-home buyers, the additional property surcharge increased from 3% to <strong>5%</strong> from 31 October 2024. This applies to all bands, meaning even the portion below £125,000 — previously tax-free — now attracts a 5% charge. On a £350,000 buy-to-let, the stamp duty bill jumped from £18,000 under the old rules to <strong>£25,000</strong> today.
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 my-4">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Quick Comparison: Before vs After April 2025</h4>
            <p className="text-sm text-slate-600">
              £350,000 property (standard buyer):<br/>
              • Before April 2025: £5,000 SDLT<br/>
              • After April 2025: <strong>£7,500 SDLT</strong> (+£2,500)<br/><br/>
              £400,000 property (first-time buyer):<br/>
              • Before April 2025: £0 SDLT<br/>
              • After April 2025: <strong>£5,000 SDLT</strong> (+£5,000)<br/><br/>
              £350,000 buy-to-let:<br/>
              • Before Oct 2024: £18,000 SDLT<br/>
              • After April 2025: <strong>£25,000 SDLT</strong> (+£7,000)
            </p>
          </div>
        </div>

        {/* Standard Rates */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Standard Residential Stamp Duty Rates (England & NI)</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            SDLT is calculated on a tiered, progressive basis. You do not pay the highest rate on the entire property value — instead, each rate applies only to the portion of the price that falls within that band. This is similar to how income tax works.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            For a standard home mover purchasing their main residence, the current rates are: <strong>0%</strong> on the first £125,000, <strong>2%</strong> on the portion from £125,001 to £250,000, <strong>5%</strong> on the portion from £250,001 to £925,000, <strong>10%</strong> on the portion from £925,001 to £1.5 million, and <strong>12%</strong> on anything above £1.5 million.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            To illustrate, a £500,000 home attracts: £0 on the first £125,000, £2,500 on the next £125,000 (at 2%), and £12,500 on the final £250,000 (at 5%). The total SDLT is <strong>£15,000</strong>, giving an effective rate of 3%. This is the most common price bracket for family homes outside London and the South East.
          </p>
          <p className="text-slate-600 leading-relaxed">
            For high-value properties, the top 12% band can generate substantial tax bills. A £2 million home in Kensington, for example, incurs £151,250 in SDLT — an effective rate of 7.56%. Buyers at this level often factor stamp duty into their negotiation strategy, sometimes requesting that the seller cover part of the cost or adjusting their offer downward to account for the tax.
          </p>
        </div>

        {/* First-Time Buyers */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">First-Time Buyer Stamp Duty Relief: What You Need to Know</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            First-time buyer relief is designed to help people get onto the property ladder by reducing or eliminating stamp duty on lower-priced homes. However, the April 2025 changes have significantly narrowed who benefits and by how much.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            To qualify, you must never have owned a residential property anywhere in the world — not just in the UK. If you are buying jointly, <strong>all purchasers</strong> must be first-time buyers. The property must be your main residence, and the purchase price must not exceed £500,000. If the price is above £500,000, you lose the relief entirely and pay standard rates.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Under the current rules, first-time buyers pay <strong>0% SDLT on the first £300,000</strong> and <strong>5% on the portion from £300,001 to £500,000</strong>. This means a £280,000 starter home in Leeds incurs zero stamp duty. A £450,000 two-bedroom flat in Bristol costs £7,500. But a £550,000 property — common in London and the South East — attracts the full standard rate of £17,500 with no relief.
          </p>
          
          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">First-Time Buyer Traps to Avoid</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Many buyers mistakenly believe they qualify for relief when they do not. If you previously owned a share of a property through inheritance, even if you never lived there, you are not a first-time buyer. Similarly, if your parents added your name to the deeds of their home for inheritance tax planning, HMRC may classify you as having previously owned property.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Another common pitfall is the "first-time buyer buy-to-let." If you have never owned a home but your first purchase is an investment property, you <strong>cannot claim first-time buyer relief</strong>. However, you also do not pay the additional property surcharge because you will only own one property. You simply pay standard rates.
          </p>
        </div>

        {/* Additional Property */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Second Home and Buy-to-Let Stamp Duty: The 5% Surcharge</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            If you already own a residential property and purchase another — whether as a buy-to-let investment, a holiday home, or a property for a family member — you must pay the <strong>additional property surcharge</strong>. From 31 October 2024, this surcharge increased from 3% to <strong>5%</strong> and applies to the entire purchase price.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The surcharge is added to every band. So the rates become: <strong>5%</strong> up to £125,000, <strong>7%</strong> on £125,001–£250,000, <strong>10%</strong> on £250,001–£925,000, <strong>15%</strong> on £925,001–£1.5 million, and <strong>17%</strong> above £1.5 million. Even the portion below £125,000, which is tax-free for main residences, now attracts 5% SDLT.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            This has made buy-to-let investing considerably more expensive. A £300,000 investment property in Liverpool now costs £15,000 in stamp duty — £5,000 more than a standard buyer would pay. Combined with higher mortgage rates, stricter lending criteria, and the phased reduction of mortgage interest tax relief, many smaller landlords are reconsidering whether property investment still stacks up.
          </p>
          
          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">Replacing Your Main Residence: The Exception</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            There is an important exception. If you are selling your main residence and buying a new one, you do not pay the surcharge even if you temporarily own two properties during the transition. However, if you do not sell your old main residence within 36 months of buying the new one, you become liable for the surcharge and must reclaim it from HMRC.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Married couples and civil partners are treated as a single unit for surcharge purposes. If one spouse owns a buy-to-let and the other buys a main residence, the surcharge still applies unless the jointly owned property is sold. Unmarried couples can be treated separately, which sometimes creates planning opportunities — though HMRC closely scrutinizes arrangements designed purely to avoid tax.
          </p>
        </div>

        {/* Non-UK Residents */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Non-UK Resident Stamp Duty Surcharge</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Since 1 April 2021, non-UK residents buying residential property in England and Northern Ireland have faced an additional <strong>2% surcharge</strong> on top of all other SDLT rates. A non-UK resident is defined as someone who was not present in the UK for at least 183 days (6 months) during the 12 months before the purchase.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            This surcharge applies to the entire purchase price and stacks with the additional property surcharge. A non-UK resident investor buying a £600,000 buy-to-let could face rates of 7%, 9%, 12%, 17%, and 19% across the bands — potentially tens of thousands of pounds more than a UK resident standard buyer.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The good news is that this surcharge can be <strong>reclaimed</strong> if you become UK resident within 2 years of the purchase date. You must submit a claim to HMRC with evidence of your residency status. This makes the surcharge less of a permanent barrier and more of a timing issue for those planning to relocate to the UK.
          </p>
        </div>

        {/* Scotland & Wales */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Scotland and Wales: LBTT and LTT Explained</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Stamp Duty Land Tax only applies in England and Northern Ireland. Scotland uses <strong>Land and Buildings Transaction Tax (LBTT)</strong>, while Wales uses <strong>Land Transaction Tax (LTT)</strong>. Both systems are broadly similar to SDLT but have different thresholds and rates.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            In Scotland, LBTT rates for residential purchases are: 0% up to £145,000, 2% on £145,001–£250,000, 5% on £250,001–£325,000, 10% on £325,001–£750,000, and 12% above £750,000. First-time buyers in Scotland benefit from relief up to £175,000. The Additional Dwelling Supplement (ADS) for second homes is 6% — higher than England's 5%.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            In Wales, LTT rates are: 0% up to £225,000, 6% on £225,001–£400,000, 7.5% on £400,001–£750,000, 10% on £750,001–£1.5 million, and 12% above £1.5 million. Wales does not offer first-time buyer relief, but the higher nil-rate band of £225,000 often means lower tax bills than in England for properties under that threshold.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our calculator provides approximate equivalents for Scotland and Wales to help you compare costs across the UK. For precise figures, always use the official Revenue Scotland LBTT calculator or the Welsh Government LTT calculator.
          </p>
        </div>

        {/* Step-by-Step */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">How to Calculate Your Stamp Duty: A Step-by-Step Guide</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Calculating stamp duty manually is straightforward once you understand the tiered system. Here is how to work out your liability in four steps.
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-slate-800">Confirm your property value</h4>
                <p className="text-sm text-slate-600 mt-1">Use the higher of the purchase price or the market valuation. HMRC uses the "chargeable consideration," which includes any fixtures, fittings, and premiums.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-slate-800">Identify your buyer profile</h4>
                <p className="text-sm text-slate-600 mt-1">Are you a first-time buyer, home mover, investor, or non-UK resident? Each profile triggers different rates and surcharges.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-slate-800">Apply the correct rate bands</h4>
                <p className="text-sm text-slate-600 mt-1">Work through each band progressively. Only the portion within each band is taxed at that band's rate.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-slate-800">Add any surcharges</h4>
                <p className="text-sm text-slate-600 mt-1">If buying an additional property, add 5% to every band. If non-UK resident, add 2%. These stack where applicable.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Scenarios */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Real-World Stamp Duty Scenarios</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            To show how stamp duty varies dramatically by buyer type, here are five realistic scenarios based on the 2025–2026 rates.
          </p>

          <div className="space-y-4">
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario A: First-Time Buyer in Leeds</h4>
              <p className="text-sm text-slate-600 mt-1">£280,000 terraced house. First main residence.</p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">Total SDLT: £0 (0% on first £300,000)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario B: Home Mover in Bristol</h4>
              <p className="text-sm text-slate-600 mt-1">£450,000 semi-detached house. Selling current home.</p>
              <p className="text-sm font-semibold text-blue-700 mt-2">Total SDLT: £12,500 (standard rates)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario C: Buy-to-Let Investor in Manchester</h4>
              <p className="text-sm text-slate-600 mt-1">£200,000 two-bedroom flat. Already owns main residence.</p>
              <p className="text-sm font-semibold text-rose-700 mt-2">Total SDLT: £10,000 (5% surcharge on full amount)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario D: Non-Resident Buying in London</h4>
              <p className="text-sm text-slate-600 mt-1">£800,000 apartment. Overseas buyer, main residence.</p>
              <p className="text-sm font-semibold text-amber-700 mt-2">Total SDLT: £54,000 (standard + 2% non-resident surcharge)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario E: Luxury Purchase in Kensington</h4>
              <p className="text-sm text-slate-600 mt-1">£2,000,000 detached house. Home mover.</p>
              <p className="text-sm font-semibold text-purple-700 mt-2">Total SDLT: £151,250 (top 12% band applies)</p>
            </div>
          </div>
        </div>

        {/* Payment & Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">When and How to Pay Stamp Duty</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Stamp duty must be paid to HMRC within <strong>14 days</strong> of completion — the day you get the keys and the property legally becomes yours. In practice, your conveyancing solicitor or licensed conveyancer handles the SDLT return and payment on your behalf. They will typically ask you to transfer the stamp duty amount to them before completion, along with their legal fees and any search costs.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Even if no stamp duty is owed — for example, a first-time buyer purchasing below £300,000 — an SDLT return must still be submitted to HMRC in most cases. Your solicitor will file this. Failure to submit the return or pay on time results in automatic penalties: £100 for returns up to 3 months late, £200 after 3 months, plus interest on the unpaid tax.
          </p>
          <p className="text-slate-600 leading-relaxed">
            You cannot pay stamp duty in installments or defer it. It is a lump-sum tax that must be cleared before or at completion. Some buyers use their mortgage lender's retention facility, but this is rare and usually only available for renovation projects. The most common approach is to set aside the stamp duty amount in a savings account during the conveyancing process so the funds are ready when your solicitor requests them.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions About UK Stamp Duty</h2>
          
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-slate-800">How much stamp duty will I pay on a £300,000 house?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                A standard buyer pays £3,750 (£2,500 on the £125,001–£250,000 band at 2%, plus £1,250 on the remaining £50,000 at 5%). A first-time buyer pays <strong>£0</strong> because the entire £300,000 falls within the £300,000 nil-rate band. A buy-to-let investor pays £15,000 due to the 5% surcharge.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Can I add stamp duty to my mortgage?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                No, stamp duty cannot be added to your mortgage. It must be paid upfront in cash (or via your solicitor from funds you provide). Adding it to your mortgage would effectively mean borrowing to pay tax, which lenders do not allow. You should budget for stamp duty alongside your deposit, legal fees, and moving costs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Do I pay stamp duty on a new-build property?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Yes, stamp duty applies to new-builds exactly as it does to resale properties. The tax is based on the purchase price. However, some developers offer "stamp duty paid" incentives, where they cover the cost as a discount. Be aware that HMRC may treat this as a reduction in purchase price, which could affect your mortgage valuation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">What if I am buying with someone who already owns a property?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                If any joint purchaser already owns a residential property and the new purchase is not a replacement of their main residence, the <strong>5% additional property surcharge applies to the entire transaction</strong>. This catches many couples where one partner owns a flat and they later buy together. The only way to avoid it is for the existing owner to sell their property before or simultaneously with the new purchase.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Is stamp duty refundable if the sale falls through?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Stamp duty is only payable after completion, so if a sale falls through before exchange of contracts, you do not pay it. If you have already paid but the transaction is rescinded, annulled, or fundamentally changed by court order, you may be able to claim a refund from HMRC within specific time limits. Speak to your solicitor if this applies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Does stamp duty apply to shared ownership properties?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Yes, but you have two options. You can pay stamp duty on the full market value of the property upfront (a "market value election"), or you can pay only on the share you are buying and pay again when you staircase to full ownership. First-time buyer relief applies if you meet the criteria. Many shared ownership buyers opt for the initial share-only payment to reduce upfront costs.
              </p>
            </div>
          </div>
        </div>

        {/* Trust & Authority */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 md:p-8 text-white">
          <h2 className="text-xl font-bold mb-3">Why Use Our UK Stamp Duty Calculator?</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Updated with <strong className="text-white">April 2025 SDLT changes</strong> and 5% surcharge</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Covers <strong className="text-white">England & NI, Scotland (LBTT), and Wales (LTT)</strong></span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>All buyer types: <strong className="text-white">first-time, mover, investor, non-resident</strong></span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Aligned with <strong className="text-white">HMRC guidelines</strong> and official rate schedules</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Disclaimer: This calculator provides estimates for planning purposes. For official assessments, use the HMRC SDLT calculator or consult a qualified conveyancing solicitor. Rates are accurate as of 2025–2026.
          </p>
        </div>

        {/* Related Guides & Deep Dives */}
        <div className="border-t border-slate-200 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Related Guides & Deep Dives
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "First-Time Buyer Stamp Duty Relief: The Complete Guide",
                href: "/blog/first-time-buyer-stamp-duty-relief-uk",
                desc: "Everything you need to know about the £300,000 nil-rate threshold and how to claim relief.",
              },
              {
                title: "Buy-to-Let Stamp Duty: 2025 Surcharge Rules",
                href: "/blog/buy-to-let-stamp-duty-guide-uk",
                desc: "Understanding the 5% additional property surcharge for landlords and second-home owners.",
              },
              {
                title: "Residential Stamp Duty Rates UK (2025–2026)",
                href: "/blog/residential-stamp-duty-rates-uk",
                desc: "A comprehensive breakdown of all SDLT bands, from £125k up to the 12% top tier.",
              },
              {
                title: "Second Home Stamp Duty: How Much Will You Pay?",
                href: "/blog/uk-stamp-duty-second-home-guide",
                desc: "Detailed look at the surcharge rules and common exemptions for replacing your main residence.",
              },
              {
                title: "SDLT vs Stamp Duty: What's the Difference?",
                href: "/blog/what-is-sdlt-vs-stamp-duty",
                desc: "Clearing up the confusion between the modern tax and historical stamp duties.",
              },
              {
                title: "Scotland LBTT Guide: Rates & ADS Explained",
                href: "/blog/scotland-lbtt-guide",
                desc: "A dedicated guide to Land and Buildings Transaction Tax for property in Scotland.",
              },
              {
                title: "Wales LTT Guide: The Welsh Property Tax",
                href: "/blog/wales-ltt-guide",
                desc: "Everything you need to know about Land Transaction Tax thresholds and rates in Wales.",
              },
              {
                title: "Islamic Mortgages UK: Halal Home Finance Guide",
                href: "/blog/first-time-buyer-halal-mortgage-guide-uk",
                desc: "How Sharia-compliant home finance works for first-time buyers in the UK.",
              },
            ].map((guide) => (
              <a
                key={guide.href}
                href={guide.href}
                className="group p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all flex flex-col"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-grow">
                  {guide.desc}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold">
                  Read Guide 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t border-slate-200 pt-12">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Related Property Calculators</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Rent vs Buy Calculator", desc: "Should you rent or buy in the UK?", href: "/real-estate/rent-vs-buy-calculator" },
              { name: "House Affordability Calculator", desc: "How much property can you afford?", href: "/real-estate/house-affordability-calculator-canada" },
              { name: "Mortgage Qualifier", desc: "Check your loan eligibility", href: "/real-estate/mortgage-qualifier-canada" },
              { name: "Rental Yield Calculator", desc: "Calculate buy-to-let returns", href: "/real-estate/rental-yield-calculator" },
              { name: "Cap Rate Calculator", desc: "Real estate capitalization rate", href: "/real-estate/cap-rate-calculator" },
              { name: "Break Even Calculator", desc: "Property investment analysis", href: "/finance/break-even-calculator" },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                className="block p-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition group"
              >
                <p className="font-medium text-slate-800 group-hover:text-blue-800">{tool.name}</p>
                <p className="text-xs text-slate-500 mt-1">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
