import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("text-by-length-sorter");

export default function Page() {
  return <ExactTextToolPage slug="text-by-length-sorter" />;
}
