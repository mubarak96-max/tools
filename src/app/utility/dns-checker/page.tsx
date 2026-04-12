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
        answer: "Our tool supports A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, and CAA records. You can select individual types or query all of them simultaneously for a complete domain overview.",
    },
    {
        question: "How long does DNS propagation take?",
        answer: "DNS propagation typically takes anywhere from 12 to 48 hours to complete worldwide. However, depending on your TTL (Time to Live) settings, changes can often be seen in just a few minutes.",
    },
    {
        question: "What's the difference between A and CNAME records?",
        answer: "An A record maps a hostname directly to an IPv4 address. A CNAME (Canonical Name) record acts as an alias, pointing one domain name to another instead of a specific IP.",
    },
    {
        question: "Why is my MX record not showing up?",
        answer: "If your MX records aren't appearing, it could be due to a recent change still propagating, an incorrect priority value, or a typo in the mail server hostname. Ensure your name servers are correctly pointed to your provider.",
    },
    {
        question: "How do I check if my DNS has propagated?",
        answer: "You can use this tool to query records directly from our servers. To verify global propagation, you should use a checker that queries servers from multiple geographical locations to see if the results are consistent.",
    },
    {
        question: "What is an SOA record used for?",
        answer: "The SOA (Start of Authority) record contains essential administrative information about a DNS zone, including the primary name server, the email of the domain administrator, and several timers for refreshing the zone data.",
    },
    {
        question: "What is the TTL (Time to Live) in DNS?",
        answer: "TTL is a value in a DNS record that tells the resolver or browser how long (in seconds) it should cache the record before it needs to query the server again for an update.",
    },
    {
        question: "Can I have multiple TXT records for one domain?",
        answer: "Yes, you can have multiple TXT records. This is very common for handling different services like SPF for email, and verification codes for Google Search Console, Microsoft 365, or other third-party tools.",
    },
    {
        question: "What is a reverse DNS (PTR) lookup?",
        answer: "A PTR record is the opposite of an A record. It maps an IP address back to a hostname, which is often used by mail servers to verify that a sending IP is associated with the domain it claims to be.",
    },
    {
        question: "Why do some record types show 'No records found'?",
        answer: "This usually means the domain hasn't configured that specific record type. For example, a domain without IPv6 support won't have AAAA records, and if no security policies are set, it might not have CAA or TLSA records.",
    },
];

export const metadata: Metadata = {
    title: "Free DNS Lookup Tool — Check All DNS Record Types Instantly",
    description: "Free DNS checker tool — instantly look up A, MX, CNAME, TXT, NS and more records for any domain. Results are fetched server-side with no sign-up required.",
    keywords: ["dns checker", "dns lookup", "dns records", "check dns online", "mx record lookup", "txt lookup", "dns propagation checker"],
    alternates: { canonical: PAGE_URL },
    openGraph: {
        type: "website",
        url: PAGE_URL,
        title: "DNS Lookup Tool | Find DNS Records Instantly",
        description: "Verify A, MX, TXT, CNAME, and more records for any domain with our free, instant DNS checker.",
    },
    twitter: {
        card: "summary_large_image",
        title: "DNS Checker — Free Online DNS Lookup",
        description: "Query all major DNS record types for any domain. Clean UI, fast results, no sign-up.",
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
        description: "Professional DNS record lookup tool supporting A, AAAA, MX, CNAME, TXT, NS, SOA, PTR, SRV, and CAA record types.",
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
        <div className="space-y-12">
            <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
            <JsonLd data={serializeJsonLd(breadcrumbs)} />
            {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

            {/* Hero Section */}
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
                    <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Network Utility</p>
                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">DNS Checker</h1>
                    <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                        Check DNS records for any domain name in real-time. Look up A, MX, CNAME, TXT, and other critical records to verify configuration or troubleshoot propagation.
                    </p>
                </div>
            </section>

            <DnsChecker />

            {/* Educational Content */}
            <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
                <div className="space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">What are DNS Records?</h2>
                        <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
                            <p>
                                DNS (Domain Name System) records are instructions that live on authoritative DNS servers. Think of them as a "phone book" for the internet that translates human-readable domain names (like findbest.tools) into machine-readable IP addresses (like 192.168.1.1).
                            </p>
                            <p>
                                When you type a URL into your browser, a DNS query is sent to a resolver. The resolver eventually finds the authoritative server for that domain and asks for the records needed to route your request to the correct server. Without these records, the internet as we know it would not function.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Common DNS Record Types Explained</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { title: "A Record", desc: "The most fundamental record. It maps a domain or subdomain to an IPv4 address." },
                                { title: "AAAA Record", desc: "Similar to the A record, but it maps a domain to an IPv6 address instead." },
                                { title: "MX Record", desc: "Mail Exchange records specify the mail servers used for the domain's email." },
                                { title: "CNAME Record", desc: "A Canonical Name record aliases one domain name to another (alias)." },
                                { title: "TXT Record", desc: "Stores text data for services like SPF, DKIM, and site ownership verification." },
                                { title: "NS Record", desc: "Identifies the authoritative name servers responsible for your DNS zone." },
                                { title: "SOA Record", desc: "The Start of Authority record contains admin info and zone transfer details." },
                                { title: "PTR Record", desc: "The Pointer record is used for reverse DNS lookups (IP to domain name)." },
                            ].map((item) => (
                                <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">How to Troubleshoot DNS Issues</h2>
                        <div className="prose prose-slate max-w-none text-muted-foreground leading-7">
                            <p>
                                DNS issues are often the root cause of "Site Not Found" errors or email delivery failures. Here are three steps to troubleshoot using this checker:
                            </p>
                            <ol className="list-decimal pl-5 space-y-4">
                                <li>
                                    <strong>Check NS Records:</strong> First, verify that your domain is pointing to the correct name servers provided by your host.
                                </li>
                                <li>
                                    <strong>Verify A/CNAME:</strong> Ensure your A record points to your server's correct IP, or your CNAME points to the correct provider hostname.
                                </li>
                                <li>
                                    <strong>Wait for Propagation:</strong> If you recently made changes, use this tool to see if the new records are showing up. Remember that TTL settings determine how long old records are cached.
                                </li>
                            </ol>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
                        <div className="grid gap-4">
                            {faq.map((item, index) => (
                                <article key={item.question} className="rounded-2xl border border-border bg-card p-6">
                                    <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-8">
                    <div className="rounded-2xl border border-border bg-muted/30 p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">How to Use</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex gap-3">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">1</span>
                                <span>Enter your domain (e.g., example.com)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">2</span>
                                <span>Select the record types for your DNS record lookup</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">3</span>
                                <span>Click "Lookup" to run the DNS checker</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Technical Utilities</h3>
                        <div className="grid gap-2">
                             {[
                                { name: "Robots.txt Generator", href: "/utility/robots-txt-generator" },
                                { name: "Sitemap Generator", href: "/utility/sitemap-generator" },
                                { name: "URL Extractor", href: "/text/url-extractor" },
                                { name: "JSON Validator", href: "/utility/json-validator" },
                                { name: "IDN Encoder", href: "/converter/idn-encoder" },
                             ].map(tool => (
                                <Link key={tool.href} href={tool.href} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                                    {tool.name}
                                    <span>→</span>
                                </Link>
                             ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/10 p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Resources</h3>
                        <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                            <li>
                                <a href="https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline underline-offset-4">IANA DNS Parameters</a>
                            </li>
                            <li>
                                <a href="https://www.icann.org/resources/pages/welcome-2012-02-25-en" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline underline-offset-4">ICANN DNS Basics</a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>

            <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
        </div>
    );
}
