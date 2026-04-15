import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("convert-eps-to-png");

export default function Page() {
  return <ImageToolPage slug="convert-eps-to-png" />;
}
