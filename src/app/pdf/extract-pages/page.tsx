import { PdfToolPage, buildPdfToolMetadata } from "@/lib/tool-pages/pdfToolPages";

export const revalidate = 43200;
export const metadata = buildPdfToolMetadata("extract-pages");

export default function Page() {
  return <PdfToolPage slug="extract-pages" />;
}
