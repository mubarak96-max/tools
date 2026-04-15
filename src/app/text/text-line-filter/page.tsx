import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("text-line-filter");

export default function Page() {
  return <ExactTextToolPage slug="text-line-filter" />;
}
