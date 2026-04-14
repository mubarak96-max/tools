import Link from "next/link";
import type { Metadata } from "next";

import NewYorkStartupCostCalculator from "./components/NewYorkStartupCostCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/new-york-business-startup-cost-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
    {
        question: "How much does it cost to form an LLC in New York?",
        answer:
            "Forming a domestic LLC in New York costs $200 for the Articles of Organization filed with the NY Department of State. LLCs are also required to publish a notice of formation in two designated newspapers within 120 days and file a Certificate of Publication for $50. Newspaper publication costs vary by county.",
    },
    {
        question: "What is the LLC publication requirement in New York?",
        answer:
            "New York requires all LLCs to publish a notice of formation in two newspapers designated by the county clerk within 120 days of formation. After publication, the LLC must file a Certificate of Publication with the NY Department of State for $50. Failure to comply suspends the LLC's authority to carry on business in New York.",
    },
    {
        question: "Do I need to register for sales tax in New York?",
        answer:
            "Yes, if your business will sell taxable goods or services in New York, you must obtain a Certificate of Authority from the NY Department of Taxation and Finance before making any taxable sales. Registration is free and can be done through NY Business Express.",
    },
    {
        question: "What is a DBA and how much does it cost in New York?",
        answer:
            "A DBA (doing business as) or assumed name lets you operate under a name different from your legal business name. For sole proprietors and partnerships, a business certificate is filed with the county clerk for approximately $25–$35. For LLCs and corporations, an assumed name certificate is filed with the NY Department of State for $25, plus a county fee of $100 per NYC county or $25 per county outside NYC.",
    },
    {
        question: "How much does it cost to start a corporation in New York?",
        answer:
            "Filing a Certificate of Incorporation for a domestic business corporation in New York costs $125 with the NY Department of State. Additional costs may include an assumed name certificate ($25 state + county fees), EIN registration (free from the IRS), and sales tax registration if applicable (free).",
    },
    {
        question: "What ongoing fees do LLCs and corporations pay in New York?",
        answer:
            "LLCs and corporations in New York must file a biennial statement every two years with the NY Department of State. The filing fee is $9. This is a recurring compliance cost separate from startup costs.",
    },
];

export const metadata: Metadata = {
    title: "New York Business Startup Cost Calculator | Filing, Licensing & Launch Costs",
    description:
        "Free calculator for NY business startup costs. Includes official filing fees for LLCs ($200), corporations ($125), DBA, LLC publication ($50), EIN, and sales tax registration — plus optional launch costs.",
    keywords: [
        "new york business startup cost calculator",
        "cost to start a business in new york",
        "new york LLC cost",
        "NYC business startup costs",
        "NY business filing fees",
        "how much does it cost to start an LLC in New York",
    ],
    alternates: { canonical: PAGE_URL },
    openGraph: {
        type: "website",
        url: PAGE_URL,
        title: "New York Business Startup Cost Calculator | Filing, Licensing & Launch Costs",
        description:
            "Free calculator for NY business startup costs. Includes official filing fees for LLCs ($200), corporations ($125), DBA, LLC publication ($50), EIN, and sales tax registration — plus optional launch costs.",
    },
    twitter: {
        card: "summary_large_image",
        title: "New York Business Startup Cost Calculator | Filing, Licensing & Launch Costs",
        description:
            "Free calculator for NY business startup costs. Includes official filing fees for LLCs ($200), corporations ($125), DBA, LLC publication ($50), EIN, and sales tax registration — plus optional launch costs.",
    },
};

function buildApplicationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "New York Business Startup Cost Calculator",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
            "Free calculator for NY business startup costs including official filing fees for LLCs, corporations, DBA, LLC publication, EIN, and sales tax registration.",
    };
}

