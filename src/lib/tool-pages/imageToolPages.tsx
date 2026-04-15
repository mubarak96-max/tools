import { notFound } from "next/navigation";

import ImageToolRunner from "@/components/image/ImageToolRunner";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildImageEditorial } from "@/lib/tool-page-content/image";
import { IMAGE_TOOL_MAP } from "@/lib/tools/image-catalog";

import { renderEditorialContent } from "./shared";

export function buildImageToolMetadata(slug: string) {
  const tool = IMAGE_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/image/${slug}`,
  });
}

export function ImageToolPage({ slug }: { slug: string }) {
  const tool = IMAGE_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const content = buildImageEditorial(tool);

  return (
    <ToolPageScaffold
      path={`/image/${slug}`}
      category="Image"
      categoryHref="/image"
      title={tool.name}
      description={tool.description}
      learn={renderEditorialContent(content)}
      faqs={content.faqs}
    >
      <ImageToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
