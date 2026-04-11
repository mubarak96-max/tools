import Link from "next/link";
import type { Metadata } from "next";

import BinaryCodeTranslator from "@/app/text/binary-code-translator/components/BinaryCodeTranslator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/binary-code-translator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const toBinaryByte = (value: number) => value.toString(2).padStart(8, "0");
const helloBinary = Array.from("Hello").map((character) => toBinaryByte(character.charCodeAt(0))).join(" ");
const hiBinary = Array.from("Hi").map((character) => toBinaryByte(character.charCodeAt(0))).join(" ");

const referenceCharacters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789").map((character) => ({
  character,
  binary: toBinaryByte(character.charCodeAt(0)),
}));

const faq = [
  {
    question: "What is binary code and how does it work?",
    answer:
      "Binary code is a base-2 number system that uses only 0 and 1. Computers represent data as electrical off and on states, so binary is the natural way to store letters, numbers, images, and instructions.",
  },
  {
    question: "What is ASCII and how does it relate to binary?",
    answer:
      "ASCII is a character standard that assigns a number to each basic English letter, digit, and punctuation mark. A binary to ASCII translator simply shows those numbers in 8-bit binary form and converts them back into readable text.",
  },
  {
    question: "Why are binary groups 8 bits long?",
    answer:
      "Eight bits make one byte. Many text encodings, especially ASCII, are commonly displayed one byte at a time, so binary is usually shown in 8-bit groups like 01001000.",
  },
  {
    question: "What does 01001000 01100101 01101100 01101100 01101111 mean?",
    answer:
      "That binary string decodes to Hello in ASCII and UTF-8. Each 8-bit group maps to one letter: H, e, l, l, o.",
  },
  {
    question: "Can binary represent any language or just English?",
    answer:
      "Binary can represent any language if the right text encoding is used. ASCII mainly covers basic English, while UTF-8 and UTF-16 can represent a much wider range of characters and scripts.",
  },
  {
    question: "What is the difference between binary and hexadecimal?",
    answer:
      "Binary uses base 2 and shows data with 0 and 1. Hexadecimal uses base 16 and is a shorter human-readable way to represent the same bytes. One byte can be written as 8 binary bits or 2 hexadecimal digits.",
  },
  {
    question: "Is this binary code translator free and does it store my data?",
    answer:
      "Yes. The tool is free to use in the browser, and the page does not require sign-up to convert text to binary or binary to text.",
  },
  {
    question: "What happens if I enter invalid binary?",
    answer:
      "Invalid groups that are not exactly 8 bits of 0s and 1s are ignored during decoding and counted in the stats panel, so you can spot formatting mistakes quickly.",
  },
  {
    question: "How do I convert binary to decimal instead of text?",
    answer:
      "Take the 8-bit group and add the place values where the bit is 1: 128, 64, 32, 16, 8, 4, 2, and 1. For example, 01001000 equals 64 + 8 = 72 in decimal.",
  },
  {
    question: "Which encoding should I choose: ASCII, UTF-8, or UTF-16?",
    answer:
      "Use ASCII for simple English text, UTF-8 for most modern web and multilingual text, and UTF-16 when you specifically need UTF-16 byte output. This tool supports all three for more accurate conversions.",
  },
];

export const metadata: Metadata = {
  title: "Free Binary Code Translator | Binary to Text Converter and Text to Binary",
  description:
    "Free binary code translator. Convert text to binary or binary to text instantly with ASCII, UTF-8, and UTF-16 support. Fast, private, no sign-up.",
  keywords: [
    "binary code translator",
    "binary to text converter",
    "text to binary",
    "binary decoder online",
    "convert binary to english",
    "binary to ascii translator",
    "8-bit binary converter",
    "online binary translator",
    "utf-8 binary converter",
    "unicode to binary",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Binary Code Translator",
    description:
      "Convert text to binary or binary to text instantly with ASCII, UTF-8, and UTF-16 support.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Binary Code Translator",
    description:
      "Binary to text converter and text to binary tool with ASCII, UTF-8, and UTF-16 support.",
  },
};

function buildBinaryTranslatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Binary Code Translator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free binary code translator that converts text to binary and binary to text with ASCII, UTF-8, and UTF-16 support.",
    featureList: [
      "Binary to text converter",
      "Text to binary converter",
      "ASCII support",
      "UTF-8 support",
      "UTF-16 support",
      "Output download",
      "Shareable result URL",
    ],
  };
}

function buildHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use the binary code translator",
    description: "Convert text to binary or decode binary to readable text in three simple steps.",
    totalTime: "PT1M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "Text or binary input",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Choose the conversion direction",
        text: "Select text to binary when you want bytes, or binary to text when you want readable characters.",
      },
      {
        "@type": "HowToStep",
        name: "Pick the encoding and paste your input",
        text: "Choose ASCII, UTF-8, or UTF-16, then enter text or paste 8-bit binary groups separated by spaces.",
      },
      {
        "@type": "HowToStep",
        name: "Copy, download, or share the result",
        text: "Review the output, then copy it, download it as a text file, or use the shareable URL.",
      },
    ],
  };
}

export default function BinaryCodeTranslatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Binary Code Translator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildBinaryTranslatorJsonLd())} />
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
            <li className="text-foreground">Binary Code Translator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Text utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Free Binary Code Translator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Use this free binary to text converter and text to binary tool to translate 8-bit binary instantly. It works as a binary decoder online, a binary to ASCII translator, and a practical reference for ASCII, UTF-8, and UTF-16 byte output.
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Got a mysterious binary string? Paste it in and decode it instantly. Need to convert binary to English, generate 8-bit byte groups, or check how characters map to machine-readable values? This page is built to be both a working online binary translator and a useful learning resource.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <BinaryCodeTranslator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to Convert Binary to Text (and Back)</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This binary code translator works in two directions. In text to binary mode, the tool takes each character, looks up its encoded byte values, and prints the result as groups of eight bits. In binary to text mode, it reads each valid 8-bit group, converts that byte into a number, and maps the number back to a character using the chosen encoding.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            For simple English text, ASCII is often enough. For modern multilingual text, UTF-8 is usually the best choice. UTF-16 can also be useful when you need to inspect or compare two-byte code unit output. That means this page is not just a binary decoder online. It is also an 8-bit binary converter and a practical encoding reference.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What Is Binary Code?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Binary code is the language of on and off states. Instead of using ten digits like the decimal system, binary uses only two digits: 0 and 1. A single binary digit is called a bit. Eight bits make one byte. Bytes are used to store text, instructions, and many other kinds of computer data.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A byte such as <span className="font-mono">01001000</span> can be interpreted as a number. If a character encoding says that number 72 means the letter H, then that byte can also be read as text. That is why a binary code translator can move between readable words and raw byte values so quickly.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How ASCII Works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            ASCII stands for American Standard Code for Information Interchange. It assigns numeric values to common English letters, digits, spaces, and punctuation. For example, uppercase A is decimal 65, uppercase H is decimal 72, and lowercase e is decimal 101. When those numbers are written in binary, they become byte groups such as <span className="font-mono">01000001</span> and <span className="font-mono">01100101</span>.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This matters because many people search for a binary to ASCII translator when they really want to convert binary to English or verify how one character maps to one byte. ASCII is perfect for that kind of learning and debugging because the mapping is direct and easy to inspect.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to Use This Binary Code Translator</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7 text-muted-foreground">
            <li>Select <strong>Text to Binary</strong> if you want to generate binary bytes, or <strong>Binary to Text</strong> if you want to decode a binary string.</li>
            <li>Choose an encoding: ASCII for basic English text, UTF-8 for most modern text, or UTF-16 when you need UTF-16 byte output.</li>
            <li>Paste your input, review the live result, and then copy, download, or share the result URL.</li>
          </ol>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Worked Examples for Text to Binary and Binary to Text</h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
            <div className="rounded-[1rem] border border-border bg-background p-4">
              <p><strong>H</strong> → <span className="font-mono">01001000</span></p>
            </div>
            <div className="rounded-[1rem] border border-border bg-background p-4">
              <p><strong>Hi</strong> → <span className="font-mono">{hiBinary}</span></p>
            </div>
            <div className="rounded-[1rem] border border-border bg-background p-4">
              <p><strong>Hello</strong> → <span className="font-mono">{helloBinary}</span></p>
            </div>
          </div>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The reverse works too. If you paste <span className="font-mono">{helloBinary}</span> into binary to text mode, the output is <strong>Hello</strong>. This exact example is useful because people frequently search for binary strings like that one and want an immediate answer.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to Format Binary Input Correctly</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Use one 8-bit group for each byte.</li>
            <li>Separate groups with spaces so the decoder can read them clearly.</li>
            <li>Only use 0 and 1. Any group with the wrong length or invalid characters is ignored and counted as invalid.</li>
            <li>For UTF-16, remember that one visible character may use more than one byte group.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to Convert Binary Manually</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            To convert binary manually, assign each position a power of two. In an 8-bit byte, the place values are 128, 64, 32, 16, 8, 4, 2, and 1. Add the values where the bit is 1.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-border text-left text-foreground">
                  <th className="px-3 py-2">Bit</th>
                  <th className="px-3 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {[128, 64, 32, 16, 8, 4, 2, 1].map((value, index) => (
                  <tr key={value} className={index % 2 === 0 ? "bg-background/60" : ""}>
                    <td className="px-3 py-2 font-mono">{index + 1}</td>
                    <td className="px-3 py-2 font-mono">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Example: <span className="font-mono">01001000</span> has 1s in the 64 and 8 positions. That means 64 + 8 = 72. In ASCII, decimal 72 is H. This is the basic math behind every binary to text converter.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Binary vs ASCII vs Unicode</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Binary is the raw representation: just bits and bytes. ASCII is one character encoding that maps a limited set of characters to numeric byte values. Unicode is a much larger character standard that covers many writing systems, symbols, and emoji. UTF-8 and UTF-16 are encoding methods used to store Unicode characters as bytes.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In short: binary is the storage format, ASCII is a smaller character map, and Unicode is the broader character system. That is why a modern binary code translator benefits from offering ASCII, UTF-8, and UTF-16 instead of only one narrow interpretation.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why Use a Binary Code Translator?</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Education: learn how letters, digits, and punctuation map to bytes.</li>
            <li>Programming: inspect byte output while testing parsers, encoders, or tutorials.</li>
            <li>CTFs and puzzles: decode a binary message quickly when you find one in a challenge.</li>
            <li>Debugging: compare text output across ASCII, UTF-8, and UTF-16.</li>
            <li>Lightweight encoding tasks: copy, download, or share a result without installing anything.</li>
          </ul>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            If you also work with other text formats, try the <Link href="/text/morse-code-translator" className="font-medium text-primary hover:underline">Morse code translator</Link>, the <Link href="/text/character-counter" className="font-medium text-primary hover:underline">character counter</Link>, the <Link href="/text/case-converter" className="font-medium text-primary hover:underline">case converter</Link>, or the <Link href="/text/ascii-art-generator" className="font-medium text-primary hover:underline">ASCII art generator</Link>.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Binary Reference Table: A-Z and 0-9</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This quick reference table is useful when you need to know what a letter or number looks like in 8-bit binary without opening a separate chart.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-border text-left text-foreground">
                  <th className="px-3 py-2">Character</th>
                  <th className="px-3 py-2">Binary</th>
                </tr>
              </thead>
              <tbody>
                {referenceCharacters.map((item, index) => (
                  <tr key={item.character} className={index % 2 === 0 ? "bg-background/60" : ""}>
                    <td className="px-3 py-2 font-semibold text-foreground">{item.character}</td>
                    <td className="px-3 py-2 font-mono">{item.binary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">History of Binary Code</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Binary ideas go back centuries, but the system became especially important through the work of Gottfried Wilhelm Leibniz, who wrote about base-2 numbers in the seventeenth century. Later, George Boole's logical algebra helped shape how binary logic could describe decision-making in machines. Early electronic computers then turned those ideas into practical engineering because circuits naturally map to off and on states.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Today, the same foundation still powers modern devices. Whether you are decoding a short puzzle string or studying how bytes work, the same base-2 logic is underneath everything from simple text files to software instructions.
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Binary Translator FAQ</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
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
