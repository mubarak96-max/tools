import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("convert-image-to-base64");

export default function Page() {
  return <ImageToolPage slug="convert-image-to-base64" />;
}
