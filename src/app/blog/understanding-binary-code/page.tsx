import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/understanding-binary-code";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Binary Basics: Understanding the Language of Computers | FindBest Tools",
  description: "Demystify binary code! Learn what binary is, how it works, and its role as the fundamental language of all digital systems. Perfect for beginners.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Binary Basics: Understanding the Language of Computers",
    description: "Learn what binary code is, how it works with bits and bytes, and why computers use it as their native language.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "What is the simplest way to explain binary code?",
    answer: "Binary is like a collection of light switches. Every switch can either be 'Off' (represented by 0) or 'On' (represented by 1). By combining many of these 'On/Off' switches, a computer can represent any information, from the letter 'A' to a high-definition movie.",
  },
  {
    question: "Difference between a bit and a byte?",
    answer: "A bit is the smallest unit of data (a single 0 or 1). A byte is a group of 8 bits. One byte is typically enough to represent a single character, like a letter or a digit, using an encoding standard like ASCII.",
  },
  {
    question: "Why don't computers use decimal (0-9) instead of binary?",
    answer: "Computers use electricity to process data. It is much easier and more reliable to detect whether electricity is 'flowing' or 'not flowing' (two states) than it is to precisely measure ten different levels of voltage. This makes binary faster and less prone to errors in hardware.",
  },
  {
    question: "What is a 'base-2' system?",
    answer: "A base-2 system (binary) uses only two digits (0 and 1). Every time you move one position to the left, the value doubles (1, 2, 4, 8, 16...). This is different from আমাদের common base-10 system where every position to the left is ten times larger.",
  },
  {
    question: "Is binary only for text?",
    answer: "No. Everything you see on a computer — images, videos, music, and programs — is stored as binary. Images are stored as binary color values for pixels, and music is stored as binary measurements of sound waves.",
  },
];

