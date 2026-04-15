import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("zalgo-glitch-text-generator");

export default function Page() {
  return <ExactTextToolPage slug="zalgo-glitch-text-generator" />;
}
