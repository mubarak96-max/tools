import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("website-screenshot-tool");

export default function Page() {
  return <ImageToolPage slug="website-screenshot-tool" />;
}
