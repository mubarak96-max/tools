import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/how-to-convert-text-to-binary";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Convert Text to Binary (Complete Binary Code Translator Guide) | FindBest Tools",
  description: "Learn how to convert text to binary and binary to text. Full guide covering ASCII, 8-bit encoding, worked examples, A–Z reference table, and how our free binary code translator works.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How to Convert Text to Binary — Complete Guide",
    description: "Everything you need to know about binary code translation: how it works, worked examples, ASCII reference table, and use cases.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "What is a binary code translator?",
    answer: "A binary code translator is a tool that converts plain text into binary (sequences of 0s and 1s) and converts binary back into readable text. It uses ASCII encoding to map each character to its 8-bit binary equivalent.",
  },
  {
    question: "How do you convert text to binary?",
    answer: "To convert text to binary: (1) Take each character in your text. (2) Find its ASCII decimal value (e.g. 'H' = 72). (3) Convert that decimal number to 8-bit binary (72 = 01001000). (4) Repeat for each character, separating each byte with a space.",
  },
  {
    question: "What does 01001000 01100101 01101100 01101100 01101111 mean?",
    answer: "01001000 01100101 01101100 01101100 01101111 translates to 'Hello' in ASCII. Each 8-bit group represents one character: 01001000 = H, 01100101 = e, 01101100 = l, 01101100 = l, 01101111 = o.",
  },
  {
    question: "Why does binary use 8 bits per character?",
    answer: "8 bits (one byte) can represent 256 different values (2^8 = 256), which is enough to cover all 128 standard ASCII characters with room to spare. 8-bit groupings also align neatly with how modern computer memory is organized.",
  },
  {
    question: "What is the difference between ASCII and Unicode in binary?",
    answer: "ASCII uses 7–8 bits to encode 128–256 characters (English letters, digits, symbols). Unicode (UTF-8, UTF-16) uses variable-length encoding to support over 1 million characters including all world languages, emoji, and special symbols. For basic English text, ASCII and UTF-8 produce identical binary output.",
  },
  {
    question: "Can binary represent languages other than English?",
    answer: "Yes — with Unicode (UTF-8 or UTF-16) encoding, binary can represent virtually every written language and symbol system in the world. Standard ASCII only covers English and basic Latin characters.",
  },
  {
    question: "What is the binary code for A to Z?",
    answer: "In ASCII binary: A=01000001, B=01000010, C=01000011, D=01000100, E=01000101, F=01000110, G=01001000... (see the table below for the full list).",
  },
  {
    question: "How do I format binary input for a binary to text converter?",
    answer: "Use space-separated 8-bit groups. Each group must be exactly 8 digits of 0s and 1s. Example: 01001000 01101001 (which translates to 'Hi'). Groups that are shorter than 8 bits or contain characters other than 0 and 1 are considered invalid.",
  },
];

const referenceCharacters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((char) => {
  const code = char.charCodeAt(0);
  const lower = char.toLowerCase();
  const lowerCode = lower.charCodeAt(0);
  return {
    char,
    dec: code,
    bin: code.toString(2).padStart(8, "0"),
    lower,
    lowerDec: lowerCode,
    lowerBin: lowerCode.toString(2).padStart(8, "0"),
  };
});

const digitCharacters = Array.from("0123456789").map((char) => {
  const code = char.charCodeAt(0);
  return {
    char,
    dec: code,
    bin: code.toString(2).padStart(8, "0"),
  };
});

