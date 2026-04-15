import { PdfToolPage, buildPdfToolMetadata } from "@/lib/tool-pages/pdfToolPages";

export const revalidate = 43200;
export const metadata = buildPdfToolMetadata("convert-pdf-to-pdfa");

export default function Page() {
  return <PdfToolPage slug="convert-pdf-to-pdfa" />;
}
