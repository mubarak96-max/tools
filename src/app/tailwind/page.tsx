import { buildMetadata } from "@/lib/seo/metadata";
import CategoryHub from "@/components/tools/CategoryHub";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Tailwind Tools for Colors, Layout, Components, and Conversion",
  description:
    "Use Tailwind tools for colors, gradients, shadows, component starters, layout generation, and CSS conversion.",
  path: "/tailwind",
});

export default function TailwindPage() {
  return (
    <CategoryHub
      category="Tailwind"
      title="Tailwind tools for faster UI building."
      description="Focused Tailwind generators and converters for colors, gradients, shadows, buttons, cards, layout utilities, and class translation."
    />
  );
}
