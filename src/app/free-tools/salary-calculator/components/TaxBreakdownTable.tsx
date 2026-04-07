"use client";

import type { SalaryBreakdownItem, SalaryCountryMeta } from "@/lib/tools/salary";

type TaxBreakdownTableProps = {
  breakdown: SalaryBreakdownItem[];
  country: SalaryCountryMeta;
};

function formatCurrency(value: number, country: SalaryCountryMeta) {
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function toneForCategory(category: SalaryBreakdownItem["category"]) {
  switch (category) {
    case "tax":
      return "bg-danger-soft text-danger";
    case "contribution":
      return "bg-warning-soft text-warning";
    case "employer":
      return "bg-primary-soft text-primary";
    case "adjustment":
      return "bg-success-soft text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function TaxBreakdownTable({ breakdown, country }: TaxBreakdownTableProps) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-background p-5">
      <h3 className="text-lg font-semibold text-foreground">Tax breakdown</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Detailed estimate of taxes, payroll contributions, and employer-side costs.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[1rem] border border-border">
          <thead className="bg-muted">
            <tr>
              {["Item", "Type", "Amount"].map((label) => (
                <th
                  key={label}
                  className="border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {breakdown.map((item) => (
              <tr key={`${item.category}-${item.label}`} className="bg-card even:bg-background">
                <td className="border-b border-border/80 px-4 py-3 text-sm font-medium text-foreground">
                  {item.label}
                </td>
                <td className="border-b border-border/80 px-4 py-3 text-sm">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${toneForCategory(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                <td className="border-b border-border/80 px-4 py-3 text-sm text-foreground">
                  {formatCurrency(item.amount, country)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
