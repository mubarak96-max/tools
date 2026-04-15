import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("colors");

export default function Page() {
  return <TailwindToolPage slug="colors" />;
}
