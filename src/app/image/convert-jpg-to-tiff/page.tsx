import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("convert-jpg-to-tiff");

export default function Page() {
  return <ImageToolPage slug="convert-jpg-to-tiff" />;
}
