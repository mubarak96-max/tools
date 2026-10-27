import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { BlogPostSchema, PostDates } from "@/components/blog/BlogPostMeta";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/first-time-buyer-stamp-duty-relief-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "First-Time Buyer Stamp Duty Relief 2026: Who Qualifies and How Much You Save",
  description:
    "First-time buyers in England and Northern Ireland pay no SDLT up to £300,000 and 5% up to £500,000. See the eligibility rules, the £500,000 cliff edge, worked examples, and how Scotland and Wales differ.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "First-Time Buyer Stamp Duty Relief: Who Qualifies?",
    description:
      "Eligibility rules, the £500,000 limit, worked savings examples and common reasons first-time buyer SDLT relief is refused.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Does every first-time buyer get SDLT relief?",
    answer:
      "No. The price must be £500,000 or less, every buyer must be an individual who has never owned a home anywhere in the world, and every buyer must intend to live in the property as their only or main residence.",
  },
  {
    question: "What happens if the purchase does not qualify?",
    answer:
      "The standard residential bands apply to the whole price: 0% up to £125,000, 2% to £250,000 and 5% to £925,000. If you already own another home or are buying with someone who does, the higher rates for additional properties may apply instead.",
  },
  {
    question: "What is the most a first-time buyer can save?",
    answer:
      "£5,000. Any purchase between £300,000 and £500,000 saves exactly £5,000 compared with the standard rates. Below £300,000 the saving equals the whole standard bill, because relief takes it to zero.",
  },
  {
    question: "I inherited a share of my parents' house. Am I still a first-time buyer?",
    answer:
      "Usually not. HMRC treats an interest in a dwelling acquired by inheritance or gift, including a part share, as previous ownership, which rules out the relief.",
  },
  {
    question: "Is there first-time buyer relief in Scotland and Wales?",
    answer:
      "Scotland raises the LBTT nil-rate band from £145,000 to £175,000 for first-time buyers, saving up to £600. Wales has no first-time buyer relief, but its LTT nil-rate band is £225,000 for all buyers.",
  },
];

