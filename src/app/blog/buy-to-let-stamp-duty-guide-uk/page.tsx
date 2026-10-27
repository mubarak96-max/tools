import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { BlogPostSchema, PostDates } from "@/components/blog/BlogPostMeta";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/buy-to-let-stamp-duty-guide-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Buy-to-Let Stamp Duty 2026: SDLT for Landlords, Companies and Portfolios",
  description:
    "How SDLT works on buy-to-let purchases in England and Northern Ireland: the 5% surcharge, company purchases and the 17% rate, buying six or more dwellings, worked examples, and Scotland and Wales comparisons.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Buy-to-Let Stamp Duty in England: SDLT for Landlords",
    description:
      "A landlord-focused guide to SDLT: individual vs company purchases, portfolio deals, and the real upfront cost of a rental property.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Does buy-to-let pay higher stamp duty?",
    answer:
      "Usually. An individual landlord who already owns a home pays the higher rates, which add 5% to every SDLT band. A company pays the higher rates on any residential purchase of £40,000 or more, even its first.",
  },
  {
    question: "If my first ever property is a buy-to-let, do I pay the surcharge?",
    answer:
      "Not if you buy as an individual and own no other residential property anywhere: you pay the standard rates. You cannot claim first-time buyer relief, though, because that requires you to live in the property as your main home.",
  },
  {
    question: "Do companies always pay 17% stamp duty?",
    answer:
      "No. The 17% flat rate can apply when a company buys a dwelling costing more than £500,000, but reliefs exist for genuine property rental businesses. Where it does not apply, the company pays the higher rates for additional dwellings instead.",
  },
  {
    question: "Can I still claim Multiple Dwellings Relief on a portfolio?",
    answer:
      "No. Multiple Dwellings Relief was abolished for transactions completing on or after 1 June 2024, unless contracts were exchanged on or before 6 March 2024 and not varied afterwards. Buying six or more dwellings in a single transaction can still be taxed at non-residential rates.",
  },
  {
    question: "Should landlords still compare the standard residential amount?",
    answer:
      "Yes. The difference between the standard and higher-rates figures is exactly 5% of the price, and seeing it separately helps when judging whether a deal still works.",
  },
];

export default function BuyToLetStampDutyGuideUkPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Buy-to-Let Stamp Duty Guide", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <BlogPostSchema slug="buy-to-let-stamp-duty-guide-uk" />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-10 space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground">Buy-to-Let SDLT</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Landlord Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Buy-to-Let Stamp Duty in England: SDLT Guide for Landlords
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>10 min read</span>
            <span>•</span>
            <PostDates slug="buy-to-let-stamp-duty-guide-uk" />
          </div>
        </div>
      </header>

      <div className="not-prose mb-10 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Short answer</p>
        <p className="mt-2 text-lg leading-8 text-foreground">
          Most buy-to-let purchases in England and Northern Ireland pay SDLT at the higher rates: 5% on the first
          £125,000, 7% to £250,000, 10% to £925,000, 15% to £1.5 million and 17% above. Companies pay these rates on
          their first purchase too. Only an individual who owns no other home anywhere pays the standard rates.
        </p>
      </div>

      <article className="prose prose-slate max-w-none">
        <h2>Which rates a landlord pays</h2>
        <p>
          The SDLT rates on a rental property depend on who is buying and what else they own, not on the fact that the
          property will be let. The table sets out the usual outcomes.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="px-2 py-3">Buyer</th>
                <th className="px-2 py-3">Usual SDLT treatment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-2 py-3">Individual who owns no other residential property anywhere</td><td className="px-2 py-3">Standard rates (0% to 12%). No first-time buyer relief.</td></tr>
              <tr><td className="px-2 py-3">Individual who owns a home or another rental (or whose spouse does)</td><td className="px-2 py-3">Higher rates (5% to 17%)</td></tr>
              <tr><td className="px-2 py-3">Limited company, dwelling up to £500,000</td><td className="px-2 py-3">Higher rates (5% to 17%)</td></tr>
              <tr><td className="px-2 py-3">Limited company, dwelling over £500,000</td><td className="px-2 py-3">17% flat rate on the whole price may apply; reliefs exist for property rental businesses, in which case the higher rates apply</td></tr>
              <tr><td className="px-2 py-3">Non-UK resident buyer (individual or company)</td><td className="px-2 py-3">Whichever of the above applies, plus 2%</td></tr>
              <tr><td className="px-2 py-3">Six or more dwellings in one transaction</td><td className="px-2 py-3">Non-residential rates: 0% to £150,000, 2% to £250,000, 5% above</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The higher rates are explained in full, including the replacement-home rules that matter to owner-occupiers,
          in our <Link href="/blog/uk-stamp-duty-second-home-guide">second home guide</Link>. This guide focuses on
          what is different for landlords.
        </p>

        <h2>Worked example: a £220,000 rental flat</h2>
        <p>An individual landlord who already owns their own home buys a flat to let for £220,000.</p>
        <ul>
          <li>First £125,000 at 5% = £6,250</li>
          <li>£125,001 to £220,000 at 7% = £6,650</li>
          <li><strong>Total SDLT: £12,900</strong></li>
        </ul>
        <p>
          At standard rates the same flat would cost £1,900 (2% on £95,000). The surcharge adds £11,000, which is 5% of
          £220,000. If the same landlord were not UK resident, a further 2% (£4,400) would bring the bill to £17,300.
        </p>

        <h2>What the tax does to your numbers</h2>
        <p>
          SDLT is paid in cash at completion and is not usually covered by a buy-to-let mortgage, so it adds directly to
          the money you need. Continuing the example, with a 25% deposit:
        </p>
        <ul>
          <li>Deposit: 25% of £220,000 = £55,000</li>
          <li>SDLT: £12,900</li>
          <li>Cash before legal, survey and lender fees: £67,900</li>
        </ul>
        <p>
          The SDLT alone is about 23% of the deposit. If the flat lets for £1,100 a month (£13,200 a year), the gross
          yield on the purchase price is 6.0%. Measured against the price plus SDLT (£232,900), it is about 5.7%. Running
          this check before making an offer shows whether a deal still works once tax is included. The
          <Link href="/real-estate/uk-stamp-duty-calculator"> UK Stamp Duty Calculator</Link> gives the SDLT figure for
          any price.
        </p>

        <h2>Your first property is a buy-to-let</h2>
        <p>
          If you buy in your own name, own no residential property anywhere in the world (including shares worth
          £40,000 or more and anything owned by your spouse), and the flat is your only property after completion, the
          higher rates do not apply. You pay the standard rates, so the £220,000 flat costs £1,900.
        </p>
        <p>
          You cannot claim first-time buyer relief, because it requires every buyer to live in the property as their
          only or main residence. Also bear in mind that this purchase will count as previous ownership if you later buy
          a home to live in, so you will not qualify for first-time buyer relief then either. The
          <Link href="/blog/first-time-buyer-stamp-duty-relief-uk"> first-time buyer guide</Link> covers this in detail.
        </p>

        <h2>Buying through a limited company</h2>
        <p>
          A company is not a person with a main home, so it cannot benefit from the replacement-home exception. It
          pays the higher rates on any residential purchase of £40,000 or more, unless the property is subject to a
          lease with more than 21 years left.
        </p>
        <p>
          For dwellings costing more than £500,000, companies and other non-natural persons may instead pay a flat 17%
          on the whole price. That rate rose from 15% to 17% on 31 October 2024, alongside the increase in the
          surcharge. HMRC provides reliefs from the 17% rate for qualifying businesses, including property rental
          businesses, and where relief applies the company pays the higher rates for additional dwellings. Whether a
          company qualifies depends on how the property is used, so take advice before buying.
        </p>

        <h2>Buying several properties at once</h2>
        <p>
          Multiple Dwellings Relief, which let buyers of several dwellings in one deal calculate SDLT on the average
          price per dwelling, was abolished for transactions that complete on or after 1 June 2024. It only survives
          where contracts were exchanged on or before 6 March 2024 and not varied afterwards.
        </p>
        <p>
          One rule remains useful for portfolio buyers: six or more dwellings bought in a single transaction are
          treated as non-residential. For example, six flats bought together for £1,200,000:
        </p>
        <ul>
          <li>First £150,000 at 0% = £0</li>
          <li>£150,001 to £250,000 at 2% = £2,000</li>
          <li>£250,001 to £1,200,000 at 5% = £47,500</li>
          <li><strong>Total SDLT: £49,500</strong></li>
        </ul>
        <p>
          The deal has to genuinely be a single transaction. Splitting purchases artificially, or linking separate
          purchases from the same seller, raises questions your solicitor should look at before exchange.
        </p>

        <h2>Rental property in Scotland and Wales</h2>
        <p>
          In Scotland, landlords who already own a home pay LBTT plus the 8% Additional Dwelling Supplement on the whole
          price. For a £220,000 flat, LBTT is £1,500 (2% on £145,001 to £220,000) and ADS is £17,600, so the total is
          £19,100. In Wales, the higher LTT rates apply: £9,000 (5% on the first £180,000) plus £3,400 (8.5% on £180,001
          to £220,000), giving £12,400. Use the <Link href="/real-estate/scotland-lbtt-calculator">Scotland LBTT
          calculator</Link> or the <Link href="/real-estate/wales-ltt-calculator">Wales LTT calculator</Link> for
          properties there.
        </p>

        <h2>Common landlord mistakes</h2>
        <ul>
          <li>
            <strong>Assuming a cheap property escapes the surcharge.</strong> The higher rates apply from £40,000. Only
            purchases below that are excluded.
          </li>
          <li>
            <strong>Overlooking a spouse&apos;s property.</strong> If your spouse owns a home, your purchase is usually a
            higher rates transaction even if you have never owned anything.
          </li>
          <li>
            <strong>Treating a shop with a flat above as residential.</strong> Mixed-use property is taxed at
            non-residential rates, which are lower at most prices.
          </li>
          <li>
            <strong>Budgeting with the mortgage, not cash.</strong> SDLT is due within 14 days of completion, and your
            conveyancer will normally ask for it before completion.
          </li>
          <li>
            <strong>Relying on Multiple Dwellings Relief.</strong> Older guides and calculators may still show it.
          </li>
        </ul>

        <div className="not-prose rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-900">Estimate buy-to-let SDLT now</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the calculator with the additional dwelling option enabled to model the likely landlord purchase route.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open Buy-to-Let SDLT Calculator
          </Link>
        </div>

        <h2>Frequently asked questions</h2>
        {faq.map((item) => (
          <div key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}

        <h2>Related guides</h2>
        <ul>
          <li><Link href="/blog/uk-stamp-duty-second-home-guide">Second home stamp duty and the 5% surcharge</Link></li>
          <li><Link href="/blog/residential-stamp-duty-rates-uk">Residential SDLT rates with worked examples</Link></li>
          <li><Link href="/blog/what-is-sdlt-vs-stamp-duty">What SDLT means vs stamp duty</Link></li>
        </ul>

        <h2>Sources</h2>
        <ul>
          <li>
            <a href="https://www.gov.uk/guidance/stamp-duty-land-tax-buying-an-additional-residential-property" rel="noopener noreferrer" target="_blank">
              GOV.UK: SDLT when buying an additional residential property
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/stamp-duty-land-tax/residential-property-rates" rel="noopener noreferrer" target="_blank">
              GOV.UK: SDLT residential property rates
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/stamp-duty-land-tax/nonresidential-and-mixed-rates" rel="noopener noreferrer" target="_blank">
              GOV.UK: SDLT non-residential and mixed-use rates
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/government/publications/stamp-duty-land-tax-abolition-of-multiple-dwellings-relief-from-1-june-2024" rel="noopener noreferrer" target="_blank">
              GOV.UK: Abolition of Multiple Dwellings Relief from 1 June 2024
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/government/publications/stamp-duty-land-tax-increase-to-the-higher-rates-of-stamp-duty-land-tax-and-to-the-single-rate-payable-by-non-natural-persons" rel="noopener noreferrer" target="_blank">
              GOV.UK: Increase to the higher rates and the single rate for non-natural persons
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/guidance/rates-of-stamp-duty-land-tax-for-non-uk-residents" rel="noopener noreferrer" target="_blank">
              GOV.UK: SDLT rates for non-UK residents
            </a>
          </li>
          <li>
            <a href="https://revenue.scot/taxes/land-buildings-transaction-tax/additional-dwelling-supplement-ads" rel="noopener noreferrer" target="_blank">
              Revenue Scotland: Additional Dwelling Supplement
            </a>
          </li>
          <li>
            <a href="https://www.gov.wales/land-transaction-tax-rates-and-bands" rel="noopener noreferrer" target="_blank">
              Welsh Government: Land Transaction Tax rates and bands
            </a>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">Last checked: October 2026.</p>
      </article>
    </div>
  );
}
