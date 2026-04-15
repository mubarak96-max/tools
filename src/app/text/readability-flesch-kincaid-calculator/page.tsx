import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("readability-flesch-kincaid-calculator");

export default function Page() {
  return <ExactTextToolPage slug="readability-flesch-kincaid-calculator" />;
}
