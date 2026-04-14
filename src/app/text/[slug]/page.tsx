import { notFound } from "next/navigation";

import ReadabilityCalculator from "@/app/text/_components/ReadabilityCalculator";
import WordCounterIntentPage from "@/app/text/_components/WordCounterIntentPage";
import ExactTextToolRunner from "@/components/tools/ExactTextTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAllWordCounterLandingSlugs, getWordCounterLanding } from "@/lib/word-counter-landings/registry";
import { EXACT_TEXT_TOOLS, EXACT_TEXT_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { buildTextToolCopy } from "@/lib/tools/exact-copy";

export const revalidate = 43200;

export function generateStaticParams() {
  const exactSlugs = new Set(EXACT_TEXT_TOOLS.map((tool) => tool.slug));
  const exact = EXACT_TEXT_TOOLS.map((tool) => ({ slug: tool.slug }));
  const landings = getAllWordCounterLandingSlugs()
    .filter((slug) => !exactSlugs.has(slug))
    .map((slug) => ({ slug }));
  return [...exact, ...landings];
}

export async function generateMetadata(props: PageProps<"/text/[slug]">) {
  const { slug } = await props.params;

  const landing = getWordCounterLanding(slug);
  if (landing) {
    return {
      ...buildMetadata({
        title: landing.metaTitle,
        description: landing.description,
        path: `/text/${slug}`,
      }),
      keywords: landing.keywords,
    };
  }

  const tool = EXACT_TEXT_TOOL_MAP[slug];
  if (!tool) {
    notFound();
  }

  if (slug === "readability-flesch-kincaid-calculator") {
    return buildMetadata({
      title: "Flesch-Kincaid Readability Calculator — Free & Instant",
      description: "Analyze your writing with our Flesch-Kincaid calculator. Get instant reading ease scores, grade levels, and sentence-level highlights to improve your content.",
      path: `/text/${slug}`,
    });
  }

  return buildMetadata({
    title: `Free ${tool.name} Online – Quick Text Processing`,
    description: tool.description,
    path: `/text/${slug}`,
  });
}

export default async function TextToolPage(props: PageProps<"/text/[slug]">) {
  const { slug } = await props.params;

  const landing = getWordCounterLanding(slug);
  if (landing) {
    return <WordCounterIntentPage landing={landing} />;
  }

  const tool = EXACT_TEXT_TOOL_MAP[slug];
  if (!tool) {
    notFound();
  }

  const copy = buildTextToolCopy(tool);

  return (
    <ToolPageScaffold
      path={`/text/${slug}`}
      category="Text"
      categoryHref="/text"
      title={tool.name}
      description={tool.description}
      learn={
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{copy.heading}</h2>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      }
      faqs={copy.faqs}
    >
      {slug === "readability-flesch-kincaid-calculator" ? (
        <ReadabilityCalculator />
      ) : (
        <ExactTextToolRunner tool={tool} />
      )}
    </ToolPageScaffold>
  );
}
