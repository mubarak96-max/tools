import { notFound } from "next/navigation";

import TailwindToolRunner from "@/components/tailwind/TailwindToolRunner";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildTailwindEditorial } from "@/lib/tool-page-content/tailwind";
import { TAILWIND_TOOL_MAP } from "@/lib/tools/tailwind-catalog";

import { renderEditorialContent } from "./shared";

export function buildTailwindToolMetadata(slug: string) {
  const tool = TAILWIND_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/tailwind/${slug}`,
  });
}

export function TailwindToolPage({ slug }: { slug: string }) {
  const tool = TAILWIND_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const content = buildTailwindEditorial(tool);

  return (
    <ToolPageScaffold
      path={`/tailwind/${slug}`}
      category="Tailwind"
      categoryHref="/tailwind"
      title={tool.name}
      description={tool.description}
      learn={renderEditorialContent(content)}
      faqs={content.faqs}
    >
      <TailwindToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
