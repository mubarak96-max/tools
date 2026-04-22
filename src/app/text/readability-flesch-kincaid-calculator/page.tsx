import Link from "next/link";

import ReadabilityCalculator from "../_components/ReadabilityCalculator";
import { buildMetadata } from "@/lib/seo/metadata";
import { FileText, BrainCircuit } from "lucide-react";

export const revalidate = 43200;

const PAGE_PATH = "/text/readability-flesch-kincaid-calculator";

export const metadata = {
  ...buildMetadata({
    title: "Readability / Flesch-Kincaid Calculator | Master Class Text Analysis",
    description: "Score pasted text for reading ease, grade level, and sentence complexity.",
    path: PAGE_PATH,
  }),
  keywords: [
    "readability calculator",
    "flesch kincaid calculator",
    "reading ease score",
    "grade level calculator",
    "text readability checker",
  ],
};

const faqs = [
  {
    question: "What does the Flesch Reading Ease score mean?",
    answer:
      "It estimates how easy text is to read on a 0 to 100 scale. Higher scores usually mean shorter sentences, simpler words, and easier reading.",
  },
  {
    question: "Do readability scores replace editing?",
    answer:
      "No. Scores are useful signals, but they do not decide whether the text is accurate, persuasive, or appropriate for the audience.",
  },
  {
    question: "What should I change after checking readability?",
    answer:
      "Shorten dense sentences, replace unnecessary complex words, and compare the result with the audience and channel you are writing for.",
  },
];

const relatedTools = [
  {
    name: "Word Frequency Counter",
    href: "/text/word-frequency",
    description: "Analyze repeated words and surface the most-used terms in any text block.",
    icon: "FREQ",
  },
  {
    name: "Binary Code Translator",
    href: "/text/binary-code-translator",
    description: "Translate text to binary and binary back to readable text.",
    icon: "BIN",
  },
  {
    name: "Morse Code Translator",
    href: "/text/morse-code-translator",
    description: "Translate text to Morse code and Morse code back to text.",
    icon: "MORSE",
  },
];

