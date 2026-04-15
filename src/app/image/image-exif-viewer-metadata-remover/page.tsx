import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("image-exif-viewer-metadata-remover");

export default function Page() {
  return <ImageToolPage slug="image-exif-viewer-metadata-remover" />;
}
