import type { Metadata } from "next";
import CarouselBuilderClient from "@/components/tools/carousel-builder/CarouselBuilderClient";
import Link from "next/link";
import { ChevronRight, Home, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Social Media Carousel Builder | Create Instagram, LinkedIn & TikTok Carousels",
  description: "Create professional social media carousels in seconds for Instagram, LinkedIn, and TikTok. High-conversion templates, continuous backgrounds, and easy PDF/PNG export. No watermark, no signup required.",
  keywords: [
    "carousel builder",
    "instagram carousel maker",
    "linkedin carousel generator",
    "tiktok carousel maker",
    "social media design tool",
    "free carousel creator",
    "canva alternative for carousels",
    "linkedin pdf carousel maker"
  ],
  alternates: {
    canonical: "https://tools.mubarak.design/design/free-social-media-carousel-builder",
  },
};

export default function CarouselBuilderPage() {
  const faqData = [
    {
      question: "Is this carousel builder really free?",
      answer: "Yes! This tool is 100% free with no hidden subscriptions, no sign-up required, and most importantly, no watermarks on your exported designs."
    },
    {
      question: "What formats can I export my carousels in?",
      answer: "You can export as a multi-page PDF (recommended for LinkedIn for the clickable 'swipe' effect) or a ZIP file containing high-resolution PNG images (perfect for Instagram and TikTok)."
    },
    {
      question: "What are the recommended dimensions for LinkedIn and Instagram?",
      answer: "LinkedIn and Instagram both prefer Portrait (4:5) at 1080x1350px or Square (1:1) at 1080x1080px. Our tool handles these dimensions automatically."
    },
    {
      question: "Can I use continuous backgrounds across slides?",
      answer: "Yes! Our 'Continuous Background' feature allows gradients and SVG patterns to flow seamlessly from one slide to the next, creating a professional swipe experience that increases engagement."
    },
    {
      question: "Do I need design skills to use this tool?",
      answer: "Not at all. We provide pre-designed templates tailored for different roles (Intro, Content, Outro). You just need to fill in your text and choose a style."
    },
    {
      question: "Is there a limit to the number of slides?",
      answer: "Currently, you can create up to 15 slides per carousel. This is the optimal range for maintaining high viewer completion rates on social media."
    }
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Social Media Carousel Builder",
      "operatingSystem": "Any",
      "applicationCategory": "DesignApplication",
      "browserRequirements": "Requires JavaScript",
      "softwareVersion": "2.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "A professional, no-signup tool for creating multi-slide carousels with continuous backgrounds for Instagram, LinkedIn, and TikTok."
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <nav className="mb-6 flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                    <li>
                        <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <ChevronRight className="h-3 w-3 shrink-0 text-gray-400" />
                    <li>
                        <Link href="/design" className="hover:text-gray-900">
                            Design Tools
                        </Link>
                    </li>
                    <ChevronRight className="h-3 w-3 shrink-0 text-gray-400" />
                    <li className="text-gray-900 font-semibold truncate" aria-current="page">
                        Carousel Builder
                    </li>
                </ol>
            </nav>
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
               No Sign-up · No Watermark · 100% Free
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Free Social Media <span className="text-blue-600">Carousel Builder</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
                Design stunning, high-converting carousels for Instagram, LinkedIn, and TikTok in minutes. 
                Use premium templates and continuous backgrounds that flow across slides.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CarouselBuilderClient />
      </div>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-blue max-w-none">
          {/* How to Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Create a Professional Carousel in 3 Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold mb-4 shadow-lg shadow-blue-200">1</div>
                    <h3 className="text-lg font-bold mb-2">Select a Template</h3>
                    <p className="text-sm text-gray-500">Pick from our library of high-conversion templates designed for educational and promotional content.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold mb-4 shadow-lg shadow-blue-200">2</div>
                    <h3 className="text-lg font-bold mb-2">Edit Your Content</h3>
                    <p className="text-sm text-gray-500">Add titles, bullet points, and images. Customize colors and patterns to match your personal brand.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold mb-4 shadow-lg shadow-blue-200">3</div>
                    <h3 className="text-lg font-bold mb-2">Download & Post</h3>
                    <p className="text-sm text-gray-500">Export as a multi-page PDF for LinkedIn or a high-res ZIP of PNGs for Instagram and TikTok.</p>
                </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Master the Art of Social Carousels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why are carousels better than single posts?</h3>
                <p className="text-gray-600 leading-relaxed">
                    Carousels are known to have up to <strong className="text-blue-600">3.1x higher engagement</strong> than static images. They encourage users to spend more time on your post, signaling to algorithms that your content is valuable. This tool helps you capture that engagement without needing complex software.
                </p>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">The "Continuous Background" Advantage</h3>
                <p className="text-gray-600 leading-relaxed">
                    Our unique background system allows patterns like waves, dots, and arrows to flow across slide boundaries. This visual continuity subconsciously drives the user to keep swiping through your slides, significantly increasing your content's completion rate.
                </p>
            </div>
          </div>

          <div className="my-16 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2rem] p-8 md:p-12 text-white shadow-xl">
             <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-white mb-4">Optimized for LinkedIn Carousels</h2>
                <p className="text-blue-100 mb-6 leading-relaxed">
                    LinkedIn professional carousels are one of the most effective ways to build authority. Our tool specifically optimizes for LinkedIn by providing a <strong>Direct PDF Export</strong>. On LinkedIn, PDF documents are treated as interactive carousels with smooth transitions and high visibility in the feed.
                </p>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                        <Check className="h-4 w-4 text-blue-300" /> Clickable Swipe Navigation
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                        <Check className="h-4 w-4 text-blue-300" /> High Document Authority
                    </div>
                </div>
             </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center underline decoration-blue-500/30 underline-offset-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {faqData.map((faq, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                           <span className="text-blue-500 uppercase text-[10px] mt-1">Q</span>
                           {faq.question}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
