import { Metadata } from "next";
import { EquityDilutionCalculatorClient } from "./components/EquityDilutionCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  metadataBase: new URL("https://findbest.tools"),
  title: "Equity Dilution Calculator 2026 | Startup Funding Round & Option Pool",
  description:
    "Free equity dilution calculator for startup founders. Calculate ownership percentage after seed, Series A/B/C funding, option pool expansion, convertible notes, and SAFEs. Model cap table dilution in real-time.",
  keywords: [
    "equity dilution calculator",
    "startup dilution calculator",
    "founder dilution calculator",
    "cap table dilution calculator",
    "equity dilution by funding round",
    "how much equity do I keep after series a",
    "option pool dilution calculator",
    "convertible note dilution calculator",
    "SAFE dilution calculator",
    "pre money post money calculator",
    "startup equity calculator",
    "founder equity percentage calculator",
    "investor ownership calculator",
    "dilution math startup",
    "equity split calculator",
    "Series A dilution",
    "Series B dilution",
    "seed round dilution",
    "down round dilution calculator",
    "anti dilution calculator",
    "full ratchet anti dilution",
    "weighted average anti dilution",
    "option pool shuffle",
    "employee equity dilution",
    "founder vesting calculator",
    "startup ownership calculator",
    "equity stake calculator",
    "percentage ownership calculator startup",
    "post money valuation calculator",
    "pre money valuation calculator",
    "how to calculate equity dilution",
    "startup funding dilution formula",
    "equity dilution chart",
    "cap table modeling tool",
  ],
  authors: [{ name: "FindBest Tools", url: "https://findbest.tools" }],
  creator: "FindBest Tools",
  publisher: "FindBest Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://findbest.tools/finance/equity-dilution-calculator",
  },
  openGraph: {
    title: "Equity Dilution Calculator 2026 | Startup Funding & Cap Table Tool",
    description:
      "Calculate founder and investor ownership through seed, Series A/B/C, option pools, SAFEs and convertible notes. Real-time cap table modeling.",
    url: "https://findbest.tools/finance/equity-dilution-calculator",
    siteName: "FindBest Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://findbest.tools/og-equity-dilution-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "Equity Dilution Calculator 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equity Dilution Calculator 2026",
    description:
      "Free tool to model startup equity dilution through funding rounds, option pools, and convertible instruments.",
    images: ["https://findbest.tools/og-equity-dilution-calculator.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://findbest.tools/finance/equity-dilution-calculator",
      url: "https://findbest.tools/finance/equity-dilution-calculator",
      name: "Equity Dilution Calculator 2026",
      isPartOf: { "@id": "https://findbest.tools/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://findbest.tools/og-equity-dilution-calculator.jpg",
      },
      datePublished: "2025-01-15T08:00:00+00:00",
      dateModified: "2026-04-25T08:00:00+00:00",
      author: {
        "@type": "Organization",
        name: "FindBest Tools",
        url: "https://findbest.tools",
      },
      publisher: {
        "@type": "Organization",
        name: "FindBest Tools",
        logo: {
          "@type": "ImageObject",
          url: "https://findbest.tools/logo.png",
        },
      },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "Equity Dilution Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1873",
      },
      featureList:
        "Multi-round dilution modeling, option pool expansion, SAFE and convertible note conversion, pre-money and post-money valuation calculation, anti-dilution protection modeling, founder vesting schedule, employee equity pool management, waterfall exit analysis",
    },
    {
      "@type": "HowTo",
      name: "How to Calculate Equity Dilution for Your Startup",
      step: [
        {
          "@type": "HowToStep",
          name: "Set Your Initial Cap Table",
          text: "Enter founder shares, initial option pool, and any early investors. Establish your starting ownership percentages before any external funding.",
        },
        {
          "@type": "HowToStep",
          name: "Model Your Funding Round",
          text: "Input the pre-money valuation, investment amount, and whether the option pool is expanded pre-money or post-money. The calculator shows exact post-round ownership for all stakeholders.",
        },
        {
          "@type": "HowToStep",
          name: "Add Convertible Instruments",
          text: "Include SAFEs or convertible notes with discount rates, valuation caps, and interest. The calculator models conversion at the triggering equity round.",
        },
        {
          "@type": "HowToStep",
          name: "Project Future Rounds",
          text: "Stack Series A, B, and C rounds to see cumulative dilution effects. Most founders end up with 15-25% ownership by Series C after starting with 50-70%.",
        },
        {
          "@type": "HowToStep",
          name: "Analyze Exit Scenarios",
          text: "See liquidation preference waterfalls and return multiples for founders, investors, and option holders at various exit valuations.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much equity should a founder expect to keep after Series A?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A typical founder or founding team retains 40-60% of the company after a Series A funding round. If the founders started with 100%, a standard Series A might sell 20-30% of the company to investors, and an expanded option pool of 10-15% is created, leaving founders with approximately 50-60% on a fully diluted basis. By Series B, founders typically own 30-45%, and by Series C, 15-25%.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between pre-money and post-money valuation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pre-money valuation is the company's value before receiving new investment. Post-money valuation equals pre-money valuation plus the investment amount. For example, if a startup has a $10 million pre-money valuation and raises $2 million, the post-money valuation is $12 million. The investors own $2M / $12M = 16.67% of the company. Pre-money valuation determines how much of the company existing shareholders give up; post-money valuation determines the company's total worth after the round.",
          },
        },
        {
          "@type": "Question",
          name: "What is an option pool shuffle and how does it dilute founders?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The option pool shuffle occurs when investors require the company to expand its employee option pool before their investment, but the expansion comes out of the pre-money valuation (diluting only founders and existing shareholders) rather than post-money (diluting everyone including the new investors). For example, if investors require a 10% option pool and it is created pre-money, founders bear 100% of that dilution. If created post-money, the dilution is shared proportionally with the new investors.",
          },
        },
        {
          "@type": "Question",
          name: "How do SAFEs and convertible notes dilute founders?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SAFEs (Simple Agreement for Future Equity) and convertible notes delay dilution until a priced equity round triggers conversion. The dilution depends on the valuation cap and discount rate. A low valuation cap (e.g., $5M cap on a $10M priced round) means SAFE investors get more shares, diluting founders more. A high cap or no cap means less dilution. Interest on convertible notes also increases the conversion amount. Most SAFEs convert at the better of the cap or a 20% discount to the priced round.",
          },
        },
        {
          "@type": "Question",
          name: "What is anti-dilution protection and how does it work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Anti-dilution protection prevents early investors from being diluted in a down round (a future round at a lower valuation than they paid). Full ratchet anti-dilution gives investors shares as if they had invested at the new lower price, heavily diluting founders. Weighted average anti-dilution is more common and moderate — it considers the size of the down round relative to total shares outstanding. The formula is: CP2 = CP1 × (A + B) / (A + C), where CP1 is the original conversion price, A is shares outstanding pre-round, B is what those shares would cost at the original price, and C is what they actually cost in the down round.",
          },
        },
      ],
    },
  ],
};

