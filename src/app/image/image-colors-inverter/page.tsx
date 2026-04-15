import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("image-colors-inverter");

export default function Page() {
  return <ImageToolPage slug="image-colors-inverter" />;
}
