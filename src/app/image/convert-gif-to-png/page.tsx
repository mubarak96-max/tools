import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("convert-gif-to-png");

export default function Page() {
  return <ImageToolPage slug="convert-gif-to-png" />;
}
