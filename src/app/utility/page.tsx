import { buildMetadata } from "@/lib/seo/metadata";
import CategoryHub from "@/components/tools/CategoryHub";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Utility Tools for Code Formatting and Random Generation",
  description: "Use utility tools for formatting code, validating source snippets, and generating passwords, UUIDs, strings, and dates.",
  path: "/utility",
});

export default function UtilityPage() {
  return (
    <CategoryHub
      category="Utility"
      title="Utility tools for formatting and generation."
      description="Focused utilities for code formatting, validation, and fast random generation tasks in the browser."
    />
  );
}
