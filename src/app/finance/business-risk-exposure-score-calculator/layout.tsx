import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Risk Exposure Score Calculator",
  description: "Assess your business risk across 7 critical dimensions and get actionable mitigation strategies.",
};

export default function BusinessRiskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
