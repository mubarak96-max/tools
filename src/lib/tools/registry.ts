import type { FreeToolMeta } from "@/types/tools";

export const FREE_TOOLS: FreeToolMeta[] = [
  {
    name: "Salary Calculator",
    href: "/free-tools/salary-calculator",
    description: "Estimate salary after tax, take-home pay, and employer cost across major countries.",
    category: "Finance",
    icon: "PAY",
  },
  {
    name: "UAE Salary Calculator",
    href: "/free-tools/uae-salary-calculator",
    description: "Calculate monthly UAE net salary from basic salary, allowances, overtime, and deductions.",
    category: "Finance",
    icon: "AED",
  },
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
  {
    name: "Discount Calculator",
    href: "/free-tools/discount-calculator",
    description: "Calculate final price after discount or reverse-calculate the percent off from original and sale price.",
    category: "Utility",
    icon: "SALE",
  },
  {
    name: "VAT Calculator",
    href: "/free-tools/vat-calculator",
    description: "Add VAT to a net price or remove VAT from a gross price with country presets and custom rates.",
    category: "Finance",
    icon: "VAT",
  },
  {
    name: "Profit Margin Calculator",
    href: "/free-tools/profit-margin-calculator",
    description: "Calculate margin, markup, gross profit, and selling price from cost in one pricing calculator.",
    category: "Finance",
    icon: "MRG",
  },
  {
    name: "Compound Interest Calculator",
    href: "/free-tools/compound-interest-calculator",
    description: "Project future value, contributions, and compound growth with optional inflation adjustment.",
    category: "Finance",
    icon: "CAGR",
  },
];

export function getRelatedFreeTools(currentHref: string, limit = 3) {
  return FREE_TOOLS.filter((tool) => tool.href !== currentHref).slice(0, limit);
}
