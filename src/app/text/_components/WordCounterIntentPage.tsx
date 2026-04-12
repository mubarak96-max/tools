import Link from "next/link";

import { WordCounter } from "@/app/text/character-counter/components/WordCounter";
import { FreeToolIcon } from "@/components/tools/FreeToolIcon";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote } from "@/components/tools/ToolPageScaffold";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import type { WordCounterLanding } from "@/lib/word-counter-landings/types";
import { WORD_COUNTER_HUB_PATH, WORD_COUNTER_LANDINGS_ANCHOR_ID } from "@/lib/word-counter-landings/registry";
import { getRelatedFreeTools } from "@/lib/tools/registry";

function buildWebApplicationJsonLd(landing: WordCounterLanding) {
  const pageUrl = absoluteUrl(`/text/${landing.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: landing.h1,
    url: pageUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: landing.description,
    featureList: [
      "Word count",
      "Character count",
      "Characters without spaces",
      "Sentence count",
      "Paragraph count",
      "Reading time estimate",
    ],
  };
}

export default function WordCounterIntentPage({ landing }: { landing: WordCounterLanding }) {
  const pagePath = `/text/${landing.slug}`;
  const pageUrl = absoluteUrl(pagePath);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: landing.h1, path: pagePath },
  ]);
  const faqJsonLd = buildFaqJsonLd(landing.faq);
  const relatedTools = getRelatedFreeTools(WORD_COUNTER_HUB_PATH).filter((tool) => tool.category === "Text");

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildWebApplicationJsonLd(landing))} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/text" className="hover:text-primary">
                Text
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{landing.h1}</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Word counter
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{landing.h1}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{landing.intro}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Prefer the generic view? Use the{" "}
            <Link href={WORD_COUNTER_HUB_PATH} className="font-medium text-primary hover:underline">
              character and word counter
            </Link>{" "}
            hub for the same metrics with neutral copy.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <WordCounter variant={landing.toolVariant} {...(landing.tool ?? {})} />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          {landing.sections.map((section) => (
            <div key={section.heading} className="mt-8 first:mt-0">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {landing.faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related text tools</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href={`/text#${WORD_COUNTER_LANDINGS_ANCHOR_ID}`} className="text-sm font-medium text-primary hover:underline">
              Word counter pages →
            </Link>
            <Link href="/text" className="text-sm font-medium text-primary hover:underline">
              All text tools →
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-[1.25rem] border border-border bg-background p-4 transition-all hover:border-primary/20 hover:bg-primary-soft"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{tool.name}</h3>
                <div className="shrink-0 rounded-md border border-border bg-muted p-1.5">
                  <FreeToolIcon tool={tool} size={16} />
                </div>
              </div>
              <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <JsonLd
        data={serializeJsonLd({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: landing.h1,
          url: pageUrl,
          description: landing.description,
          isPartOf: {
            "@type": "WebSite",
            name: "FindBest Tools",
            url: absoluteUrl("/"),
          },
        })}
      />
    </div>
  );
}
