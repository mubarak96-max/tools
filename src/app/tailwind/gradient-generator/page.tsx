import { TailwindToolPage, buildTailwindToolMetadata } from "@/lib/tool-pages/tailwindToolPages";

export const revalidate = 43200;
export const metadata = buildTailwindToolMetadata("gradient-generator");

export default function Page() {
  return <TailwindToolPage slug="gradient-generator" />;
}
