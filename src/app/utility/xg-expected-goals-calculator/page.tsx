import Link from "next/link";
import type { Metadata } from "next";

import ShotCalculator from "./components/ShotCalculator";
import XGExplainer from "./components/XGExplainer";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection, PrivacyNote } from "@/components/tools/ToolPageScaffold";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl, SITE_NAME, buildMetadata } from "@/lib/seo/metadata";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/utility/xg-expected-goals-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good xG per game?",
    answer:
      "It depends on the league and style, but many top-flight teams average roughly 1.2–1.6 xG per match in attack. A single game can swing wildly; xG is more reliable over 10–20 matches. Defensive strength matters too—good teams often limit opponents to under 1.0 xG against.",
  },
  {
    question: "What does 0.79 xG mean?",
    answer:
      "About a 79% chance of scoring if that chance were repeated many times under similar conditions. Penalty kicks are often valued near 0.76–0.79 in public xG models (exact values differ slightly by provider). It is not a guarantee—roughly one in four or five penalties is still missed in real data.",
  },
  {
    question: "Is xG the same as expected goals?",
    answer:
      "Yes. xG is simply the abbreviation for expected goals—the same metric. Analysts and broadcasters use xG as shorthand in stats graphics and articles.",
  },
  {
    question: "What is xGA in football?",
    answer:
      "xGA means expected goals against: the quality of chances your team allows defensively, expressed as how many goals those chances would typically produce. Lower xGA usually indicates a stronger defensive record in chance-quality terms, independent of goalkeeper heroics or luck.",
  },
  {
    question: "What is npxG?",
    answer:
      "npxG is non-penalty expected goals—open-play (and non-penalty set-piece) chance quality without penalties. It is useful when you want to compare attacking output without penalties skewing the totals, since penalties carry a much higher baseline xG per shot.",
  },
  {
    question: "Why is my team's xG higher than their goals?",
    answer:
      "That usually means underperformance versus the average finisher: weaker finishing, excellent opposing goalkeeping, or random variance over a small sample. Over a full season, teams often move closer to their xG totals, but elite strikers can sustainably outperform xG while others lag.",
  },
  {
    question: "What is the highest xG ever recorded for a single shot?",
    answer:
      "Penalties and open-goal tap-ins receive the highest values—often in the high 0.7s to 0.9+ depending on the model. There is no single universal number because each provider uses different features and calibration; always compare shots within one model or source.",
  },
  {
    question: "How accurate is xG?",
    answer:
      "xG is well calibrated over large samples: across thousands of shots, goal rates align closely with the sum of xG. Single shots and single matches are noisy. Different vendors assign different xG to the same chance, so treat exact decimals as estimates, not physics.",
  },
  {
    question: "What does xG mean in football and soccer?",
    answer:
      "Football and soccer are the same sport; xG means expected goals in both. It is a probability (0 to 1) for a shot becoming a goal based on factors like distance, angle, body part, and how the chance was created.",
  },
  {
    question: "What is a good team xG in one match?",
    answer:
      "There is no single perfect number, but many teams finish a normal match somewhere around 1.0 to 2.5 xG. Totals below that often suggest a low-chance game, while higher totals usually reflect a more open match with better scoring opportunities.",
  },
  {
    question: "Is this expected goals calculator free?",
    answer:
      "Yes. The xG calculator runs in your browser with no sign-up. Adjust the pitch position, shot type, assist type, pressure, and situation to see how modeled probability changes.",
  },
];

const baseMetadata = buildMetadata({
  title: "xG Calculator — Expected Goals Football & Soccer Tool",
  description:
    "Calculate the expected goals (xG) value of any football shot. Interactive pitch tool — adjust distance, angle, shot type, pressure and assist type. Free, instant, no sign-up.",
  path: PAGE_PATH,
});

