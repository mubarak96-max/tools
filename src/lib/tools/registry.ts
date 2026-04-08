import type { FreeToolMeta } from "@/types/tools";

export const FREE_TOOLS: FreeToolMeta[] = [
  {
    name: "AI Humanizer",
    href: "/ai/ai-humanizer",
    description: "Rewrite AI-generated text to sound natural and human, with a short queue flow and no sign-up.",
    category: "AI",
    icon: "HUMN",
  },
  {
    name: "Salary Calculator",
    href: "/finance/salary-calculator",
    description: "Estimate salary after tax, take-home pay, and employer cost across major countries.",
    category: "Finance",
    icon: "PAY",
  },
  {
    name: "UAE Salary Calculator",
    href: "/finance/uae-salary-calculator",
    description: "Calculate monthly UAE net salary from basic salary, allowances, overtime, and deductions.",
    category: "Finance",
    icon: "AED",
  },
  {
    name: "Mortgage Calculator",
    href: "/finance/mortgage-calculator",
    description: "Calculate monthly home loan payments with down payment, property tax, and insurance.",
    category: "Finance",
    icon: "MTG",
  },
  {
    name: "EMI Calculator",
    href: "/finance/emi-calculator",
    description: "Calculate monthly loan instalments for home, car, and personal loans.",
    category: "Finance",
    icon: "EMI",
  },
  {
    name: "Car Loan Calculator",
    href: "/finance/car-loan-calculator",
    description: "Calculate monthly payments for new and used car loans with down payment and trade-in value.",
    category: "Finance",
    icon: "AUTO",
  },
  {
    name: "Discount Calculator",
    href: "/finance/discount-calculator",
    description: "Calculate final price after discount or reverse-calculate the percent off from original and sale price.",
    category: "Finance",
    icon: "SALE",
  },
  {
    name: "VAT Calculator",
    href: "/finance/vat-calculator",
    description: "Add VAT to a net price or remove VAT from a gross price with country presets and custom rates.",
    category: "Finance",
    icon: "VAT",
  },
  {
    name: "Profit Margin Calculator",
    href: "/finance/profit-margin-calculator",
    description: "Calculate margin, markup, gross profit, and selling price from cost in one pricing calculator.",
    category: "Finance",
    icon: "MRG",
  },
  {
    name: "Compound Interest Calculator",
    href: "/finance/compound-interest-calculator",
    description: "Project future value, contributions, and compound growth with optional inflation adjustment.",
    category: "Finance",
    icon: "CAGR",
  },
  {
    name: "Word Frequency Counter",
    href: "/text/word-frequency",
    description: "Analyze repeated words, filter stop words, and surface the most-used terms in any text block.",
    category: "Text",
    icon: "WORD",
  },
];

export function getRelatedFreeTools(currentHref: string, limit = 3) {
  return FREE_TOOLS.filter((tool) => tool.href !== currentHref).slice(0, limit);
}
