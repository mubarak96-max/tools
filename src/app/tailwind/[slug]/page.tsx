import { notFound } from "next/navigation";

import TailwindToolRunner from "@/components/tailwind/TailwindToolRunner";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { buildMetadata } from "@/lib/seo/metadata";
import { TAILWIND_TOOLS, TAILWIND_TOOL_MAP } from "@/lib/tools/tailwind-catalog";
import { buildTailwindToolCopy } from "@/lib/tools/tailwind-copy";

export function generateStaticParams() {
  return TAILWIND_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tool = TAILWIND_TOOL_MAP[slug];
  if (!tool) {
    return {};
  }

  return buildMetadata({
    title: `${tool.name} | Free Online ${tool.name}`,
    description: tool.description,
    path: `/tailwind/${slug}`,
  });
}

export default async function TailwindToolPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const tool = TAILWIND_TOOL_MAP[slug];

  if (!tool) {
    notFound();
  }

  const copy = buildTailwindToolCopy(tool);

  return (
    <ToolPageScaffold
      path={`/tailwind/${slug}`}
      category="Tailwind"
      categoryHref="/tailwind"
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
      <TailwindToolRunner tool={tool} />
    </ToolPageScaffold>
  );
}
