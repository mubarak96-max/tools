import type { FreeToolMeta } from "@/types/tools";

type BaseTailwindTool = Omit<FreeToolMeta, "href" | "category"> & {
  slug: string;
  category: "Tailwind";
};

export type TailwindTool = BaseTailwindTool & {
  kind:
    | "colors"
    | "gradient"
    | "shadow"
    | "button"
    | "flexbox"
    | "grid"
    | "card"
    | "css-to-tailwind"
    | "tailwind-to-css";
};

const tool = (value: TailwindTool) => value;

export const TAILWIND_TOOLS = [
  tool({
    slug: "colors",
    name: "Tailwind Colors",
    description: "Browse Tailwind color scales, copy class names, and grab hex values without opening the docs.",
    category: "Tailwind",
    icon: "CLR",
    kind: "colors",
  }),
  tool({
    slug: "gradient-generator",
    name: "Tailwind and CSS Gradient Generator",
    description: "Build gradients visually and copy both Tailwind classes and plain CSS output.",
    category: "Tailwind",
    icon: "GRAD",
    kind: "gradient",
  }),
  tool({
    slug: "shadow-generator",
    name: "Tailwind CSS Shadow Generator",
    description: "Preview box shadows and copy either Tailwind shadow classes or matching CSS.",
    category: "Tailwind",
    icon: "SHDW",
    kind: "shadow",
  }),
  tool({
    slug: "button-generator",
    name: "Tailwind CSS Button Generator",
    description: "Customize a button preview and copy production-ready Tailwind classes or HTML.",
    category: "Tailwind",
    icon: "BTN",
    kind: "button",
  }),
  tool({
    slug: "css-to-tailwind",
    name: "CSS to Tailwind Converter",
    description: "Paste common CSS declarations and get the closest Tailwind utility classes back.",
    category: "Tailwind",
    icon: "C2T",
    kind: "css-to-tailwind",
  }),
  tool({
    slug: "tailwind-to-css",
    name: "Tailwind to CSS Converter",
    description: "Convert common Tailwind classes into readable CSS declarations for debugging and handoff.",
    category: "Tailwind",
    icon: "T2C",
    kind: "tailwind-to-css",
  }),
  tool({
    slug: "flexbox-generator",
    name: "Tailwind Flexbox Generator",
    description: "Configure flex direction, alignment, wrapping, and gap visually, then copy the Tailwind classes.",
    category: "Tailwind",
    icon: "FLEX",
    kind: "flexbox",
  }),
  tool({
    slug: "grid-generator",
    name: "Tailwind CSS Grid Generator",
    description: "Build a grid layout preview and copy the Tailwind class string or matching CSS.",
    category: "Tailwind",
    icon: "GRID",
    kind: "grid",
  }),
  tool({
    slug: "card-generator",
    name: "Tailwind Card Generator",
    description: "Design a card component with spacing, accent colors, and shadows, then copy the markup.",
    category: "Tailwind",
    icon: "CARD",
    kind: "card",
  }),
] as const;

export const TAILWIND_TOOL_MAP = Object.fromEntries(
  TAILWIND_TOOLS.map((entry) => [entry.slug, entry]),
) as Record<string, TailwindTool>;

export const TAILWIND_TOOL_REGISTRY: FreeToolMeta[] = TAILWIND_TOOLS.map((entry) => ({
  name: entry.name,
  href: `/tailwind/${entry.slug}`,
  description: entry.description,
  category: entry.category,
  icon: entry.icon,
}));
