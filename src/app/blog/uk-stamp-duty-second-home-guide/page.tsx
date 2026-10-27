import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { BlogPostSchema, PostDates } from "@/components/blog/BlogPostMeta";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/uk-stamp-duty-second-home-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Second Home Stamp Duty 2026: The 5% Surcharge, Refunds and Replacement Homes",
  description:
    "Second homes in England and Northern Ireland pay 5% on top of every SDLT band. See the higher rates table, worked examples, the 36-month refund rule for movers, and how Scotland's 8% ADS and Wales's higher LTT rates compare.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Second Home Stamp Duty: Higher Rates Explained",
    description:
      "The 5% additional property surcharge, when it applies, how movers reclaim it, and how Scotland and Wales compare.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Do second homes pay extra stamp duty in England?",
    answer:
      "Usually yes. If you will own more than one residential property worth £40,000 or more at the end of completion day, and you are not replacing your main home, you pay 5 percentage points on top of every standard SDLT band.",
  },
  {
    question: "Does replacing my main home avoid the surcharge?",
    answer:
      "Yes, if you sell or give away your previous main home on or before the day you complete on the new one. If the old home sells later, you pay the higher rates first and can claim a refund if it is sold within 36 months.",
  },
  {
    question: "How long do I have to claim a refund of the higher rates?",
    answer:
      "For previous homes sold on or after 29 October 2018, you must claim within 12 months of the later of the sale of the previous home or the filing date of the SDLT return for the new home.",
  },
  {
    question: "Does a property I own abroad count?",
    answer:
      "Yes. Residential property anywhere in the world counts, so owning a flat overseas worth £40,000 or more can trigger the higher rates on a purchase in England.",
  },
  {
    question: "Does buy-to-let count as an additional dwelling?",
    answer:
      "In most cases yes. A landlord who already owns a home pays the higher rates, and companies pay them even on their first residential purchase.",
  },
];

export default function UKStampDutySecondHomeGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Second Home Stamp Duty Guide", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <BlogPostSchema slug="uk-stamp-duty-second-home-guide" />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-10 space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground">Second Home SDLT</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          UK Real Estate
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Second Home Stamp Duty in England: Higher Rates Explained
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>10 min read</span>
            <span>•</span>
            <PostDates slug="uk-stamp-duty-second-home-guide" />
          </div>
        </div>
      </header>

      <div className="not-prose mb-10 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Short answer</p>
        <p className="mt-2 text-lg leading-8 text-foreground">
          In England and Northern Ireland, buying a second home usually means paying 5% on top of every SDLT band, so
          rates run from 5% to 17%. The surcharge applies if you will own more than one residential property worth
          £40,000 or more and are not replacing your main home. Movers who sell their old home within 36 months can
          claim it back.
        </p>
      </div>

      <article className="prose prose-slate max-w-none">
        <h2>The higher rates for additional dwellings</h2>
        <p>
          The surcharge rose from 3% to 5% for transactions with an effective date on or after 31 October 2024
          (contracts exchanged before that date generally kept the old rate). Combined with the standard bands that
          applied from 1 April 2025, the rates for an additional residential property are:
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="px-2 py-3">Portion of the price</th>
                <th className="px-2 py-3">Standard rate</th>
                <th className="px-2 py-3">Higher rate (second home)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-2 py-3">Up to £125,000</td><td className="px-2 py-3">0%</td><td className="px-2 py-3">5%</td></tr>
              <tr><td className="px-2 py-3">£125,001 to £250,000</td><td className="px-2 py-3">2%</td><td className="px-2 py-3">7%</td></tr>
              <tr><td className="px-2 py-3">£250,001 to £925,000</td><td className="px-2 py-3">5%</td><td className="px-2 py-3">10%</td></tr>
              <tr><td className="px-2 py-3">£925,001 to £1.5 million</td><td className="px-2 py-3">10%</td><td className="px-2 py-3">15%</td></tr>
              <tr><td className="px-2 py-3">Above £1.5 million</td><td className="px-2 py-3">12%</td><td className="px-2 py-3">17%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Because the extra 5% applies to every pound, a quick check is: higher-rates SDLT equals standard SDLT plus 5%
          of the full price. Non-UK residents add a further 2% on top of that. First-time buyer relief can never be
          combined with the higher rates.
        </p>

        <h2>When the higher rates apply</h2>
        <p>For an individual, HMRC applies the higher rates when all of these are true:</p>
        <ul>
          <li>The property you are buying is residential and costs £40,000 or more.</li>
          <li>
            At the end of completion day you will own more than one residential property, anywhere in the world, each
            worth £40,000 or more (properties or shares worth less than that are ignored).
          </li>
          <li>You have not sold or given away your previous main home.</li>
          <li>Nobody else holds a lease on the property you are buying with more than 21 years left to run.</li>
        </ul>
        <p>
          Married couples and civil partners are treated as one unit unless they are permanently separated. If either
          spouse would owe the higher rates, the whole purchase does, even if only one of you is buying. The same
          applies to joint buyers: if any one buyer (or their spouse) would pay the higher rates, the entire
          transaction pays them.
        </p>

        <h2>Worked example 1: a £350,000 holiday cottage</h2>
        <p>You own and live in a home in Leeds and buy a cottage in Cornwall for £350,000.</p>
        <ul>
          <li>First £125,000 at 5% = £6,250</li>
          <li>£125,001 to £250,000 at 7% = £8,750</li>
          <li>£250,001 to £350,000 at 10% = £10,000</li>
          <li><strong>Total SDLT: £25,000</strong></li>
        </ul>
        <p>
          Check: standard SDLT on £350,000 is £7,500 (£2,500 + £5,000), and 5% of £350,000 is £17,500. Together that is
          £25,000. The surcharge more than triples the bill. If you were not UK resident, the 2% surcharge would add
          £7,000, making £32,000.
        </p>

        <h2>Replacing your main home</h2>
        <p>
          The surcharge is aimed at people adding to the number of homes they own, not people moving. If you sell or
          give away your previous main residence on or before the day you complete on a new home you will live in, the
          purchase is a replacement and the standard rates apply. This is the usual result when a sale and purchase
          complete on the same day in a chain.
        </p>
        <p>
          If you complete on the new home before the old one is sold, you pay the higher rates at completion. You can
          then claim a refund of the extra 5% if you sell or give away the old main home within 36 months of buying the
          new one. The claim must be made within 12 months of the later of the sale or the filing date of the new
          home&apos;s SDLT return. HMRC may extend the 36-month period in exceptional circumstances outside your
          control, such as government restrictions that prevented a sale.
        </p>

        <h2>Worked example 2: buying before you sell</h2>
        <p>You buy a new main home for £450,000 while your old home is still on the market.</p>
        <ul>
          <li>First £125,000 at 5% = £6,250</li>
          <li>£125,001 to £250,000 at 7% = £8,750</li>
          <li>£250,001 to £450,000 at 10% = £20,000</li>
          <li><strong>SDLT paid at completion: £35,000</strong></li>
        </ul>
        <p>
          At standard rates the purchase would cost £12,500. When the old home sells, say 10 months later, you can
          reclaim the £22,500 difference (5% of £450,000), provided you claim within the 12-month window. That is a
          large sum to fund temporarily, so build it into your bridging or cash-flow plans.
        </p>

        <h2>Second homes in Scotland and Wales</h2>
        <p>
          Scotland charges an Additional Dwelling Supplement (ADS) of 8% of the <em>whole</em> price for transactions
          from 5 December 2024, on top of normal LBTT. On a £350,000 second home, LBTT is £2,100 (2% on £145,001 to
          £250,000) plus £3,750 (5% on £250,001 to £325,000) plus £2,500 (10% on £325,001 to £350,000), which is £8,350.
          ADS adds £28,000, for a total of £36,350. Scotland gives 36 months to sell a previous main home, both to avoid
          ADS and to claim it back, for transactions from 1 April 2024.
        </p>
        <p>
          Wales uses a separate higher rates table from 11 December 2024: 5% up to £180,000, 8.5% to £250,000, 10% to
          £400,000, 12.5% to £750,000, 15% to £1.5 million and 17% above. A £350,000 second home pays £9,000 + £5,950 +
          £10,000, which is £24,950 of LTT. Check the Welsh Revenue Authority guidance for the Welsh replacement and
          refund rules. Our <Link href="/real-estate/scotland-lbtt-calculator">Scotland LBTT calculator</Link> and
          {" "}<Link href="/real-estate/wales-ltt-calculator">Wales LTT calculator</Link> handle both.
        </p>

        <h2>Common mistakes</h2>
        <ul>
          <li>
            <strong>Forgetting overseas property.</strong> A flat abroad worth £40,000 or more counts, even if you have
            never thought of it as a second home.
          </li>
          <li>
            <strong>Ignoring a spouse&apos;s property.</strong> Your spouse&apos;s flat counts even if your name is not on
            it and they are not buying with you.
          </li>
          <li>
            <strong>Letting the old home instead of selling it.</strong> If you keep your previous main home and rent it
            out, the new purchase is not a replacement, and there is no refund unless you sell it within 36 months.
          </li>
          <li>
            <strong>Missing the refund deadline.</strong> Selling within 36 months is not enough; you must also claim
            within 12 months of the later of the sale or the filing date.
          </li>
          <li>
            <strong>Assuming a cheap share is ignored.</strong> Only interests worth less than £40,000 fall outside the
            count. A share in a family home worth more than that can trigger the surcharge.
          </li>
        </ul>
        <p>
          If you are buying specifically to rent the property out, the <Link href="/blog/buy-to-let-stamp-duty-guide-uk">
          buy-to-let guide</Link> covers company purchases, portfolio deals and other landlord-specific points.
        </p>

        <div className="not-prose rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-900">Run the exact SDLT scenario</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the calculator to compare standard residential rates against the additional dwelling path before you
            commit to the transaction structure.
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
          <li><Link href="/blog/buy-to-let-stamp-duty-guide-uk">Buy-to-let stamp duty for landlords</Link></li>
          <li><Link href="/blog/residential-stamp-duty-rates-uk">Residential SDLT rates with worked examples</Link></li>
          <li><Link href="/blog/first-time-buyer-stamp-duty-relief-uk">First-time buyer stamp duty relief</Link></li>
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
            <a href="https://www.gov.uk/government/publications/stamp-duty-land-tax-increase-to-the-higher-rates-of-stamp-duty-land-tax-and-to-the-single-rate-payable-by-non-natural-persons" rel="noopener noreferrer" target="_blank">
              GOV.UK: Increase to the higher rates of SDLT (from 31 October 2024)
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
