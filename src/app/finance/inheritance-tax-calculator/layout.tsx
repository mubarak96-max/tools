import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inheritance Tax Calculator 2026 | UK, USA, Ireland, France, Germany & More",
  description: "Free inheritance tax calculator for 10 countries including UK, USA, Ireland, France, Germany, Spain, Italy, Canada, Australia & India. Calculate estate tax and succession duty.",
};

export default function InheritanceTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
