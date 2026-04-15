import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("unicode-ascii-table-search");

export default function Page() {
  return <ExactTextToolPage slug="unicode-ascii-table-search" />;
}
