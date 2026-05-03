import type { Metadata } from "next";
import LTTCalculator from "@/components/wales-ltt/LTTCalculator";
import { absoluteUrl } from "@/lib/seo/metadata";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

const PAGE_PATH = "/real-estate/wales-ltt-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Wales Land Transaction Tax Calculator 2025–2026 | LTT Rates",
  description:
    "Free Wales Land Transaction Tax (LTT) calculator for 2025–2026. Calculate main residential and higher rates for second homes, buy-to-let, companies, and trusts. Updated with 2026 higher rates. No first-time buyer relief in Wales — accurate for Cardiff, Swansea, Wrexham & all Welsh properties.",
  keywords: [
    "wales land transaction tax calculator",
    "wales ltt calculator",
    "welsh stamp duty calculator",
    "land transaction tax wales 2025",
    "wales property tax calculator",
    "ltt rates wales 2025 2026",
    "wales second home tax",
    "wales buy to let stamp duty",
    "higher rates ltt wales",
    "wales property purchase tax",
    "cardiff stamp duty calculator",
    "swansea property tax",
    "wales land transaction tax rates",
    "wra tax calculator",
    "wales additional property surcharge",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Wales Land Transaction Tax Calculator 2025–2026",
    description:
      "Calculate LTT for Welsh property purchases. Updated with Dec 2024 higher rates. Covers main residences, second homes, buy-to-let, companies & trusts.",
    url: PAGE_URL,
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Wales Land Transaction Tax Calculator",
      url: PAGE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
      description:
        "Calculate Land Transaction Tax (LTT) for residential property purchases in Wales. Covers main residential rates and higher rates for additional properties, companies, and trusts.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the current Land Transaction Tax rates in Wales for 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For main residences in Wales, LTT rates are: 0% up to £225,000, 6% on £225,001–£400,000, 7.5% on £400,001–£750,000, 10% on £750,001–£1,500,000, and 12% above £1,500,000. For additional properties, higher rates apply from 5% up to 17% for the top band.",
          },
        },
        {
          "@type": "Question",
          name: "Is there first-time buyer relief for LTT in Wales?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Unlike England and Northern Ireland, Wales does not offer specific first-time buyer relief on Land Transaction Tax. However, many first-time buyer properties fall within or close to the £225,000 zero-rate threshold.",
          },
        },
        {
          "@type": "Question",
          name: "How much LTT will I pay on a £350,000 house in Wales?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For a £350,000 main residence in Wales, you pay £7,500 LTT (6% on the £125,000 above £225,000). If it is an additional property, you pay £21,450 under the higher rates.",
          },
        },
        {
          "@type": "Question",
          name: "Do non-resident buyers pay extra tax in Wales?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Wales does not have a non-resident surcharge on Land Transaction Tax. Overseas buyers pay the same LTT rates as Welsh residents, unlike in England where non-residents pay an extra 2%.",
          },
        },
      ],
    },
  ],
};

