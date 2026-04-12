import Link from "next/link";
import type { Metadata } from "next";

import DnsChecker from "@/app/utility/dns-checker/components/DnsChecker";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/dns-checker";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
    {
        question: "What DNS record types can I look up?",
        answer:
            "You can query A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, and CAA records. Select the types you need before running the lookup.",
    },

    {
        question: "Why do some record types show 'No records found'?",
        answer:
            "A domain may simply not have records of that type configured. For example, many domains have no AAAA records if they are not IPv6-enabled, or no CAA records if they rely on default CA issuance policies.",
    },
];

export const metadata: Metadata = {
    title: "DNS Checker | Look Up DNS Records for Any Domain",
    description:
        "Look up A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, and CAA records for any domain. Results are fetched server-side and displayed grouped by record type.",
    keywords: ["dns checker", "dns lookup", "dns records", "check dns", "mx lookup", "txt record lookup"],
    alternates: { canonical: PAGE_URL },
    openGraph: {
        type: "website",
        url: PAGE_URL,
        title: "DNS Checker",
        description: "Look up DNS records for any domain, grouped by type with copy-to-clipboard support.",
    },
    twitter: {
        card: "summary_large_image",
        title: "DNS Checker",
        description: "Query A, MX, TXT, CNAME, NS and more DNS record types for any domain.",
    },
};

function buildApplicationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "DNS Checker",
        url: PAGE_URL,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: "Free DNS record lookup tool supporting A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, and CAA record types.",
    };
}

export default function DnsCheckerPage() {
    const breadcrumbs = buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Utility", path: "/utility" },
        { name: "DNS Checker", path: PAGE_PATH },
    ]);
    const faqJsonLd = buildFaqJsonLd(faq);

    return (
        <div className="space-y-8">
            <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
            <JsonLd data={serializeJsonLd(breadcrumbs)} />
            {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
            <section className="space-y-4 py-2 sm:py-4">
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <li><Link href="/" className="hover:text-primary">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/utility" className="hover:text-primary">Utility</Link></li>
                        <li>/</li>
                        <li className="text-foreground">DNS Checker</li>
                    </ol>
                </nav>
                <div className="max-w-3xl">
                    <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Dev Utility</p>
                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">DNS Checker</h1>
                    <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                        Look up DNS records for any domain. Select the record types you need, run the lookup, and copy results directly from the page.
                    </p>
                </div>
            </section>
            <DnsChecker />
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
            <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
        </div>
    );
}
