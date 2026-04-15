import { PdfToolPage, buildPdfToolMetadata } from "@/lib/tool-pages/pdfToolPages";

export const revalidate = 43200;
export const metadata = buildPdfToolMetadata("convert-excel-to-pdf");

export default function Page() {
  return <PdfToolPage slug="convert-excel-to-pdf" />;
}
