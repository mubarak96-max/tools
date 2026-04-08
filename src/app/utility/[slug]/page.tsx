import { notFound } from "next/navigation";

import ExactUtilityToolRunner from "@/components/tools/ExactUtilityTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { EXACT_UTILITY_TOOLS, EXACT_UTILITY_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { buildUtilityToolCopy } from "@/lib/tools/exact-copy";

export function generateStaticParams() {
  return EXACT_UTILITY_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(props: PageProps<"/utility/[slug]">) {
  const { slug } = await props.params;
  const tool = EXACT_UTILITY_TOOL_MAP[slug];
  if (!tool) {
    return {};
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/utility/${slug}`,
  });
}

export default async function UtilityToolPage(props: PageProps<"/utility/[slug]">) {
  const { slug } = await props.params;
  const tool = EXACT_UTILITY_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const copy = buildUtilityToolCopy(tool);

  return (
    <ToolPageScaffold
      path={`/utility/${slug}`}
      category="Utility"
      categoryHref="/utility"
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
      <ExactUtilityToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
