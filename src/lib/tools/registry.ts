import type { FreeToolMeta } from "@/types/tools";

export const FREE_TOOLS: FreeToolMeta[] = [
  {
    name: "Mortgage Calculator",
    href: "/free-tools/mortgage-calculator",
    description: "Calculate monthly home loan payments with down payment, property tax, and insurance.",
    category: "Finance",
    icon: "MTG",
  },
  {
    name: "EMI Calculator",
    href: "/free-tools/emi-calculator",
    description: "Calculate monthly loan instalments for home, car, and personal loans.",
    category: "Finance",
    icon: "EMI",
  },
  {
    name: "Car Loan Calculator",
    href: "/free-tools/car-loan-calculator",
    description: "Calculate monthly payments for new and used car loans with down payment and trade-in value.",
    category: "Finance",
    icon: "AUTO",
  },
];

export function getRelatedFreeTools(currentHref: string, limit = 3) {
  return FREE_TOOLS.filter((tool) => tool.href !== currentHref).slice(0, limit);
}
