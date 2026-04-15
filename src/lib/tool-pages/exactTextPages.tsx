import { notFound } from "next/navigation";

import ExactTextToolRunner from "@/components/tools/ExactTextTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildExactTextEditorial } from "@/lib/tool-page-content/exact-text";
import { EXACT_TEXT_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { getExactTextSeoContent } from "@/lib/tools/exact-text-seo";

import { renderEditorialContent } from "./shared";

export function buildExactTextMetadata(slug: string) {
  const tool = EXACT_TEXT_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const seo = getExactTextSeoContent(tool);

  return {
    ...buildMetadata({
      title: seo.metaTitle,
      description: seo.metaDescription,
      path: `/text/${slug}`,
    }),
    keywords: seo.keywords,
  };
}

export function ExactTextToolPage({ slug }: { slug: string }) {
  const tool = EXACT_TEXT_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const content = buildExactTextEditorial(tool);

  return (
    <ToolPageScaffold
      path={`/text/${slug}`}
      category="Text"
      categoryHref="/text"
      title={tool.name}
      description={tool.description}
      learn={renderEditorialContent(content)}
      faqs={content.faqs}
    >
      <ExactTextToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
