import type { Metadata } from "next";
import CarouselBuilderClient from "@/components/tools/carousel-builder/CarouselBuilderClient";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Social Media Carousel Builder | Create Instagram & LinkedIn Carousels",
  description: "Create professional social media carousels in seconds. Choose from premium templates, customize with AI, and export as high-quality PNG or PDF. No design skills required.",
  keywords: [
    "carousel builder",
    "instagram carousel maker",
    "linkedin carousel generator",
    "social media design tool",
    "free carousel creator",
    "canva alternative for carousels"
  ],
  alternates: {
    canonical: "https://tools.mubarak.design/design/free-social-media-carousel-builder",
  },
};

export default function CarouselBuilderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Social Media Carousel Builder",
    "operatingSystem": "Any",
    "applicationCategory": "DesignApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "A professional, browser-based tool for creating multi-slide carousels for social media platforms."
  };

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
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Free Social Media <span className="text-blue-600">Carousel Builder</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                Design stunning, multi-slide carousels for Instagram, LinkedIn, and TikTok. 
                High-conversion templates, continuous backgrounds, and easy export.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CarouselBuilderClient />
      </div>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-blue max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Master the Art of Social Carousels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why are carousels better than single posts?</h3>
                <p className="text-gray-600 leading-relaxed">
                    Carousels are known to have up to **3.1x higher engagement** than static images. They encourage users to spend more time on your post, signaling to algorithms that your content is valuable. This tool helps you capture that engagement without needing a graphic designer.
                </p>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">The "Continuous Background" Advantage</h3>
                <p className="text-gray-600 leading-relaxed">
                    Our unique background system allows patterns like waves, dots, and arrows to flow across slide boundaries. This visual continuity subconsciously drives the user to keep swiping until the end, significantly increasing your completion rate.
                </p>
            </div>
          </div>

          <div className="mt-16 bg-blue-50 rounded-3xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Expert Carousel Checklist</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-blue-800 font-medium font-sm">Hook title on Slide 1</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-blue-800 font-medium font-sm">Consistent color palette</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-blue-800 font-medium font-sm">Readable font sizes</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                    <span className="text-blue-800 font-medium font-sm">Clear CTA on the last slide</span>
                </li>
            </ul>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-gray-900">Is this tool really free?</h4>
                    <p className="text-gray-600">Yes! This carousel builder is a free utility for creators and marketers. You can design and export as many carousels as you want without a subscription.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">What are the best dimensions for Instagram carousels?</h4>
                    <p className="text-gray-600">Instagram supports square (1:1) and portrait (4:5). Our tool supports both formats with high-resolution export.</p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
