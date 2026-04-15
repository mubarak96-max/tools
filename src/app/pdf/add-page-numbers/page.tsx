import { PdfToolPage, buildPdfToolMetadata } from "@/lib/tool-pages/pdfToolPages";

export const revalidate = 43200;
export const metadata = buildPdfToolMetadata("add-page-numbers");

export default function Page() {
  return <PdfToolPage slug="add-page-numbers" />;
}