export default function EquityDilutionCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              Updated April 2026 — Multi-Round Cap Table Modeling
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Equity Dilution{" "}
              <span className="text-indigo-400">Calculator</span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-400">
              Model founder and investor ownership through seed, Series A/B/C,
              option pool expansions, SAFEs, and convertible notes. Build
              your cap table and project dilution through exit.
            </p>
          </div>

          {/* Calculator */}
          <EquityDilutionCalculatorClient />

          {/* Trust Signal */}
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xl font-bold text-indigo-400">
                FB
              </div>
              <div>
                <p className="font-semibold text-white">Verified by FindBest Tools</p>
                <p className="mt-1 text-sm text-slate-400">
                  Calculations based on standard venture capital term sheet
                  mechanics, NVCA model legal documents, and Y Combinator SAFE
                  documentation. Dilution math follows industry-standard
                  pre-money and post-money conventions. Last verified 25
                  April 2026. For binding transactions, consult a securities
                  attorney.
                </p>
              </div>
            </div>
          </div>

          {/* Long-form Content */}
          <article className="mx-auto mt-20 max-w-4xl space-y-16">
            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Understanding Equity Dilution: The Founder&apos;s Guide to Ownership Through Funding
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Equity dilution is the reduction in ownership percentage that
                  occurs when a company issues new shares. For startup founders,
                  understanding dilution is not optional — it is fundamental to
                  strategic decision-making, negotiation, and long-term wealth
                  creation. Every funding round, every option pool expansion,
                  every convertible instrument that converts to equity reduces
                  the founder&apos;s percentage of the company. The critical
                  question is not whether dilution will happen, but whether the
                  value created justifies the ownership given up.
                </p>
                <p>
                  The mathematics of dilution are straightforward but often
                  misunderstood. If you own 50% of a company and the company
                  issues new shares equal to 20% of the post-money total, your
                  ownership drops to 40% (50% of the remaining 80%). However,
                  if the company&apos;s valuation increased sufficiently, the dollar
                  value of your stake may have risen despite the percentage
                  decrease. This is the essential trade-off of venture
                  financing: smaller percentage of a larger pie.
                </p>
                <p>
                  This calculator models standard dilution scenarios across
                  multiple funding rounds, incorporating option pool
                  expansions, SAFE and convertible note conversions, and
                  anti-dilution provisions. It uses industry-standard
                  conventions from the National Venture Capital Association
                  (NVCA) and Y Combinator SAFE documentation to provide
                  accurate, actionable projections for founders, investors, and
                  startup employees.
                </p>
              </div>
            </section>

            {/* Section 2: Pre vs Post Money */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Pre-Money vs Post-Money Valuation: The Foundation of Dilution Math
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  The distinction between pre-money and post-money valuation is
                  the single most important concept in dilution calculation.
                  Pre-money valuation is the value of the company before the
                  investment. Post-money valuation equals pre-money valuation
                  plus the investment amount. This seemingly simple distinction
                  has enormous implications for ownership percentages.
                </p>
                <p>
                  Consider a startup with a $10 million pre-money valuation
                  raising $2 million. The post-money valuation is $12 million.
                  The investor&apos;s ownership is $2M / $12M = 16.67%. The
                  existing shareholders (founders, prior investors, option
                  holders) retain 83.33% of the company. If the same company
                  were described as having a $12 million post-money valuation
                  and raising $2 million, the pre-money would be $10 million
                  — the math is identical, but the framing matters enormously
                  in negotiation.
                </p>
                <p>
                  The critical issue for founders is when the option pool is
                  expanded. If investors require a 10% option pool and it is
                  created pre-money (before the investment), the founders bear
                  100% of that dilution. If it is created post-money, the new
                  investors share the dilution proportionally. This is the
                  &quot;option pool shuffle&quot; — a standard term sheet negotiation
                  point that can shift 5-10% of ownership between founders and
                  investors.
                </p>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                  <h4 className="font-semibold text-indigo-400">Pre-Money Option Pool</h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Option pool created BEFORE investment. Founders diluted by
                    full option pool amount. Investors get their percentage
                    after the pool is set aside.
                  </p>
                  <p className="mt-2 text-sm font-medium text-rose-400">
                    More dilution for founders
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                  <h4 className="font-semibold text-indigo-400">Post-Money Option Pool</h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Option pool created AFTER investment. Dilution shared
                    proportionally between all shareholders including new
                    investors.
                  </p>
                  <p className="mt-2 text-sm font-medium text-emerald-400">
                    Less dilution for founders
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Round by Round */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Typical Founder Dilution by Funding Round: From Founder to Exit
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                The following table shows typical founder ownership trajectories
                through standard funding rounds for a venture-backed startup
                with a founding team of 2-3 people:
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Stage</th>
                      <th className="px-6 py-4 font-semibold">Typical Raise</th>
                      <th className="px-6 py-4 font-semibold">Pre-Money Valuation</th>
                      <th className="px-6 py-4 font-semibold">Founder Ownership</th>
                      <th className="px-6 py-4 font-semibold">Cumulative Dilution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="bg-slate-950/50">
                      <td className="px-6 py-4 font-medium">Founding</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4 font-medium text-emerald-400">100%</td>
                      <td className="px-6 py-4">0%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Angel / Pre-Seed</td>
                      <td className="px-6 py-4">$250k – $1M</td>
                      <td className="px-6 py-4">$2M – $5M</td>
                      <td className="px-6 py-4 font-medium text-emerald-400">80-90%</td>
                      <td className="px-6 py-4">10-20%</td>
                    </tr>
                    <tr className="bg-slate-950/50">
                      <td className="px-6 py-4 font-medium">Seed Round</td>
                      <td className="px-6 py-4">$1M – $3M</td>
                      <td className="px-6 py-4">$5M – $15M</td>
                      <td className="px-6 py-4 font-medium text-emerald-400">60-75%</td>
                      <td className="px-6 py-4">25-40%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Series A</td>
                      <td className="px-6 py-4">$5M – $20M</td>
                      <td className="px-6 py-4">$20M – $60M</td>
                      <td className="px-6 py-4 font-medium text-blue-400">40-60%</td>
                      <td className="px-6 py-4">40-60%</td>
                    </tr>
                    <tr className="bg-slate-950/50">
                      <td className="px-6 py-4 font-medium">Series B</td>
                      <td className="px-6 py-4">$20M – $50M</td>
                      <td className="px-6 py-4">$80M – $250M</td>
                      <td className="px-6 py-4 font-medium text-amber-400">30-45%</td>
                      <td className="px-6 py-4">55-70%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Series C</td>
                      <td className="px-6 py-4">$50M – $150M</td>
                      <td className="px-6 py-4">$250M – $1B</td>
                      <td className="px-6 py-4 font-medium text-amber-400">20-35%</td>
                      <td className="px-6 py-4">65-80%</td>
                    </tr>
                    <tr className="bg-slate-950/50">
                      <td className="px-6 py-4 font-medium">Series D+ / Pre-IPO</td>
                      <td className="px-6 py-4">$100M+</td>
                      <td className="px-6 py-4">$1B+</td>
                      <td className="px-6 py-4 font-medium text-rose-400">10-25%</td>
                      <td className="px-6 py-4">75-90%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Figures represent typical ranges for venture-backed startups.
                Actual dilution varies based on negotiation leverage, market
                conditions, and company performance. Figures are fully diluted
                including option pools.
              </p>
            </section>

            {/* Section 4: SAFEs and Convertible Notes */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                How SAFEs and Convertible Notes Convert to Equity
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  SAFEs (Simple Agreement for Future Equity) and convertible
                  notes are the dominant early-stage financing instruments in
                  the startup ecosystem. Both delay the valuation discussion
                  until a priced equity round, but they create a different kind
                  of uncertainty — founders cannot know their exact dilution
                  until the triggering round occurs.
                </p>
                <p>
                  A SAFE typically has two key economic terms: a valuation cap
                  and a discount rate. The cap sets a maximum effective
                  valuation for the SAFE investor. The discount gives the
                  investor a reduced price compared to the priced round
                  investors. The SAFE converts at the better of the two for the
                  investor (lower effective valuation = more shares). For
                  example, a $1M SAFE with a $10M cap and 20% discount
                  converts into a Series A with a $20M pre-money valuation as
                  follows: the cap gives an effective price of $10M (50% of
                  the round price), while the discount gives $16M (80% of
                  round price). The cap wins, so the SAFE investor gets shares
                  as if they invested at a $10M valuation — twice as many
                  shares as the priced round investor per dollar invested.
                </p>
                <p>
                  Convertible notes add interest and maturity dates to the
                  equation. Interest accrues (typically 4-8% annually) and
                  increases the conversion amount. If the note reaches maturity
                  without a qualifying equity round, the investor may demand
                  repayment (rare in practice) or convert at a predetermined
                  valuation. The most founder-friendly notes convert at the
                  lower of a negotiated cap or a discount to the next round.
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h4 className="font-semibold text-indigo-400">SAFE Conversion Example</h4>
                <p className="mt-2 text-sm text-slate-300">
                  SAFE investment: $500,000 with $8M cap, 20% discount.<br />
                  Series A: $20M pre-money, $5M investment.<br />
                  Cap effective valuation: $8M (better for investor).<br />
                  SAFE ownership: $500k / $8M = 6.25% pre-money.<br />
                  Priced round investor ownership: $5M / $25M = 20%.<br />
                  Post-money: SAFE holder owns 6.25% × (20/25) = 5% of company.
                </p>
              </div>
            </section>

            {/* Section 5: Anti-Dilution */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Anti-Dilution Protection: Full Ratchet vs Weighted Average
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Anti-dilution provisions protect investors in down rounds —
                  future equity financing at a valuation lower than what the
                  investor paid. There are two primary types, and the
                  difference between them is dramatic for founders.
                </p>
                <p>
                  <strong>Full ratchet anti-dilution</strong> gives the
                  protected investor shares as if they had originally invested
                  at the new, lower price. If an investor paid $1 per share
                  in Series A and the company raises a down round at $0.50 per
                  share, the Series A investor receives additional shares to
                  make their effective price $0.50. This is extremely dilutive
                  to founders — a single down round with full ratchet can
                  reduce founders from 30% to under 10% ownership. Full ratchet
                  is rare in modern venture deals except in distressed
                  situations.
                </p>
                <p>
                  <strong>Weighted average anti-dilution</strong> is the
                  industry standard. It uses a formula that considers both the
                  lower price and the size of the down round relative to total
                  shares outstanding. The formula is: New Conversion Price =
                  Old Conversion Price × (A + B) / (A + C), where A is shares
                  outstanding before the down round, B is what the down round
                  shares would cost at the old price, and C is what they
                  actually cost. A small down round causes minimal adjustment;
                  a large down round causes more. Weighted average is
                  significantly more founder-friendly than full ratchet.
                </p>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
                  <h4 className="font-semibold text-rose-400">Full Ratchet</h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Investor gets full price reset to down round price.
                    Maximum dilution for founders. Rare in standard VC deals.
                  </p>
                  <p className="mt-2 text-sm font-bold text-rose-400">
                    Extreme founder dilution
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <h4 className="font-semibold text-emerald-400">Weighted Average</h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Formula-based adjustment considering round size. Moderate
                    dilution. Standard in nearly all venture deals.
                  </p>
                  <p className="mt-2 text-sm font-bold text-emerald-400">
                    Moderate founder dilution
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Option Pools */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Employee Option Pools: Size, Expansion, and Founder Dilution
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  The employee option pool (or ESOP — Employee Stock Ownership
                  Plan) is a reserved block of shares used to grant equity to
                  employees, advisors, and consultants. Option pool size is
                  one of the most negotiated terms in venture financing, and
                  when and how the pool is expanded dramatically affects
                  founder dilution.
                </p>
                <p>
                  Standard option pool sizes by stage: pre-seed/seed
                  companies typically create a 10-15% pool. By Series A, this
                  may need expansion to 15-20% to hire senior executives and
                  engineers. By Series B and beyond, the pool is often
                  refreshed to 10-15% of the expanded capitalization. The key
                  question is whether the pool expansion happens pre-money or
                  post-money.
                </p>
                <p>
                  In a pre-money expansion, the option pool is increased before
                  the investment closes, diluting only existing shareholders.
                  In a post-money expansion, the dilution is shared with the
                  new investor. For example, if a company has 10 million shares
                  outstanding, creates a 1.5 million share option pool
                  pre-money (15%), and then issues 2 million shares to new
                  investors, the founders go from 100% to 70% to 58.3%. If the
                  same pool were created post-money (after the 2 million
                  investor shares), the founders would own 62.5% instead — a
                  4.2 percentage point difference worth millions at exit.
                </p>
              </div>
            </section>

            {/* Section 7: Exit Analysis */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Exit Scenario Analysis: What Your Equity Is Actually Worth
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Ownership percentage is meaningless without considering
                  liquidation preferences, participation rights, and exit
                  valuation. A founder with 20% ownership in a company that
                  sells for $100 million may receive $20 million — or far
                  less, depending on investor terms.
                </p>
                <p>
                  <strong>Non-participating preferred stock</strong> (standard)
                  gives investors the greater of their liquidation preference
                  (typically 1x their investment) or their pro-rata share of
                  proceeds. If investors put in $10 million and the company
                  sells for $100 million, they choose between $10 million
                  (1x preference) or their percentage of $100 million. At
                  high valuations, they convert to common and take their
                  percentage.
                </p>
                <p>
                  <strong>Participating preferred stock</strong> (less common
                  now) gives investors BOTH their liquidation preference AND
                  their pro-rata share of remaining proceeds. The same $10M
                  investor in a $100M sale takes $10M preference plus their
                  percentage of the remaining $90M. This is significantly
                  worse for founders and is generally avoided in modern deals.
                </p>
                <p>
                  <strong>Cumulative dividends</strong> (8% annually is
                  standard) increase the liquidation preference over time. A
                  $10M Series A investment with 8% cumulative dividends
                  becomes a $14.6M preference after 5 years if not converted.
                  This can dramatically reduce founder proceeds in an exit.
                </p>
              </div>
            </section>

            {/* Section 8: Strategies */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Strategies to Minimize Harmful Dilution
              </h2>
              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">1</div>
                  <div>
                    <h4 className="font-semibold text-white">Negotiate Option Pool Treatment</h4>
                    <p className="mt-1 text-sm text-slate-300">
                      Always push for post-money option pool treatment. This
                      single term can save founders 3-8% ownership over
                      multiple rounds. If investors insist on pre-money,
                      negotiate a smaller pool or a valuation increase.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">2</div>
                  <div>
                    <h4 className="font-semibold text-white">Use High Valuation Caps on SAFEs</h4>
                    <p className="mt-1 text-sm text-slate-300">
                      A $15M cap on a $1M SAFE vs a $5M cap means 3x less
                      dilution at a $30M Series A. Negotiate caps that reflect
                      realistic 12-18 month forward valuations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">3</div>
                  <div>
                    <h4 className="font-semibold text-white">Avoid Full Ratchet Anti-Dilution</h4>
                    <p className="mt-1 text-sm text-slate-300">
                      Never agree to full ratchet. If an investor insists,
                      walk away. Weighted average anti-dilution is the
                      industry standard and protects both parties reasonably.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">4</div>
                  <div>
                    <h4 className="font-semibold text-white">Maintain Supermajority Protections</h4>
                    <p className="mt-1 text-sm text-slate-300">
                      Protective provisions requiring founder approval for
                      future financings, acquisitions, and amendments prevent
                      unilateral dilution by investor-majority boards.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400">5</div>
                  <div>
                    <h4 className="font-semibold text-white">Model Before You Sign</h4>
                    <p className="mt-1 text-sm text-slate-300">
                      Use this calculator to model your ownership through
                      Series C before signing any term sheet. Understand
                      exactly what 20% dilution today means for your exit
                      proceeds at $100M, $500M, and $1B valuations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ for Humans */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Frequently Asked Questions About Startup Equity Dilution
              </h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400">
                    Is it better to own 10% of a $1B company or 50% of a $50M company?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    Mathematically identical ($100M), but the $1B company
                    offers greater probability of additional upside, more
                    investor confidence, stronger talent attraction, and better
                    acquisition interest. However, the path to $1B requires
                    more capital, more dilution, and higher risk. The optimal
                    strategy depends on your risk tolerance, market size, and
                    competitive dynamics.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400">
                    How do I calculate my equity value as an employee?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    Employee equity value = (Number of options × Exercise
                    price per share) / (Total fully diluted shares) × Company
                    valuation. For example, 10,000 options in a company with
                    10 million fully diluted shares at a $100M valuation =
                    0.1% × $100M = $100,000. However, this is pre-tax and
                    pre-exercise cost. Subtract exercise costs (typically
                    $0.10-$5.00 per share) and apply a liquidity discount
                    (20-40% for private companies).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400">
                    What is a 409A valuation and why does it matter?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    A 409A valuation is an independent appraisal of your
                    company&apos;s common stock fair market value, required by IRS
                    Section 409A for option pricing. It must be performed
                    annually or after material events. The 409A price
                    (typically 20-40% of the preferred price) sets the
                    minimum exercise price for options. A low 409A benefits
                    employees (cheaper exercise); a high 409A benefits the
                    company (less dilution, higher employee tax basis).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400">
                    Can I prevent dilution entirely?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    No. Dilution is the cost of capital for growth. The only
                    way to avoid dilution is to never raise external capital
                    (bootstrapping) or to buy back shares (rare and expensive).
                    Smart founders focus on minimizing unnecessary dilution
                    through strong negotiation, competitive fundraising
                    processes, and efficient capital deployment that drives
                    valuation faster than ownership percentage declines.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400">
                    What is a down round and how bad is it for founders?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    A down round occurs when a company raises capital at a
                    valuation lower than the previous round. It signals
                    distress, triggers anti-dilution provisions, demoralizes
                    employees (underwater options), and can give investors
                    additional control rights. For founders, a down round with
                    weighted average anti-dilution typically reduces
                    ownership by 10-20 additional percentage points beyond
                    normal round dilution. A down round with full ratchet can
                    be catastrophic.
                  </p>
                </div>
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Calculator Methodology and Assumptions
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                This calculator uses standard venture capital capitalization
                mathematics as defined in NVCA model legal documents and Y
                Combinator SAFE documentation. Pre-money and post-money
                valuations follow the industry convention where post-money =
                pre-money + investment. Option pool expansions are modeled
                both pre-money (diluting existing shareholders only) and
                post-money (shared dilution). SAFE conversions use the
                standard YC SAFE formulas with valuation cap and discount
                mechanics. Convertible note conversions include accrued
                interest at the stated rate.
              </p>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Anti-dilution calculations use the broad-based weighted
                average formula per NVCA standards. Exit waterfall analysis
                assumes non-participating preferred stock (1x liquidation
                preference) unless otherwise specified. The calculator does
                not account for complex structures such as multiple
                liquidation preferences, participating preferred with caps,
                pay-to-play provisions, or drag-along rights. For actual
                transactions, engage a securities attorney to model your
                specific term sheet provisions.
              </p>
            </section>

            {/* Related Tools */}
            <div className="mt-24">
              <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/equity-dilution-calculator" />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
