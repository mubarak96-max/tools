import { Metadata } from "next";
import CDLadderClient from "./CDLadderClient";

export const metadata: Metadata = {
  title: "CD Ladder Calculator | cd maturity calculator & monthly cd interest calculator",
  description:
    "Free CD ladder calculator: plan multi-rung certificate of deposit ladders, use our cd maturity calculator to track maturity dates, and our monthly cd interest calculator to project exact earnings. No sign-up required.",
  keywords: [
    "cd ladder calculator",
    "cd maturity calculator",
    "monthly cd interest calculator",
    "certificate of deposit ladder",
    "cd ladder strategy",
    "how to build a cd ladder",
    "cd ladder 2026",
    "5 year cd ladder calculator",
    "cd ladder with different rates",
    "cd ladder vs high yield savings",
    "rolling cd ladder calculator",
    "cd interest calculator",
    "cd maturity date calculator",
    "when does my cd mature",
    "cd early withdrawal penalty calculator",
    "best cd rates ladder strategy",
    "cd ladder income calculator",
    "quarterly cd interest calculator",
    "annual cd return calculator",
    "cd laddering strategy guide",
  ].join(", "),
  openGraph: {
    title: "CD Ladder Calculator — cd maturity calculator & monthly cd interest calculator",
    description:
      "Build a multi-rung CD ladder in seconds. Track every maturity date, calculate monthly interest, and project total earnings — all free, no login.",
    url: "https://findbest.tools/finance/cd-ladder-calculator",
    siteName: "FindBest Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CD Ladder Calculator | FindBest Tools",
    description:
      "Plan your CD ladder, track maturity dates, and calculate monthly interest income — all in one free tool.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/cd-ladder-calculator",
  },
};

export default function CDLadderPage() {
  return <CDLadderClient />;
}