export default function BinaryBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "How to Convert Text to Binary", path: PAGE_PATH },
  ]);

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Text to Binary",
    "description": "Step-by-step guide to converting plain text into 8-bit binary using ASCII encoding.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Find the ASCII value",
        "text": "Take each character and find its ASCII decimal value. For example, the letter 'H' has an ASCII value of 72."
      },
      {
        "@type": "HowToStep",
        "name": "Convert decimal to binary",
        "text": "Convert the decimal value to an 8-bit binary number. 72 in binary is 01001000."
      },
      {
        "@type": "HowToStep",
        "name": "Repeat for each character",
        "text": "Repeat steps 1–2 for every character in your text, separating each 8-bit group with a space."
      },
      {
        "@type": "HowToStep",
        "name": "Use a binary code translator",
        "text": "Or skip the manual steps entirely — paste your text into a binary code translator and get instant results."
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <JsonLd data={serializeJsonLd(howTo)} />
      <JsonLd data={serializeJsonLd(buildFaqJsonLd(faq))} />

      <header className="mb-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Binary Guide</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Guide · Binary Encoding
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How to Convert Text to Binary (and Binary Back to Text)
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A complete guide to binary code translation — how it works, worked examples, the A–Z reference table, and everything else you need to understand or use a binary code translator.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>8 min read</span>
            <span>•</span>
            <span>Updated April 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section id="what-is-binary" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-6">What is binary code?</h2>
          <p>
            Binary is a <strong>base-2 number system</strong> — meaning it uses only two digits: <code>0</code> and <code>1</code>. Every piece of data stored or processed by a computer — text, images, audio, video — is ultimately stored as a sequence of these two values.
          </p>
          <p>
            The reason computers use binary comes down to hardware. Transistors, the fundamental building block of every processor, operate like tiny switches: they're either <em>off</em> (<code>0</code>) or <em>on</em> (<code>1</code>). Billions of these switches working in combination allow modern computers to represent and manipulate any type of information.
          </p>
          <p>
            A single <code>0</code> or <code>1</code> is called a <strong>bit</strong> (short for <em>binary digit</em>). Eight bits grouped together form a <strong>byte</strong> — the standard unit for representing a single character in most text encoding systems.
          </p>
          <div className="bg-primary/5 border-l-4 border-primary p-6 my-8 rounded-r-xl">
            <h4 className="text-primary font-bold uppercase text-xs tracking-widest mb-2">Quick fact</h4>
            <p className="m-0 text-muted-foreground italic">
              One byte (<code>8 bits</code>) can represent 256 unique values (2⁸ = 256). That's enough to encode every standard English letter, digit, punctuation mark, and common symbol — with room to spare.
            </p>
          </div>
        </section>

        <section id="ascii" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-6">How ASCII connects text to binary</h2>
          <p>
            A computer doesn't inherently know what the letter <strong>A</strong> is — it only understands numbers. <strong>ASCII</strong> (the American Standard Code for Information Interchange) is a mapping that bridges that gap. It assigns a unique number to every letter, digit, and symbol, so computers can agree on a shared language for text.
          </p>
          <p>
            ASCII was first published in 1963 and became the foundation for virtually all modern text encoding. It defines 128 characters (7-bit encoding), later extended to 256 with the 8-bit variant. Here are a few familiar examples:
          </p>

          <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Character</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Decimal</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Binary (8-bit)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { char: 'A', dec: 65, bin: '01000001' },
                    { char: 'a', dec: 97, bin: '01100001' },
                    { char: 'Z', dec: 90, bin: '01011010' },
                    { char: '0', dec: 48, bin: '00110000' },
                    { char: '!', dec: 33, bin: '00100001' },
                    { char: '(space)', dec: 32, bin: '00100000' },
                  ].map((row) => (
                    <tr key={row.char} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">{row.char}</td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">{row.dec}</td>
                      <td className="px-6 py-4 font-mono text-primary font-medium">{row.bin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p>
            Notice that uppercase <strong>A</strong> (65) and lowercase <strong>a</strong> (97) have different values — binary translation is always case-sensitive. Also notice that the space character has its own binary value, just like any letter.
          </p>
        </section>

        <section id="how-to-convert" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-6">How to convert text to binary (step by step)</h2>
          <p>You can convert any text to binary manually by following this process:</p>
          <div className="space-y-6 my-8">
            {[
              { title: "Take the first character", text: "Take the first character of your text. For example, the letter H." },
              { title: "Find its ASCII decimal value", text: "H = 72. You can look this up in an ASCII table or use the reference table further down this page." },
              { title: "Convert the decimal to binary", text: "Divide 72 by 2 repeatedly, noting remainders. Reading remainders bottom-to-top gives 1001000. Pad to 8 bits: 01001000." },
              { title: "Repeat for every character", text: "Repeat steps 1–2 for every character in your text, separating each 8-bit group with a space." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                  <p className="m-0 text-muted-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p>
            As you can see, even converting a single word manually takes significant effort. That's exactly what our <Link href="/text/binary-code-translator" className="text-primary font-medium underline decoration-primary/30 hover:decoration-primary transition-all">binary code translator</Link> does for you — instantly and accurately, for any length of text.
          </p>
        </section>

        <section id="hello-example" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-6">Worked example: "Hello" in binary</h2>
          <p>Let's walk through the full conversion of the word <strong>Hello</strong> — one of the most commonly searched binary examples.</p>

          <div className="bg-muted/30 border border-border rounded-2xl p-8 my-8">
            <h4 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8">Hello → 8-bit binary (ASCII)</h4>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { char: 'H', bin: '01001000' },
                { char: 'e', bin: '01100101' },
                { char: 'l', bin: '01101100' },
                { char: 'l', bin: '01101100' },
                { char: 'o', bin: '01101111' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className="text-3xl font-serif font-bold text-primary">{item.char}</span>
                  <code className="px-3 py-1 bg-primary/10 rounded-lg text-primary text-xs font-mono">{item.bin}</code>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center font-mono text-sm text-primary bg-muted/50 py-4 rounded-xl border border-dashed border-border mb-8">
            01001000 01100101 01101100 01101100 01101111
          </p>

          <p>A few things worth noticing in this example:</p>
          <ul className="list-none space-y-4 p-0">
            <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-xl">
              <span className="text-primary">→</span>
              <p className="m-0">The two <strong>l</strong> characters produce identical binary (<code>01101100</code>) — same character, same code.</p>
            </li>
            <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-xl">
              <span className="text-primary">→</span>
              <p className="m-0"><strong>H</strong> (uppercase) and <strong>e</strong> (lowercase) produce different first bits, reflecting their different ASCII ranges.</p>
            </li>
            <li className="flex gap-3 items-start p-4 bg-card border border-border rounded-xl">
              <span className="text-primary">→</span>
              <p className="m-0">Every group is exactly 8 bits — leading zeros are always included.</p>
            </li>
          </ul>
        </section>

        <section id="reference-table" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-6">Binary A–Z reference table</h2>
          <p>
            The table below shows the complete binary representation for all 26 uppercase letters (A–Z) and their lowercase equivalents, along with the digits 0–9. All values use standard <strong>8-bit ASCII encoding</strong>.
          </p>

          <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-wider">Upper</th>
                    <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-wider">Dec</th>
                    <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-wider">Binary</th>
                    <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-wider">Lower</th>
                    <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-wider">Dec</th>
                    <th className="px-4 py-3 font-bold text-muted-foreground uppercase tracking-wider">Binary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {referenceCharacters.map((row) => (
                    <tr key={row.char} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2 font-bold text-primary text-lg">{row.char}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground text-xs">{row.dec}</td>
                      <td className="px-4 py-2 font-mono text-primary text-xs">{row.bin}</td>
                      <td className="px-4 py-2 font-bold text-emerald-500 text-lg">{row.lower}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground text-xs">{row.lowerDec}</td>
                      <td className="px-4 py-2 font-mono text-emerald-500 text-xs">{row.lowerBin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4 mt-12">Digits 0–9 in binary</h3>
          <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card max-w-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Char</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Decimal</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Binary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {digitCharacters.map((row) => (
                    <tr key={row.char} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 font-bold text-primary text-lg">{row.char}</td>
                      <td className="px-6 py-3 font-mono text-muted-foreground">{row.dec}</td>
                      <td className="px-6 py-3 font-mono text-primary">{row.bin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-8">One important note: the binary code for the <em>digit</em> <strong>0</strong> (<code>00110000</code>) is not the same as an actual zero bit. The digit 0 still has its own ASCII value (48), and is encoded as a full byte just like any letter.</p>
        </section>

        <section id="binary-to-text" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-6">Converting binary back to text</h2>
          <p>
            The reverse process — <strong>binary to text</strong> — is decoding. Given a sequence of 8-bit groups, you look up each group's decimal equivalent in the ASCII table and return the corresponding character.
          </p>
          <p>For example: <code>01001000 01101001</code></p>
          <div className="my-6 space-y-4">
            <div className="flex gap-4 items-center">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-bold text-xs">1</span>
              <span>Split the binary string: <code>01001000</code> and <code>01101001</code></span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-bold text-xs">2</span>
              <span>Convert to decimal: <code>01001000</code> = 72, <code>01101001</code> = 105</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-bold text-xs">3</span>
              <span>ASCII lookup: 72 = <strong>H</strong>, 105 = <strong>i</strong></span>
            </div>
          </div>
          <p className="font-bold text-primary">Result: Hi</p>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mt-8">
            <h4 className="text-amber-600 font-bold uppercase text-xs tracking-widest mb-2">Input formatting tip</h4>
            <p className="m-0 text-muted-foreground italic">
              When using a binary to text converter, always separate your 8-bit groups with spaces. If groups are run together (e.g. <code>0100100001101001</code>), the tool needs to split them itself — this can cause errors if the string length isn't a perfect multiple of 8.
            </p>
          </div>
        </section>

        <section id="ascii-vs-unicode" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-6">ASCII vs Unicode: what's the difference?</h2>
          <p>
            ASCII handles 128–256 characters, which covers English text perfectly. But the modern web needs to support every language — Arabic, Chinese, Hindi, Japanese, emoji, mathematical symbols, and more. That's where <strong>Unicode</strong> comes in.
          </p>

          <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Feature</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">ASCII</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider">Unicode (UTF-8)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { f: 'Characters supported', a: '128 / 256', u: '1,100,000+' },
                    { f: 'Bits per character', a: '7 or 8 (fixed)', u: '8–32 (variable)' },
                    { f: 'English text output', a: 'Identical to UTF-8', u: 'Identical to ASCII', highlight: true },
                    { f: 'Non-English languages', a: 'Not supported', u: 'Fully supported' },
                    { f: 'Emoji support', a: 'No', u: 'Yes' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{row.f}</td>
                      <td className={`px-6 py-4 ${row.highlight ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>{row.a}</td>
                      <td className={`px-6 py-4 ${row.highlight ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}>{row.u}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p>
            For standard English text, ASCII and UTF-8 produce <em>identical</em> binary output — a UTF-8 binary translator and an ASCII binary translator give the same result for English. The difference only matters when you introduce characters outside the basic Latin alphabet.
          </p>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground uppercase tracking-widest text-sm">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-[1.5rem] p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-[linear-gradient(135deg,_var(--tw-gradient-from),_var(--tw-gradient-to))] from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Try the Binary Code Translator</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Convert text to binary or decode binary back to text — instantly, free, and entirely in your browser.
          </p>
          <Link 
            href="/text/binary-code-translator" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Open the Translator →
          </Link>
        </div>
      </div>
    </div>
  );
}
