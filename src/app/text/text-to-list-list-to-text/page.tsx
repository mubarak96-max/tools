import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("text-to-list-list-to-text");

export default function Page() {
  return <ExactTextToolPage slug="text-to-list-list-to-text" />;
}