export const metadata: Metadata = {
  ...baseMetadata,
  keywords: [
    "xG calculator football",
    "expected goals calculator",
    "what is xG in football",
    "xG football explained",
    "how is xG calculated",
    "xG value by position",
    "penalty xG value",
    "expected goals soccer",
    "xG meaning football",
    "what does xG mean",
    "xG calculator soccer",
    "calculate xG from shot position",
  ],
};

function buildXgCalculatorSoftwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Expected Goals (xG) Calculator",
    url: PAGE_URL,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free expected goals (xG) calculator for football and soccer. Interactive pitch, heatmap, presets, and parameters for shot type, assist, and pressure.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    featureList: [
      "Interactive pitch shot placement",
      "xG heatmap visualization",
      "Shot type and assist modelling",
      "Defensive pressure and situation factors",
      "Instant xG readout",
    ],
  };
}

function buildXgHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use the xG calculator",
    description:
      "Calculate expected goals (xG) from shot position and situation using the interactive football and soccer pitch tool.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        name: "Place the shot on the pitch",
        text: "Click the pitch to set the shooter location. Distance and angle to goal drive the base xG before other modifiers.",
      },
      {
        "@type": "HowToStep",
        name: "Choose shot type and assist type",
        text: "Select shot type (foot, header, volley, penalty) and how the chance was created (through ball, cross, cutback, rebound, etc.).",
      },
      {
        "@type": "HowToStep",
        name: "Set pressure and game situation",
        text: "Adjust defensive pressure and situation such as open play, counter-attack, or set piece to reflect the context of the chance.",
      },
      {
        "@type": "HowToStep",
        name: "Read the xG value",
        text: "Review the final xG figure and breakdown to see how each factor increased or decreased scoring probability.",
      },
    ],
  };
}

