import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("convert-tailwind-to-css");

export default function Page() {
  return <TailwindToolPage slug="convert-tailwind-to-css" />;
}
