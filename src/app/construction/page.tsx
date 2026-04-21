import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const CONSTRUCTION_TOOLS = [
  {
    name: "Concrete Volume Calculator",
    href: "/construction/concrete-volume-calculator",
    description: "Estimate concrete volume for slabs, footings, columns, holes, and mixed project shapes.",
    icon: "CON",
  },
  {
    name: "Paint Coverage Calculator",
    href: "/construction/paint-coverage-calculator",
    description: "Estimate paint, primer, coats, and wall coverage for room and renovation projects.",
    icon: "PNT",
  },
  {
    name: "Flooring Material Calculator",
    href: "/construction/flooring-material-calculator",
    description: "Estimate flooring area, boxes, waste allowance, underlayment, and project cost.",
    icon: "FLR",
  },
  {
    name: "Roofing Material Calculator",
    href: "/construction/roofing-material-calculator",
    description: "Estimate shingles, underlayment, nails, bundles, squares, and roof waste allowance.",
    icon: "ROOF",
  },
];

export const metadata = buildMetadata({
  title: "Construction Calculators for Materials and Project Planning",
  description: "Free construction calculators for concrete, paint coverage, and roofing material estimates.",
  path: "/construction",
});

export default function ConstructionPage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="font-medium text-foreground">Construction Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Construction - {CONSTRUCTION_TOOLS.length} tools
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Construction calculators for material planning.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Estimate concrete, paint, and roofing materials before you order supplies or plan a job.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CONSTRUCTION_TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary">{tool.name}</h2>
              <span className="shrink-0 rounded-lg border border-border bg-muted p-2 text-[10px] font-black text-primary">
                {tool.icon}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{tool.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
