import { notFound } from "next/navigation";

import PdfToolRunner from "@/components/pdf/PdfToolRunner";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildPdfEditorial } from "@/lib/tool-page-content/pdf";
import { PDF_TOOL_MAP } from "@/lib/tools/pdf-catalog";

import { renderEditorialContent } from "./shared";

export function buildPdfToolMetadata(slug: string) {
  const tool = PDF_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/pdf/${slug}`,
  });
}

export function PdfToolPage({ slug }: { slug: string }) {
  const tool = PDF_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const content = buildPdfEditorial(tool);

  return (
    <ToolPageScaffold
      path={`/pdf/${slug}`}
      category="PDF"
      categoryHref="/pdf"
      title={tool.name}
      description={tool.description}
      learn={renderEditorialContent(content)}
      faqs={content.faqs}
    >
      <PdfToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
