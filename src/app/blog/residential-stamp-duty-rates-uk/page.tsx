import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { BlogPostSchema, PostDates } from "@/components/blog/BlogPostMeta";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/residential-stamp-duty-rates-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Residential Stamp Duty Rates in England 2026: SDLT Bands With Worked Examples",
  description:
    "The current SDLT residential bands for England and Northern Ireland (0%, 2%, 5%, 10%, 12%), how the slice system works, and band-by-band examples at £295,000, £500,000 and £1.2 million.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Residential Stamp Duty Rates in England 2026",
    description:
      "Current SDLT residential bands, how each slice of the price is taxed, and worked examples with real numbers.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "What are the current residential stamp duty rates in England?",
    answer:
      "For a buyer who will own only one home, SDLT is 0% up to £125,000, 2% from £125,001 to £250,000, 5% from £250,001 to £925,000, 10% from £925,001 to £1.5 million and 12% above £1.5 million. These rates have applied since 1 April 2025.",
  },
  {
    question: "Is stamp duty charged on the whole price or just the part above the threshold?",
    answer:
      "Only on each slice of the price within each band. A £300,000 home pays nothing on the first £125,000, 2% on the next £125,000 and 5% on the final £50,000, giving £5,000 in total.",
  },
  {
    question: "How much stamp duty is due on a £500,000 house?",
    answer:
      "£15,000 at the standard residential rates: £2,500 on the 2% band plus £12,500 on the £250,000 that falls in the 5% band. A first-time buyer would pay £10,000 and a buyer of an additional property would pay £40,000.",
  },
  {
    question: "Do these rates apply in Scotland and Wales?",
    answer:
      "No. SDLT applies only in England and Northern Ireland. Scotland uses Land and Buildings Transaction Tax and Wales uses Land Transaction Tax, each with its own bands.",
  },
];

export default function ResidentialStampDutyRatesUkPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Residential Stamp Duty Rates", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <BlogPostSchema slug="residential-stamp-duty-rates-uk" />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-10 space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground">Residential SDLT Rates</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Residential SDLT
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Residential Stamp Duty Rates in England: How the SDLT Bands Work
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>9 min read</span>
            <span>•</span>
            <PostDates slug="residential-stamp-duty-rates-uk" />
          </div>
        </div>
      </header>

      <div className="not-prose mb-10 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Short answer</p>
        <p className="mt-2 text-lg leading-8 text-foreground">
          In England and Northern Ireland, a buyer who will own only one home pays SDLT of 0% on the first £125,000,
          2% on £125,001 to £250,000, 5% on £250,001 to £925,000, 10% on £925,001 to £1.5 million and 12% above
          that. Each rate applies only to the slice of the price inside its band, not to the whole price.
        </p>
      </div>

      <article className="prose prose-slate max-w-none">
        <h2>The standard residential SDLT bands</h2>
        <p>
          These are the rates HMRC publishes for residential property where the purchase leaves you owning one
          residential property after completion. They have applied to transactions with an effective date (usually
          completion) on or after 1 April 2025.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="px-2 py-3">Portion of the price</th>
                <th className="px-2 py-3">SDLT rate</th>
                <th className="px-2 py-3">Maximum tax in this band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-2 py-3">Up to £125,000</td><td className="px-2 py-3">0%</td><td className="px-2 py-3">£0</td></tr>
              <tr><td className="px-2 py-3">£125,001 to £250,000</td><td className="px-2 py-3">2%</td><td className="px-2 py-3">£2,500</td></tr>
              <tr><td className="px-2 py-3">£250,001 to £925,000</td><td className="px-2 py-3">5%</td><td className="px-2 py-3">£33,750</td></tr>
              <tr><td className="px-2 py-3">£925,001 to £1.5 million</td><td className="px-2 py-3">10%</td><td className="px-2 py-3">£57,500</td></tr>
              <tr><td className="px-2 py-3">Above £1.5 million</td><td className="px-2 py-3">12%</td><td className="px-2 py-3">No limit</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The third column is useful as a shortcut. Once a price passes the top of a band, that band always
          contributes the same fixed amount. Anything at £925,000 or above has already paid £36,250 on the first three
          bands, so you only need to work out the remaining slices.
        </p>

        <h2>How the slice system works</h2>
        <p>
          SDLT is a marginal tax, like income tax. The price is cut into pieces that line up with the bands, each piece
          is taxed at its own rate, and the results are added together. Moving into a higher band never makes the whole
          price more expensive; it only changes the rate on the extra pounds. That is why there is no &quot;cliff
          edge&quot; in the standard bands, although first-time buyer relief does have one at £500,000 (covered in
          our <Link href="/blog/first-time-buyer-stamp-duty-relief-uk">first-time buyer relief guide</Link>).
        </p>

        <h2>Worked example 1: a £295,000 home</h2>
        <ul>
          <li>First £125,000 at 0% = £0</li>
          <li>Next £125,000 (£125,001 to £250,000) at 2% = £2,500</li>
          <li>Final £45,000 (£250,001 to £295,000) at 5% = £2,250</li>
          <li><strong>Total SDLT: £4,750</strong> (an effective rate of about 1.6%)</li>
        </ul>

        <h2>Worked example 2: a £500,000 home</h2>
        <ul>
          <li>First £125,000 at 0% = £0</li>
          <li>Next £125,000 at 2% = £2,500</li>
          <li>Final £250,000 (£250,001 to £500,000) at 5% = £12,500</li>
          <li><strong>Total SDLT: £15,000</strong> (an effective rate of 3%)</li>
        </ul>

        <h2>Worked example 3: a £1.2 million home</h2>
        <ul>
          <li>First £125,000 at 0% = £0</li>
          <li>Next £125,000 at 2% = £2,500</li>
          <li>Next £675,000 (£250,001 to £925,000) at 5% = £33,750</li>
          <li>Final £275,000 (£925,001 to £1,200,000) at 10% = £27,500</li>
          <li><strong>Total SDLT: £63,750</strong> (an effective rate of about 5.3%)</li>
        </ul>
        <p>
          The effective rate rises steadily with price even though the top marginal rate only changes at fixed points.
          If you want to try other prices, the <Link href="/real-estate/uk-stamp-duty-calculator">UK Stamp Duty
          Calculator</Link> runs the same band-by-band calculation.
        </p>

        <h2>When the standard bands do not apply</h2>
        <p>The standard table is the starting point, but three situations change the rates used:</p>
        <ul>
          <li>
            <strong>First-time buyers</strong> buying a home for £500,000 or less can claim relief: 0% up to £300,000
            and 5% from £300,001 to £500,000.
          </li>
          <li>
            <strong>Buyers who will own more than one residential property</strong> usually pay 5 percentage points
            on top of every band. See the <Link href="/blog/uk-stamp-duty-second-home-guide">second home guide</Link>
            {" "}and the <Link href="/blog/buy-to-let-stamp-duty-guide-uk">buy-to-let guide</Link>.
          </li>
          <li>
            <strong>Non-UK residents</strong> (broadly, people present in the UK for fewer than 183 days in the 12 months
            before buying) usually pay a further 2% surcharge on top of whichever residential rates apply.
          </li>
        </ul>

        <h2>Leasehold homes: premium and rent</h2>
        <p>
          When you buy an existing lease from the current leaseholder, SDLT is worked out on the price using the bands
          above. When a <em>new</em> lease is granted, you pay the same bands on the premium, and HMRC also looks at the
          net present value of the rent over the lease term. If that value is above £125,000, you pay 1% on the
          portion above £125,000. Long residential leases with low ground rents rarely reach that figure, but it is
          worth checking on new-build flats sold on a fresh lease.
        </p>

        <h2>How the bands have changed</h2>
        <p>
          Between 23 September 2022 and 31 March 2025, the nil-rate band was £250,000 and the 2% band did not exist.
          Purchases from 1 April 2025 went back to the £125,000 nil-rate band, which is why older articles and
          calculators may show figures that are now out of date. For a £295,000 home, the difference is £2,500: the
          old rules gave £2,250 and the current rules give £4,750. HMRC keeps a record of previous rates on gov.uk if
          you need to check a past purchase.
        </p>

        <h2>Common mistakes and edge cases</h2>
        <ul>
          <li>
            <strong>Applying the top rate to the whole price.</strong> A £300,000 purchase is not 5% of £300,000
            (£15,000). It is £5,000.
          </li>
          <li>
            <strong>Using SDLT rates for a home in Scotland or Wales.</strong> Scotland charges LBTT and Wales charges
            LTT, with different bands. Use the <Link href="/real-estate/scotland-lbtt-calculator">Scotland LBTT
            calculator</Link> or the <Link href="/real-estate/wales-ltt-calculator">Wales LTT calculator</Link> instead.
          </li>
          <li>
            <strong>Forgetting property you own elsewhere.</strong> A share of a home, or a property abroad worth
            £40,000 or more, can move you from the standard bands to the higher rates.
          </li>
          <li>
            <strong>Treating mixed-use property as residential.</strong> A flat above a shop bought in one transaction is
            mixed-use, and non-residential rates (0% to £150,000, 2% to £250,000, 5% above) apply instead.
          </li>
          <li>
            <strong>Assuming exchange date sets the rates.</strong> The rates generally follow the effective date, which
            is usually completion. Transitional rules can protect contracts exchanged before a rate change, so check
            HMRC guidance if rates change between exchange and completion.
          </li>
        </ul>

        <div className="not-prose rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-900">Compare the residential path to the alternatives</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Run the same purchase through the standard residential, first-time buyer, and additional dwelling options.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open UK Stamp Duty Calculator
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
          <li><Link href="/blog/first-time-buyer-stamp-duty-relief-uk">First-time buyer stamp duty relief</Link></li>
          <li><Link href="/blog/uk-stamp-duty-second-home-guide">Second home stamp duty and the 5% surcharge</Link></li>
          <li><Link href="/blog/buy-to-let-stamp-duty-guide-uk">Buy-to-let stamp duty for landlords</Link></li>
        </ul>

        <h2>Sources</h2>
        <ul>
          <li>
            <a href="https://www.gov.uk/stamp-duty-land-tax/residential-property-rates" rel="noopener noreferrer" target="_blank">
              GOV.UK: Stamp Duty Land Tax residential property rates
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/stamp-duty-land-tax/nonresidential-and-mixed-rates" rel="noopener noreferrer" target="_blank">
              GOV.UK: SDLT rates for non-residential and mixed land and property
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/government/publications/rates-and-allowances-stamp-duty-land-tax" rel="noopener noreferrer" target="_blank">
              GOV.UK: Stamp Duty Land Tax rates from 1 December 2003 (previous rates)
            </a>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">Last checked: October 2026.</p>
      </article>
    </div>
  );
}
