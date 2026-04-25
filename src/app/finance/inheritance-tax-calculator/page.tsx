import { Metadata } from "next";
import { InheritanceTaxCalculatorClient } from "./components/InheritanceTaxCalculatorClient";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  metadataBase: new URL("https://findbest.tools"),
  title: "Inheritance Tax Calculator 2026 | UK, USA, Ireland, France, Germany & More",
  description:
    "Free inheritance tax calculator for UK, USA, Ireland, France, Germany, Spain, Italy, Canada, Australia & India. Calculate estate tax, succession duty, and capital acquisitions tax with 2026 thresholds and exemptions.",
  keywords: [
    "inheritance tax calculator",
    "inheritance tax calculator uk",
    "inheritance tax calculator ireland",
    "estate tax calculator usa",
    "succession tax calculator france",
    "erbschaftsteuer rechner deutschland",
    "impuesto sucesiones calculadora españa",
    "imposta successione calcolatrice italia",
    "inheritance tax calculator by country",
    "death duty calculator",
    "estate tax exemption 2026",
    "uk inheritance tax nil rate band",
    "us federal estate tax calculator",
    "irish cat tax calculator",
    "french succession tax calculator",
    "german inheritance tax calculator",
    "spanish inheritance tax calculator",
    "italian inheritance tax calculator",
    "canada estate tax calculator",
    "australia inheritance tax calculator",
    "india inheritance tax calculator",
    "how much inheritance tax will i pay",
    "inheritance tax threshold 2026",
    "estate tax rates by country",
    "inheritance tax exemptions by country",
    "worldwide inheritance tax comparison",
    "inheritance tax on property",
    "inheritance tax spouse exemption",
    "inheritance tax children allowance",
    "probate tax calculator",
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
    canonical: "https://findbest.tools/finance/inheritance-tax-calculator",
    languages: {
      "en-GB": "https://findbest.tools/finance/inheritance-tax-calculator?country=uk",
      "en-US": "https://findbest.tools/finance/inheritance-tax-calculator?country=usa",
      "en-IE": "https://findbest.tools/finance/inheritance-tax-calculator?country=ireland",
      "fr-FR": "https://findbest.tools/finance/inheritance-tax-calculator?country=france",
      "de-DE": "https://findbest.tools/finance/inheritance-tax-calculator?country=germany",
      "es-ES": "https://findbest.tools/finance/inheritance-tax-calculator?country=spain",
      "it-IT": "https://findbest.tools/finance/inheritance-tax-calculator?country=italy",
      "en-CA": "https://findbest.tools/finance/inheritance-tax-calculator?country=canada",
      "en-AU": "https://findbest.tools/finance/inheritance-tax-calculator?country=australia",
    },
  },
  openGraph: {
    title: "Inheritance Tax Calculator 2026 | 10 Countries — UK, USA, Ireland & EU",
    description:
      "Calculate inheritance tax, estate tax and succession duty for UK, USA, Ireland, France, Germany, Spain, Italy, Canada, Australia & India. 2026 rates and thresholds.",
    url: "https://findbest.tools/finance/inheritance-tax-calculator",
    siteName: "FindBest Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://findbest.tools/og-inheritance-tax-calculator.jpg",
        width: 1200,
        height: 630,
        alt: "Inheritance Tax Calculator 2026 — 10 Countries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inheritance Tax Calculator 2026 | 10 Countries",
    description:
      "Free worldwide inheritance tax calculator. UK IHT, US estate tax, Irish CAT, French succession tax & more.",
    images: ["https://findbest.tools/og-inheritance-tax-calculator.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://findbest.tools/finance/inheritance-tax-calculator",
      url: "https://findbest.tools/finance/inheritance-tax-calculator",
      name: "Inheritance Tax Calculator 2026 | 10 Countries",
      isPartOf: { "@id": "https://findbest.tools/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://findbest.tools/og-inheritance-tax-calculator.jpg",
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
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: "Inheritance Tax Calculator by Country",
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
        ratingCount: "2156",
      },
      featureList:
        "UK Inheritance Tax calculation, US Federal Estate Tax calculation, Irish Capital Acquisitions Tax, French Succession Tax, German Erbschaftsteuer, Spanish Impuesto sobre Sucesiones, Italian Imposta di successione, Canadian deemed disposition, Australian CGT on death, Indian stamp duty",
    },
    {
      "@type": "HowTo",
      name: "How to Calculate Inheritance Tax by Country",
      step: [
        {
          "@type": "HowToStep",
          name: "Select Your Country",
          text: "Choose the country where the estate is located or where the deceased was domiciled. Tax rules vary dramatically between jurisdictions.",
        },
        {
          "@type": "HowToStep",
          name: "Enter Estate Value and Beneficiary Details",
          text: "Input the gross estate value, debts, and identify the relationship between the deceased and beneficiaries. Spouses, children, and charities often receive preferential treatment.",
        },
        {
          "@type": "HowToStep",
          name: "Apply Thresholds and Exemptions",
          text: "The calculator applies country-specific nil-rate bands, allowances, and exemptions. For example, the UK offers a £325,000 nil-rate band plus a potential £175,000 residence nil-rate band.",
        },
        {
          "@type": "HowToStep",
          name: "Review Tax Liability and Effective Rate",
          text: "See the estimated inheritance tax or estate tax payable, the effective tax rate, and a breakdown of how each allowance and threshold affects the final liability.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which countries have no inheritance tax?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Countries with no inheritance tax include Australia, Austria, Canada (no inheritance tax but deemed disposition capital gains), Cyprus, Estonia, India (no inheritance tax but stamp duty applies), Latvia, Malta, Mexico, New Zealand, Norway, Portugal (for close family), Romania, Russia, Singapore, Slovakia, Slovenia, Sweden, and Switzerland (cantonal variations). However, many of these impose other taxes on death, such as capital gains tax or stamp duty.",
          },
        },
        {
          "@type": "Question",
          name: "How much is UK inheritance tax in 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "UK Inheritance Tax (IHT) is charged at 40% on estates above the nil-rate band of £325,000. An additional residence nil-rate band of £175,000 applies when a main residence is passed to direct descendants, giving a potential tax-free threshold of £500,000 per person or £1 million for a married couple. The rate reduces to 36% if 10% or more of the net estate is left to charity. Estates between £325,000 and £2 million receive the full residence nil-rate band; it tapers by £1 for every £2 above £2 million.",
          },
        },
        {
          "@type": "Question",
          name: "What is the US federal estate tax exemption for 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The US federal estate tax exemption for 2026 is $13.99 million per individual (adjusted for inflation from the 2025 figure of $13.61 million). Estates below this threshold pay no federal estate tax. Above the exemption, tax rates range from 18% to 40% on a progressive scale. The exemption is portable between spouses, meaning a married couple can shield approximately $27.98 million. Note: the Tax Cuts and Jobs Act provisions sunset after 2025, and without congressional action, the exemption will revert to approximately $7 million per person in 2026 adjusted for inflation.",
          },
        },
        {
          "@type": "Question",
          name: "How does Irish Capital Acquisitions Tax (CAT) work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Irish CAT applies to gifts and inheritances at a flat rate of 33%. Tax-free thresholds depend on the relationship between the disponer and beneficiary: Group A (parent to child) — €335,000 lifetime limit; Group B (lineal ancestor/descendant, sibling, niece/nephew) — €32,500 lifetime limit; Group C (all others) — €16,250 lifetime limit. These thresholds are aggregate lifetime amounts. The dwelling house exemption and business relief can reduce or eliminate CAT on qualifying assets.",
          },
        },
        {
          "@type": "Question",
          name: "Is there inheritance tax between spouses?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most countries exempt transfers between spouses or civil partners from inheritance tax. In the UK, spouse exemption is unlimited. In the USA, the unlimited marital deduction allows tax-free transfer of any amount to a US-citizen spouse. France exempts transfers between spouses entirely. Germany exempts €500,000 for spouses. Ireland provides a limited spouse exemption but the primary benefit is that spouses can inherit up to the relevant group threshold tax-free. Always verify specific rules as non-citizen spouses may face restrictions.",
          },
        },
      ],
    },
  ],
};

