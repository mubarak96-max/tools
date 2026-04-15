import { ImageToolPage, buildImageToolMetadata } from "@/lib/tool-pages/imageToolPages";

export const revalidate = 43200;
export const metadata = buildImageToolMetadata("laser-eyes-meme-generator");

export default function Page() {
  return <ImageToolPage slug="laser-eyes-meme-generator" />;
}
