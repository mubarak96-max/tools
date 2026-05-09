import { Metadata } from "next";
import { Calculator } from "@/components/navy-body-fat/Calculator";
import { ContentSection } from "@/components/navy-body-fat/ContentSection";
import { FAQSection } from "@/components/navy-body-fat/FAQSection";
import { AuthorBio } from "@/components/navy-body-fat/AuthorBio";

export const metadata: Metadata = {
  title: "US Navy Body Fat Calculator 2026 | Official Navy PRT Body Composition Calculator",
  description:
    "Official US Navy body fat calculator using OPNAVINST 6110.1J tape measurement standards. Calculate Navy PRT body fat percentage for males and females. Accurate Navy body composition assessment with height/weight and circumference measurements.",
  keywords: [
    "us navy body fat calculator",
    "navy body fat calculator",
    "navy prt body fat",
    "navy body composition calculator",
    "navy tape test calculator",
    "navy body fat standards",
    "navy prt calculator",
    "navy body fat percentage",
    "navy circumference body fat",
    "navy male body fat calculator",
    "navy female body fat calculator",
    "opnavinst 6110 body fat",
    "navy physical readiness test body fat",
    "navy bca calculator",
    "navy body fat chart",
  ],
  authors: [{ name: "Mubarak Mutesasira" }],
  openGraph: {
    title: "US Navy Body Fat Calculator | Official PRT Standards",
    description:
      "Calculate your Navy body fat percentage using official tape measurement protocols. Male and female standards with PRT readiness assessment.",
    type: "website",
    url: "https://findbest.tools/health/us-navy-body-fat-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Official US Navy Body Fat Calculator",
    description:
      "Accurate Navy PRT body composition calculator with tape measurement standards for males and females.",
  },
  alternates: {
    canonical: "https://findbest.tools/health/us-navy-body-fat-calculator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function NavyBodyFatCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://findbest.tools/health/us-navy-body-fat-calculator",
        url: "https://findbest.tools/health/us-navy-body-fat-calculator",
        name: "US Navy Body Fat Calculator 2026 | Official Navy PRT Body Composition Calculator",
        description:
          "Official US Navy body fat calculator using OPNAVINST 6110.1J tape measurement standards. Calculate Navy PRT body fat percentage for males and females.",
        isPartOf: { "@id": "https://findbest.tools" },
        about: { "@type": "Thing", name: "Navy Physical Fitness Assessment" },
      },
      {
        "@type": "SoftwareApplication",
        name: "US Navy Body Fat Calculator",
        applicationCategory: "HealthApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Official Navy tape measurement protocol",
          "Male and female body fat calculation",
          "Height-weight screening",
          "Body circumference measurements",
          "PRT readiness assessment",
          "Navy body fat standards compliance",
          "Age-adjusted maximums",
          "Measurement technique guide",
          "PDF export for records",
          "OPNAVINST 6110.1J compliant",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does the Navy calculate body fat percentage?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Navy calculates body fat using circumference-based measurements per OPNAVINST 6110.1J. For males: measure neck and abdomen circumference, then apply the formula: %Body Fat = 86.010 × log10(abdomen - neck) - 70.041 × log10(height) + 36.76. For females: measure neck, waist, and hip circumference, then apply: %Body Fat = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387.",
            },
          },
          {
            "@type": "Question",
            name: "What are the Navy body fat standards for 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Navy body fat maximums are age-adjusted. For males: ages 18-21 max 22%, 22-29 max 23%, 30-39 max 24%, 40+ max 26%. For females: ages 18-21 max 33%, 22-29 max 34%, 30-39 max 35%, 40+ max 36%. These standards apply to the Physical Readiness Test (PRT) body composition assessment.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if I fail the Navy body fat tape test?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Failing the Navy body fat assessment results in PRT failure and enrollment in the Fitness Enhancement Program (FEP). Repeated failures can lead to administrative separation from the Navy. Sailors who pass the PRT cardio and strength events but fail body composition receive an overall PRT failure score.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Measure Body Fat Using Navy Tape Test Protocol",
        step: [
          {
            "@type": "HowToStep",
            name: "Prepare for Measurement",
            text: "Wear minimal clothing. Do not exercise, eat, or drink within 2 hours of measurement. Stand relaxed with feet together and arms at sides.",
          },
          {
            "@type": "HowToStep",
            name: "Measure Neck (Male and Female)",
            text: "Measure neck circumference below the larynx (Adam's apple), perpendicular to the long axis of the neck. Round to nearest half inch.",
          },
          {
            "@type": "HowToStep",
            name: "Measure Abdomen (Male)",
            text: "Measure abdomen at the navel level, horizontal to the floor, at the end of a normal exhalation. Arms at sides, relaxed.",
          },
          {
            "@type": "HowToStep",
            name: "Measure Waist and Hip (Female)",
            text: "Measure waist at the narrowest point. Measure hips at the widest point of the buttocks. Both horizontal to floor.",
          },
          {
            "@type": "HowToStep",
            name: "Calculate Body Fat",
            text: "Enter measurements into the Navy body fat calculator. Compare result to age-adjusted standards. Record for PRT documentation.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-800/90" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-6">
                OPNAVINST 6110.1J Compliant
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-blue-400">US Navy</span>
                <span className="block">Body Fat Calculator</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                The official <strong className="text-white">US Navy body fat calculator</strong> using
                OPNAVINST 6110.1J tape measurement standards. Calculate your Navy PRT body composition
                percentage with accurate male and female circumference protocols. Know your status before
                the Physical Readiness Test.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                {[
                  "Official Navy Formula",
                  "Male & Female Standards",
                  "Age-Adjusted Max",
                  "PRT Readiness",
                  "Free & Private",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Calculator />
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ContentSection />
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <FAQSection />
          </div>
        </section>

        {/* Author Bio */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <AuthorBio />
        </section>
      </main>
    </>
  );
}
