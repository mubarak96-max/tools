import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import MarketingROICalculator from "./components/MarketingROICalculator";

export const metadata: Metadata = buildMetadata({
  title: "Marketing ROI (Return on Investment) Calculator | Free ROAS & CAC Analysis Tool",
  description: "Calculate your marketing ROI instantly. Free marketing ROI (Return on Investment) calculator covering ROAS, ROMI, CPL, and CAC for growth teams.",
  path: "/marketing/marketing-roi-calculator",
});

export default function Page() {
  return <MarketingROICalculator />;
}
