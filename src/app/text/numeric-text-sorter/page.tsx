import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("numeric-text-sorter");

export default function Page() {
  return <ExactTextToolPage slug="numeric-text-sorter" />;
}
