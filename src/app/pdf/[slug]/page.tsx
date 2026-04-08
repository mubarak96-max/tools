import { notFound } from "next/navigation";

import PdfToolRunner from "@/components/pdf/PdfToolRunner";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildPdfToolCopy } from "@/lib/tools/pdf-copy";
import { PDF_TOOLS, PDF_TOOL_MAP } from "@/lib/tools/pdf-catalog";

export function generateStaticParams() {
  return PDF_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tool = PDF_TOOL_MAP[slug];
  if (!tool) {
    return {};
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/pdf/${slug}`,
  });
}

export default async function PdfToolPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tool = PDF_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const copy = buildPdfToolCopy(tool);

  return (
    <ToolPageScaffold
      path={`/pdf/${slug}`}
      category="PDF"
      categoryHref="/pdf"
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
      <PdfToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
