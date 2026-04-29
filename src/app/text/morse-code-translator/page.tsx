import Link from "next/link";
import type { Metadata } from "next";

import MorseCodeTranslator from "@/app/text/morse-code-translator/components/MorseCodeTranslator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { MORSE_PROSIGNS_REFERENCE, MORSE_REFERENCE } from "@/lib/tools/morse-code";

export const revalidate = 43200;

const PAGE_PATH = "/text/morse-code-translator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const morseAlphabet = MORSE_REFERENCE.filter((item) => /^[A-Z0-9]$/.test(item.character));
const morsePunctuation = MORSE_REFERENCE.filter((item) => !/^[A-Z0-9]$/.test(item.character));

const popularExamples = [
  { label: "SOS", plain: "SOS", morse: "... --- ..." },
  { label: "HELLO", plain: "HELLO", morse: ".... . .-.. .-.. ---" },
  { label: "WORLD", plain: "WORLD", morse: ".-- --- .-. .-.. -.." },
  { label: "LOVE", plain: "LOVE", morse: ".-.. --- ...- ." },
];

const commonWordExamples = [
  { word: "HELP", morse: ".... . .-.. .--." },
  { word: "YES", morse: "-.-- . ..." },
  { word: "NO", morse: "-. ---" },
  { word: "HOME", morse: ".... --- -- ." },
  { word: "SAFE", morse: "... .- ..-." },
  { word: "READY", morse: ".-. . .- -.. -.--" },
];

const nameExamples = [
  { name: "EMMA", morse: ". -- -- ." },
  { name: "LIAM", morse: ".-.. .. .- --" },
  { name: "NOAH", morse: "-. --- .- ...." },
  { name: "AVA", morse: ".- ...- ." },
  { name: "MIA", morse: "-- .. ." },
  { name: "LEO", morse: ".-.. . ---" },
  { name: "IVY", morse: ".. ...- -.--" },
  { name: "OWEN", morse: "--- .-- . -." },
];

const numberExamples = [
  { label: "2026", morse: "..--- ----- ..--- -...." },
  { label: "911", morse: "----. .---- .----" },
  { label: "12345", morse: ".---- ..--- ...-- ....- ....." },
];

const punctuationExamples = [
  { symbol: "?", morse: "..--.." },
  { symbol: "!", morse: "-.-.--" },
  { symbol: "@", morse: ".--.-." },
  { symbol: ".", morse: ".-.-.-" },
  { symbol: ",", morse: "--..--" },
  { symbol: "/", morse: "-..-." },
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
      "Yes. You can play the current Morse sequence directly in your browser, adjust the speed in words per minute, and change the tone frequency to make the beeps easier to learn from.",
  },
  {
    question: "Does this tool use International Morse code?",
    answer:
      "Yes. This translator follows the standard International Morse code style used in modern online references, where letters are separated by spaces and words are separated by a slash in written output.",
  },
  {
    question: "Can I share a Morse code translation with someone else?",
    answer:
      "Yes. Use the share link button in the tool to copy a URL with the current input, mode, speed, and tone frequency, so someone else can open the same translation state.",
  },
];

export const metadata: Metadata = {
  title: "Morse Code Translator - Text to Morse Code, Morse to Text, and Audio",
  description:
    "Translate text to Morse code, decode Morse to text, play Morse audio, and use a full alphabet chart with letters, numbers, punctuation, and SOS examples.",
  keywords: [
    "morse code translator",
    "morse code converter",
    "text to morse code",
    "morse to text",
    "morse code decoder",
    "morse code alphabet",
    "morse code chart",
    "morse code generator",
    "morse code audio",
    "hear morse code",
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
    title: "Morse Code Translator - Text to Morse Code, Morse to Text, and Audio",
    description:
      "Translate text to Morse code, decode Morse to text, and play Morse audio instantly with a free converter and reference chart.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Morse Code Translator with Audio",
    description:
      "Use a free Morse code translator, decoder, audio player, and reference chart for text, letters, numbers, punctuation, and SOS patterns.",
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
      "Free Morse code translator with two-way conversion, browser audio playback, shareable URLs, and an expanded reference chart.",
    featureList: [
      "Text to Morse conversion",
      "Morse to text conversion",
      "Browser audio playback",
      "Speed control",
      "Tone frequency control",
      "Letters, numbers, and punctuation support",
      "Translation stats",
      "Morse code alphabet chart",
      "Shareable result URL",
      "Popular examples and presets",
      "Copy translated output",
    ],
  };
}

function buildHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use the Morse code translator",
    description: "Convert text to Morse code or decode Morse code back into readable text in a few steps.",
    totalTime: "PT1M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "Text or Morse code input",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Choose the translation direction",
        text: "Pick text to Morse when you want dot-dash output, or Morse to text when you want readable characters.",
      },
      {
        "@type": "HowToStep",
        name: "Paste your input or load an example",
        text: "Enter plain text, or paste Morse code with spaces between letters and a slash between words.",
      },
      {
        "@type": "HowToStep",
        name: "Copy, share, or play the result",
        text: "Review the output, copy it, share a URL, or play the Morse audio to hear the timing pattern.",
      },
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
      <JsonLd data={serializeJsonLd(buildHowToJsonLd())} />
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
            Morse Code Translator: Text to Morse Code and Morse to Text
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Translate text to Morse code or decode Morse code back to text instantly. This free Morse code translator
            supports letters, numbers, and punctuation, includes browser audio playback, and shows a live stats panel
            so you can spot unsupported characters and incomplete input quickly.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Use it as a Morse code converter, Morse code decoder, Morse code audio player, or quick reference tool
            while learning the Morse code alphabet, checking SOS patterns, preparing classroom examples, decoding
            jewelry messages, or testing short encoded signals.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
            <a href="#translator" className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary/20 hover:text-primary">
              Use translator
            </a>
            <a href="#examples" className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary/20 hover:text-primary">
              Popular examples
            </a>
            <a href="#alphabet-chart" className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary/20 hover:text-primary">
              Alphabet chart
            </a>
            <a href="#prosigns" className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground hover:border-primary/20 hover:text-primary">
              Prosigns
            </a>
          </div>
        </div>
      </section>

      <div id="translator">
        <MorseCodeTranslator />
      </div>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How Morse code translation works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Morse code represents letters, numbers, and punctuation through patterns of dots and dashes. A Morse code
            translator works by mapping each supported character to its standard Morse pattern, then reversing that
            pattern back into readable text when you switch modes. This makes the page useful as both a text to Morse
            code converter and a Morse code decoder for pasted signals.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This page uses the International Morse code style that most modern learners expect. In written Morse code,
            letters are separated by spaces and words are commonly separated by a forward slash. That convention keeps
            decoding predictable when you are typing or pasting Morse instead of hearing it as audio beeps.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Text to Morse code vs Morse to text</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The page is built for both main search intents. If you want to convert a name, short message, or classroom
            phrase into dots and dashes, use the text to Morse mode. If you already have Morse code and need to decode
            it into readable words, switch to Morse to text and keep the standard spacing between letters and the slash
            between words.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            That two-way structure matters because many pages only handle one direction well. A strong Morse code
            translator should help with both encoding and decoding while also making it easy to hear the pattern as
            real audio.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Text to Morse code guide</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Text to Morse mode is the fastest path when you already know the word or phrase you want and need a clean
            dot-dash version for learning, puzzles, cards, or hidden-message gifts. Type plain text, let the tool
            convert each character into International Morse, then copy the output or play it back as audio to hear the
            rhythm.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This is also the best mode for classroom examples because it exposes exactly how letters become patterns.
            If your input includes unsupported symbols, the page does not silently invent mappings. Instead, it skips
            them and reports them in the stats panel so you can see where the conversion became incomplete.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Morse to text guide</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Morse to text mode is for decoding. Paste the dots and dashes exactly as you have them, separate letters
            with spaces, and separate words with a forward slash. Once the spacing is correct, the tool can translate
            the sequence back into readable text instantly.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Most decoding mistakes come from formatting rather than from the code itself. A missing space can merge two
            letters into an invalid token. An extra slash can create an empty word break. That is why this page keeps
            the rules visible and reports unsupported items clearly instead of returning confusing output with no
            explanation.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Timing ratios and Morse structure</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Morse code is not only about symbols. It also has timing rules. A dot is one unit long, while a dash is
            three units long. The gap between parts of the same letter is one unit, the gap between letters is three
            units, and the gap between words is seven units. Even if you are only using written Morse code on this
            page, understanding those ratios helps explain why patterns such as E, T, S, and O are so recognizable.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            That timing model is one reason queries like &quot;what does SOS sound like in Morse code&quot; and
            &quot;how do I read Morse code&quot; are so common. People are not only looking for the text result. They also want to understand
            the structure behind the symbols. A good Morse code converter should therefore explain the system, not just
            produce output.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why audio playback matters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Morse code is designed to be heard. Audio playback helps learners connect written dots and dashes to actual
            rhythm, compare slow and fast timing, and check whether a pattern like SOS is immediately recognizable. The
            in-browser audio player on this page gives you a practical way to learn those patterns without leaving the
            translator.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Input rules for Morse mode</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Separate letters with spaces.</li>
            <li>Separate words with a forward slash.</li>
            <li>Use standard dot and dash tokens only for best results.</li>
            <li>Unsupported or invalid tokens are skipped and counted in the stats panel.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common decoding mistakes</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Combining two letters into one long token instead of separating them with a space.</li>
            <li>Using a slash between letters instead of between words.</li>
            <li>Mixing punctuation without checking whether it has a standard Morse mapping.</li>
            <li>Typing visual separators that look helpful to humans but do not map to valid Morse symbols.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Who uses a Morse code translator</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Students learning Morse code for class projects or amateur radio study.</li>
            <li>Teachers creating encoding and decoding exercises for communication history lessons.</li>
            <li>Puzzle designers and escape room builders checking letter patterns and hidden clues.</li>
            <li>Ham radio hobbyists verifying text before sending or teaching basic Morse concepts.</li>
            <li>Hobby learners converting names, phrases, and SOS examples into Morse code for practice.</li>
            <li>Shoppers decoding Morse code jewelry messages such as love, hope, or initials hidden in bead patterns.</li>
          </ul>
        </div>
      </section>

      <section id="examples" className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Popular Morse code examples</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          These examples cover some of the most common Morse code lookups, including SOS, greetings, names, and short
          gift-style words people often want to encode into bracelets, necklaces, cards, or puzzle clues.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {popularExamples.map((example) => (
            <article key={example.label} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{example.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Plain text: <span className="font-semibold text-foreground">{example.plain}</span>
              </p>
              <p className="mt-2 break-words font-mono text-sm text-foreground">{example.morse}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-primary/15 bg-primary-soft p-5">
          <h3 className="text-lg font-semibold text-foreground">SOS in Morse code</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            SOS is <span className="font-mono text-foreground">... --- ...</span>. It is one of the most searched
            Morse patterns because it is short, memorable, and useful for both history lessons and emergency signaling
            discussions.
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Common words in Morse code</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          Common-word examples make Morse easier to memorize because they connect the code to useful phrases instead of
          isolated letters. This is helpful for practice lists, school worksheets, and gift messages where you want a
          short word that stays readable when encoded.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {commonWordExamples.map((item) => (
            <div key={item.word} className="rounded-[1rem] border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{item.word}</p>
              <p className="mt-2 break-words font-mono text-sm text-muted-foreground">{item.morse}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to write names in Morse code</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          One of the most common personal uses for Morse code is encoding names, initials, or short hidden messages.
          People use this for bracelets, necklaces, classroom posters, puzzles, and custom gifts. Names work especially
          well because each letter stays visually distinct in dot-dash form.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          If you want a quick hidden-message format, initials are even shorter and often easier to fit into jewelry or
          printed designs. Use the translator for the exact spelling you need, then compare it with these examples to
          see how names usually look when spaced correctly.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {nameExamples.map((item) => (
            <div key={item.name} className="rounded-[1rem] border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="mt-2 break-words font-mono text-sm text-muted-foreground">{item.morse}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="alphabet-chart" className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Morse code alphabet chart</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          This Morse code chart covers the full A to Z alphabet and digits 0 to 9. It helps with direct lookups for
          searches like &quot;Morse code for A&quot;, &quot;Morse code letters&quot;, &quot;Morse code numbers&quot;, and &quot;Morse code alphabet&quot;.
          Use it alongside the translator when you want to learn patterns instead of just converting whole phrases.
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
              {morseAlphabet.map((item, index) => (
                <tr key={item.character} className={index === 0 ? "" : "border-t border-border/70"}>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">{item.character}</td>
                  <td className="px-4 py-3 text-sm font-mono tracking-wide text-muted-foreground">{item.morse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Morse code punctuation chart</h3>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          The translator also supports common punctuation, which is useful when you want to convert questions,
          exclamations, email-like symbols, or jewelry messages with separators and emphasis.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {morsePunctuation.map((item) => (
            <div key={item.character} className="rounded-[1rem] border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{item.character}</p>
              <p className="mt-2 break-words font-mono text-sm text-muted-foreground">{item.morse}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Numbers and punctuation examples</h3>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          Numbers and punctuation are practical because they show up in dates, short identifiers, and direct questions.
          If you are practicing beyond the alphabet, these are the next patterns worth learning.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.25rem] border border-border bg-background p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Number examples</h4>
            <div className="mt-4 space-y-3">
              {numberExamples.map((item) => (
                <div key={item.label}>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 break-words font-mono text-sm text-muted-foreground">{item.morse}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.25rem] border border-border bg-background p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Punctuation examples</h4>
            <div className="mt-4 space-y-3">
              {punctuationExamples.map((item) => (
                <div key={item.symbol}>
                  <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                  <p className="mt-1 break-words font-mono text-sm text-muted-foreground">{item.morse}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Common example: SOS = <span className="font-mono text-foreground">... --- ...</span>. If you need another
          text utility after translating, try the <Link href="/text/binary-code-translator" className="font-medium text-primary hover:underline">binary code translator</Link>, <Link href="/text/word-frequency" className="font-medium text-primary hover:underline">word frequency counter</Link>, or <Link href="/text/readability-flesch-kincaid-calculator" className="font-medium text-primary hover:underline">readability calculator</Link>.
        </p>
      </section>

      <section id="prosigns" className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Common Morse code prosigns</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          Prosigns are shorthand procedural signals used heavily in radio and operator practice. They are a useful
          long-tail topic because advanced users often search for SK, AR, KN, and similar patterns that are not
          obvious from the basic alphabet table alone.
        </p>

        <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-border bg-background">
          <table className="w-full border-collapse">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Prosign</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Meaning</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Morse code</th>
              </tr>
            </thead>
            <tbody>
              {MORSE_PROSIGNS_REFERENCE.map((item, index) => (
                <tr key={item.prosign} className={index === 0 ? "" : "border-t border-border/70"}>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">{item.prosign}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{item.meaning}</td>
                  <td className="px-4 py-3 text-sm font-mono tracking-wide text-muted-foreground">{item.morse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
          Prosigns matter most for radio operators and advanced learners because they represent operating intent rather
          than normal spelling. They are also useful for puzzle builders who want a more specialized Morse layer than
          the ordinary alphabet.
        </p>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">SOS and emergency signaling</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          SOS is the most famous Morse code pattern because it is compact, symmetrical, and easy to recognize:
          <span className="ml-1 font-mono text-foreground">... --- ...</span>. Even people who do not know the full
          Morse alphabet often recognize that rhythm immediately.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          It remains valuable as a teaching example because it connects pattern recognition, audio timing, and real
          communication history in a single sequence. If you are learning Morse for the first time, practicing SOS at a
          slower WPM is one of the easiest ways to connect symbols to sound.
        </p>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Morse code for learning, classrooms, and practice</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          For beginners, Morse is easier to learn in layers. Start with the shortest and most recognizable letters, move
          into simple words like SOS, YES, and NO, then practice longer phrases. The chart, audio player, and stats
          panel on this page are useful because they let you move between visual recognition and sound practice without
          switching tools.
        </p>
        <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
          <li>Start with letters such as E, T, S, O, A, and N because their patterns are short and memorable.</li>
          <li>Practice short words before full sentences so the spacing rules become natural.</li>
          <li>Use the audio player at a slower speed first, then increase WPM once the rhythm feels familiar.</li>
          <li>Give students direct lookup tasks such as names, initials, dates, or common phrases.</li>
        </ul>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Morse code jewelry and hidden message ideas</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          Morse code is popular in bracelets, necklaces, and keepsake gifts because dots and dashes translate naturally
          into bead and bar patterns. Short words tend to work best because they stay visually compact and remain easier
          to decode later.
        </p>
        <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
          <li>Use a short word such as LOVE, HOPE, SAFE, or FAMILY for a clear hidden message.</li>
          <li>Use initials when space is limited or you want the design to stay minimal.</li>
          <li>Use a date or number pattern for anniversaries, birthdays, or milestone years.</li>
          <li>Test the final output in the translator before turning it into a printed or physical design.</li>
        </ul>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Morse code vs other text encodings</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          Morse code is a symbolic communication system, not a computer character encoding in the same sense as binary,
          ASCII, or UTF-8. That difference matters because Morse is optimized for human recognition in sound and signal
          patterns, while binary systems are optimized for machine storage and transmission.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
          If you work across multiple formats, a common path is to use Morse for educational or human-readable signal
          practice and binary for technical encoding workflows. That is why this page pairs well with the
          <Link href="/text/binary-code-translator" className="ml-1 font-medium text-primary hover:underline">binary code translator</Link>
          and other text-analysis tools in this section of the site.
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
