import { notFound } from "next/navigation";

import ExactConverterToolRunner from "@/components/tools/ExactConverterTool";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { EXACT_CONVERTER_TOOLS, EXACT_CONVERTER_TOOL_MAP } from "@/lib/tools/exact-catalog";
import { buildConverterToolCopy } from "@/lib/tools/exact-copy";

export function generateStaticParams() {
  return EXACT_CONVERTER_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(props: PageProps<"/converter/[slug]">) {
  const { slug } = await props.params;
  const tool = EXACT_CONVERTER_TOOL_MAP[slug];
  if (!tool) {
    return {};
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/converter/${slug}`,
  });
}

export default async function ConverterToolPage(props: PageProps<"/converter/[slug]">) {
  const { slug } = await props.params;
  const tool = EXACT_CONVERTER_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const copy = buildConverterToolCopy(tool);

  return (
    <ToolPageScaffold
      path={`/converter/${slug}`}
      category="Converter"
      categoryHref="/converter"
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
      <ExactConverterToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
