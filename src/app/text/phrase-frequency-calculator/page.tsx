import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("phrase-frequency-calculator");

export default function Page() {
  return <ExactTextToolPage slug="phrase-frequency-calculator" />;
}
