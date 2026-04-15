import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("backslash-adder");

export default function Page() {
  return <ExactTextToolPage slug="backslash-adder" />;
}
