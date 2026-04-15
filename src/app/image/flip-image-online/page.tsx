import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("flip-image-online");

export default function Page() {
  return <ImageToolPage slug="flip-image-online" />;
}
