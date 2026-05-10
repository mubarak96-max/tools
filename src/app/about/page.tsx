import React from 'react';
import { Shield, Zap, Target, Code2, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in">
        <p className="primary-chip inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest mb-6">
          Our Mission
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
          Tools Built for <span className="text-primary">Clarity</span> and <span className="text-primary">Speed</span>.
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
          FindBest Tools is an independent utility suite designed to solve everyday digital problems without the friction of account creation, data harvesting, or complex software.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Zero Friction</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            No sign-ups, no wait times, and no unnecessary steps. We build for the "one-minute workflow" where results are needed instantly.
          </p>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy First</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Most tools process data entirely in your browser using client-side JavaScript or WebAssembly. A small number of tools (like DNS lookup and IP detection) make server-side requests by design.
          </p>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Professional Grade</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            From financial calculators to SEO crawlers, we prioritize accuracy and high-performance algorithms for reliable outputs.
          </p>
        </div>
      </div>

      {/* Detailed Content Sections */}
      <div className="prose prose-slate max-w-none space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">The FindBest Philosophy</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4 text-slate-600">
              <p>
                In an era where every simple utility requires a subscription or a marketing sign-up, FindBest Tools takes the opposite approach. We believe that the most useful tools are the ones that respect the user&apos;s time and intelligence.
              </p>
              <p>
                What started as a small collection of text analysis utilities has grown into a comprehensive ecosystem of over <strong>100+ specialized tools</strong> spanning finance, real estate, health, design, and developer productivity.
              </p>
              <p>
                Built and maintained by Mubarak Mutesasira, the site runs on Next.js with a local-first architecture — most tools process data entirely in your browser, with no account required.
              </p>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" /> Technical Excellence
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>WASM-Powered:</strong> Heavy lifting like background removal and OCR happens locally via WebAssembly.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>SEO Focused:</strong> Our tools provide data that is actionable for marketers and analysts.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Universal Access:</strong> Fully responsive design that works on mobile, tablet, and desktop.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What You&apos;ll Find Here</h2>
          <p className="text-slate-600 mb-8">
            Our library is curated to provide depth in specific vertical categories. We don&apos;t just build broad tools; we build the specific ones professionals actually use.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 not-prose">
            {[
              { title: "Financial Suite", desc: "From UK Student Loans and CPP/EI to Global Inheritance Tax calculators.", href: "/finance" },
              { title: "Real Estate", desc: "Specialized tools for NYC Transfer Tax, Singapore Stamp Duty, and Rental Yield.", href: "/real-estate" },
              { title: "Developer Tools", desc: "Binary translators, Morse code converters, and DNS lookup utilities.", href: "/text" },
              { title: "SEO & Marketing", desc: "Keyword clustering, YouTube title checkers, and Marketing ROI analysis.", href: "/seo" },
              { title: "Image Processing", desc: "AI-driven background removal and Base64 conversion without server uploads.", href: "/image" },
              { title: "Health & Living", desc: "Scientific BMR and Calorie calculators based on modern medical formulas.", href: "/health" },
            ].map((cat) => (
              <Link key={cat.href} href={cat.href} className="p-6 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all group">
                <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.title}</h4>
                <p className="text-xs text-slate-500 mt-2">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 rounded-[3rem] p-10 sm:p-16 text-center border border-primary/10">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Built by Mubarak Mutesasira</h2>
          <p className="max-w-3xl mx-auto text-slate-600 mb-10">
            FindBest Tools is an independent project built and maintained by Mubarak Mutesasira — a developer and digital analyst who builds the tools he actually uses in his own workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="primary-button px-8 py-3 rounded-full">
              Request a Tool
            </Link>
            <Link href="/blog" className="secondary-button px-8 py-3 rounded-full">
              Read Our Guides
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-slate-50 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Meet the Author</h2>
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-black text-primary">
              MM
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mubarak Mutesasira</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">Developer &amp; Content Lead, FindBest Tools</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mubarak builds and maintains the tools and guides on FindBest Tools. With a background in software development and digital marketing, he focuses on creating accurate, practical calculators and guides for finance, real estate, SEO, and productivity. All blog posts and tool documentation are written and reviewed by Mubarak.
              </p>
            </div>
          </div>
        </section>

        <section className="text-sm text-slate-400 text-center pt-8 border-t border-slate-100">
          <p>© {new Date().getFullYear()} FindBest Tools. All utilities are provided free of charge to support the global creator and professional community. We sustain the site through non-intrusive advertising and affiliate partnerships.</p>
        </section>
      </div>
    </div>
  );
}