export default function BinaryBasicsBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Understanding Binary Code", path: PAGE_PATH },
  ]);

  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Binary Basics</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
            Beginner Guide · Foundation
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Binary Basics: Understanding the Language of Computers
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Unlocking the digital world: a simple guide to what binary is, how it functions, and why it powers every device you own.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>5 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Introduction: Unlocking the Digital World</h2>
          <p>
            In our increasingly digital world, understanding the fundamental language that powers all computers is more relevant than ever. That language is <strong>binary code</strong>. Far from being a complex concept reserved for computer scientists, binary is a simple yet elegant system that underpins every interaction you have with technology. This guide will demystify binary, explaining what it is, how it works, and why it&apos;s essential to the digital age.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Exactly is Binary Code?</h2>
          <p>
            At its core, binary code is a <strong>base-2 number system</strong>, meaning it uses only two symbols: <strong>0</strong> and <strong>1</strong>. This contrasts with the decimal system (base-10) we use daily, which employs ten digits (0-9). In binary, each <code>0</code> or <code>1</code> is called a <strong>bit</strong> (short for binary digit). Eight bits grouped together form a <strong>byte</strong>, which is the fundamental unit for storing data in computers.
          </p>
          <div className="bg-primary/5 border-l-4 border-primary p-6 my-8 rounded-r-xl">
            <p className="m-0 text-muted-foreground">
              Think of it like a light switch: either it&apos;s <strong>on (1)</strong> or <strong>off (0)</strong>. Computers use these two states to represent all information, from text and images to complex software instructions.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">How Binary Works: Bits, Bytes, and Powers of Two</h2>
          <p>
            To understand how binary represents numbers, we look at <strong>place values</strong>, similar to how the decimal system works. In decimal, each digit&apos;s position represents a power of 10 (e.g., 10^0, 10^1, 10^2). In binary, each position represents a power of 2.
          </p>
          
          <div className="my-8 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-muted-foreground text-center uppercase tracking-wider">Bit Position</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground text-center uppercase tracking-wider">Power of 2</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground text-center uppercase tracking-wider">Decimal Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { pos: 8, pow: "2^7", val: 128 },
                    { pos: 7, pow: "2^6", val: 64 },
                    { pos: 6, pow: "2^5", val: 32 },
                    { pos: 5, pow: "2^4", val: 16 },
                    { pos: 4, pow: "2^3", val: 8 },
                    { pos: 3, pow: "2^2", val: 4 },
                    { pos: 2, pow: "2^1", val: 2 },
                    { pos: 1, pow: "2^0", val: 1 },
                  ].map((row) => (
                    <tr key={row.pos} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 text-center font-bold">{row.pos}</td>
                      <td className="px-6 py-3 text-center font-mono text-muted-foreground">{row.pow}</td>
                      <td className="px-6 py-3 text-center font-mono font-bold text-primary">{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p>
            To convert a binary number to decimal, you simply add the decimal values for each position where there is a <code>1</code>. For instance, the binary <code>01001000</code> (which represents the letter &apos;H&apos; in ASCII) breaks down as:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 list-none p-0 my-6">
            <li className="p-3 bg-muted/30 rounded-lg text-center font-mono text-xs">0 x 128</li>
            <li className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center font-mono text-xs"><strong>1 x 64</strong></li>
            <li className="p-3 bg-muted/30 rounded-lg text-center font-mono text-xs">0 x 32</li>
            <li className="p-3 bg-muted/30 rounded-lg text-center font-mono text-xs">0 x 16</li>
            <li className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center font-mono text-xs"><strong>1 x 8</strong></li>
            <li className="p-3 bg-muted/30 rounded-lg text-center font-mono text-xs">0 x 4</li>
            <li className="p-3 bg-muted/30 rounded-lg text-center font-mono text-xs">0 x 2</li>
            <li className="p-3 bg-muted/30 rounded-lg text-center font-mono text-xs">0 x 1</li>
          </ul>
          <p>
            Adding the values where there&apos;s a <code>1</code>: 64 + 8 = <strong>72</strong>. So, <code>01001000</code> in binary is <code>72</code> in decimal.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Why Do Computers Speak Binary?</h2>
          <p>
            The primary reason computers use binary is due to their electronic nature. Computer circuits are made up of millions of tiny switches (transistors) that can only be in one of two states: on or off. These states perfectly map to the <code>1</code> and <code>0</code> of binary code. This simplicity makes binary extremely reliable and efficient for electronic systems to process information at incredibly high speeds.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Binary, ASCII, and Unicode: Giving Meaning to Bits</h2>
          <p>
            While binary is the raw language of computers, humans need to interpret this data. This is where <strong>character encodings</strong> come in:
          </p>
          <ul className="space-y-6 list-none p-0 my-8">
            <li className="p-6 bg-card border border-border rounded-2xl">
              <h4 className="font-bold text-foreground mb-2">ASCII (American Standard Code for Information Interchange)</h4>
              <p className="m-0 text-muted-foreground text-sm">An early and widely used encoding that assigns a unique 7-bit (or 8-bit) binary code to each English letter, number, and common symbol. For example, as we saw, <code>01001000</code> represents &apos;H&apos;.</p>
            </li>
            <li className="p-6 bg-card border border-border rounded-2xl">
              <h4 className="font-bold text-foreground mb-2">Unicode</h4>
              <p className="m-0 text-muted-foreground text-sm">A much more extensive character encoding standard designed to represent text from all writing systems in the world. It includes characters for almost every language, symbols, and emojis.</p>
            </li>
            <li className="p-6 bg-card border border-border rounded-2xl">
              <h4 className="font-bold text-foreground mb-2">UTF-8 and UTF-16</h4>
              <p className="m-0 text-muted-foreground text-sm">These are variable-width encodings that store Unicode characters. UTF-8 is the dominant encoding on the web, efficiently representing a vast range of characters using 1 to 4 bytes per character.</p>
            </li>
          </ul>
          <p>
            These encodings act as a bridge, allowing computers to store and process binary data, and then translate it into human-readable text and vice-versa.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Practical Applications of Binary Today</h2>
          <p>Beyond the fundamental operations of a computer, binary code is crucial in various fields:</p>
          <div className="grid sm:grid-cols-2 gap-4 my-8">
            <div className="p-6 bg-muted/20 rounded-xl">
              <h5 className="font-bold mb-2">Networking</h5>
              <p className="text-sm text-muted-foreground m-0">Data transmission across the internet relies on binary packets for routing and delivery.</p>
            </div>
            <div className="p-6 bg-muted/20 rounded-xl">
              <h5 className="font-bold mb-2">Digital Imaging</h5>
              <p className="text-sm text-muted-foreground m-0">Every pixel in an image is represented by binary color values (RGB coordinates).</p>
            </div>
            <div className="p-6 bg-muted/20 rounded-xl">
              <h5 className="font-bold mb-2">Programming</h5>
              <p className="text-sm text-muted-foreground m-0">Understanding binary helps developers grasp low-level operations and optimize memory usage.</p>
            </div>
            <div className="p-6 bg-muted/20 rounded-xl">
              <h5 className="font-bold mb-2">Data Storage</h5>
              <p className="text-sm text-muted-foreground m-0">Hard drives and SSDs store all information as magnetic or electric charge (binary states).</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore Binary?</h2>
          <p>
            Understanding binary is a foundational step in comprehending how our digital world functions. Whether you&apos;re a student, a budding programmer, or just curious, exploring binary can unlock a deeper appreciation for technology.
          </p>
          <p>
            Ready to see binary in action? Our <Link href="/converter/convert-binary-encoder-decoder" className="text-primary font-bold underline decoration-primary/30 hover:decoration-primary transition-all">Free Binary Code Translator</Link> allows you to effortlessly convert text to binary and binary back to text, supporting ASCII, UTF-8, and UTF-16. It&apos;s a perfect tool for learning, debugging, or simply satisfying your curiosity!
          </p>
        </section>

        <hr className="my-16 border-border" />

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Common Binary FAQs</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Master the Digital Language</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Instantly translate between text and binary with our free simulator. Learn as you convert.
          </p>
          <Link 
            href="/converter/convert-binary-encoder-decoder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
          >
            Start Translating Binary →
          </Link>
        </div>
      </div>
    </div>
  );
}
