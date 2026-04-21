import Link from "next/link";
import type { Metadata } from "next";

import MorseCodeTranslator from "@/app/text/morse-code-translator/components/MorseCodeTranslator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

export const revalidate = 43200;

const PAGE_PATH = "/text/morse-code-translator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const morseReference = [
  { character: "A", morse: ".-" },
  { character: "B", morse: "-..." },
  { character: "C", morse: "-.-." },
  { character: "D", morse: "-.." },
  { character: "E", morse: "." },
  { character: "F", morse: "..-." },
  { character: "G", morse: "--." },
  { character: "H", morse: "...." },
  { character: "I", morse: ".." },
  { character: "J", morse: ".---" },
  { character: "K", morse: "-.-" },
  { character: "L", morse: ".-.." },
  { character: "M", morse: "--" },
  { character: "N", morse: "-." },
  { character: "O", morse: "---" },
  { character: "P", morse: ".--." },
  { character: "Q", morse: "--.-" },
  { character: "R", morse: ".-." },
  { character: "S", morse: "..." },
  { character: "T", morse: "-" },
  { character: "U", morse: "..-" },
  { character: "V", morse: "...-" },
  { character: "W", morse: ".--" },
  { character: "X", morse: "-..-" },
  { character: "Y", morse: "-.--" },
  { character: "Z", morse: "--.." },
  { character: "0", morse: "-----" },
  { character: "1", morse: ".----" },
  { character: "2", morse: "..---" },
  { character: "3", morse: "...--" },
  { character: "4", morse: "....-" },
  { character: "5", morse: "....." },
  { character: "6", morse: "-...." },
  { character: "7", morse: "--..." },
  { character: "8", morse: "---.." },
  { character: "9", morse: "----." },
];

const faq = [
  {
    question: "What is Morse code?",
    answer:
      "Morse code is a communication system that represents letters, numbers, and some punctuation with short and long signals, usually written as dots and dashes. Each character has a unique pattern, which is why a Morse code translator or Morse code decoder can convert it back into readable text.",
  },
  {
    question: "What can I do with a Morse code translator?",
    answer:
      "You can translate plain text into Morse code, decode Morse code back into text, check classroom examples, verify short messages, and look up individual letters or numbers while learning the Morse code alphabet.",
  },
  {
    question: "How do I read Morse code?",
    answer:
      "Read Morse code one character at a time. Dots and dashes make up a single letter, spaces separate letters, and a slash separates words in most online Morse code converter tools. For example, ... means S and --- means O, so ... --- ... reads as SOS.",
  },
  {
    question: "How do I separate words in Morse code?",
    answer:
      "Use spaces between letters and a forward slash between words. This translator follows that convention, so a phrase such as HELLO WORLD becomes .... . .-.. .-.. --- / .-- --- .-. .-.. -..",
  },
  {
    question: "Does the translator support numbers and punctuation?",
    answer:
      "Yes. The tool supports letters, digits, and a core set of common punctuation used in Morse code workflows, so it works for most learning, hobby, and quick-translation use cases.",
  },
  {
    question: "What does SOS look like in Morse code?",
    answer:
      "SOS in Morse code is ... --- ... It is one of the most recognized Morse code patterns because it is short, memorable, and easy to identify in audio or written dot-dash form.",
  },
  {
    question: "Who invented Morse code?",
    answer:
      "Morse code is associated with Samuel Morse and Alfred Vail, who helped develop an early telegraph signaling system that became the basis for modern International Morse code standards.",
  },
  {
    question: "Is Morse code still used today?",
    answer:
      "Yes, although it is no longer mainstream for everyday communication. It is still relevant in amateur radio, emergency signaling knowledge, education, military history, puzzles, and hobby learning.",
  },
  {
    question: "What is the difference between dots and dashes in Morse code?",
    answer:
      "A dot is the short signal and a dash is the longer signal. In standard timing, a dash lasts three times as long as a dot. That timing ratio is one reason Morse code patterns can be distinguished clearly in sound-based communication.",
  },
  {
    question: "What happens to unsupported characters?",
    answer:
      "Unsupported items are skipped in the translation output and counted in the stats panel so you can see where the conversion was incomplete. This is useful when pasted text includes symbols outside the supported Morse set.",
  },
  {
    question: "Can I hear Morse code audio on this page?",
    answer:
      "Not in the current version. This page focuses on fast two-way text translation and a reference chart. If audio playback is added later, it should help users learn Morse timing and compare written output with actual beeps.",
  },
  {
    question: "Does this tool use International Morse code?",
    answer:
      "Yes. This translator follows the standard International Morse code style used in modern online references, where letters are separated by spaces and words are separated by a slash in written output.",
  },
];

