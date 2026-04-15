import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("punctuation-mark-remover");

export default function Page() {
  return <ExactTextToolPage slug="punctuation-mark-remover" />;
}
