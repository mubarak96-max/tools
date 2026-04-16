import { notFound } from "next/navigation";

import ExactConverterToolRunner from "@/components/tools/ExactConverterTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildExactConverterEditorial } from "@/lib/tool-page-content/exact-converter";
import { EXACT_CONVERTER_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { withConvertSlug } from "@/lib/tools/conversion-routes";

import { renderEditorialContent } from "./shared";

export function buildExactConverterMetadata(slug: string) {
  const finalSlug = withConvertSlug(slug);
  const tool = EXACT_CONVERTER_TOOL_MAP[finalSlug];

  if (!tool) {
    notFound();
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/converter/${finalSlug}`,
  });
}

export function ExactConverterPage({ slug }: { slug: string }) {
  const finalSlug = withConvertSlug(slug);
  const tool = EXACT_CONVERTER_TOOL_MAP[finalSlug];

  if (!tool) {
    notFound();
  }

  const content = buildExactConverterEditorial(tool);

  return (
    <ToolPageScaffold
      path={`/converter/${finalSlug}`}
      category="Converter"
      categoryHref="/converter"
      title={tool.name}
      description={tool.description}
      learn={renderEditorialContent(content)}
      faqs={content.faqs}
    >
      <ExactConverterToolRunner slug={finalSlug} />
      {content.guide && (
        <div className="mt-16 border-t border-border pt-16">
          {content.guide}
        </div>
      )}
    </ToolPageScaffold>
  );
}
