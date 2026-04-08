import { notFound } from "next/navigation";

import ExactTextToolRunner from "@/components/tools/ExactTextTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { EXACT_TEXT_TOOLS, EXACT_TEXT_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { buildTextToolCopy } from "@/lib/tools/exact-copy";

export function generateStaticParams() {
  return EXACT_TEXT_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(props: PageProps<"/text/[slug]">) {
  const { slug } = await props.params;
  const tool = EXACT_TEXT_TOOL_MAP[slug];
  if (!tool) {
    return {};
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/text/${slug}`,
  });
}

export default async function TextToolPage(props: PageProps<"/text/[slug]">) {
  const { slug } = await props.params;
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
      <ExactTextToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
