import Link from "next/link";
import type { Metadata } from "next";

import JwtDecoder from "@/app/utility/jwt-decoder/components/JwtDecoder";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/jwt-decoder";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Does this verify the JWT signature?",
    answer:
      "No. It decodes the Base64URL header and payload only. Signature verification requires the correct secret or public key and depends on the signing algorithm.",
  },
  {
    question: "Is decoding the same as trusting the token?",
    answer:
      "No. Any JWT can be decoded whether or not it is valid. Always verify the signature and token claims in your actual application.",
  },
  {
    question: "Does the token leave my browser?",
    answer:
      "This decoder works locally in the page and does not need a server round trip to parse the token segments.",
  },
];

export const metadata: Metadata = {
  title: "JWT Decoder | Decode Header and Payload Locally",
  description:
    "Decode JWT header and payload segments locally in the browser. Useful for debugging token contents without sending them to a server.",
  keywords: ["jwt decoder", "decode jwt", "jwt payload decoder"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "JWT Decoder",
    description: "Decode JWT header and payload locally for debugging.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder",
    description: "Read JWT header and payload segments without server decoding.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JWT Decoder",
    url: PAGE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free JWT decoder for local Base64URL header and payload inspection.",
  };
}

export default function JwtDecoderPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "JWT Decoder", path: PAGE_PATH },
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
            <li className="text-foreground">JWT Decoder</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Dev Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">JWT Decoder</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Decode JWT header and payload segments locally to inspect claims and token metadata quickly without sending the token to a backend.
          </p>
        </div>
      </section>
      <JwtDecoder />
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
