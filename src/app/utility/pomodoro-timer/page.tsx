import Link from "next/link";
import type { Metadata } from "next";

import PomodoroTimer from "@/app/utility/pomodoro-timer/components/PomodoroTimer";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/pomodoro-timer";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the Pomodoro Technique?",
    answer:
      "The Pomodoro Technique is a highly popular time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break down work into completely focused intervals (traditionally 25 minutes long), separated by short breaks.",
  },
  {
    question: "Does the timer run if I switch tabs?",
    answer:
      "Yes, the timer uses your browser's precise internal clock to continue counting down exactly even if you switch tabs or minimize the browser window.",
  },
  {
    question: "What should I do during a break?",
    answer:
      "During a 5-minute break, avoid looking at screens. Stand up, stretch, get a glass of water, or look out a window. During a 15-minute long break, take a full walk, make coffee, or read a book chapter.",
  },
  {
    question: "Will it play a sound when the time is up?",
    answer:
      "Yes, a clear but gentle notification chime will play through your device's speakers or headphones when the countdown reaches zero so you don't have to watch the clock.",
  },
];

export const metadata: Metadata = {
  title: "Pomodoro Timer | Free Online Focus & Break Tracker",
  description:
    "Free online Pomodoro Timer. Boost your productivity with 25-minute focus sprints, 5-minute short breaks, and audio notifications. Start focused work now.",
  keywords: [
    "pomodoro timer",
    "focus timer",
    "25 minute timer",
    "productivity timer",
    "online stopwatch",
    "tomato timer online",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Pomodoro Timer Online",
    description:
      "Boost your productivity with a clean, ad-free Pomodoro focus timer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Timer",
    description:
      "Free online Pomodoro Timer with alarm audio and break tracking.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pomodoro Timer",
    url: PAGE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires Web Audio API and JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A fast, distraction-free productivity timer using the Pomodoro technique for strict work and rest intervals.",
    featureList: [
      "25-minute work interval",
      "5 and 15 minute break cycles",
      "Web Audio API notification chime",
      "Background tab tracking",
    ],
  };
}

export default function PomodoroTimerPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Pomodoro Timer", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/utility" className="hover:text-primary">Utility</Link></li>
            <li>/</li>
            <li className="text-foreground">Pomodoro Timer</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Productivity
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Pomodoro Timer
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Boost your daily output by breaking work into intensely focused 25-minute sprints. Get notified when it's time to take a break and step away from the screen.
          </p>
        </div>
      </section>

      <PomodoroTimer />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why Does the Pomodoro Technique Work?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Humans are not built to stare at screens and concentrate on complex tasks for 8 hours uninterrupted. Attempting to force continuous focus leads to burnout, rapid task-switching, and extreme procrastination.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            By strictly limiting your work window to just 25 minutes, your brain registers the task as a highly achievable sprint rather than an exhausting marathon. Knowing that a break is guaranteed shortly reduces the urge to check social media or email. When the alarm sounds, the mandatory 5-minute break resets your attention span, ensuring you remain highly productive across the entire day.
          </p>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
    </div>
  );
}
