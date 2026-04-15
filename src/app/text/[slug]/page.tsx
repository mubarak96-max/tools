import { notFound } from "next/navigation";

import WordCounterIntentPage from "@/app/text/_components/WordCounterIntentPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAllWordCounterLandingSlugs, getWordCounterLanding } from "@/lib/word-counter-landings/registry";

export const revalidate = 43200;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWordCounterLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/text/[slug]">) {
  const { slug } = await props.params;

  const landing = getWordCounterLanding(slug);
  if (landing) {
    return {
      ...buildMetadata({
        title: landing.metaTitle,
        description: landing.description,
        path: `/text/${slug}`,
      }),
      keywords: landing.keywords,
    };
  }

  notFound();
}

export default async function TextToolPage(props: PageProps<"/text/[slug]">) {
  const { slug } = await props.params;

  const landing = getWordCounterLanding(slug);
  if (landing) {
    return <WordCounterIntentPage landing={landing} />;
  }

  notFound();
}
