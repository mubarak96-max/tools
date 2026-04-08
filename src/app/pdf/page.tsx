import CategoryHub from "@/components/tools/CategoryHub";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "PDF Tools for Editing, Converting, Protecting, and Page Cleanup",
  description:
    "Use standalone PDF tools for merging, splitting, protecting, signing, converting, and cleaning up documents directly in the browser.",
  path: "/pdf",
});

export default function PdfPage() {
  return (
    <CategoryHub
      category="PDF"
      title="PDF tools for fast document work."
      description="Standalone PDF utilities for editing page order, protecting files, converting office documents, and cleaning up documents without opening desktop software."
    />
  );
}
