import { PdfToolPage, buildPdfToolMetadata } from "@/lib/tool-pages/pdfToolPages";

export const revalidate = 43200;
export const metadata = buildPdfToolMetadata("convert-html-to-pdf");

export default function Page() {
  return <PdfToolPage slug="convert-html-to-pdf" />;
}
