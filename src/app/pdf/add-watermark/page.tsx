import { PdfToolPage, buildPdfToolMetadata } from "@/lib/tool-pages/pdfToolPages";

export const revalidate = 43200;
export const metadata = buildPdfToolMetadata("add-watermark");

export default function Page() {
  return <PdfToolPage slug="add-watermark" />;
}