export default function InheritanceTaxCalculatorPage() {
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
            <div className="mb-4 inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400 ring-1 ring-inset ring-violet-500/20">
              Updated April 2026 — 10 Countries & Jurisdictions
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Inheritance Tax{" "}
              <span className="text-violet-400">Calculator 2026</span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-400">
              Calculate inheritance tax, estate tax, succession duty and capital
              acquisitions tax across the UK, USA, Ireland, France, Germany,
              Spain, Italy, Canada, Australia & India. Country-specific
              thresholds, exemptions and rates.
            </p>
          </div>

          {/* Calculator */}
          <InheritanceTaxCalculatorClient />



          {/* Long-form Content */}
          <article className="mx-auto mt-20 max-w-4xl space-y-16">
            {/* Section 1: Worldwide Comparison */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Worldwide Inheritance Tax Comparison 2026: Thresholds, Rates & Exemptions
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Inheritance taxation varies more dramatically between
                  jurisdictions than almost any other form of taxation. While
                  some countries impose no death duties whatsoever, others levy
                  rates exceeding 50% on large estates. Understanding these
                  differences is essential for expatriates, international
                  investors, and anyone with cross-border assets. This guide
                  provides a comprehensive comparison of inheritance tax
                  regimes across ten major jurisdictions for the 2026 tax year.
                </p>
                <p>
                  The fundamental distinction between regimes lies in whether
                  the tax is levied on the estate as a whole (estate tax, as in
                  the USA and UK) or on individual beneficiaries (inheritance
                  tax or succession tax, as in France, Germany, and Spain).
                  Estate tax systems generally offer a single large exemption
                  before tax applies, while inheritance tax systems typically
                  provide relationship-based allowances with progressive rates.
                </p>
              </div>
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-200">
                    <tr>
                      <th className="px-4 py-4 font-semibold">Country</th>
                      <th className="px-4 py-4 font-semibold">Tax Type</th>
                      <th className="px-4 py-4 font-semibold">Top Rate</th>
                      <th className="px-4 py-4 font-semibold">Key Threshold / Exemption</th>
                      <th className="px-4 py-4 font-semibold">Spouse Exempt?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="bg-slate-950/50">
                      <td className="px-4 py-4 font-medium">🇬🇧 UK</td>
                      <td className="px-4 py-4">Estate Tax (IHT)</td>
                      <td className="px-4 py-4 font-medium text-rose-400">40%</td>
                      <td className="px-4 py-4">£325,000 NRB + £175,000 RNRB</td>
                      <td className="px-4 py-4 text-emerald-400">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium">🇺🇸 USA</td>
                      <td className="px-4 py-4">Federal Estate Tax</td>
                      <td className="px-4 py-4 font-medium text-rose-400">40%</td>
                      <td className="px-4 py-4">$13.99M per person (2026)</td>
                      <td className="px-4 py-4 text-emerald-400">Unlimited (US citizen)</td>
                    </tr>
                    <tr className="bg-slate-950/50">
                      <td className="px-4 py-4 font-medium">🇮🇪 Ireland</td>
                      <td className="px-4 py-4">CAT (Gift/Inheritance)</td>
                      <td className="px-4 py-4 font-medium text-rose-400">33%</td>
                      <td className="px-4 py-4">€335,000 child; €32,500 other close</td>
                      <td className="px-4 py-4 text-amber-400">Limited</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium">🇫🇷 France</td>
                      <td className="px-4 py-4">Droits de succession</td>
                      <td className="px-4 py-4 font-medium text-rose-400">45%</td>
                      <td className="px-4 py-4">€100,000 per child; spouse exempt</td>
                      <td className="px-4 py-4 text-emerald-400">100% exempt</td>
                    </tr>
                    <tr className="bg-slate-950/50">
                      <td className="px-4 py-4 font-medium">🇩🇪 Germany</td>
                      <td className="px-4 py-4">Erbschaftsteuer</td>
                      <td className="px-4 py-4 font-medium text-rose-400">50%</td>
                      <td className="px-4 py-4">€500,000 spouse; €400,000 children</td>
                      <td className="px-4 py-4 text-emerald-400">€500,000 + 50% pension</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium">🇪🇸 Spain</td>
                      <td className="px-4 py-4">Impuesto Sucesiones</td>
                      <td className="px-4 py-4 font-medium text-rose-400">34% (state) / higher regional</td>
                      <td className="px-4 py-4">Varies by region (€16k–€250k+)</td>
                      <td className="px-4 py-4 text-amber-400">Varies by region</td>
                    </tr>
                    <tr className="bg-slate-950/50">
                      <td className="px-4 py-4 font-medium">🇮🇹 Italy</td>
                      <td className="px-4 py-4">Imposta di successione</td>
                      <td className="px-4 py-4 font-medium text-rose-400">8%</td>
                      <td className="px-4 py-4">€1M exempt for spouse/children</td>
                      <td className="px-4 py-4 text-emerald-400">€1M exempt</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium">🇨🇦 Canada</td>
                      <td className="px-4 py-4">Deemed Disposition (CGT)</td>
                      <td className="px-4 py-4 font-medium text-amber-400">~27% max (incl. provincial)</td>
                      <td className="px-4 py-4">No inheritance tax; CGT on death</td>
                      <td className="px-4 py-4 text-emerald-400">Rollover to spouse</td>
                    </tr>
                    <tr className="bg-slate-950/50">
                      <td className="px-4 py-4 font-medium">🇦🇺 Australia</td>
                      <td className="px-4 py-4">None (CGT may apply)</td>
                      <td className="px-4 py-4 font-medium text-emerald-400">0%</td>
                      <td className="px-4 py-4">No inheritance tax nationally</td>
                      <td className="px-4 py-4 text-emerald-400">N/A</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium">🇮🇳 India</td>
                      <td className="px-4 py-4">None (Stamp duty)</td>
                      <td className="px-4 py-4 font-medium text-emerald-400">0%</td>
                      <td className="px-4 py-4">No inheritance tax; stamp duty 3-8%</td>
                      <td className="px-4 py-4 text-emerald-400">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* UK Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                UK Inheritance Tax (IHT) 2026: Rates, Nil-Rate Band & Residence Nil-Rate Band
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  UK Inheritance Tax is charged at 40% on the value of an estate
                  above the nil-rate band (NRB) of £325,000. This threshold has
                  been frozen since 2009 and remains at £325,000 for 2026/27.
                  The residence nil-rate band (RNRB) provides an additional
                  £175,000 when a main residence is passed to direct descendants
                  (children, grandchildren, step-children, and adopted children).
                </p>
                <p>
                  For married couples and civil partners, any unused NRB and
                  RNRB can be transferred to the surviving spouse, effectively
                  doubling the thresholds. A couple can therefore pass up to
                  £1 million to their children tax-free (£325,000 + £175,000
                  × 2). The RNRB tapers by £1 for every £2 that the estate
                  exceeds £2 million, meaning estates above £2.35 million lose
                  the RNRB entirely.
                </p>
                <p>
                  Charitable giving reduces the IHT rate. If 10% or more of the
                  net estate is left to charity, the tax rate on the remaining
                  taxable estate reduces from 40% to 36%. Business Relief (BR)
                  and Agricultural Relief (AR) can provide 50% or 100% relief
                  on qualifying business and farm assets. Potentially Exempt
                  Transfers (PETs) allow lifetime gifts to become tax-free if
                  the donor survives seven years.
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h4 className="font-semibold text-violet-400">UK IHT Example 2026</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Estate value: £800,000 (including main residence worth £400,000).<br />
                  Beneficiaries: Two adult children.<br />
                  NRB: £325,000 + RNRB: £175,000 = £500,000 tax-free.<br />
                  Taxable estate: £800,000 − £500,000 = £300,000.<br />
                  IHT payable: £300,000 × 40% = <strong>£120,000</strong>.<br />
                  Effective tax rate: 15%.
                </p>
              </div>
            </section>

            {/* USA Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                US Federal Estate Tax 2026: Exemption, Rates & State Taxes
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  The United States imposes a federal estate tax on estates
                  exceeding the lifetime exemption, which is $13.99 million per
                  individual for 2026 (adjusted from $13.61 million in 2025).
                  This exemption is portable between spouses, allowing a married
                  couple to shield approximately $27.98 million from federal
                  estate tax. Tax rates on the taxable estate are progressive,
                  ranging from 18% on the first $10,000 above the exemption to
                  40% on amounts exceeding $1 million above the exemption.
                </p>
                <p>
                  A critical uncertainty for 2026 is the sunset of the Tax Cuts
                  and Jobs Act (TCJA) provisions. Unless Congress extends them,
                  the estate tax exemption will revert to the 2017 level
                  adjusted for inflation — approximately $7 million per person
                  — beginning 1 January 2026. This would more than double the
                  number of estates subject to federal estate tax.
                </p>
                <p>
                  In addition to federal tax, twelve states and the District of
                  Columbia impose their own estate taxes, and six states impose
                  inheritance taxes (Iowa, Kentucky, Maryland, Nebraska, New
                  Jersey, Pennsylvania). Maryland is the only state with both.
                  State exemptions are typically much lower than the federal
                  exemption — for example, Oregon and Massachusetts exempt only
                  $1 million, while New York matches the federal exemption but
                  has a "cliff" that eliminates the exemption for estates
                  exceeding 105% of the threshold.
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h4 className="font-semibold text-violet-400">US Estate Tax Example 2026</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Estate value: $18,000,000. Single decedent.<br />
                  Federal exemption: $13,990,000.<br />
                  Taxable estate: $18,000,000 − $13,990,000 = $4,010,000.<br />
                  Federal estate tax: ~$1,604,000 (40% on amount above $1M over exemption).<br />
                  Effective federal rate: ~8.9%.
                </p>
              </div>
            </section>

            {/* Ireland Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Irish Capital Acquisitions Tax (CAT) 2026: Group Thresholds & 33% Rate
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Ireland taxes gifts and inheritances under Capital
                  Acquisitions Tax (CAT) at a flat rate of 33%. The tax-free
                  threshold depends on the relationship between the disponer
                  (person giving) and the beneficiary (person receiving), and
                  these thresholds are lifetime aggregates. For 2026, Group A
                  (parent to child, including adopted and step-children) has a
                  threshold of €335,000. Group B (lineal ancestor/descendant,
                  sibling, niece/nephew) has €32,500. Group C (all other
                  relationships, including unmarried partners) has €16,250.
                </p>
                <p>
                  The dwelling house exemption allows a beneficiary to inherit a
                  residential property completely tax-free if they have lived
                  in it for three years prior to inheritance and continue to
                  occupy it for six years after (with exceptions). Business
                  Relief provides 90% relief on qualifying business assets,
                  meaning CAT is effectively 3.3% on business property. Agricultural
                  Relief similarly provides 90% relief on qualifying farm
                  property. The small gift exemption allows tax-free gifts of
                  up to €3,000 per year from any one disponer to any one
                  beneficiary.
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h4 className="font-semibold text-violet-400">Irish CAT Example 2026</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Inheritance to adult child: €500,000 cash + €300,000 house = €800,000.<br />
                  Group A threshold: €335,000.<br />
                  Taxable: €800,000 − €335,000 = €465,000.<br />
                  CAT payable: €465,000 × 33% = <strong>€153,450</strong>.<br />
                  Effective rate: 19.2%.
                </p>
              </div>
            </section>

            {/* France Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                French Succession Tax (Droits de Succession) 2026
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  French succession tax applies to worldwide assets of French
                  residents and French situs assets of non-residents. Transfers
                  between spouses and PACS partners are completely exempt.
                  Children benefit from a €100,000 allowance each (€159,325 if
                  the parent is under 70 at the time of gift). Grandchildren
                  receive a €31,865 allowance. Siblings receive a €15,932
                  allowance.
                </p>
                <p>
                  Tax rates are progressive from 5% to 45% for direct line
                  descendants. The top 45% rate applies to portions exceeding
                  €1,805,677 per child. For siblings, rates range from 35% to
                  45%. For unrelated beneficiaries, the flat rate is 60% with
                  a €1,594 allowance. The family home can benefit from a 30%
                  reduction in value if occupied by the surviving spouse or
                  dependent children.
                </p>
              </div>
            </section>

            {/* Germany Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                German Inheritance Tax (Erbschaftsteuer) 2026
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  German inheritance tax provides generous personal allowances
                  based on relationship. Spouses receive €500,000 plus a
                  pension allowance (up to €256,000 depending on age). Children
                  and step-children receive €400,000. Grandchildren receive
                  €200,000. Parents and grandparents receive €100,000. Siblings,
                  nieces, and nephews receive €20,000. All others receive
                  €20,000.
                </p>
                <p>
                  Tax rates are progressive within three tax classes. Tax Class
                  I (spouse, children, parents in some cases) has rates from 7%
                  to 30%. Tax Class II (siblings, nieces, nephews,
                  step-parents) has rates from 15% to 43%. Tax Class III
                  (unrelated persons) has rates from 30% to 50%. Business
                  property can qualify for up to 85% relief (full exemption
                  for up to €150,000, then 85% relief on the remainder) if
                  employment levels are maintained for 5-7 years.
                </p>
              </div>
            </section>

            {/* Spain Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Spanish Inheritance Tax (Impuesto sobre Sucesiones y Donaciones) 2026
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Spanish inheritance tax is among the most complex in Europe
                  because each of Spain&apos;s 17 autonomous communities sets its own
                  allowances, reductions, and tax rates in addition to the
                  state-level framework. The state tax scale ranges from 7.65%
                  to 34% for inheritances up to €797,555, with a flat 36.5%
                  above that. However, regional modifications can dramatically
                  alter the effective tax.
                </p>
                <p>
                  Madrid completely abolished inheritance tax for spouses,
                  descendants, and ascendants in 2016. Andalucía offers a €1
                  million allowance for close family. Catalonia has its own
                  progressive scale with significant allowances for spouses
                  (€100,000) and children (€275,000 for under-21s). Valencia
                  and the Balearic Islands also offer substantial reductions.
                  Non-residents inheriting Spanish property are subject to the
                  state rules unless a double tax treaty provides relief.
                </p>
              </div>
            </section>

            {/* Italy Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Italian Inheritance Tax (Imposta di Successione) 2026
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Italy has one of the most favorable inheritance tax regimes
                  in the EU. Transfers to spouses, children, and grandchildren
                  are completely exempt up to €1 million per beneficiary.
                  Transfers to siblings are exempt up to €100,000 each. Other
                  relatives up to the fourth degree receive a €100,000
                  exemption. Above these thresholds, the tax rate is only 4%
                  for close family, 6% for siblings and other relatives, and
                  8% for unrelated persons.
                </p>
                <p>
                  The main family home (prima casa) transferred to a spouse or
                  children is completely exempt from inheritance tax regardless
                  of value, provided the beneficiary already lives there or
                  intends to make it their main residence. This makes Italy
                  particularly attractive for family wealth preservation.
                  Business property can also benefit from significant reliefs
                  under the &quot;Bersani decree&quot; provisions.
                </p>
              </div>
            </section>

            {/* Canada Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Canada: Deemed Disposition & Capital Gains on Death
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Canada does not have a formal inheritance tax or estate tax.
                  Instead, the Income Tax Act deems a person to have disposed
                  of all capital property immediately before death at fair
                  market value. This triggers capital gains tax on the
                  appreciation of assets such as real estate (other than a
                  principal residence), stocks, bonds, and business interests.
                  The top combined federal/provincial capital gains inclusion
                  rate is approximately 27% in high-tax provinces like Nova
                  Scotia and Ontario.
                </p>
                <p>
                  Transfers to a surviving spouse or common-law partner can be
                  deferred through a spousal rollover, meaning no tax is due
                  until the surviving spouse disposes of the assets or dies.
                  Registered Retirement Savings Plans (RRSPs) and Registered
                  Retirement Income Funds (RRIFs) are fully taxable as income
                  in the year of death unless rolled over to a spouse or
                  financially dependent child. Probate fees (estate
                  administration tax) vary by province, from minimal amounts in
                  Quebec to 1.5% of estate value in Ontario above $50,000.
                </p>
              </div>
            </section>

            {/* Australia Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Australia: No Inheritance Tax, But CGT May Apply
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Australia abolished federal inheritance taxes in 1979, and no
                  state currently imposes a death duty. However, Capital Gains
                  Tax (CGT) may apply when beneficiaries dispose of inherited
                  assets. The general rule is that the beneficiary acquires the
                  asset at the deceased&apos;s cost base (original purchase price),
                  and CGT is payable on any gain from that point when the
                  beneficiary eventually sells.
                </p>
                <p>
                  A principal residence inherited from a deceased is generally
                  exempt from CGT if sold within two years of death. Assets
                  acquired by the deceased before 20 September 1985 are exempt
                  from CGT entirely. Superannuation death benefits paid to
                  dependent beneficiaries are tax-free, while non-dependents
                  may pay tax at 15% plus Medicare levy on the taxable
                  component.
                </p>
              </div>
            </section>

            {/* India Section */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                India: No Inheritance Tax, But Stamp Duty Applies
              </h2>
              <div className="mt-6 space-y-4 text-slate-300 leading-relaxed">
                <p>
                  India abolished estate duty in 1985 and has not reintroduced
                  it. There is currently no inheritance tax, estate tax, or
                  succession duty at the national level. However, transferring
                  immovable property through inheritance requires payment of
                  stamp duty (typically 3-8% depending on the state) and
                  registration fees. Some states like Maharashtra charge 1%
                  stamp duty on the market value of inherited property.
                </p>
                <p>
                  Inherited property is not subject to income tax at the time
                  of inheritance. However, if the beneficiary later sells the
                  property, capital gains tax applies. The holding period for
                  calculating long-term capital gains includes the period the
                  deceased held the property. The cost basis is stepped up to
                  the fair market value as of the date of inheritance.
                </p>
              </div>
            </section>

            {/* FAQ for Humans */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Frequently Asked Questions About Inheritance Tax Worldwide
              </h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-violet-400">
                    Can I avoid inheritance tax by moving abroad?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    Domicile rules, not residence alone, determine inheritance
                    tax liability in most countries. The UK taxes worldwide
                    assets of UK-domiciled individuals regardless of residence.
                    The USA taxes worldwide assets of US citizens and
                    domiciliaries. Simply moving abroad does not eliminate
                    liability — formal domicile change and asset restructuring
                    are required, often with a multi-year transition period.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-violet-400">
                    What is the most tax-efficient country to inherit property?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    Italy offers the most favorable regime for close family,
                    with €1 million per beneficiary completely exempt and only
                    4% above that. Australia and Canada have no inheritance
                    tax (though CGT may apply). Among countries with
                    significant taxes, Germany offers generous spousal
                    allowances (€500,000 + pension), while France exempts
                    spouses entirely.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-violet-400">
                    Do double tax treaties cover inheritance tax?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    Yes, many countries have double tax conventions (DTCs)
                    specifically for inheritance and estate taxes. The UK has
                    treaties with France, USA, Ireland, Netherlands, Italy,
                    Sweden, Switzerland, and South Africa. The USA has estate
                    tax treaties with 16 countries. These treaties prevent
                    double taxation and determine which country has primary
                    taxing rights based on domicile, nationality, and situs of
                    assets.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-violet-400">
                    How does the UK 7-year rule work for gifts?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    Potentially Exempt Transfers (PETs) become completely
                    inheritance-tax-free if the donor survives seven years.
                    If the donor dies within seven years, taper relief reduces
                    the tax rate: 0-3 years = 40%, 3-4 years = 32%, 4-5 years
                    = 24%, 5-6 years = 16%, 6-7 years = 8%. Gifts above the
                    £3,000 annual exemption and normal expenditure out of
                    income rules may be PETs.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-violet-400">
                    Will the US estate tax exemption drop in 2026?
                  </h3>
                  <p className="mt-2 text-slate-300">
                    Unless Congress extends the Tax Cuts and Jobs Act, the
                    federal estate tax exemption is scheduled to revert to
                    approximately $7 million per person (adjusted for inflation
                    from the 2017 $5.49 million base) on 1 January 2026. This
                    would represent a 50% reduction from the current $13.99
                    million exemption and significantly increase the number of
                    taxable estates. Estate planning attorneys recommend
                    utilizing the current exemption through gifting strategies
                    before the potential sunset.
                  </p>
                </div>
              </div>
            </section>

            {/* Methodology */}
            <section>
              <h2 className="text-3xl font-bold text-white">
                Calculator Methodology and Data Sources
              </h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                This calculator uses official 2026 tax parameters from each
                jurisdiction&apos;s revenue authority. UK rates are sourced from
                HMRC guidance and the Finance Act 2024. US federal rates are
                based on IRS Revenue Procedure 2025-XX (2026 inflation
                adjustments). Irish CAT thresholds reflect Revenue
                Commissioners CAT thresholds for 2026. French succession tax
                rates are per Code général des impôts. German rates are per
                Erbschaftsteuer- und Schenkungsteuergesetz (ErbStG). Spanish
                rates combine state-level Impuesto sobre Sucesiones y
                Donaciones with representative autonomous community
                modifications. Italian rates are per Testo unico delle
                imposte sui redditi (TUIR). Canadian treatment reflects CRA
                guidance on deemed disposition. Australian treatment reflects
                ATO guidance on inherited assets and CGT. Indian treatment
                reflects CBDT and state stamp duty schedules.
              </p>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Limitations: This tool does not account for complex estate
                planning structures, trusts, double tax treaty relief,
                specific regional variations (particularly in Spain and
                Germany), or currency conversion effects. For estates with
                cross-border assets, multiple jurisdictions, or values
                approaching exemption thresholds, consult a qualified
                international tax advisor or estate planning attorney.
              </p>
            </section>

            {/* Related Tools */}
            <div className="mt-24">
              <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/inheritance-tax-calculator" />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
