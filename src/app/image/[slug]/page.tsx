import { notFound } from "next/navigation";

import ImageToolRunner from "@/components/image/ImageToolRunner";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { IMAGE_TOOLS, IMAGE_TOOL_MAP } from "@/lib/tools/image-catalog";
import { buildImageToolCopy } from "@/lib/tools/image-copy";

export function generateStaticParams() {
  return IMAGE_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tool = IMAGE_TOOL_MAP[slug];
  if (!tool) {
    return {};
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/image/${slug}`,
  });
}

export default async function ImageToolPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tool = IMAGE_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const copy = buildImageToolCopy(tool);

  return (
    <ToolPageScaffold
      path={`/image/${slug}`}
      category="Image"
      categoryHref="/image"
      title={tool.name}
      description={tool.description}
      learn={
        copy ? (
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{copy.heading}</h2>
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        ) : undefined
      }
      faqs={copy?.faqs || []}
    >
      <ImageToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
