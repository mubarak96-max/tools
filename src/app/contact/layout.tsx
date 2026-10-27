import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact FindBest Tools | Report an Error or Request a Tool",
  description:
    "Report a calculation error, suggest a new tool or ask a question about FindBest Tools. Corrections to tax and rate data are prioritised.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
