import { buildMetadata } from "@/lib/seo/metadata";
import CategoryHub from "@/components/tools/CategoryHub";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Image Tools for Quick Browser Editing and Conversion",
  description:
    "Use image tools for quick browser-based editing, conversion, color work, and simple visual cleanup.",
  path: "/image",
});

export default function ImagePage() {
  return (
    <CategoryHub
      category="Image"
      title="Image tools for quick edits and lightweight conversions."
      description="Focused browser-based image utilities for conversion, color experiments, fast edits, and small asset cleanup tasks."
    />
  );
}
