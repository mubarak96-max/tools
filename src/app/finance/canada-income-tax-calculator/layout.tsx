import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Canada Income Tax Calculator 2024",
  description: "Free Canada income tax calculator for 2024. See federal tax, provincial tax, CPP, EI, and take-home pay for Ontario, BC, Alberta, Quebec, and all provinces.",
  path: "/finance/canada-income-tax-calculator",
});

export default function CanadaIncomeTaxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
