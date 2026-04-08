import type { FreeToolMeta } from "@/types/tools";

type BasePdfTool = Omit<FreeToolMeta, "href" | "category"> & {
  slug: string;
  category: "PDF";
};

export type PdfTool = BasePdfTool & {
  kind:
    | "merge-pdf"
    | "split-pdf"
    | "remove-pages"
    | "extract-pages"
    | "rotate-pdf"
    | "add-page-numbers"
    | "add-watermark"
    | "jpg-to-pdf"
    | "protect-pdf"
    | "unlock-pdf"
    | "organize-pdf"
    | "crop-pdf"
    | "sign-pdf"
    | "compress-pdf"
    | "html-to-pdf"
    | "compare-pdf"
    | "word-to-pdf"
    | "powerpoint-to-pdf"
    | "excel-to-pdf"
    | "pdf-to-pdfa";
};

const tool = (value: PdfTool) => value;

export const PDF_TOOLS = [
  tool({
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one merged document directly in the browser.",
    category: "PDF",
    icon: "MERGE",
    kind: "merge-pdf",
  }),
  tool({
    slug: "split-pdf",
    name: "Split PDF",
    description: "Split a PDF into separate single-page files or export specific page ranges as standalone PDFs.",
    category: "PDF",
    icon: "SPLIT",
    kind: "split-pdf",
  }),
  tool({
    slug: "remove-pages",
    name: "Remove Pages",
    description: "Remove selected pages from a PDF and download a cleaned version without those pages.",
    category: "PDF",
    icon: "CUT",
    kind: "remove-pages",
  }),
  tool({
    slug: "extract-pages",
    name: "Extract Pages",
    description: "Extract selected pages from a PDF into a new standalone file without changing the original document.",
    category: "PDF",
    icon: "EXT",
    kind: "extract-pages",
  }),
  tool({
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate all pages or selected pages inside a PDF and download the updated document.",
    category: "PDF",
    icon: "ROT",
    kind: "rotate-pdf",
  }),
  tool({
    slug: "add-page-numbers",
    name: "Add Page Numbers",
    description: "Add page numbers to a PDF with simple position, size, and start-number controls.",
    category: "PDF",
    icon: "NUM",
    kind: "add-page-numbers",
  }),
  tool({
    slug: "add-watermark",
    name: "Add Watermark",
    description: "Add a text watermark to all pages or selected pages in a PDF and download the updated file.",
    category: "PDF",
    icon: "MARK",
    kind: "add-watermark",
  }),
  tool({
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Turn one or more JPG or PNG images into a PDF directly in the browser.",
    category: "PDF",
    icon: "JPG",
    kind: "jpg-to-pdf",
  }),
  tool({
    slug: "protect-pdf",
    name: "Protect PDF",
    description: "Add a password to a PDF and lock it before you share or archive the file.",
    category: "PDF",
    icon: "LOCK",
    kind: "protect-pdf",
  }),
  tool({
    slug: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove the open password from a PDF you already have permission to edit.",
    category: "PDF",
    icon: "OPEN",
    kind: "unlock-pdf",
  }),
  tool({
    slug: "organize-pdf",
    name: "Organize PDF",
    description: "Reorder pages inside a PDF and export the document in a cleaner sequence.",
    category: "PDF",
    icon: "SORT",
    kind: "organize-pdf",
  }),
  tool({
    slug: "crop-pdf",
    name: "Crop PDF",
    description: "Trim page edges in a PDF to remove margins or extra white space before sharing.",
    category: "PDF",
    icon: "CROP",
    kind: "crop-pdf",
  }),
  tool({
    slug: "sign-pdf",
    name: "Sign PDF",
    description: "Place a typed signature on a PDF with date and position controls in the browser.",
    category: "PDF",
    icon: "SIGN",
    kind: "sign-pdf",
  }),
  tool({
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Create a lighter PDF copy for email or upload when the current file feels too heavy.",
    category: "PDF",
    icon: "CMP",
    kind: "compress-pdf",
  }),
  tool({
    slug: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert HTML markup into a printable PDF from a focused browser-based editor.",
    category: "PDF",
    icon: "HTML",
    kind: "html-to-pdf",
  }),
  tool({
    slug: "compare-pdf",
    name: "Compare PDF",
    description: "Compare two PDF files for page count, size, metadata, and page-dimension differences.",
    category: "PDF",
    icon: "DIFF",
    kind: "compare-pdf",
  }),
  tool({
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert a DOCX file into a clean text-first PDF directly in the browser.",
    category: "PDF",
    icon: "DOCX",
    kind: "word-to-pdf",
  }),
  tool({
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Turn a PPTX deck into a text-based PDF handout without desktop office software.",
    category: "PDF",
    icon: "PPTX",
    kind: "powerpoint-to-pdf",
  }),
  tool({
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Export workbook sheets into a readable PDF for quick review or sharing.",
    category: "PDF",
    icon: "XLSX",
    kind: "excel-to-pdf",
  }),
  tool({
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Create a best-effort archival-style PDF copy for longer-term document storage.",
    category: "PDF",
    icon: "PDFA",
    kind: "pdf-to-pdfa",
  }),
] as const;

export const PDF_TOOL_MAP = Object.fromEntries(PDF_TOOLS.map((entry) => [entry.slug, entry])) as Record<string, PdfTool>;

export const PDF_TOOL_REGISTRY: FreeToolMeta[] = PDF_TOOLS.map((entry) => ({
  name: entry.name,
  href: `/pdf/${entry.slug}`,
  description: entry.description,
  category: entry.category,
  icon: entry.icon,
}));
