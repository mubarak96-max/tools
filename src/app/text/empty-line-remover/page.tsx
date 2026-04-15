import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("empty-line-remover");

export default function Page() {
  return <ExactTextToolPage slug="empty-line-remover" />;
}
