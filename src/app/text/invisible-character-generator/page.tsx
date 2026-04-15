import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("invisible-character-generator");

export default function Page() {
  return <ExactTextToolPage slug="invisible-character-generator" />;
}