export default function ExpectedGoalsCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "xG Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      <JsonLd data={serializeJsonLd(buildXgCalculatorSoftwareJsonLd())} />
      <JsonLd data={serializeJsonLd(buildXgHowToJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/utility" className="hover:text-primary">
                Utility
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">xG Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Football & soccer analytics
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            xG Calculator — Expected Goals for Football & Soccer
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Place the shot on the interactive pitch below to instantly calculate the expected goals (xG) value based on distance, angle, and situation.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            xG = the probability a shot becomes a goal. Example: 0.30 xG means about a 30% chance of scoring from a similar chance.
          </p>
          {currentTool ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p> : null}
          <p className="mt-4 rounded-[1rem] border border-amber-300/40 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            This calculator uses an educational xG model for learning and scenario comparison. Values can differ from professional data providers.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <div className="mt-2">
        <ShotCalculator />
      </div>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <XGExplainer />
      </section>

      <section className="space-y-4 max-w-4xl">
        <p className="text-base leading-7 text-muted-foreground">
          If you are searching for <strong>what is xG in football</strong> or <strong>xG meaning football</strong>, the sections
          below explain the idea; the interactive tool shows how distance, angle, shot type, assist, and pressure move the
          number in practice.
        </p>
        <p className="text-base leading-7 text-muted-foreground">
          <strong>How is xG calculated</strong> in real models? Providers train on huge shot databases so each attempt gets
          a probability between 0 and 1. This page uses a transparent, educational model—ideal for comparing scenarios and
          learning <strong>xG football explained</strong>-style intuition, not for replacing proprietary league data.
        </p>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is xG (Expected Goals)?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Expected goals (xG) assigns each shot a probability between 0 and 1, representing how often a similar chance is
            scored in historical data. It never says &quot;will score&quot;; it says &quot;would score about this fraction of
            the time.&quot; Analysts use it to measure chance quality instead of only counting shots.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Key inputs in most models include where the shot was taken (distance and angle to goal), the body part (foot,
            header, etc.), how the ball arrived (through ball, cross, cutback, set piece), and the attacking context (stable
            possession, rebound, counter-attack). The exact blend depends on the provider—that is why two sites can show
            slightly different xG for the same clip.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How xG is calculated</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Conceptually, models learn patterns from thousands of past shots. Closer central shots earn higher xG than
            wide or long-range efforts. Headers and difficult volleys usually sit below clean foot shots from the same
            spot. Assists matter: a through ball that breaks the defensive line often raises xG, while a floated cross can
            lower it because the finish is harder. Game situation—open play, fast break, or crowded set piece—also shifts the
            baseline. Professional systems add richer data (player speed, goalkeeper position, etc.); this calculator keeps
            the logic readable while still reflecting those main ideas.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to use this calculator</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7 text-muted-foreground">
            <li>
              <strong>Click the pitch</strong> to place the shot. The tool infers distance and angle to goal from that point.
            </li>
            <li>
              <strong>Set shot type</strong> (e.g. strong foot, header, volley, penalty) and <strong>assist type</strong>{" "}
              (through ball, cross, rebound).
            </li>
            <li>
              <strong>Adjust defensive pressure</strong> and <strong>game situation</strong> to match the moment.
            </li>
            <li>
              <strong>Read the xG value</strong> and factor list to see what raised or lowered the probability.
            </li>
            <li>
              Optional: toggle the <strong>xG heatmap</strong> to visualize how modeled danger changes across the final third.
            </li>
          </ol>

          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">Worked examples</h3>
          <ul className="mt-3 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong>Penalty:</strong> Select penalty as the shot type. You should see a very high xG— broadly in line with
              a <strong>penalty xG value</strong> near 0.76–0.79 in many public models.
            </li>
            <li>
              <strong>Central six-yard tap-in:</strong> Click next to the goal mouth with a foot shot and a cutback or square
              pass. xG should jump into &quot;big chance&quot; territory.
            </li>
            <li>
              <strong>Long-range wide shot:</strong> Place the marker 25+ yards out toward the sideline, add heavy pressure and
              a header if appropriate. xG should collapse toward speculative levels.
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">xG reference values</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Benchmarks vary by league and model; use this table as a rough guide for Googlers comparing chance types.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-border text-left text-foreground">
                  <th className="px-3 py-2">Shot type</th>
                  <th className="px-3 py-2">Typical xG</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Penalty kick", "~0.79"],
                  ["One-on-one with goalkeeper", "~0.45–0.60"],
                  ["Header from cross, six-yard box", "~0.15–0.25"],
                  ["Long-range shot (25+ yards)", "~0.02–0.05"],
                  ["Header from corner", "~0.05–0.09"],
                ].map(([a, b], i) => (
                  <tr key={a} className={i % 2 === 0 ? "bg-background/60" : ""}>
                    <td className="px-3 py-2 text-foreground">{a}</td>
                    <td className="px-3 py-2">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What does my xG result mean?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Interpreting a single output helps answer searches like <strong>what does xG mean</strong> in plain language:
          </p>
          <ul className="mt-3 space-y-2 text-base leading-7 text-muted-foreground">
            <li>
              <strong>Under 0.10</strong> — low-quality or speculative chance; goals from here are memorable, not expected.
            </li>
            <li>
              <strong>0.10–0.25</strong> — moderate chance; many match goals live here when volume adds up.
            </li>
            <li>
              <strong>0.25–0.50</strong> — high-quality opportunity; missing hurts expected points.
            </li>
            <li>
              <strong>Above 0.50</strong> — big chance; a miss is a major event in xG terms.
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            xGA, npxG, and xGOT — related metrics explained
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong>xGA (expected goals against)</strong> sums the xG of shots a team allows. It describes defensive chance
            quality independent of saves and luck—pair it with actual goals conceded to judge goalkeeping and variance.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong>npxG (non-penalty xG)</strong> removes penalties from attacking xG so you can compare open-play creation
            fairly. It is standard when discussing build-up play versus spot-kick reliance.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong>xGOT (expected goals on target)</strong> starts from shots that hit the target and adjusts for placement
            and shot execution—rewarding corners and punishing weak strikes from good positions. It complements classic xG when
            discussing finishing skill.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Using xG to analyse a full match (football & soccer)
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Match totals aggregate every shot. If Liverpool finish with 2.3 xG and Arsenal 1.8 xG, the story is chance
            volume and quality—not guaranteed scorelines. Bettors and fantasy managers sometimes stack team xG with implied
            goal markets: higher combined xG often aligns with more goalmouth action, but red cards, game state, and finishing
            streaks still swing real results.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Concrete hypotheticals: (1) 2.4 vs 0.7 xG — dominant attacking display versus few clear looks; (2) 1.1 vs 1.0 xG —
            even on chances despite a 3-0 score (finishing variance); (3) low xG win — last-minute long shot; celebrate the
            points but expect regression if xG stays low. This framing is what analytics communities link to when they share
            match reports.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            xG overperformance and underperformance
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Teams and players routinely score more or fewer goals than their xG. Elite finishers and aggressive pressing can
            outperform; cold streaks, injuries, and elite shot-stopping can underperform. Over many shots, totals usually
            drift toward xG, but talent matters—some forwards sustainably beat their xG.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Example: imagine a Premier League side ends the season with 56 goals from about 80 xG. That is roughly 24 goals of
            underperformance—often described as poor finishing, exceptional opposing keepers, or bad luck. The reverse (more
            goals than xG) fuels narratives about clutch finishing and regression debates in fan forums and betting circles.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">xG by position</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong>xG value by position</strong> is not one number—strikers accumulate more xG because they shoot closer to
            goal, while full-backs add smaller chunks from crosses. Midfielders can lead xG assisted without topping shot xG.
            Always separate shot xG from chance creation (xA) when comparing roles.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">League context</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In major leagues, any single shot averages roughly a one-in-ten chance of scoring—team match totals often land
            near 2.0–3.0 combined xG depending on style. Elite attacks might average north of 1.3 xG per 90 while relegation
            battles see lower open-play volume. Use league-specific dashboards for precision; this page focuses on per-shot
            intuition.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Using xG for predictions and markets</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Modellers map xG to goal lines and both-teams-to-score props by simulating matches thousands of times. If
            pre-match xG projections imply 2.7 total goals, over 2.5 goals may look fair value—provided you trust the inputs
            and adjust for injuries, motivation, and weather. This calculator does not place bets; it helps you reason about
            chance quality before you apply any staking strategy.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">History of xG</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Academic discussion of expected goals-style ideas appeared by the 1990s—notably work such as Vic Barnett and Sarah
            Hilditch&apos;s 1993 paper on football scoring probabilities. The modern metric evolved through blogging and
            analytics communities in the 2000s and 2010s, with contributors like Howard Hamilton (2009) and Sander Ijtsma
            (2011) helping popularise transparent shot models before clubs and broadcasters adopted xG worldwide.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Limitations of xG</h2>
          <ul className="mt-3 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Most models do not see goalkeeper positioning in real time.</li>
            <li>Shot power, curl, and jump height are simplified or absent.</li>
            <li>Small samples (one match, one player) are noisy—read trends, not single decimals.</li>
            <li>Providers disagree on the same chance; compare like with like.</li>
          </ul>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Stating these limits upfront answers skeptical searches (<strong>is xG accurate</strong>, <strong>xG criticism</strong>)
            and matches how professional analysts caveat their work.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Related tools</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Analysing commentary or exports? Try the{" "}
            <Link href="/text/character-counter" className="font-medium text-primary hover:underline">
              character counter
            </Link>
            ,{" "}
            <Link href="/utility/statistics-calculator" className="font-medium text-primary hover:underline">
              statistics calculator
            </Link>
            , or{" "}
            <Link href="/utility/probability-calculator" className="font-medium text-primary hover:underline">
              probability calculator
            </Link>
            . Browse every free app from the{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              homepage
            </Link>{" "}
            or the{" "}
            <Link href="/utility" className="font-medium text-primary hover:underline">
              utility tools hub
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">xG calculator FAQ</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Quick answers for common questions about expected goals (xG) in football and soccer.
        </p>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
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
