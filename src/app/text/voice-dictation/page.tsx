import Link from "next/link";
import type { Metadata } from "next";

import VoiceDictation from "@/app/text/voice-dictation/components/VoiceDictation";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/text/voice-dictation";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is this speech to text tool really free?",
    answer: "Yes, completely free. Most transcription tools charge by the minute because they upload your voice to cloud APIs. We use the Web Speech API natively built into your browser, meaning it costs us nothing to run and costs you nothing to use."
  },
    {
      question: "Are my audio recordings saved or listened to?",
      answer: "No. Your voice is not recorded or saved to any file. The browser's native speech recognition engine converts the audio stream directly into text in real-time."
    },
    {
      question: "Why isn't it working in my browser?",
      answer: "The Web Speech API is an advanced feature currently supported primarily by Google Chrome, Microsoft Edge, and Safari. If you are using Firefox or Brave, you may need to switch browsers."
    },
    {
      question: "Can I edit the text after dictating?",
      answer: "Yes! The output box is a fully functional text area. You can pause the recording by clicking the microphone again, use your keyboard to fix any typos, and then hit record to continue dictating."
    }
];

export const metadata: Metadata = {
  title: "Voice Dictation Online | Free Speech to Text",
  description:
    "Free online voice dictation tool. Convert your speech to text in real-time using your browser's microphone without any transcription limits.",
  keywords: [
    "voice dictation",
    "speech to text",
    "voice typing",
    "free transcription online",
    "talk to text",
    "online notepad with voice",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Voice Dictation Online",
    description:
      "Type with your voice completely free directly from your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice Dictation Online",
    description:
      "Convert your voice directly into text using our real-time browser dictation engine.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Voice Dictation",
    url: PAGE_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires Web Speech API and Microphone",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A free client-side tool utilizing the Web Speech API to continually convert user microphone audio into text.",
    featureList: [
      "Real-time speech to text rendering",
      "Unlimited dictation length",
      "Inline text editing",
      "One click copy to clipboard",
    ],
  };
}

export default function VoiceDictationPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Voice Dictation", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Voice Dictation</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Voice Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Voice Dictation
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Type with your voice for free. Speak into your microphone and watch your words instantly converted to text using out real-time speech recognition engine.
          </p>
        </div>
      </section>

      <VoiceDictation />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why Use Voice Typing?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Whether you are documenting a long essay, taking rapid meeting notes, or simply dealing with carpal tunnel, voice dictation is fundamentally faster than physical typing. The average person types at around 40 words per minute, but speaks at over 150 words per minute.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            By shifting from a keyboard to a vocal flow state, you can rapidly brainstorm ideas without the cognitive friction of trying to spell difficult words or structure sentences on a screen. Once your brain dump is captured here, you can easily copy the text directly into your word processor and edit it manually later.
          </p>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Text" categoryHref="/text" currentPath={PAGE_PATH} />
    </div>
  );
}
