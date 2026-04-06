import type { FreeToolMeta } from "@/types/tools";

export const FREE_TOOLS: FreeToolMeta[] = [
  {
    name: "EMI Calculator",
    href: "/free-tools/emi-calculator",
    description: "Calculate monthly loan instalments for home, car, and personal loans.",
    category: "Finance",
    icon: "EMI",
  },
];

export function getRelatedFreeTools(currentHref: string, limit = 3) {
  return FREE_TOOLS.filter((tool) => tool.href !== currentHref).slice(0, limit);
}
