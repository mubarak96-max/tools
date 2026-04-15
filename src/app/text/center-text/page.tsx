import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("center-text");

export default function Page() {
  return <ExactTextToolPage slug="center-text" />;
}
