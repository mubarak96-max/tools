import Link from "next/link";
import type { Metadata } from "next";
import { AuthorSection } from "@/components/blog/AuthorSection";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/residential-stamp-duty-rates-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Residential Stamp Duty Rates in England: How the SDLT Bands Work",
  description:
    "A practical guide to the standard residential SDLT bands in England and Northern Ireland, before first-time buyer relief or additional property surcharges change the total.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Residential Stamp Duty Rates in England",
    description:
      "Understand the core residential SDLT bands, when they apply, and how they interact with first-time buyer and second home rules.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function ResidentialStampDutyRatesUkPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Residential Stamp Duty Rates", path: PAGE_PATH },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

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
            <span>7 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
        <p className="text-lg leading-8 text-muted-foreground">
          Before you model first-time buyer relief or a second home surcharge, you need the baseline residential SDLT
          structure. This is the core rate framework buyers build on.
        </p>
      </header>

      <article className="prose prose-slate max-w-none">
        <h2>Residential bands are the foundation</h2>
        <p>
          The standard residential bands are the default route for owner-occupier transactions that do not qualify for
          relief and do not trigger additional property surcharges. Most property calculators start here because every
          variation builds on this baseline.
        </p>

        <h2>Why residential searches still branch into multiple scenarios</h2>
        <p>
          A buyer searching for <strong>residential stamp duty</strong> may actually need one of three outcomes: the
          standard homeowner calculation, the first-time buyer path, or the additional property path. That is why a
          dedicated SDLT calculator needs all three decision points.
        </p>

        <h2>Use the baseline, then apply the modifier</h2>
        <p>
          The cleanest workflow is to estimate the normal residential amount, then test whether relief or a surcharge
          changes the answer. That gives buyers a faster sense of how much the special rule is really costing or saving.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 not-prose">
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
      </article>
    </div>
  );
}
