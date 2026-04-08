import { buildMetadata } from "@/lib/seo/metadata";
import CategoryHub from "@/components/tools/CategoryHub";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Converter Tools for Structured Data, Encoding, and Units",
  description: "Use converter tools for data formats, tabular cleanup, encoding, timestamps, and common unit conversions.",
  path: "/converter",
});

export default function ConverterPage() {
  return (
    <CategoryHub
      category="Converter"
      title="Converter tools for formats, data, and values."
      description="Focused conversion tools for structured data, timestamps, encodings, color values, and everyday unit changes."
    />
  );
}
