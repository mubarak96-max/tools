import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import QuoteImageGeneratorClient from "./QuoteImageGeneratorClient";

const PAGE_PATH = "/utility/quote-image-generator-online";
const PAGE_URL = "https://findbest.tools/utility/quote-image-generator-online";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Quote Image Generator Online - Create Beautiful Quote Posts Free",
    description:
      "Create quote images online with Pixabay backgrounds, quote search, custom text, style controls, and one-click PNG download.",
    path: PAGE_PATH,
  }),
  keywords: [
    "quote image generator online",
    "quote post maker",
    "quote image maker",
    "quote generator with background",
    "pixabay quote image tool",
    "motivational quote image creator",
    "instagram quote post maker",
    "quote png generator",
  ],
};

function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Quote Image Generator Online",
    url: PAGE_URL,
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free online quote image generator with Pixabay backgrounds, built-in quote search, custom quote entry, style controls, and PNG export.",
    featureList: [
      "Pixabay image search",
      "Local image upload",
      "Quote search and custom quotes",
      "Text color, size, overlay, and format controls",
      "One-click PNG export",
    ],
  };
}

const faqItems = [
  {
    question: "Is this quote image generator really free?",
    answer:
      "Yes. The tool is free to use, requires no account, and exports PNG images directly from the browser.",
  },
  {
    question: "Can I use my own image instead of searching the library?",
    answer:
      "Yes. You can search the built-in background library or upload your own image from your device if you already have a photo, brand asset, or custom visual you want to use.",
  },
  {
    question: "Do I have to use the built-in quote search?",
    answer:
      "No. You can search for a quote if you want inspiration, but you can also type or paste your own quote and author line manually.",
  },
  {
    question: "Can I choose different output formats?",
    answer:
      "Yes. The editor supports square output for feed-style quote cards and 9:16 output for story-style vertical graphics.",
  },
  {
    question: "Will my uploaded image stay private?",
    answer:
      "Yes. The tool is designed so you can work quickly without sending your image through a long account or upload workflow. Your local image is used to generate the finished quote graphic directly in the editor.",
  },
  {
    question: "Can I use downloaded quote graphics commercially?",
    answer:
      "The tool itself does not add usage restrictions, but you should still review the terms for any source image and verify quote rights or attribution requirements for your specific use case.",
  },
];

export default function QuoteImageGeneratorOnlinePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Quote Image Generator Online", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faqItems);

  return (
    <div>
      <JsonLd data={serializeJsonLd(buildSoftwareApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <QuoteImageGeneratorClient />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Quote Creator Online
          </h2>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Create quote images in a few straightforward steps
          </h2>
          <p className="text-base leading-8 text-muted-foreground">
            This quote image generator is built to stay fast and uncomplicated. You choose a
            background, pick a quote or write your own, make a few style adjustments, and export a
            PNG directly from the browser. There is no account system, no handoff to a remote design
            editor, and no requirement to learn layers, masks, or canvas tools before you can make
            something useful.
          </p>
          <p className="text-base leading-8 text-muted-foreground">
            The goal is practical output. Sometimes that means a square quote card for a feed post.
            Sometimes it means a 9:16 vertical image for a story, reel cover, slide, or presentation
            opener. Either way, the workflow is meant to get from idea to finished graphic quickly.
          </p>
        </section>

        <section className="mt-14 space-y-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">Step 1: Choose your background image</h3>
            <p className="text-base leading-8 text-muted-foreground">
              The background sets the emotional tone before anyone reads the quote itself. You can
              search by subject, mood, or visual style and click any result to use it instantly. If
              you already have a specific image in mind, you can upload your own file instead of
              searching the built-in library.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              A good background usually has enough visual breathing room for text to sit clearly. Sky,
              water, shadow, walls, soft gradients in nature, and lightly detailed scenes tend to work
              well. Busy patterns and high-contrast textures can still be used, but they often need a
              stronger overlay to preserve readability.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              The tool also keeps the chosen crop centered in the preview. That matters more than it
              sounds, especially in square and vertical formats, where the wrong crop can make a usable
              image suddenly feel awkward or off-balance.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">Step 2: Choose a quote or write your own</h3>
            <p className="text-base leading-8 text-muted-foreground">
              You can search by keyword or author if you want inspiration, or skip the search entirely
              and write your own quote from scratch. That makes the tool useful for public quotes,
              original writing, presentation lines, campaign copy, workshop prompts, and personal
              notes you want to turn into something visual.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              The custom quote section lets you type or paste your own text and add an author line if
              you want one. That gives you complete control when the exact wording matters or when the
              quote you want to use is not something you plan to search for.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              Short quotes usually work best when you let them breathe. Medium-length quotes tend to be
              the most flexible. Longer text can still work, but it usually benefits from a smaller
              font size and a background that does not compete too aggressively with the words.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">Step 3: Style, preview, and download</h3>
            <p className="text-base leading-8 text-muted-foreground">
              After the background and quote are in place, you can adjust output format, text color,
              font size, and overlay strength. The editor supports square output and 9:16 output so you
              can make a standard quote post or a vertical story-style asset from the same flow.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              The preview updates in real time. What you see in the preview is what gets exported, which
              is important for legibility decisions like whether the overlay is dark enough or whether
              the text size feels balanced against the chosen crop.
            </p>
            <p className="text-base leading-8 text-muted-foreground">
              When the design looks right, you can download the finished image as a PNG and use it in
              feed posts, stories, slide decks, blog graphics, handouts, or anywhere else you need a
              clean quote visual.
            </p>
          </div>
        </section>

        <section className="mt-16 space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What this tool includes
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Searchable background library</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                The background library helps you get started quickly when you do not already have an
                image prepared. Search results stay compact in the editor so browsing does not take over
                the whole page, especially on mobile.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Local image upload</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                If you do not want to rely on a stock image at all, you can upload your own file from
                your device. That is useful for brand assets, team photography, product stills, event
                images, or custom art direction that a generic library search will never match.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Quote search plus manual input</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                The tool does not force a single workflow. You can browse quotes when you want ideas, or
                ignore the search completely and write your own text when you already know what you want
                to say.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Square and 9:16 formats</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                Format choice is not an afterthought. A quote that feels balanced in a square card may
                feel cramped in vertical format, and a strong vertical story layout can feel empty when
                forced into a square. Keeping both options in the editor makes it easier to produce the
                right output for the channel you actually plan to use.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Quick PNG download</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                The export flow is simple: make your quote image, check the preview, and download the
                result. That makes it practical for one-off graphics as well as repetitive content work.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">No account required</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                There is no signup wall between you and the editor. That matters for quick use cases:
                making a one-off slide image, testing several quote variations, building a few social
                assets, or turning a line into something shareable without opening a larger design tool.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Who this tool is for
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Social media creators</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                Quote graphics remain one of the simplest content formats to produce consistently. For
                creators working across Instagram, Pinterest, LinkedIn, or story-based channels, the
                combination of a quote source, a background picker, and a fast exporter is often enough
                to build a repeatable content flow.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Writers and bloggers</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                Strong lines disappear quickly inside long-form writing unless you give them a second
                life. Turning a paragraph highlight, article line, or newsletter hook into an image is a
                practical way to make written content more portable across channels.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Educators, coaches, and presenters</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                A well-framed quote can work as an opening slide, discussion prompt, workshop divider, or
                takeaway graphic. This tool is fast enough for preparation work and simple enough to use
                without turning slide prep into a design task.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Marketing and content teams</h3>
              <p className="mt-2 text-base leading-8 text-muted-foreground">
                Sometimes the job is not to produce the final campaign asset. It is to produce a usable
                first pass quickly. For early concepts, quote-led content, or lightweight branded posts,
                a simple browser tool can be more efficient than opening a heavyweight design workflow.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 space-y-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Why this tool feels easy to use
          </h2>

          <div className="space-y-5 text-base leading-8 text-muted-foreground">
            <p>
              The editor is built around the shortest possible path from idea to finished image. You do
              not need to move through a complicated template builder, open a separate design program, or
              manage a large number of controls before you can make something usable.
            </p>
            <p>
              The most important choices are surfaced first: background, quote, format, text color, font
              size, and overlay strength. That gives you enough control to make the image feel polished
              without forcing you into a full design workflow.
            </p>
            <p>
              The preview updates as you work, so the design process stays concrete. You are not guessing
              what the final result might look like after export. You can judge balance, readability, and
              crop directly in the editor.
            </p>
            <p>
              Overall, the tool is meant to solve one job well: turning a line of text into a clean,
              shareable quote image without unnecessary friction.
            </p>
          </div>
        </section>

        <section className="mt-16 space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Common questions about this quote image generator
            </h2>
          </div>

          <div className="space-y-8">
            {faqItems.map((faq) => (
              <article key={faq.question} className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{faq.question}</h3>
                <p className="text-base leading-8 text-muted-foreground">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 space-y-6 border-t border-border/60 pt-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Related Tools
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              More tools you might need next
            </h2>
            <p className="text-base leading-8 text-muted-foreground">
              If you are turning quotes into social content, these tools can help with resizing,
              character limits, and other supporting tasks.
            </p>
          </div>

          <div className="space-y-4 text-base leading-8">
            <p>
              <Link href="/utility/social-media-image-resizer" className="font-semibold text-primary hover:underline">
                Social Media Image Resizer
              </Link>
              {" "}helps you adapt finished graphics for platform-specific sizes when you need
              versions for feeds, stories, banners, or thumbnails.
            </p>
            <p>
              <Link href="/utility/social-media-character-counter" className="font-semibold text-primary hover:underline">
                Social Media Character Counter
              </Link>
              {" "}is useful when the quote image is part of a larger post and you want the caption,
              hook, or supporting copy to fit the channel cleanly.
            </p>
            <p>
              <Link href="/utility/aspect-ratio-calculator" className="font-semibold text-primary hover:underline">
                Aspect Ratio Calculator
              </Link>
              {" "}helps if you are planning crops or preparing source images before you bring them
              into the quote editor.
            </p>
            <p>
              <Link href="/design/free-social-media-carousel-builder" className="font-semibold text-primary hover:underline">
                Free Social Media Carousel Builder
              </Link>
              {" "}is the next step when a single quote card turns into a multi-slide visual post.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
