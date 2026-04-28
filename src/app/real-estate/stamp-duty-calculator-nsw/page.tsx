import type { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Sydney Stamp Duty Calculator — NSW Transfer Duty 2026",
  description:
    "Calculate NSW stamp duty (transfer duty) for Sydney property purchases. Includes 2026 rates, first home buyer exemptions ($800k), foreign buyer surcharge (8%), and annual property tax opt-in analysis.",
  keywords: [
    "sydney stamp duty calculator",
    "nsw stamp duty calculator",
    "transfer duty calculator nsw",
    "first home buyer stamp duty exemption nsw",
    "stamp duty calculator sydney 2026",
    "foreign buyer stamp duty nsw",
    "nsw property tax opt in calculator",
  ],
  alternates: {
    canonical: "https://findbest.tools/real-estate/stamp-duty-calculator-nsw",
  },
};

export default function Page() {
  return <ClientPage />;
}
