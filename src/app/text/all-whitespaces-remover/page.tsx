import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("all-whitespaces-remover");

export default function Page() {
  return <ExactTextToolPage slug="all-whitespaces-remover" />;
}