export default function ReadabilityPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Readability / Flesch-Kincaid Calculator",
            description: "Score pasted text for reading ease, grade level, and sentence complexity.",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            url: `https://findbest.tools${PAGE_PATH}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <section className="relative overflow-hidden pt-8 sm:pt-12">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/text" className="primary-chip rounded-full px-3 py-1 shadow-sm drop-shadow-sm">
              Text
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
              Private and browser-native
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Readability / Flesch-Kincaid Calculator
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Paste text to measure reading ease, grade level, sentence complexity, reading time, and related readability scores in one browser-based workspace.
          </p>
          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/text" className="hover:text-primary">Text</Link></li>
              <li>/</li>
              <li className="text-slate-900">Readability Calculator</li>
            </ol>
          </nav>
        </div>
      </section>

      <ReadabilityCalculator />

      {/* ── EDUCATIONAL EXPANSION: 1500+ WORDS OF AUTHORITY ── */}
      <section className="mx-auto max-w-4xl space-y-24 px-4 py-16">
        
        {/* Section 1: The Origin Story */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">The Science of Clarity: A Brief History of Readability</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Readability is not just a modern SEO buzzword; it is a discipline born from the necessity of effective military communication. The <strong>Flesch-Kincaid Grade Level</strong> and <strong>Flesch Reading Ease</strong> formulas, which powers this calculator, were developed in the mid-1970s for the United States Navy.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Leading the research, Rudolf Flesch and J. Peter Kincaid sought a way to objectively measure how difficult technical manuals were for sailors to understand. They discovered that two primary variables predicted comprehension with remarkable accuracy: <strong>average sentence length</strong> and <strong>average syllables per word</strong>. Shorter sentences and simpler words reduced cognitive load, ensuring that critical information was processed correctly under pressure. Today, these exact metrics are used by everyone from internal policy writers at the Pentagon to the developers of the world's leading search algorithms.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 not-prose my-16">
             {[
               { icon: "🏛️", title: "Military Origins", body: "Originally used to standardize Navy manuals, ensuring technical safety through linguistic simplicity and clear, actionable syntax." },
               { icon: "⚖️", title: "Legal Standards", body: "In many jurisdictions, insurance policies and legal disclosures must meet a minimum Flesch Reading Ease score to be legally binding." },
               { icon: "🔍", title: "Search Authority", body: "Modern search engines prioritize content that regular people can understand. Readability is a proxy for user experience and 'answer quality'." },
               { icon: "🎓", title: "Educational Tech", body: "Teachers use these scores to level books, ensuring students are challenged without being overwhelmed by inaccessible vocabulary." },
             ].map((box) => (
                <div key={box.title} className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-2xl transition-all group shadow-sm">
                  <div className="text-3xl mb-6 group-hover:scale-110 transition-transform inline-block">{box.icon}</div>
                  <h4 className="text-lg font-black text-slate-900 mb-3">{box.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{box.body}</p>
                </div>
             ))}
          </div>
        </article>

        {/* Section 2: Deep Dive into the Formulas */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">Decoding the Numbers: How the Algorithms Work</h2>
          <p className="text-slate-600">
            While our dashboard provides multiple scores (Gunning Fog, SMOG, ARI), the Flesch-Kincaid pairing remains the industry gold standard. Here is the mathematical bridge between your text and a reading grade:
          </p>
          
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white font-mono text-sm shadow-2xl my-10 overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
               <FileText className="w-32 h-32" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50 text-indigo-400"># Flesch-Kincaid Grade Level Formula</p>
             <p className="text-lg sm:text-xl font-bold mb-6">0.39 (Words / Sentences) + 11.8 (Syllables / Words) - 15.59</p>
             <hr className="border-white/10 mb-6" />
             <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50 text-emerald-400"># Flesch Reading Ease Formula</p>
             <p className="text-lg sm:text-xl font-bold mb-0">206.835 - 1.015 (Words / Sentences) - 84.6 (Syllables / Words)</p>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">What is a "Good" Score?</h3>
          <p className="text-slate-600">
            A score of 60-70 in Reading Ease is the "sweet spot" for internet content. This translates to an 8th or 9th-grade reading level. Why target such a low grade? It's not about "dumbing down" your ideas; it's about <strong>accessibility</strong>. Even highly educated professionals prefer to consume information easily, especially on digital screens with high levels of distraction.
          </p>
        </section>

        {/* Section 3: The Psychology of Reading */}
        <section className="bg-slate-900 rounded-[3.5rem] p-10 sm:p-20 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
             <BrainCircuit className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-8 leading-tight">Processing Fluency: The Psychology of Simple Text</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Cognitive psychology shows that when text is "processed fluently" (read quickly and without friction), readers are more likely to trust the information and perceive the author as more intelligent.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 text-left">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group-hover:bg-white/10 transition-colors">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> The Halo Effect
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">Readers subconsciously associate clear writing with clear thinking. Obfuscation (using "big words") is often a red flag for a lack of expertise.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group-hover:bg-white/10 transition-colors">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Working Memory
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">Long, nested sentences force the brain to hold multiple clauses in its buffer at once. When the buffer overflows, comprehension collapses.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Readability for SEO and Growth */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">Why Search Engines Love High Readability</h2>
          <p className="text-slate-600 leading-relaxed">
            Is readability a direct ranking factor for Google? While Google doesn't officially say "you must be at Grade 9," readability has a massive indirect impact on SEO performance.
          </p>
          <ul className="text-slate-600 space-y-4 font-medium">
             <li><strong className="text-slate-900">Reduced Bounce Rate:</strong> When a user lands on a wall of academic text, they likely bounce back to search results. This signal tells Google your page didn't fulfill the user's intent.</li>
             <li><strong className="text-slate-900">Voice Search Optimization:</strong> Natural, readable text is much closer to how people speak. Higher readability scores correlate strongly with winning "Featured Snippets" and Voice Search results.</li>
             <li><strong className="text-slate-900">Shareability & Backlinks:</strong> Clear content is cited more often. Journalists and other writers are far more likely to link to a source they can understand and summarize quickly.</li>
             <li><strong className="text-slate-900">Accessibility Compliance (WCAG):</strong> Good readability is a core tenet of web accessibility, ensuring users with cognitive disabilities or those reading in their second language can access your content.</li>
          </ul>
        </article>

        {/* Section 5: Optimization Framework - The "Editor's Stack" */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">The Professional Editor's Stack</h2>
          <p className="text-slate-600">Once you have your scores, how do you improve them? We recommend the <strong>3-Stage Optimization Framework</strong>:</p>

          <div className="space-y-8 mt-12">
            {[
              { step: "01", name: "Syntactic Slicing", txt: "Find any sentence with more than 2 commas. These are candidates for splitting into two separate sentences. Slicing sentences is the single fastest way to drop 2 full grade levels." },
              { step: "02", name: "Vocabulary Sanitization", txt: "Search for 'intellectually lazy' words. Replace 'utilize' with 'use'. Replace 'commence' with 'start'. Replace 'subsequently' with 'then'. This reduces syllables-per-word without losing meaning." },
              { step: "03", name: "Passive to Active Pivot", txt: "Identify where things are 'being done' (passive) and change them to the subject 'doing the thing' (active). It reduces word count and increases the energy of the text." },
              { step: "04", name: "The Aloud Test", txt: "If you stumble while reading it aloud, the algorithm will stumble too. Use our sentence higlighter to find 'red' zones and read them out loud until they flow smoothly." },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start group">
                <div className="text-3xl font-black text-primary/20 group-hover:text-primary transition-colors shrink-0">{item.step}</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.txt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Limitations of the Scores */}
        <section className="prose prose-slate max-w-none pt-16 border-t border-slate-100">
          <h2 className="text-3xl font-black text-slate-900">The Limits of the Algorithm: What Scores Can't Do</h2>
          <p className="text-slate-600">
            Readability scores are mechanical. They count punctuation and characters, but they cannot "read" for logic, nuance, or beauty. A perfect Grade 8 score doesn't mean your writing is good; it just means it's easy to read.
          </p>
          <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 text-slate-700 italic">
            "Scores are a compass, not the steering wheel. If you are writing a technical manual for nuclear engineers, a 'Very Difficult' score is not just acceptable—it's expected. Context is always the supreme editor."
          </div>
        </section>

        {/* Advanced FAQ Section */}
        <section id="faq" className="space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Readability & Linguistic FAQ</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">Expert answers for copywriters, SEOs, and content strategists.</p>
          </div>
          
          <div className="grid gap-6">
             {[
               { q: "Is a Grade 5 score 'childish'?", a: "Not at all. Some of the most influential writers in history, like Ernest Hemingway, consistently scored at a 5th or 6th-grade level. Clear, direct language is a sign of confidence and mastery, not a lack of sophistication." },
               { q: "How should I interpret the SMOG Index?", a: "The SMOG (Simple Measure of Gobbledygook) Index is particularly good for medical and healthcare documents. It is more sensitive to complex vocabulary than Flesch-Kincaid, making it the preferred metric for patient education materials." },
               { q: "Does readability affect conversion rates?", a: "Yes. Studies in the SaaS and E-commerce space consistently show that as readability scores improve, conversion rates follow. Friction in reading leads to friction in the buying journey." },
               { q: "Can I use this for non-English text?", a: "The Flesch-Kincaid formulas provided here are optimized for the English language structure (syllable counts and sentence syntax). For other languages (like Spanish or French), specialized variations like the 'Fernandez' or 'Kandel' formulas are required." },
             ].map((item) => (
                <div key={item.q} className="p-10 rounded-[3rem] border border-slate-100 bg-white hover:border-primary/40 hover:shadow-2xl transition-all group shadow-sm">
                   <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">{item.q}</h3>
                   <p className="text-base text-slate-600 leading-relaxed font-medium">{item.a}</p>
                </div>
             ))}
          </div>
        </section>

      </section>

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between px-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Text Tools</h2>
            <p className="mt-1 text-sm text-slate-500">Utilities for better writing and communication.</p>
          </div>
          <Link href="/text" className="secondary-button px-4 py-2 text-xs">View All</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-20">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-primary shadow-sm ring-1 ring-black/5">
                {tool.icon}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {tool.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
