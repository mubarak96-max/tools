import { buildMetadata } from "@/lib/seo/metadata";
import CategoryHub from "@/components/tools/CategoryHub";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Image Tools for Format Conversion, Compression, and Quick Editing",
  description:
    "Use image tools for exact format conversion pages, quick browser-based editing, compression, color work, and simple visual cleanup.",
  path: "/image",
});

export default function ImagePage() {
  return (
    <CategoryHub
      category="Image"
      title="Image tools for conversions, quick edits, and small asset cleanup."
      description="Standalone image utilities for exact format conversion pages, browser-based edits, color work, and lightweight visual cleanup tasks."
    />
  );
}
