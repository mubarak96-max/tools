import { notFound } from "next/navigation";

import ExactUtilityToolRunner from "@/components/tools/ExactUtilityTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildExactUtilityEditorial } from "@/lib/tool-page-content/exact-utility";
import { EXACT_UTILITY_TOOL_MAP } from "@/lib/tools/exact-catalog";

import { renderEditorialContent } from "./shared";

export function buildExactUtilityMetadata(slug: string) {
  const tool = EXACT_UTILITY_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/utility/${slug}`,
  });
}

export function ExactUtilityPage({ slug }: { slug: string }) {
  const tool = EXACT_UTILITY_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const content = buildExactUtilityEditorial(tool);

  return (
    <ToolPageScaffold
      path={`/utility/${slug}`}
      category="Utility"
      categoryHref="/utility"
      title={tool.name}
      description={tool.description}
      learn={renderEditorialContent(content)}
      faqs={content.faqs}
    >
      <ExactUtilityToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
