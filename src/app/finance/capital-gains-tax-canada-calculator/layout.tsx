import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capital Gains Tax Canada Calculator",
  description:
    "Calculate your exact capital gains tax in Canada on investments, real estate, crypto, and business shares. Includes the current inclusion rate changes, principal residence exemption, and LCGE. Accurate for all 13 provinces.",
  keywords: [
    "capital gains tax canada calculator",
    "how to calculate capital gains tax canada",
    "capital gains on real estate canada",
    "capital gains tax on sale of house canada",
    "capital gains on crypto canada",
    "capital gains tax ontario",
  ],
  openGraph: {
    title: "Capital Gains Tax Canada Calculator",
    description:
      "Calculate your exact capital gains tax on investments, real estate, cryptocurrency, and business shares. Includes current inclusion rate changes and all 13 provinces.",
    url: "https://findbest.tools/finance/capital-gains-tax-canada-calculator",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/capital-gains-tax-canada-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
