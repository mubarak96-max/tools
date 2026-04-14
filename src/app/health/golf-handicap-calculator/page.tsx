import type { Metadata } from "next";
import { GolfHandicapCalculator } from "./components/GolfHandicapCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/golf-handicap-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How many scores do I need to establish a handicap index?",
    answer:
      "Under the World Handicap System, you need a minimum of 54 holes of recorded scores to establish an initial Handicap Index. This can come from any combination of 18-hole or 9-hole rounds. Once established, your index is updated after every round you submit.",
  },
  {
    question: "What is the difference between a Handicap Index and a Course Handicap?",
    answer:
      "Your Handicap Index is a portable measure of your demonstrated ability, expressed to one decimal place (e.g., 14.2). A Course Handicap is the number of strokes you receive on a specific course, calculated by applying your Handicap Index to that course's Slope Rating and Course Rating. The same Handicap Index will produce different Course Handicaps on different courses.",
  },
  {
    question: "What is Slope Rating and why does it matter?",
    answer:
      "Slope Rating measures the relative difficulty of a course for a bogey golfer compared to a scratch golfer. It ranges from 55 to 155, with 113 being the standard (average) slope. A higher slope means the course is proportionally harder for higher-handicap players. Your Course Handicap is calculated by multiplying your Handicap Index by the Slope Rating divided by 113.",
  },
  {
    question: "How is a handicap differential calculated?",
    answer:
      "A handicap differential is calculated as: (Adjusted Gross Score − Course Rating) × 113 ÷ Slope Rating. The result is rounded to one decimal place. Your Handicap Index is then the average of the best 8 differentials from your most recent 20 scores, multiplied by 0.96.",
  },
  {
    question: "How do I use my handicap in stroke play vs. match play?",
    answer:
      "In stroke play, you subtract your full Course Handicap from your gross score to get your net score. In match play, the lower-handicap player receives zero strokes and the higher-handicap player receives the difference between the two Course Handicaps, allocated to the holes with the highest stroke index (SI) values on the scorecard.",
  },
];

export const metadata: Metadata = {
  title: "Golf Handicap Calculator | World Handicap System (WHS) Index",
  description:
    "Calculate your golf Handicap Index using the World Handicap System. Enter your scores, course rating, and slope rating to get your handicap differential and index.",
  keywords: [
    "golf handicap calculator",
    "World Handicap System calculator",
    "handicap index calculator",
    "golf handicap differential",
    "course rating slope rating",
    "WHS handicap",
    "golf net score calculator",
    "handicap index formula",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Golf Handicap Calculator | World Handicap System (WHS) Index",
    description:
      "Calculate your golf Handicap Index using the official World Handicap System formula with course rating and slope rating.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Golf Handicap Calculator | World Handicap System (WHS) Index",
    description:
      "Enter your scores, course rating, and slope to calculate your WHS Handicap Index and differentials.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Golf Handicap Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free golf Handicap Index calculator using the World Handicap System formula.",
    featureList: [
      "Handicap differential calculation",
      "Handicap Index from multiple scores",
      "Course Handicap conversion",
      "WHS-compliant formula",
    ],
  };
}

export default function GolfHandicapCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Golf Handicap Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Golf Handicap Calculator"
        description="Calculate your Handicap Index using the World Handicap System. Enter your adjusted gross scores, course rating, and slope rating to get your differentials and index."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is a golf Handicap Index?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A Handicap Index is a numerical measure of a golfer's demonstrated playing ability. It allows players of different skill levels to compete fairly against each other by expressing each player's potential as a portable, course-neutral number. The lower the index, the better the player — a scratch golfer has an index of 0.0, while a high-handicap recreational player might have an index of 28 or higher.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The key word is "demonstrated" — your Handicap Index reflects your best recent performances, not your average. Under the World Handicap System (WHS), the index is calculated from the best 8 differentials out of your most recent 20 scores. This means your index represents what you're capable of on a good day, not what you typically shoot. The practical effect is that your index is always slightly better than your average score would suggest.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The WHS was introduced in 2020 as a unified global standard, replacing six different regional systems (including the USGA Handicap System, the CONGU system used in Great Britain and Ireland, and others). Today, a Handicap Index issued in one country is recognized and usable anywhere in the world.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Course Rating and Slope Rating: the two numbers that matter</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Every rated golf course has two key numbers assigned by the national golf association: the <strong>Course Rating</strong> and the <strong>Slope Rating</strong>. Understanding both is essential to understanding how handicaps work.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>Course Rating</strong> is the expected score for a scratch golfer (0.0 handicap) playing the course under normal conditions. It's expressed to one decimal place — for example, 71.4. A course with a rating of 71.4 is expected to yield a score of 71.4 from a scratch player. Course Rating accounts for factors like length, obstacles, green speed, and prevailing wind.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>Slope Rating</strong> measures how much harder the course is for a bogey golfer (roughly 20 handicap) compared to a scratch golfer. It ranges from 55 (very easy) to 155 (very hard), with 113 defined as the standard average. A course with a slope of 130 is significantly harder for higher-handicap players relative to scratch players than a course with a slope of 100. This is why the same Handicap Index produces different Course Handicaps on different courses — a 10-index player gets more strokes on a high-slope course than on a low-slope course.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to calculate a handicap differential</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The handicap differential is the core calculation that converts a raw score into a course-neutral measure of performance. The formula is:
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground font-mono bg-muted/50 rounded-lg px-4 py-3">
              Differential = (Adjusted Gross Score − Course Rating) × 113 ÷ Slope Rating
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For example, if you shoot an adjusted gross score of 88 on a course with a rating of 71.4 and a slope of 125, your differential is: (88 − 71.4) × 113 ÷ 125 = 16.6 × 0.904 = 15.0. The "adjusted gross score" uses the maximum score per hole (net double bogey) to prevent one disastrous hole from inflating your differential excessively.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Once you have 20 recorded scores, your Handicap Index is calculated by taking the average of the best 8 differentials and multiplying by 0.96. The 0.96 multiplier (a 4% reduction) is a "bonus for excellence" that rewards consistent good play and keeps the index slightly below your average differential.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Using your handicap in stroke play and match play</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Before you can use your Handicap Index on a specific course, you need to convert it to a <strong>Course Handicap</strong> using the formula: Course Handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating − Par). The result is rounded to the nearest whole number.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              In <strong>stroke play</strong>, you subtract your full Course Handicap from your gross score to get your net score. If you shoot 92 with a Course Handicap of 18, your net score is 74. In competitions, net scores are compared across all players, allowing a 28-handicapper to compete meaningfully against a 5-handicapper.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              In <strong>match play</strong>, the lower-handicap player plays off scratch and the higher-handicap player receives the difference between the two Course Handicaps as strokes. These strokes are allocated to specific holes based on the stroke index (SI) printed on the scorecard — SI 1 is the hardest hole, SI 18 the easiest. A player receiving 5 strokes gets one extra shot on the five holes with SI 1 through 5.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The WHS also introduced a <strong>Playing Conditions Calculation (PCC)</strong> that adjusts differentials when course conditions on a given day were significantly easier or harder than normal. If many players score better than expected, the PCC adds up to +3 to all differentials from that day; if conditions were unusually tough, it can subtract up to −1. This prevents a single unusually easy day from artificially lowering everyone's index.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {faq.map((item) => (
                <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                </article>
              ))}
            </div>
          </>
        }
      >
        <GolfHandicapCalculator />
      </HealthToolPage>
    </>
  );
}