export default function WalesLTTPage() {
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
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wide">
              Updated 2026
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide">
              WRA-Aligned
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Wales Land Transaction Tax Calculator
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
            Calculate <strong>Land Transaction Tax (LTT)</strong> for any residential property purchase in Wales. Updated with the{" "}
            <strong>2026 higher rates</strong> for second homes and buy-to-let properties. Covers main residences, additional properties, companies, and trusts — with no non-resident surcharge.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="max-w-5xl mx-auto px-4 py-8 -mt-6">
        <LTTCalculator />
      </section>

      {/* Long-Form SEO Content */}
      <article className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">

        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900">Understanding Land Transaction Tax in Wales (2025–2026)</h2>
          <p className="text-slate-600 leading-relaxed">
            If you are buying a home in Wales — whether a terraced house in Cardiff, a coastal cottage in Pembrokeshire, or a buy-to-let investment in Wrexham — you will need to factor in <strong>Land Transaction Tax (LTT)</strong>. Introduced in April 2018, LTT replaced Stamp Duty Land Tax (SDLT) in Wales and is administered by the <strong>Welsh Revenue Authority (WRA)</strong>. It applies to both freehold and leasehold residential purchases, and the amount you pay depends on the property price and your buyer profile.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our <strong>Wales Land Transaction Tax calculator</strong> gives you instant, accurate LTT estimates for every type of residential purchase. Unlike generic UK stamp duty calculators that confuse English SDLT rules with Welsh LTT, this tool is built specifically for the Welsh tax regime — including the higher residential rates that increased on <strong>11 December 2024</strong> and the fact that <strong>Wales has no first-time buyer relief</strong> and <strong>no non-resident surcharge</strong>.
          </p>
        </div>

        {/* What is LTT */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What Is Land Transaction Tax (LTT) in Wales?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Land Transaction Tax is a devolved tax paid by the purchaser when buying residential property or land in Wales. It operates on a tiered, progressive basis — meaning you only pay the higher rate on the portion of the price that falls within each band, not on the entire purchase price. This is the same principle as income tax.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            LTT is self-assessed, which means you (or more commonly, your solicitor or conveyancer) must file an LTT return with the WRA and pay any tax due. Importantly, <strong>you must file an LTT return even if no tax is payable</strong> — for example, if you are buying a main residence for £200,000. Failure to submit the return can result in penalties, even when the tax bill is zero.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The tax must be paid within <strong>30 days</strong> of the effective date, which is usually the completion date — the day you get the keys. In practice, your conveyancing solicitor handles the return and payment, collecting the funds from you before completion.
          </p>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 my-4">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">Quick LTT Calculation Example</h4>
            <p className="text-sm text-slate-600">
              For a £300,000 main residence in Swansea:<br />
              • First £225,000 × 0% = £0<br />
              • Remaining £75,000 × 6% = £4,500<br />
              <strong>Total LTT = £4,500</strong>
            </p>
          </div>
        </div>

        {/* Main Residential Rates */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Main Residential LTT Rates for Your Primary Home</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            When you buy a residential property in Wales that will be your main home — and you do not already own another residential property — you pay the main residential rates. These rates have been in place since 10 October 2022 and offer a relatively generous zero-rate threshold compared to England.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The current main residential bands are: <strong>0%</strong> on the first £225,000, <strong>6%</strong> on the portion from £225,001 to £400,000, <strong>7.5%</strong> on the portion from £400,001 to £750,000, <strong>10%</strong> on the portion from £750,001 to £1.5 million, and <strong>12%</strong> on anything above £1.5 million.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The £225,000 nil-rate band is a significant advantage for Welsh buyers compared to England, where the threshold dropped to £125,000 in April 2025. A first-time buyer in Cardiff purchasing a £220,000 flat pays absolutely nothing in LTT, while an equivalent buyer in Bristol would face a £1,900 SDLT bill. This makes the Welsh property market particularly attractive for buyers at the lower end of the price spectrum.
          </p>
          <p className="text-slate-600 leading-relaxed">
            However, the rates escalate quickly above £225,000. A £450,000 family home in the Vale of Glamorgan attracts £16,500 in LTT — £7,500 on the £175,000 band at 6% and £9,000 on the £50,000 band at 7.5%. Buyers in this bracket should budget carefully, as LTT cannot be added to your mortgage and must be paid from savings or equity.
          </p>
        </div>

        {/* No First-Time Buyer Relief */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">No First-Time Buyer Relief in Wales: What It Means for You</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            One of the most important differences between Wales and England is that <strong>Wales does not offer first-time buyer relief</strong>. In England, first-time buyers pay no SDLT on properties up to £300,000 and a reduced rate up to £500,000. In Wales, first-time buyers are treated exactly the same as any other main residence purchaser.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            This policy choice by the Welsh Government means that a 25-year-old buying their first flat in Cardiff for £280,000 pays the same £3,300 LTT as a home mover buying their third property. The rationale is that the £225,000 zero-rate band is already set at a level that captures many first-time buyer properties in Wales, particularly in the North and Valleys where average prices are lower.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            However, for first-time buyers in South Wales — particularly Cardiff, Newport, and the Vale of Glamorgan — where average prices often exceed £250,000, the lack of relief can feel like a penalty. A £320,000 starter home in Cardiff generates £5,700 in LTT, while an identical property in England would cost a first-time buyer just £1,000 in SDLT.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you are a first-time buyer in Wales, the key strategy is to factor LTT into your maximum budget from the outset. Unlike in England, you cannot rely on a first-time buyer exemption to reduce your upfront costs. Speak to your mortgage adviser about setting aside funds for LTT alongside your deposit, valuation fees, and legal costs.
          </p>
        </div>

        {/* Higher Rates */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Higher Residential Rates: Second Homes, Buy-to-Let & Investments</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            If you already own one or more residential properties and buy another in Wales worth £40,000 or more, you must pay the <strong>higher residential rates</strong> of LTT. These rates also apply to companies buying residential property and, in many cases, to trusts. The higher rates were increased on 11 December 2024, making investment properties in Wales more expensive than before.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The current higher rates are: <strong>5%</strong> on the first £180,000, <strong>8.5%</strong> on £180,001–£250,000, <strong>10%</strong> on £250,001–£400,000, <strong>12.5%</strong> on £400,001–£750,000, <strong>15%</strong> on £750,001–£1.5 million, and <strong>17%</strong> above £1.5 million. These represent an increase from the previous 4% to 16% structure.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The impact is substantial. A £300,000 buy-to-let in Wrexham now costs £21,450 in LTT under the higher rates, compared to just £4,500 for a main residence buyer. The difference — £16,950 — is the cost of the higher rate surcharge and must be paid in cash upfront, as it cannot be financed through a buy-to-let mortgage.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-3">Replacing Your Main Residence: The 36-Month Refund Rule</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            There is an important exception. If you are selling your previous main residence and buying a new one, you do not pay the higher rates even if you temporarily own two properties during the transition. However, if your old home has not sold by the completion date of your new purchase, you must pay the higher rates upfront and then <strong>claim a refund from the WRA within 36 months</strong> of the new purchase.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Married couples and civil partners are treated as a single unit for higher rates purposes. If one spouse owns a buy-to-let and the couple buys a new main residence together, the higher rates apply to the entire transaction unless the existing property is sold. Unmarried couples can be treated separately, which may create planning opportunities — though arrangements designed purely to avoid tax are closely scrutinised.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Companies face particularly strict rules. A company must pay higher rates on any residential property purchase over £40,000, regardless of whether it owns other properties, unless the property has a lease with 21 years or less remaining. This makes company structures less attractive for Welsh residential investment than in some other jurisdictions.
          </p>
        </div>

        {/* No Non-Resident Surcharge */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">No Non-Resident Surcharge in Wales</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Unlike England and Northern Ireland, where non-UK residents pay an extra 2% SDLT surcharge on top of all other rates, <strong>Wales does not have a non-resident surcharge</strong>. Overseas buyers purchasing property in Wales pay exactly the same LTT rates as Welsh residents.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            This makes Wales an increasingly attractive destination for overseas investors, expats returning to the UK, and foreign nationals looking to establish a base in Britain. A non-resident buying a £600,000 holiday home in Snowdonia pays the same higher residential rates as a Welsh resident investor — with no additional penalty for not being UK-based.
          </p>
          <p className="text-slate-600 leading-relaxed">
            The absence of a non-resident surcharge is a deliberate policy choice by the Welsh Government, reflecting a different approach to housing taxation than Westminster. However, overseas buyers should still be aware of other regulatory requirements, including the Economic Crime (Transparency and Enforcement) Act 2022 and potential changes to overseas entity registration rules.
          </p>
        </div>

        {/* Wales vs England Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Wales vs England: How LTT Compares to SDLT in 2025</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            With England's SDLT rates changing significantly in April 2025, many buyers are asking whether it is cheaper to buy in Wales or England. The answer depends entirely on the property price and your buyer profile.
          </p>

          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm border border-slate-200 rounded-lg">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-left py-2 px-3">Scenario</th>
                  <th className="text-right py-2 px-3">Wales LTT</th>
                  <th className="text-right py-2 px-3">England SDLT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="text-slate-700">
                  <td className="py-2 px-3">£200,000 main residence (first-time buyer)</td>
                  <td className="py-2 px-3 text-right font-medium">£0</td>
                  <td className="py-2 px-3 text-right font-medium">£0</td>
                </tr>
                <tr className="text-slate-700">
                  <td className="py-2 px-3">£300,000 main residence (first-time buyer)</td>
                  <td className="py-2 px-3 text-right font-medium">£4,500</td>
                  <td className="py-2 px-3 text-right font-medium">£0</td>
                </tr>
                <tr className="text-slate-700">
                  <td className="py-2 px-3">£350,000 main residence (home mover)</td>
                  <td className="py-2 px-3 text-right font-medium">£7,500</td>
                  <td className="py-2 px-3 text-right font-medium">£7,500</td>
                </tr>
                <tr className="text-slate-700">
                  <td className="py-2 px-3">£500,000 main residence (home mover)</td>
                  <td className="py-2 px-3 text-right font-medium">£22,500</td>
                  <td className="py-2 px-3 text-right font-medium">£11,250</td>
                </tr>
                <tr className="text-slate-700">
                  <td className="py-2 px-3">£350,000 buy-to-let</td>
                  <td className="py-2 px-3 text-right font-medium">£21,450</td>
                  <td className="py-2 px-3 text-right font-medium">£25,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-600 leading-relaxed mb-4">
            The table reveals a clear pattern. For lower-priced main residences, Wales is often cheaper due to the £225,000 zero-rate band versus England's £125,000. However, for mid-range properties between £350,000 and £500,000, England can be cheaper — especially for first-time buyers who benefit from relief. For buy-to-let investors, Wales is currently slightly cheaper on a £350,000 property, but this varies by price point.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you are considering buying near the Welsh border — in places like Chester, Shrewsbury, or Hereford — it is worth running the numbers on both sides. A £280,000 property in Chester (England) costs a first-time buyer nothing in SDLT, while the same price in Wrexham (Wales) costs £3,300 in LTT. Conversely, a £200,000 property costs the same in both countries.
          </p>
        </div>

        {/* Step-by-Step */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">How to Calculate Your LTT: A Step-by-Step Guide</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Calculating LTT manually is straightforward once you understand the progressive banding system. Here is how to work out your tax liability in four steps.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-slate-800">Confirm your property value</h4>
                <p className="text-sm text-slate-600 mt-1">Use the higher of the purchase price or the market valuation. For new builds, include fixtures and fittings that are part of the building (fitted kitchens, wardrobes) but exclude removable items like carpets and curtains.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-slate-800">Determine your buyer type</h4>
                <p className="text-sm text-slate-600 mt-1">Are you buying a main residence with no other properties? Or do you already own a home, making this an additional property? Are you buying through a company or trust?</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-slate-800">Apply the correct LTT bands</h4>
                <p className="text-sm text-slate-600 mt-1">Work through each band progressively. Only the portion within each band is taxed at that band's rate. Do not apply the top rate to the whole amount.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-slate-800">Check for exemptions and reliefs</h4>
                <p className="text-sm text-slate-600 mt-1">Are you replacing your main residence? You may be eligible for a refund if you sell within 36 months. Is the property mixed-use (e.g., shop with flat above)? Higher rates may not apply.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Scenarios */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Real-World LTT Scenarios for Welsh Buyers</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            To illustrate how LTT varies by location and buyer type, here are five realistic scenarios based on the 2025–2026 rates.
          </p>

          <div className="space-y-4">
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario A: First Home in Merthyr Tydfil</h4>
              <p className="text-sm text-slate-600 mt-1">£180,000 terraced house. First property, main residence.</p>
              <p className="text-sm font-semibold text-emerald-700 mt-2">Total LTT: £0 (within £225,000 zero-rate band)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario B: Family Home in Cardiff</h4>
              <p className="text-sm text-slate-600 mt-1">£420,000 semi-detached house. Home mover, no other properties.</p>
              <p className="text-sm font-semibold text-blue-700 mt-2">Total LTT: £16,500 (£10,500 at 6% + £6,000 at 7.5%)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario C: Buy-to-Let in Newport</h4>
              <p className="text-sm text-slate-600 mt-1">£200,000 two-bedroom flat. Already owns main residence.</p>
              <p className="text-sm font-semibold text-rose-700 mt-2">Total LTT: £10,000 (5% higher rate on full amount)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario D: Holiday Cottage in Anglesey</h4>
              <p className="text-sm text-slate-600 mt-1">£350,000 coastal property. Second home.</p>
              <p className="text-sm font-semibold text-amber-700 mt-2">Total LTT: £21,450 (higher residential rates)</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-sm">Scenario E: Company Purchase in Swansea</h4>
              <p className="text-sm text-slate-600 mt-1">£500,000 apartment block. Bought through limited company.</p>
              <p className="text-sm font-semibold text-purple-700 mt-2">Total LTT: £42,500 (company higher rates)</p>
            </div>
          </div>
        </div>

        {/* Payment & Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">When and How to Pay LTT in Wales</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            LTT must be paid to the <strong>Welsh Revenue Authority (WRA)</strong> within <strong>30 days</strong> of the effective date — typically the completion date when you receive the keys and the property legally transfers to you. Your conveyancing solicitor or licensed conveyancer will almost always handle the LTT return and payment on your behalf, collecting the funds from you before completion.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Even if no LTT is due — for example, a £200,000 main residence — an LTT return must still be filed. Your solicitor will submit this electronically through the WRA portal. If you are handling the transaction yourself without a solicitor, you can file the return directly via the WRA website, though this is rare for residential purchases.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Late filing or late payment incurs penalties. The WRA charges an automatic penalty for late returns, plus interest on any unpaid tax. These penalties escalate the longer the delay, so it is essential to ensure your solicitor has all funds cleared well before the completion date.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you paid higher rates because you had not sold your previous main residence by the completion date, you can claim a refund from the WRA once the sale completes. You have <strong>36 months</strong> from the purchase date of your new home to submit the refund claim. The refund will be the difference between the higher rates you paid and the main residential rates that would have applied.
          </p>
        </div>

        {/* Reliefs & Exemptions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">LTT Reliefs and Exemptions Available in Wales</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            While Wales does not offer first-time buyer relief, several other reliefs and exemptions are available that can reduce or eliminate your LTT liability.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Multiple Dwellings Relief (MDR)</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            If you buy two or more dwellings in a single transaction or linked transactions, you may be able to claim Multiple Dwellings Relief. This calculates the tax based on the average price per dwelling rather than the total price, which can significantly reduce the bill. However, from 2026, the Welsh Government is increasing the minimum tax rate under MDR from 1% to 3%, which may reduce the benefit for some transactions.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Charities Relief</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Charities may be eligible for relief from LTT when acquiring property for charitable purposes. The property must be held for use in furtherance of the charity's objectives, and the relief must be claimed in the LTT return.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Registered Social Landlords Relief</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Registered social landlords (RSLs) can claim relief on purchases of dwellings that will be used for social housing. The Welsh Government is currently reviewing whether to extend a similar relief to local authorities.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">Transactions Exempt from Higher Rates</h3>
          <p className="text-slate-600 leading-relaxed">
            The higher residential rates do not apply to certain property types, including: mixed-use properties (e.g., a shop with a flat above), caravans and mobile homes, houseboats, properties worth less than £40,000, and freehold properties with an underlying lease of more than 21 years held by someone unconnected to the buyer. If you are unsure whether your purchase qualifies for an exemption, consult your solicitor or the WRA directly.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions About Wales LTT</h2>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-slate-800">How much is stamp duty on a £400,000 house in Wales?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                For a £400,000 main residence, LTT is £13,500 (£10,500 on the £225,001–£400,000 band at 6%, plus £3,000 on the £400,001 portion at 7.5%). If it is an additional property, the higher rates apply and the bill rises to £31,500.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Do first-time buyers pay LTT in Wales?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                First-time buyers in Wales pay the same LTT rates as any other main residence purchaser. There is no first-time buyer relief. However, if the property is under £225,000, no LTT is payable regardless of buyer status.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Can I add LTT to my mortgage in Wales?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                No. Like stamp duty in England, LTT cannot be added to your mortgage. It must be paid upfront in cash (or via your solicitor from funds you provide). You should budget for LTT alongside your deposit, valuation fees, survey costs, and legal fees.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">What happens if I buy a new home before selling my old one?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                You will have to pay the higher residential rates on your new purchase. However, if you sell your previous main residence within 36 months, you can claim a refund from the WRA for the difference between the higher rates and the main residential rates.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Do companies pay higher LTT rates in Wales?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Yes. Companies must pay the higher residential rates on all residential property purchases over £40,000, unless the property has a short lease of 21 years or less. This applies regardless of whether the company owns other properties.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Is LTT the same as council tax?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                No. LTT is a one-time tax paid when you buy a property. Council tax is an ongoing annual tax paid to your local authority based on the property's valuation band. They are completely separate taxes administered by different bodies.
              </p>
            </div>
          </div>
        </div>

        {/* Trust & Authority */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 md:p-8 text-white">
          <h2 className="text-xl font-bold mb-3">Why Use Our Wales LTT Calculator?</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Updated with <strong className="text-white">2026 higher rates</strong> (5%–17%)</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Specifically built for <strong className="text-white">Welsh LTT rules</strong> — not confused with English SDLT</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Covers <strong className="text-white">main residences, second homes, companies, and trusts</strong></span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Aligned with <strong className="text-white">Welsh Revenue Authority (WRA)</strong> guidance</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Disclaimer: This calculator provides estimates for planning purposes. For official assessments, refer to the Welsh Revenue Authority or consult a qualified conveyancing solicitor. Rates are accurate as of 2025–2026.
          </p>
        </div>
        {/* Related Tools */}
        <div className="border-t border-slate-200 pt-12">
          <RelatedToolsSection
            category="Real Estate"
            categoryHref="/real-estate"
            currentPath={PAGE_PATH}
          />
        </div>
      </article>
    </main>
  );
}
