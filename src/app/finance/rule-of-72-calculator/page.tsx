import { Metadata } from "next";
import RuleOf72Client from "./RuleOf72Client";

export const metadata: Metadata = {
  title: "Rule of 72 Calculator | 72 Rule Investing, Formula, Monthly & With Contributions",
  description:
    "Free Rule of 72 calculator with steps, monthly compounding mode, and contribution support. Understand the rule of 72 formula in finance, see how fast your money doubles, and compare scenarios side-by-side.",
  keywords: [
    "rule of 72 calculator",
    "72 rule investing",
    "rule 72 finance",
    "rule of 72 formula",
    "rule of 72 calculator with steps",
    "rule of 72 calculator monthly",
    "rule of 72 calculator with contributions",
    "rule of 72 example",
    "doubling time calculator",
    "how long to double money",
    "rule of 72 vs rule of 69",
    "rule of 72 vs rule of 70",
    "rule of 72 stock market",
    "rule of 72 inflation",
    "rule of 72 interest rate",
    "compound interest doubling time",
    "investment doubling calculator",
    "rule of 72 real estate",
    "when will my investment double",
    "rule of 72 explained",
  ].join(", "),
  openGraph: {
    title: "Rule of 72 Calculator — 72 Rule Investing, Monthly & With Contributions",
    description:
      "See exactly how fast your investment doubles. Rule of 72 calculator with step-by-step working, monthly compounding, contributions, and scenario comparison.",
    url: "https://findbest.tools/finance/rule-of-72-calculator",
    siteName: "FindBest Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rule of 72 Calculator | FindBest Tools",
    description:
      "How long will it take to double your money? Use the Rule of 72 — with steps, monthly mode, contributions, and scenario comparison.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/rule-of-72-calculator",
  },
};

export default function RuleOf72Page() {
  return <RuleOf72Client />;
}
