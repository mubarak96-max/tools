import Link from "next/link";
import type { Metadata } from "next";

import QuadraticEquationSolver from "@/app/utility/quadratic-equation-solver/components/QuadraticEquationSolver";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/quadratic-equation-solver";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What equation form does this solve?",
    answer:
      "It solves quadratic equations in the standard form ax² + bx + c = 0, where a must not be zero.",
  },
  {
    question: "What does the discriminant show?",
    answer:
      "The discriminant b² - 4ac determines the root type: positive gives two real roots, zero gives one repeated real root, and negative gives complex roots.",
  },
  {
    question: "What is the vertex?",
    answer:
      "The vertex is the turning point of the parabola. Its x-coordinate is -b / 2a, and the y-coordinate is found by substituting that x-value back into the quadratic.",
  },
];

export const metadata: Metadata = {
  title: "Quadratic Equation Solver | Roots, Discriminant, and Vertex",
  description:
    "Solve quadratic equations and see real or complex roots, discriminant, axis of symmetry, and vertex coordinates.",
  keywords: ["quadratic equation solver", "quadratic formula calculator", "vertex calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Quadratic Equation Solver",
    description: "Solve ax² + bx + c = 0 and inspect roots, discriminant, and vertex.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quadratic Equation Solver",
    description: "Solve quadratic equations with real or complex roots.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Quadratic Equation Solver",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free quadratic equation solver with roots, discriminant, and vertex.",
  };
}

export default function QuadraticEquationSolverPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Quadratic Equation Solver", path: PAGE_PATH },
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
            <li className="text-foreground">Quadratic Equation Solver</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Math Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Quadratic Equation Solver</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Solve quadratic equations in standard form and inspect the discriminant, roots, axis of symmetry, and vertex without working the formula by hand.
          </p>
        </div>
      </section>
      <QuadraticEquationSolver />
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
