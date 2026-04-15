import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("alphabetic-text-sorter");

export default function Page() {
  return <ExactTextToolPage slug="alphabetic-text-sorter" />;
}