export default function FirstTimeBuyerStampDutyReliefUkPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "First-Time Buyer Relief", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <BlogPostSchema slug="first-time-buyer-stamp-duty-relief-uk" />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-10 space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground">First-Time Buyer Relief</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          First-Time Buyer
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          First-Time Buyer Stamp Duty Relief in England: Who Qualifies?
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>9 min read</span>
            <span>•</span>
            <PostDates slug="first-time-buyer-stamp-duty-relief-uk" />
          </div>
        </div>
      </header>

      <div className="not-prose mb-10 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Short answer</p>
        <p className="mt-2 text-lg leading-8 text-foreground">
          In England and Northern Ireland, first-time buyers pay no SDLT on the first £300,000 of a home and 5% on
          the part from £300,001 to £500,000. The relief only applies if the price is £500,000 or less, every buyer has
          never owned a home anywhere, and every buyer will live there as their main residence.
        </p>
      </div>

      <article className="prose prose-slate max-w-none">
        <h2>First-time buyer rates</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="px-2 py-3">Portion of the price</th>
                <th className="px-2 py-3">First-time buyer rate</th>
                <th className="px-2 py-3">Standard rate (for comparison)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-2 py-3">Up to £125,000</td><td className="px-2 py-3">0%</td><td className="px-2 py-3">0%</td></tr>
              <tr><td className="px-2 py-3">£125,001 to £250,000</td><td className="px-2 py-3">0%</td><td className="px-2 py-3">2%</td></tr>
              <tr><td className="px-2 py-3">£250,001 to £300,000</td><td className="px-2 py-3">0%</td><td className="px-2 py-3">5%</td></tr>
              <tr><td className="px-2 py-3">£300,001 to £500,000</td><td className="px-2 py-3">5%</td><td className="px-2 py-3">5%</td></tr>
              <tr><td className="px-2 py-3">Price above £500,000</td><td className="px-2 py-3">No relief: standard rates on the whole price</td><td className="px-2 py-3">Standard bands</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          These thresholds have applied since 1 April 2025. Between 23 September 2022 and 31 March 2025 they were more
          generous (0% to £425,000 and relief on homes up to £625,000), so guides written before April 2025 often quote
          the wrong figures. The full standard band table is in our <Link href="/blog/residential-stamp-duty-rates-uk">
          residential rates guide</Link>.
        </p>

        <h2>Who qualifies</h2>
        <p>HMRC&apos;s conditions for the relief are:</p>
        <ul>
          <li>You are buying a single dwelling for £500,000 or less.</li>
          <li>Every buyer is an individual. A company or trust cannot claim.</li>
          <li>
            Every buyer is a first-time buyer, meaning they have never, alone or with others, acquired a major interest
            in a dwelling (a freehold or leasehold interest) anywhere in the world.
          </li>
          <li>Every buyer intends to occupy the property as their only or main residence.</li>
          <li>The purchase is not linked to other land transactions, apart from things like the garden and grounds.</li>
          <li>It is not a higher rates transaction and does not include non-residential land.</li>
        </ul>
        <p>
          The relief is claimed on the SDLT return, which your conveyancer files after completion. It is not
          automatic: the return must say you qualify, and you are responsible if that turns out to be wrong.
        </p>

        <h2>Worked example 1: a £280,000 flat</h2>
        <p>With relief, the whole price falls in the 0% first-time buyer band:</p>
        <ul>
          <li>£0 to £280,000 at 0% = £0</li>
          <li><strong>First-time buyer SDLT: £0</strong></li>
        </ul>
        <p>Without relief (standard rates):</p>
        <ul>
          <li>First £125,000 at 0% = £0</li>
          <li>£125,001 to £250,000 at 2% = £2,500</li>
          <li>£250,001 to £280,000 at 5% = £1,500</li>
          <li><strong>Standard SDLT: £4,000</strong>, so relief saves £4,000</li>
        </ul>

        <h2>Worked example 2: a £450,000 house</h2>
        <ul>
          <li>First £300,000 at 0% = £0</li>
          <li>£300,001 to £450,000 at 5% = £7,500</li>
          <li><strong>First-time buyer SDLT: £7,500</strong></li>
        </ul>
        <p>
          At standard rates the same house costs £2,500 (2% band) plus £10,000 (5% on £250,001 to £450,000), which is
          £12,500. The saving is £5,000.
        </p>

        <h2>The £500,000 cliff edge</h2>
        <p>
          Unlike the standard bands, the relief is all or nothing. At £500,000 a first-time buyer pays £10,000 (5% of
          £200,000). At £510,000 there is no relief at all, so the standard bands apply to the whole price: £2,500 plus
          5% of £260,000 (£13,000), giving £15,500. Paying £10,000 more for the property adds £5,500 of tax.
        </p>
        <p>
          If a home is marketed slightly above £500,000, it can be worth negotiating to £500,000 or less, or agreeing a
          separate, genuine price for removable items such as furniture. Any apportionment must reflect real market
          value; inflating the value of chattels to get under the limit is not allowed.
        </p>

        <h2>How much relief saves at different prices</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="px-2 py-3">Price</th>
                <th className="px-2 py-3">Standard SDLT</th>
                <th className="px-2 py-3">First-time buyer SDLT</th>
                <th className="px-2 py-3">Saving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-2 py-3">£200,000</td><td className="px-2 py-3">£1,500</td><td className="px-2 py-3">£0</td><td className="px-2 py-3">£1,500</td></tr>
              <tr><td className="px-2 py-3">£300,000</td><td className="px-2 py-3">£5,000</td><td className="px-2 py-3">£0</td><td className="px-2 py-3">£5,000</td></tr>
              <tr><td className="px-2 py-3">£400,000</td><td className="px-2 py-3">£10,000</td><td className="px-2 py-3">£5,000</td><td className="px-2 py-3">£5,000</td></tr>
              <tr><td className="px-2 py-3">£500,000</td><td className="px-2 py-3">£15,000</td><td className="px-2 py-3">£10,000</td><td className="px-2 py-3">£5,000</td></tr>
              <tr><td className="px-2 py-3">£550,000</td><td className="px-2 py-3">£17,500</td><td className="px-2 py-3">£17,500 (no relief)</td><td className="px-2 py-3">£0</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Edge cases that cost buyers the relief</h2>
        <ul>
          <li>
            <strong>Buying with someone who has owned before.</strong> Relief needs every buyer to qualify. If your
            partner sold a flat years ago, a joint purchase pays standard rates.
          </li>
          <li>
            <strong>A spouse who owns a property.</strong> Married couples and civil partners are treated together for
            the higher rates. If your spouse still owns a home, the purchase can become a higher rates transaction even
            if they are not on the deeds, and relief cannot be claimed on a higher rates transaction.
          </li>
          <li>
            <strong>Inherited or gifted shares.</strong> HMRC counts interests acquired by inheritance or gift,
            including a part share, as previous ownership.
          </li>
          <li>
            <strong>Property abroad.</strong> Owning a home in another country, whatever its value, means you are not a
            first-time buyer.
          </li>
          <li>
            <strong>Buying to let.</strong> If you will not live in the property as your main home, there is no relief,
            even if it is the first property you have ever bought. See the <Link href="/blog/buy-to-let-stamp-duty-guide-uk">
            buy-to-let guide</Link>.
          </li>
          <li>
            <strong>Non-UK residents.</strong> First-time buyers who are not UK resident for SDLT purposes still pay the
            2% non-resident surcharge on top of the residential rates.
          </li>
        </ul>
        <p>
          Shared ownership buyers can also claim, either by electing to pay SDLT on the full market value at the
          start, or (since a change backdated to 22 November 2017) when paying for the share in stages. The details are
          in HMRC&apos;s manual, and your conveyancer should confirm the best route.
        </p>

        <h2>First-time buyers in Scotland and Wales</h2>
        <p>
          In Scotland, LBTT first-time buyer relief raises the nil-rate band from £145,000 to £175,000. On a £200,000
          home that means £25,000 at 2% (£500) instead of £55,000 at 2% (£1,100), a saving of £600, which is the
          maximum. Wales has no first-time buyer relief, but no buyer pays LTT on the first £225,000. Use the
          <Link href="/real-estate/scotland-lbtt-calculator"> Scotland LBTT calculator</Link> or the
          <Link href="/real-estate/wales-ltt-calculator"> Wales LTT calculator</Link> for homes there.
        </p>

        <div className="not-prose rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-900">Check the relief path instantly</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the first-time buyer option in the calculator, then compare it with the standard residential result.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open First-Time Buyer SDLT Calculator
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
          <li><Link href="/blog/what-is-sdlt-vs-stamp-duty">What SDLT means vs stamp duty</Link></li>
          <li><Link href="/blog/residential-stamp-duty-rates-uk">Residential SDLT rates with worked examples</Link></li>
          <li><Link href="/blog/uk-stamp-duty-second-home-guide">Second home stamp duty and the 5% surcharge</Link></li>
        </ul>

        <h2>Sources</h2>
        <ul>
          <li>
            <a href="https://www.gov.uk/stamp-duty-land-tax/residential-property-rates" rel="noopener noreferrer" target="_blank">
              GOV.UK: SDLT residential property rates (first-time buyers)
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/hmrc-internal-manuals/stamp-duty-land-tax-manual/sdltm29805" rel="noopener noreferrer" target="_blank">
              HMRC manual SDLTM29805: Introduction to first-time buyers&apos; relief
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/hmrc-internal-manuals/stamp-duty-land-tax-manual/sdltm29811" rel="noopener noreferrer" target="_blank">
              HMRC manual SDLTM29811: Conditions for the relief
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/hmrc-internal-manuals/stamp-duty-land-tax-manual/sdltm29845" rel="noopener noreferrer" target="_blank">
              HMRC manual SDLTM29845: Meaning of first-time buyer
            </a>
          </li>
          <li>
            <a href="https://revenue.scot/taxes/land-buildings-transaction-tax/residential-property" rel="noopener noreferrer" target="_blank">
              Revenue Scotland: LBTT residential rates and first-time buyer relief
            </a>
          </li>
          <li>
            <a href="https://www.gov.wales/land-transaction-tax-guide" rel="noopener noreferrer" target="_blank">
              Welsh Government: Land Transaction Tax guide
            </a>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">Last checked: October 2026.</p>
      </article>
    </div>
  );
}