export const metadata: Metadata = {
  title: "Free Morse Code Translator - Text to Morse & Morse to Text",
  description:
    "Translate text to Morse code or decode Morse code back to text instantly. Supports letters, numbers, and punctuation. Free online Morse code translator with no sign-up needed.",
  keywords: [
    "morse code translator",
    "morse code converter",
    "text to morse code",
    "morse code decoder",
    "morse code alphabet",
    "morse code chart",
    "morse code generator",
    "sos morse code",
    "learn morse code",
    "morse code letters",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Morse Code Translator - Text to Morse & Morse to Text",
    description:
      "Translate text to Morse code or decode Morse code back to text instantly with a free online Morse code converter and reference chart.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Morse Code Translator",
    description:
      "Use a free Morse code translator, decoder, and reference chart for text, letters, numbers, and SOS patterns.",
  },
};

function buildMorseTranslatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Translator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free Morse code translator with two-way conversion, Morse code reference support, and instant text decoding.",
    featureList: [
      "Text to Morse conversion",
      "Morse to text conversion",
      "Letters, numbers, and punctuation support",
      "Translation stats",
      "Morse code alphabet chart",
      "Copy translated output",
    ],
  };
}

export default function MorseCodeTranslatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Morse Code Translator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildMorseTranslatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Morse Code Translator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Morse Code Translator for Fast Two-Way Conversion
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Translate text to Morse code or decode Morse code back to text instantly. This free Morse code translator supports letters, numbers, and punctuation with a live stats panel so you can spot unsupported characters and incomplete input quickly.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Use it as a Morse code converter, Morse code decoder, or quick reference tool while learning the Morse code alphabet, checking SOS patterns, preparing classroom examples, or testing short encoded messages.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
            Private and browser-native
          </div>
        </div>
      </section>

      <MorseCodeTranslator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How Morse code translation works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Morse code represents letters, numbers, and punctuation through patterns of dots and dashes. A Morse code translator works by mapping each supported character to its standard Morse pattern, then reversing that pattern back into readable text when you switch modes. This makes the page useful as both a text to Morse code converter and a Morse code decoder for pasted signals.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This page uses the International Morse code style that most modern learners expect. In written Morse code, letters are separated by spaces and words are commonly separated by a forward slash. That convention keeps decoding predictable when you are typing or pasting Morse instead of hearing it as audio beeps.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Timing ratios and Morse structure</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Morse code is not only about symbols. It also has timing rules. A dot is one unit long, while a dash is three units long. The gap between parts of the same letter is one unit, the gap between letters is three units, and the gap between words is seven units. Even if you are only using written Morse code on this page, understanding those ratios helps explain why patterns such as E, T, S, and O are so recognizable.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            That timing model is one reason queries like “what does SOS sound like in Morse code” and “how do I read Morse code” are so common. People are not only looking for the text result. They also want to understand the structure behind the symbols. A good Morse code converter should therefore explain the system, not just produce output.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Input rules for Morse mode</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Separate letters with spaces.</li>
            <li>Separate words with a forward slash.</li>
            <li>Use standard dot and dash tokens only for best results.</li>
            <li>Unsupported or invalid tokens are skipped and counted in the stats panel.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Who uses a Morse code translator</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Students learning Morse code for class projects or amateur radio study.</li>
            <li>Teachers creating encoding and decoding exercises for communication history lessons.</li>
            <li>Puzzle designers and escape room builders checking letter patterns and hidden clues.</li>
            <li>Ham radio hobbyists verifying text before sending or teaching basic Morse concepts.</li>
            <li>Hobby learners converting names, phrases, and SOS examples into Morse code for practice.</li>
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Morse code alphabet chart</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          This Morse code chart covers the full A to Z alphabet and digits 0 to 9. It helps with direct lookups for searches like “Morse code for A”, “Morse code letters”, “Morse code numbers”, and “Morse code alphabet”. Use it alongside the translator when you want to learn patterns instead of just converting whole phrases.
        </p>

        <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-border bg-background">
          <table className="w-full border-collapse">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Character</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Morse code</th>
              </tr>
            </thead>
            <tbody>
              {morseReference.map((item, index) => (
                <tr key={item.character} className={index === 0 ? "" : "border-t border-border/70"}>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">{item.character}</td>
                  <td className="px-4 py-3 text-sm font-mono tracking-wide text-muted-foreground">{item.morse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Common example: SOS = <span className="font-mono text-foreground">... --- ...</span>. If you need another text utility after translating, try the <Link href="/text/binary-code-translator" className="font-medium text-primary hover:underline">binary code translator</Link>, <Link href="/text/case-converter" className="font-medium text-primary hover:underline">case converter</Link>, or <Link href="/text/character-counter" className="font-medium text-primary hover:underline">character counter</Link>.
        </p>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-slate-100 pt-16">
        <Link href="/text" className="secondary-button px-4 py-2 text-xs">
          View All Text Tools
        </Link>
      </section>
    </div>
  );
}
