import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workers Comp Premium Calculator by Industry 2026",
  description: "Calculate workers compensation insurance premiums by industry, state, and payroll.",
};

export default function WorkersCompLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
