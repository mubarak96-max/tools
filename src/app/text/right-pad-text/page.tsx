import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("right-pad-text");

export default function Page() {
  return <ExactTextToolPage slug="right-pad-text" />;
}
