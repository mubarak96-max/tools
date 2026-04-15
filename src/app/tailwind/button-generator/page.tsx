import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("button-generator");

export default function Page() {
  return <TailwindToolPage slug="button-generator" />;
}