export default function NewYorkBusinessStartupCostCalculatorPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Finance", path: "/finance" },
        { name: "New York Business Startup Cost Calculator", path: PAGE_PATH },
    ]);
    const faqJsonLd = buildFaqJsonLd(faq);

    return (
        <div className="space-y-8">
            <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
            <JsonLd data={serializeJsonLd(breadcrumbs)} />
            {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

            {/* Breadcrumb nav */}
            <section className="space-y-4 py-2 sm:py-4">
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <li><Link href="/" className="hover:text-primary">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
                        <li>/</li>
                        <li className="text-foreground">New York Business Startup Cost Calculator</li>
                    </ol>
                </nav>
                <div className="max-w-3xl">
                    <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">New York Business</p>
                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">New York Business Startup Cost Calculator</h1>
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                        Estimate your filing, licensing, tax registration, and launch costs in New York. All government fees are sourced from the NY Department of State and IRS official publications.
                    </p>
                </div>
            </section>

            {/* Calculator */}
            <div>
                <noscript>
                    <p className="rounded-[1rem] border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                        This calculator requires JavaScript. Please enable JavaScript to use this tool.
                    </p>
                </noscript>
                <NewYorkStartupCostCalculator />
            </div>

            {/* Official fee schedule */}
            <section className="space-y-4 border-t border-border/60 pt-8">
                <div className="prose prose-slate max-w-none">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Official New York filing fees</h2>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Verified June 2025. All fees below are sourced from official government publications.
                    </p>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="pb-3 pr-4 font-semibold text-foreground">Item</th>
                                    <th className="pb-3 pr-4 font-semibold text-foreground">Fee</th>
                                    <th className="pb-3 font-semibold text-foreground">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">LLC formation (Articles of Organization)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$200</td>
                                    <td className="py-3">
                                        <a href="https://dos.ny.gov/fees-corporations-and-businesses" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">NY Department of State</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">Corporation formation (Certificate of Incorporation)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$125</td>
                                    <td className="py-3">
                                        <a href="https://dos.ny.gov/fees-corporations-and-businesses" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">NY Department of State</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">Sole proprietorship / partnership entity filing</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$0</td>
                                    <td className="py-3 text-muted-foreground">NY Department of State</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">LLC assumed name certificate (state)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$25</td>
                                    <td className="py-3 text-muted-foreground">NY Department of State</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">Corporation assumed name certificate (state)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$25</td>
                                    <td className="py-3 text-muted-foreground">NY Department of State</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">Assumed name — county fee (NYC county)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$100 per county</td>
                                    <td className="py-3 text-muted-foreground">NY Department of State</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">Assumed name — county fee (outside NYC)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$25 per county</td>
                                    <td className="py-3 text-muted-foreground">NY Department of State</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">LLC Certificate of Publication</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$50</td>
                                    <td className="py-3">
                                        <a href="https://dos.ny.gov/limited-liability-companies-llcs" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">NY Department of State</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">EIN (Employer Identification Number)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$0</td>
                                    <td className="py-3">
                                        <a href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">IRS</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">NY Sales Tax Certificate of Authority</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$0</td>
                                    <td className="py-3">
                                        <a href="https://www.tax.ny.gov/bus/st/stidx.htm" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">NY Tax &amp; Finance</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-4 text-muted-foreground">Biennial statement (LLC / Corporation)</td>
                                    <td className="py-3 pr-4 font-medium text-foreground">$9 every 2 years</td>
                                    <td className="py-3 text-muted-foreground">NY Department of State</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        This tool provides estimates based on official published fees. Consult a licensed attorney or accountant for advice specific to your situation.
                    </p>
                </div>
            </section>

            {/* LLC publication requirement */}
            <section className="space-y-4 border-t border-border/60 pt-8">
                <div className="prose prose-slate max-w-none">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">What the LLC publication requirement means</h2>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        New York is one of the few states that requires LLCs to publish a notice of formation in two newspapers designated by the county clerk. This must be done within 120 days of the LLC&apos;s formation date. After both publications are complete, the LLC must file a Certificate of Publication with the NY Department of State for a $50 filing fee. Failure to comply with the publication requirement suspends the LLC&apos;s authority to carry on business in New York until the requirement is met.
                    </p>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Newspaper publication costs vary significantly by county. Manhattan (New York County) publication costs are typically $1,000–$2,000 or more. Some upstate counties cost under $200. Contact your county clerk&apos;s office to identify the designated newspapers and get current rates.
                    </p>
                    <p className="mt-3">
                        <a href="https://dos.ny.gov/limited-liability-companies-llcs" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
                            NY Department of State — LLC publication requirement
                        </a>
                    </p>
                </div>
            </section>

            {/* Industry-specific licenses */}
            <section className="space-y-4 border-t border-border/60 pt-8">
                <div className="prose prose-slate max-w-none">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Industry-specific licenses in New York</h2>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                        Different industries require different state and city licenses beyond entity formation. Restaurants, salons, contractors, street vendors, and professional practices all face additional licensing requirements from state agencies and, in New York City, from city agencies. NY Business Express is the official routing hub for identifying which licenses and permits apply to your specific business type and location.
                    </p>
                    <p className="mt-3">
                        <a href="https://businessexpress.ny.gov" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
                            NY Business Express — find licenses and permits for your business
                        </a>
                    </p>
                </div>
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
