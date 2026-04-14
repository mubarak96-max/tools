import Link from "next/link";
import type { Metadata } from "next";

import LondonStartupCostCalculator from "@/app/finance/london-business-startup-cost-calculator/components/LondonStartupCostCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/london-business-startup-cost-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
    {
        question: "How much does it cost to register a limited company in the UK?",
        answer:
            "Registering a private limited company (Ltd) online with Companies House costs £100. LLP incorporation also costs £100 online. Sole traders and general partnerships do not register with Companies House — they register with HMRC for Self Assessment, which is free.",
    },
    {
        question: "Does a sole trader need to register with Companies House?",
        answer:
            "No. Sole traders do not register with Companies House. They must register with HMRC for Self Assessment to pay Income Tax and National Insurance. This registration is free.",
    },
    {
        question: "What is the VAT registration threshold in the UK?",
        answer:
            "The VAT registration threshold is £90,000 of taxable turnover in any rolling 12-month period (from April 2024, HMRC). Businesses below this threshold can register voluntarily. VAT registration itself is free.",
    },
    {
        question: "Do I need a premises licence for my London business?",
        answer:
            "A premises licence is required under the Licensing Act 2003 if your business sells alcohol, provides regulated entertainment, or offers late-night refreshment. Most retail shops, offices, and online businesses do not need one. Restaurants selling alcohol do.",
    },
    {
        question: "How much does a premises licence cost in London?",
        answer:
            "Premises licence application fees are set by the Licensing Act 2003 and depend on the rateable value of the property: Band A (up to £4,300) = £100; Band B (£4,301–£33,000) = £190; Band C (£33,001–£87,000) = £315; Band D (£87,001–£125,000) = £450; Band E (£125,001+) = £635. London commercial premises typically fall in Band B–D.",
    },
    {
        question: "What ongoing fees do UK limited companies pay?",
        answer:
            "Limited companies and LLPs must file a Confirmation Statement with Companies House once per year. The fee for the first statement in a 12-month period is £50 (online). Companies must also register for Corporation Tax within 3 months of starting to trade (free) and file annual accounts.",
    },
];

export const metadata: Metadata = {
    title: "London Business Startup Cost Calculator | Companies House, HMRC & Launch Costs",
    description:
        "Free calculator for London and UK business startup costs. Includes official Companies House fees (£100 Ltd), HMRC registrations, premises licence fees (Licensing Act 2003), and optional launch costs. VAT threshold £90,000.",
    keywords: [
        "london business startup cost calculator",
        "cost to start a business in london",
        "UK limited company setup cost",
        "companies house registration cost",
        "london business registration fees",
        "how much does it cost to start a limited company in the UK",
        "london premises licence cost",
        "UK sole trader registration cost",
    ],
    alternates: {
        canonical: PAGE_URL,
    },
    openGraph: {
        type: "website",
        url: PAGE_URL,
        title: "London Business Startup Cost Calculator | Companies House, HMRC & Launch Costs",
        description:
            "Estimate your UK business startup costs with official Companies House fees, HMRC registrations, premises licence fees, and optional launch costs.",
    },
    twitter: {
        card: "summary_large_image",
        title: "London Business Startup Cost Calculator",
        description:
            "Free calculator for London and UK business startup costs including Companies House, HMRC, and premises licence fees.",
    },
};

function buildApplicationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "London Business Startup Cost Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "GBP",
        },
        description:
            "Free calculator for London and UK business startup costs. Includes official Companies House fees, HMRC registrations, premises licence fees, and optional launch costs.",
        featureList: [
            "Companies House incorporation fees",
            "HMRC registration costs",
            "Premises licence fee bands",
            "Optional launch cost estimator",
            "Minimum, likely, and upper cost ranges",
        ],
    };
}

export default function LondonStartupCostCalculatorPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Finance", path: "/finance" },
        { name: "London Business Startup Cost Calculator", path: PAGE_PATH },
    ]);
    const faqJsonLd = buildFaqJsonLd(faq);

    return (
        <div className="space-y-8">
            <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
            <JsonLd data={serializeJsonLd(breadcrumbs)} />
            {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

            {/* Header */}
            <section className="space-y-4 py-2 sm:py-4">
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <li><Link href="/" className="hover:text-primary">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
                        <li>/</li>
                        <li className="text-foreground">London Business Startup Cost Calculator</li>
                    </ol>
                </nav>

                <div className="max-w-3xl">
                    <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                        Business Finance
                    </p>
                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        London Business Startup Cost Calculator
                    </h1>
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                        Estimate your Companies House registration, HMRC filing, licensing, and launch costs in the UK. All government fees are sourced directly from official publications — Companies House, HMRC, and GOV.UK.
                    </p>
                </div>
            </section>

            {/* Calculator */}
            <noscript>
                <p className="rounded-[1rem] border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    This calculator requires JavaScript. Please enable JavaScript to use the interactive tool.
                </p>
            </noscript>
            <LondonStartupCostCalculator />

            {/* Official fee schedule */}
            <section className="space-y-4 border-t border-border/60 pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Official UK fee schedule</h2>
                <p className="text-sm text-muted-foreground">
                    All fees below are sourced from official UK government publications. Last verified: April 2025.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="pb-3 pr-6 font-semibold text-foreground">Item</th>
                                <th className="pb-3 pr-6 font-semibold text-foreground">Fee</th>
                                <th className="pb-3 font-semibold text-foreground">Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {[
                                { item: "Private Limited Company incorporation (online)", fee: "£100", source: "Companies House", href: "https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees" },
                                { item: "LLP incorporation (online)", fee: "£100", source: "Companies House", href: "https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees" },
                                { item: "Sole trader / partnership registration", fee: "£0", source: "HMRC", href: "https://www.gov.uk/register-for-self-assessment" },
                                { item: "Confirmation Statement (first in 12-month period, online)", fee: "£50/yr", source: "Companies House", href: "https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees" },
                                { item: "VAT registration", fee: "£0", source: "HMRC", href: "https://www.gov.uk/vat-registration" },
                                { item: "HMRC Self Assessment registration", fee: "£0", source: "HMRC", href: "https://www.gov.uk/register-for-self-assessment" },
                                { item: "Food business registration (local council)", fee: "£0", source: "Food Standards Agency", href: "https://www.food.gov.uk/business-guidance/register-a-food-business" },
                                { item: "Premises licence — Band A (up to £4,300 rateable value)", fee: "£100 + £70/yr", source: "GOV.UK", href: "https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels" },
                                { item: "Premises licence — Band B (£4,301–£33,000)", fee: "£190 + £180/yr", source: "GOV.UK", href: "https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels" },
                                { item: "Premises licence — Band C (£33,001–£87,000)", fee: "£315 + £295/yr", source: "GOV.UK", href: "https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels" },
                                { item: "Premises licence — Band D (£87,001–£125,000)", fee: "£450 + £320/yr", source: "GOV.UK", href: "https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels" },
                                { item: "Premises licence — Band E (£125,001+)", fee: "£635 + £350/yr", source: "GOV.UK", href: "https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels" },
                                { item: "Personal licence (Designated Premises Supervisor)", fee: "£37", source: "GOV.UK", href: "https://www.gov.uk/personal-licence" },
                            ].map(({ item, fee, source, href }) => (
                                <tr key={item}>
                                    <td className="py-3 pr-6 text-foreground">{item}</td>
                                    <td className="py-3 pr-6 font-medium text-foreground">{fee}</td>
                                    <td className="py-3">
                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            {source}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-muted-foreground">
                    This tool provides estimates based on official published fees. Consult a qualified accountant or solicitor for advice specific to your situation.
                </p>
            </section>

            {/* Premises licence explainer */}
            <section className="space-y-4 border-t border-border/60 pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Do you need a premises licence?</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                    A premises licence is required under the{" "}
                    <a href="https://www.gov.uk/guidance/alcohol-licensing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Licensing Act 2003
                    </a>{" "}
                    if your business carries out any of the following licensable activities: selling or supplying alcohol, providing regulated entertainment (live music, films, dancing), or offering late-night refreshment (hot food or drink between 11pm and 5am).
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                    Most offices, online businesses, and professional services do not need a premises licence. Restaurants, pubs, bars, nightclubs, and some retail shops typically do.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="pb-3 pr-6 font-semibold text-foreground">Band</th>
                                <th className="pb-3 pr-6 font-semibold text-foreground">Rateable value</th>
                                <th className="pb-3 pr-6 font-semibold text-foreground">Application fee</th>
                                <th className="pb-3 font-semibold text-foreground">Annual renewal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {[
                                { band: "A", rv: "Up to £4,300", app: "£100", annual: "£70" },
                                { band: "B", rv: "£4,301–£33,000", app: "£190", annual: "£180" },
                                { band: "C", rv: "£33,001–£87,000", app: "£315", annual: "£295" },
                                { band: "D", rv: "£87,001–£125,000", app: "£450", annual: "£320" },
                                { band: "E", rv: "£125,001+", app: "£635", annual: "£350" },
                            ].map(({ band, rv, app, annual }) => (
                                <tr key={band}>
                                    <td className="py-3 pr-6 font-medium text-foreground">Band {band}</td>
                                    <td className="py-3 pr-6 text-muted-foreground">{rv}</td>
                                    <td className="py-3 pr-6 text-foreground">{app}</td>
                                    <td className="py-3 text-foreground">{annual}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-muted-foreground">
                    Source:{" "}
                    <a href="https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        GOV.UK — Licensing Act 2003 fee levels
                    </a>
                </p>
            </section>

            {/* Food business registration */}
            <section className="space-y-4 border-t border-border/60 pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Food business registration</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                    If your business handles, prepares, stores, or sells food — including restaurants, cafés, takeaways, market stalls, and home catering — you must register as a food business with your local council. Registration is free and must be completed at least 28 days before you start trading. It cannot be refused.
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                    Registration is separate from a premises licence. A restaurant selling alcohol needs both food business registration (free) and a premises licence (fee by rateable value band).
                </p>
                <p className="text-sm text-muted-foreground">
                    Source:{" "}
                    <a href="https://www.food.gov.uk/business-guidance/register-a-food-business" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Food Standards Agency — Register a food business
                    </a>
                </p>
            </section>

            {/* FAQ */}
            <section className="space-y-6 border-t border-border/60 pt-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
                <div className="mt-6 space-y-4">
                    {faq.map((item, index) => (
                        <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
                            <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
        </div>
    );
}
