import { notFound } from "next/navigation";

import ReadabilityCalculator from "@/app/text/_components/ReadabilityCalculator";
import WordCounterIntentPage from "@/app/text/_components/WordCounterIntentPage";
import ExactTextToolRunner from "@/components/tools/ExactTextTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { EXACT_TEXT_TOOLS, EXACT_TEXT_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { getExactTextSeoContent } from "@/lib/tools/exact-text-seo";
import { getAllWordCounterLandingSlugs, getWordCounterLanding } from "@/lib/word-counter-landings/registry";

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

  const seo = getExactTextSeoContent(tool);
  const isCharacterTablePage = slug === "unicode-ascii-table-search";

  return {
    ...buildMetadata({
      title: seo.metaTitle,
      description: seo.metaDescription,
      path: `/text/${slug}`,
    }),
    keywords: seo.keywords,
  };
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

  const seo = getExactTextSeoContent(tool);
  const isCharacterTablePage = slug === "unicode-ascii-table-search";

  return (
    <ToolPageScaffold
      path={`/text/${slug}`}
      category="Text"
      categoryHref="/text"
      title={tool.name}
      description={seo.metaDescription}
      learn={
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{seo.learnTitle}</h2>
          {seo.introParagraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
          {isCharacterTablePage ? (
            <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-border bg-background">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"></th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">ASCII</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Unicode</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Characters", ascii: "128", unicode: "149,000+" },
                    { label: "Encoding size", ascii: "7-bit", unicode: "Variable (UTF-8, UTF-16, UTF-32)" },
                    { label: "Scripts covered", ascii: "English letters, digits, punctuation, control characters", unicode: "Most world scripts, symbols, punctuation, emoji" },
                    { label: "Typical use", ascii: "Legacy systems and strict plain-text validation", unicode: "Modern web, apps, documents, and global text" },
                  ].map((row, index) => (
                    <tr key={row.label} className={index === 0 ? "" : "border-t border-border/70"}>
                      <td className="px-4 py-3 font-semibold text-foreground">{row.label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.ascii}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.unicode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {seo.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      }
      faqs={seo.faqs}
    >
      {slug === "readability-flesch-kincaid-calculator" ? (
        <ReadabilityCalculator />
      ) : (
        <ExactTextToolRunner tool={tool} />
      )}
    </ToolPageScaffold>
  );
}
