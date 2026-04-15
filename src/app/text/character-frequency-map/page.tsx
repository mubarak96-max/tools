import { ExactTextToolPage, buildExactTextMetadata } from "@/lib/tool-pages/exactTextPages";

export const revalidate = 43200;
export const metadata = buildExactTextMetadata("character-frequency-map");

export default function Page() {
  return <ExactTextToolPage slug="character-frequency-map" />;
}
