import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { BlogPostSchema, PostDates } from "@/components/blog/BlogPostMeta";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/what-is-sdlt-vs-stamp-duty";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "What Is SDLT? Stamp Duty vs SDLT, LBTT and LTT Explained",
  description:
    "SDLT is the property tax people call stamp duty in England and Northern Ireland. Learn where the name came from, how it differs from Scotland's LBTT and Wales's LTT, who files it, and what a £300,000 home costs in each nation.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "What Is SDLT? Stamp Duty vs SDLT Explained",
    description:
      "A plain-English explanation of SDLT, why the stamp duty label survives, and how the UK's three property taxes compare.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Is SDLT the same as stamp duty?",
    answer:
      "For property in England and Northern Ireland, yes in practice. People say stamp duty, but the tax on land and property has formally been Stamp Duty Land Tax (SDLT) since 1 December 2003. Stamp Duty in the strict sense now mainly applies to paper transfers of shares.",
  },
  {
    question: "Does Scotland use SDLT?",
    answer:
      "No. Scotland has used Land and Buildings Transaction Tax (LBTT), run by Revenue Scotland, since 1 April 2015. Wales has used Land Transaction Tax (LTT), run by the Welsh Revenue Authority, since 1 April 2018.",
  },
  {
    question: "Who pays SDLT, the buyer or the seller?",
    answer:
      "The buyer. Your solicitor or conveyancer usually files the SDLT return and pays the tax on your behalf on completion day, then adds it to their bill. The return and payment are due within 14 days of completion.",
  },
  {
    question: "Does Northern Ireland have its own property tax?",
    answer:
      "No. Northern Ireland uses SDLT with the same rates and reliefs as England, administered by HMRC.",
  },
  {
    question: "Do I have to file an SDLT return if no tax is due?",
    answer:
      "Often yes. Many purchases need a return even when the tax works out at zero, for example a first-time buyer purchase under £300,000. Your conveyancer will normally handle this.",
  },
];

export default function WhatIsSdltVsStampDutyPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "What Is SDLT", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <BlogPostSchema slug="what-is-sdlt-vs-stamp-duty" />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-10 space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground">What Is SDLT</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          SDLT Basics
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          What Is SDLT? Stamp Duty vs SDLT Explained for Home Buyers
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>8 min read</span>
            <span>•</span>
            <PostDates slug="what-is-sdlt-vs-stamp-duty" />
          </div>
        </div>
      </header>

      <div className="not-prose mb-10 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Short answer</p>
        <p className="mt-2 text-lg leading-8 text-foreground">
          SDLT (Stamp Duty Land Tax) is the tax a buyer pays on property or land in England and Northern Ireland.
          &quot;Stamp duty&quot; is the everyday name for it. Scotland charges a different tax, LBTT, and Wales charges
          LTT. Each has its own rates, reliefs, tax authority and filing deadline, so the name tells you which rules
          apply.
        </p>
      </div>

      <article className="prose prose-slate max-w-none">
        <h2>Where the two names come from</h2>
        <p>
          Before 1 December 2003, property transfers were taxed under Stamp Duty, a tax on documents. A transfer deed
          was physically stamped once the duty had been paid, which is where the name comes from. The Finance Act 2003
          replaced that system for land with Stamp Duty Land Tax, which taxes the transaction itself rather than the
          paperwork.
        </p>
        <p>
          The old name stuck. Estate agents, mortgage brokers, newspapers and most buyers still say &quot;stamp
          duty&quot;, while HMRC forms, legislation and conveyancing documents say SDLT. When someone in England asks
          how much stamp duty they will pay on a house, they mean SDLT.
        </p>
        <p>
          Stamp Duty in the original sense still exists, but for property buyers it is largely irrelevant. Today it
          mainly applies to shares bought using a paper stock transfer form, at 0.5% where the transaction is over
          £1,000. Shares bought electronically are charged Stamp Duty Reserve Tax at the same 0.5% rate.
        </p>

        <h2>One UK, three property taxes</h2>
        <p>
          Property tax was devolved in two steps. LBTT replaced SDLT in Scotland from 1 April 2015, and LTT replaced
          it in Wales from 1 April 2018. Northern Ireland did not devolve the tax, so it still uses SDLT on the same
          terms as England.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="px-2 py-3"></th>
                <th className="px-2 py-3">SDLT</th>
                <th className="px-2 py-3">LBTT</th>
                <th className="px-2 py-3">LTT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="px-2 py-3 font-semibold">Where</td><td className="px-2 py-3">England and Northern Ireland</td><td className="px-2 py-3">Scotland</td><td className="px-2 py-3">Wales</td></tr>
              <tr><td className="px-2 py-3 font-semibold">In force since</td><td className="px-2 py-3">1 December 2003</td><td className="px-2 py-3">1 April 2015</td><td className="px-2 py-3">1 April 2018</td></tr>
              <tr><td className="px-2 py-3 font-semibold">Run by</td><td className="px-2 py-3">HMRC</td><td className="px-2 py-3">Revenue Scotland</td><td className="px-2 py-3">Welsh Revenue Authority</td></tr>
              <tr><td className="px-2 py-3 font-semibold">Residential nil-rate band</td><td className="px-2 py-3">£125,000</td><td className="px-2 py-3">£145,000</td><td className="px-2 py-3">£225,000</td></tr>
              <tr><td className="px-2 py-3 font-semibold">Top residential rate</td><td className="px-2 py-3">12% above £1.5m</td><td className="px-2 py-3">12% above £750,000</td><td className="px-2 py-3">12% above £1.5m</td></tr>
              <tr><td className="px-2 py-3 font-semibold">First-time buyer relief</td><td className="px-2 py-3">0% to £300,000 (homes up to £500,000)</td><td className="px-2 py-3">Nil-rate band raised to £175,000</td><td className="px-2 py-3">None</td></tr>
              <tr><td className="px-2 py-3 font-semibold">Additional property charge</td><td className="px-2 py-3">+5% on every band</td><td className="px-2 py-3">8% ADS on the whole price</td><td className="px-2 py-3">Separate higher-rates table (5% to 17%)</td></tr>
              <tr><td className="px-2 py-3 font-semibold">Non-resident surcharge</td><td className="px-2 py-3">+2%</td><td className="px-2 py-3">None</td><td className="px-2 py-3">None</td></tr>
              <tr><td className="px-2 py-3 font-semibold">Return and payment due</td><td className="px-2 py-3">Within 14 days of completion</td><td className="px-2 py-3">See Revenue Scotland guidance</td><td className="px-2 py-3">Within 30 days of the day after completion</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Worked example: the same £300,000 home in each nation</h2>
        <p>
          Take a buyer who already owns no other property and is not a first-time buyer (for example, they sold their
          previous home before buying). The only thing that changes is where the house is.
        </p>
        <h3>England or Northern Ireland (SDLT)</h3>
        <ul>
          <li>First £125,000 at 0% = £0</li>
          <li>£125,001 to £250,000 at 2% = £2,500</li>
          <li>£250,001 to £300,000 at 5% = £2,500</li>
          <li><strong>Total: £5,000</strong></li>
        </ul>
        <h3>Scotland (LBTT)</h3>
        <ul>
          <li>First £145,000 at 0% = £0</li>
          <li>£145,001 to £250,000 at 2% = £2,100</li>
          <li>£250,001 to £300,000 at 5% = £2,500</li>
          <li><strong>Total: £4,600</strong></li>
        </ul>
        <h3>Wales (LTT)</h3>
        <ul>
          <li>First £225,000 at 0% = £0</li>
          <li>£225,001 to £300,000 at 6% = £4,500</li>
          <li><strong>Total: £4,500</strong></li>
        </ul>
        <p>
          At this price the three bills are close, but the gap grows at higher values because the bands diverge.
          Scotland&apos;s 10% band starts at £325,001 and its 12% band at £750,001, far lower than in England. You can
          compare any price with the <Link href="/real-estate/uk-stamp-duty-calculator">UK Stamp Duty
          Calculator</Link>, the <Link href="/real-estate/scotland-lbtt-calculator">Scotland LBTT calculator</Link> and
          the <Link href="/real-estate/wales-ltt-calculator">Wales LTT calculator</Link>. The full SDLT band table is in
          our <Link href="/blog/residential-stamp-duty-rates-uk">residential rates guide</Link>.
        </p>

        <h2>How SDLT is actually paid</h2>
        <p>
          SDLT is self-assessed by the buyer. In a typical purchase, your conveyancer asks you questions about other
          property you own, whether you have owned a home before and where you live, then completes the SDLT return
          for you. They pay HMRC from funds you send before completion and give you a certificate (SDLT5) that the
          Land Registry needs to register you as the owner.
        </p>
        <p>
          The legal responsibility remains yours. If the return is wrong because you gave incomplete information, for
          example you did not mention a flat you own abroad, HMRC can charge the extra tax plus interest and
          penalties. Late filing or payment also carries penalties and interest.
        </p>

        <h2>What SDLT is charged on</h2>
        <p>
          SDLT is charged on the &quot;chargeable consideration&quot;, which is usually the price you pay. It covers
          freehold purchases, the purchase of an existing lease, and the premium and rent on a new lease. The rates depend on whether the property is residential, non-residential or mixed-use, and on
          who you are: a first-time buyer, someone buying an additional home, a company, or a non-UK resident.
        </p>

        <h2>Common mistakes</h2>
        <ul>
          <li>
            <strong>Using an English calculator for a Scottish or Welsh home.</strong> The bands, reliefs and surcharges
            are all different. A &quot;UK stamp duty calculator&quot; usually means England and Northern Ireland only.
          </li>
          <li>
            <strong>Expecting first-time buyer relief in Wales.</strong> There is none; Wales instead has a higher
            nil-rate band for everyone.
          </li>
          <li>
            <strong>Assuming the seller pays.</strong> In all three systems the buyer is liable.
          </li>
          <li>
            <strong>Relying on old figures.</strong> SDLT thresholds were temporarily higher between September 2022
            and March 2025. Anything quoting a £250,000 nil-rate band for standard buyers is out of date.
          </li>
          <li>
            <strong>Thinking a zero bill means no paperwork.</strong> Many transactions still need a return.
          </li>
        </ul>

        <div className="not-prose rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-semibold text-slate-900">Need the actual calculation?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the SDLT calculator for England and Northern Ireland, including first-time buyer relief and additional
            dwelling surcharges.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open SDLT Calculator
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
          <li><Link href="/blog/residential-stamp-duty-rates-uk">Residential SDLT rates with worked examples</Link></li>
          <li><Link href="/blog/first-time-buyer-stamp-duty-relief-uk">First-time buyer stamp duty relief</Link></li>
          <li><Link href="/blog/uk-stamp-duty-second-home-guide">Second home stamp duty and the 5% surcharge</Link></li>
          <li><Link href="/blog/buy-to-let-stamp-duty-guide-uk">Buy-to-let stamp duty for landlords</Link></li>
        </ul>

        <h2>Sources</h2>
        <ul>
          <li>
            <a href="https://www.gov.uk/stamp-duty-land-tax" rel="noopener noreferrer" target="_blank">
              GOV.UK: Stamp Duty Land Tax overview
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/stamp-duty-land-tax/residential-property-rates" rel="noopener noreferrer" target="_blank">
              GOV.UK: SDLT residential property rates
            </a>
          </li>
          <li>
            <a href="https://www.gov.uk/tax-buy-shares" rel="noopener noreferrer" target="_blank">
              GOV.UK: Tax when you buy shares
            </a>
          </li>
          <li>
            <a href="https://revenue.scot/taxes/land-buildings-transaction-tax/residential-property" rel="noopener noreferrer" target="_blank">
              Revenue Scotland: LBTT residential property rates
            </a>
          </li>
          <li>
            <a href="https://www.gov.wales/land-transaction-tax-rates-and-bands" rel="noopener noreferrer" target="_blank">
              Welsh Government: Land Transaction Tax rates and bands
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
