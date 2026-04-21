import Link from "next/link";
import type { Metadata } from "next";

import FreeCvResumeBuilder from "@/app/utility/free-cv-resume-builder/components/FreeCvResumeBuilder";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/free-cv-resume-builder";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is this CV builder free?",
    answer:
      "Yes. This version is built as a free browser-based resume builder with no AI features required to use the editor, templates, autosave, or print-to-PDF flow.",
  },
  {
    question: "How do I save my resume?",
    answer:
      "The builder autosaves your draft in your browser localStorage. You can also export the resume data as a JSON backup file.",
  },
  {
    question: "How do I download it as a PDF?",
    answer:
      "Use the print button in the builder and choose Save as PDF in your browser's print dialog. The preview area is formatted for A4-style export.",
  },
  {
    question: "Does it work for ATS-friendly resumes?",
    answer:
      "Yes. The Classic template is intentionally simple and text-first, which makes it a safer format for ATS-friendly resume submissions.",
  },
];

export const metadata: Metadata = {
  title: "Free CV Resume Builder | Create, Preview, and Save PDF",
  description:
    "Build a professional resume online for free with editable sections, multiple templates, local autosave, and print-to-PDF export.",
  keywords: [
    "free cv resume builder",
    "resume builder free",
    "free cv maker",
    "free resume maker online",
    "ats resume builder",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free CV Resume Builder",
    description:
      "Create a professional CV with live preview, editable sections, templates, and print-to-PDF export.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free CV Resume Builder",
    description:
      "Build a CV online for free with live preview, autosave, and printable templates.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free CV Resume Builder",
    url: PAGE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free online CV and resume builder with live preview, local autosave, multiple templates, and print-to-PDF support.",
    featureList: [
      "Live resume preview",
      "Multiple templates",
      "Local autosave",
      "Print to PDF",
      "JSON backup export",
    ],
  };
}

export default function FreeCvResumeBuilderPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Free CV Resume Builder", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4 print:hidden">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/utility" className="hover:text-primary">Utility</Link></li>
            <li>/</li>
            <li className="text-foreground">Free CV Resume Builder</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Career Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Free CV Resume Builder
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Build a clean, professional CV in your browser with live preview, editable sections, template switching, local autosave, and print-to-PDF export.
          </p>
        </div>
      </section>

      <FreeCvResumeBuilder />

      <section className="space-y-4 border-t border-border/60 pt-8 print:hidden">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What this free CV builder includes</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool focuses on the core resume-building flow: structured personal details, summary, work history, education, skills, languages, projects, certifications, custom sections, multiple templates, and browser-based saving. It deliberately skips AI writing and account walls so the editing experience stays fast and free.
          </p>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8 print:hidden">
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

      <div className="print:hidden">
        <section className="mt-16 border-t border-slate-100 pt-16">
          <Link href="/utility" className="secondary-button px-4 py-2 text-xs">
            View All Utility Tools
          </Link>
        </section>
      </div>
    </div>
  );
}
