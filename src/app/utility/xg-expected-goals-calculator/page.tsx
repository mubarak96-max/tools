import { buildMetadata } from "@/lib/seo/metadata";
import ShotCalculator from "./components/ShotCalculator";

export const metadata = buildMetadata({
    title: "Expected Goals (xG) Calculator - Football Shot Analysis Tool",
    description: "Calculate Expected Goals (xG) for football shots with our interactive pitch visualization. Analyze shot quality, distance, angle, and situational factors to understand scoring probability.",
    path: "/utility/xg-expected-goals-calculator",
});

export default function ExpectedGoalsCalculatorPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <ShotCalculator />
        </div>
    );
}