import { PdfToolPage, buildPdfToolMetadata } from "@/lib/tool-pages/pdfToolPages";

export const revalidate = 43200;
export const metadata = buildPdfToolMetadata("unlock-pdf");

export default function Page() {
  return <PdfToolPage slug="unlock-pdf" />;
}
