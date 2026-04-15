import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("split-images-online");

export default function Page() {
  return <ImageToolPage slug="split-images-online" />;
}
