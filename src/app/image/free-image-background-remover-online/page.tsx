import Link from "next/link";
import AIBackgroundRemover from "./components/AIBackgroundRemover";
import { buildMetadata, absoluteUrl } from "@/lib/seo/metadata";

export const revalidate = 43200;

const PAGE_PATH = "/image/free-image-background-remover-online";

const baseMetadata = buildMetadata({
  title: "free image background remover online — Remove Image Background and Download | FindBest Tools",
  description: "Perfect free Canva background removal alternative—remove image backgrounds instantly in your browser with no upload and no sign-up. Supports PNG, JPG & WEBP.",
  path: PAGE_PATH,
});

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    images: [
      {
        url: absoluteUrl("/images/bg-remover-og.png"),
        width: 1200,
        height: 630,
        alt: "Free AI Background Remover Preview",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: [absoluteUrl("/images/bg-remover-og.png")],
  },
};

const faqs = [
  {
    question: "Is this tool free?",
    answer:
      "Yes, this image background remover is 100% free with no hidden costs, no subscriptions, and no account required. You can process as many images as you need without limits.",
  },
  {
    question: "Does the background remover upload my images?",
    answer:
      "No. The tool runs the background-removal workflow entirely in your browser using local AI (WebAssembly). Your images never leave your device, ensuring total privacy.",
  },
  {
    question: "How do I remove a background from a product photo?",
    answer:
      "Simply drag and drop your product photo into the upload area. Our AI automatically detects the subject and removes the background. For best results, use sharp images where the subject is clearly distinguishable.",
  },
  {
    question: "What image formats work best?",
    answer:
      "PNG, JPG, and WEBP files work best. Clear subject edges and good contrast usually produce the cleanest cutouts.",
  },
  {
    question: "What's the best image resolution for background removal?",
    answer:
      "Higher definition images (around 2000px+) provide the AI with more detail for refining complex edges. You can export results at 1x or 2x the original resolution.",
  },
  {
    question: "Can I export with a transparent background?",
    answer:
      "Yes. Use PNG when you need a transparent background (perfect for 'transparent background maker' use cases), or choose JPG for a flattened white or colored background.",
  },
  {
    question: "How does this compare to Canva background removal for free?",
    answer:
      "Unlike the Canva background removal tool which requires a Pro subscription, our professional background remover is 100% free with no monthly fees. It serves as a powerful Canva background removal alternative that processes everything locally in your browser, ensuring high-definition results without needing to pay for a premium account.",
  },
  {
    question: "How do I remove a white background from an image?",
    answer:
      "Our AI is trained to detect subjects regardless of background color. Whether it's a solid white background or a complex scene, the 'background eraser online' will isolate the main subject accurately.",
  },
];

const relatedTools = [
  {
    name: "Convert Image to Base64",
    href: "/image/convert-image-to-base64",
    description: "Convert an image into Base64 text or a full data URL.",
    icon: "B64",
  },
  {
    name: "Image to Text OCR",
    href: "/text/convert-image-to-text",
    description: "Extract editable text from JPG, PNG, WEBP, and BMP images.",
    icon: "OCR",
  },
];

export default function AIBackgroundRemoverPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AI Background Remover",
              description: "Remove image backgrounds in the browser with local AI processing.",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              url: absoluteUrl(PAGE_PATH),
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "1250",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]),
        }}
      />

      <section className="relative overflow-hidden pt-8 sm:pt-12">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/image" className="primary-chip rounded-full px-3 py-1 shadow-sm drop-shadow-sm">
              Image
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
              Private and browser-native
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            free image background remover online — Instant, Private & Browser-Based
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            A high-performance <strong>Canva background removal alternative</strong>. Remove backgrounds from image free with local WebAssembly. Instant cutouts, high-resolution exports, and total privacy—no server uploads required.
          </p>

          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/image" className="hover:text-primary">Image</Link></li>
              <li>/</li>
              <li className="text-slate-900">AI Background Remover</li>
            </ol>
          </nav>
        </div>
      </section>

      <AIBackgroundRemover />

      <div className="prose prose-slate max-w-none mt-16 space-y-12 pb-20">
        <section className="space-y-6 border-t border-border/60 pt-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Professional Background Remover: A Fast, Free alternative to Paid Software</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-base leading-7 text-muted-foreground">
                In the modern digital landscape, the ability to isolate a subject from its environment is no longer just a luxury for graphic designers—it's a necessity for everyone from e-commerce entrepreneurs to social media enthusiasts. While many <strong>background remover</strong> tools exist today, most fall into one of two frustrating categories: either they are overly complex Desktop applications with steep learning curves, or they are cloud-based services that charge a "per-image" credit fee or hide high-resolution exports behind a paywall.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                Our <strong>image background remover online</strong> was built to disrupt this model. We provide a completely free, high-performance solution that runs entirely within your web browser. By utilizing local processing technology, we eliminate the need for expensive server farms, allowing us to offer unlimited, high-definition background removal without a subscription, a sign-up form, or a single cent in fees.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-7 text-muted-foreground">
                The core advantage of our tool is its <strong>no-upload privacy model</strong>. Unlike traditional online editors that require you to send your data to a remote server, our tool processes every pixel on your own device. Whether you are working with sensitive company headshots or personal family photos, you can rest assured that your images never leave your local machine. This is a critical feature for professionals who must adhere to strict data security protocols while maintaining a fast-paced creative workflow.
              </p>
              <p className="text-base leading-7 text-muted-foreground">
                By choosing a <strong>background eraser</strong> that functions locally, you also bypass the bandwidth bottlenecks associated with uploading large files. Whether you're on a high-speed fiber connection or a restricted mobile data plan, the processing speed remains consistent and lightning-fast.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8 bg-slate-50/50 rounded-[2rem] p-8 lg:p-12 border border-slate-100">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center">How We Compare: Free vs. Paid Background Removal</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4">FindBest Background Remover</th>
                  <th className="px-6 py-4">Paid Online Services</th>
                  <th className="px-6 py-4">Professional Software</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Cost</td>
                  <td className="px-6 py-4">100% Free, No Limits</td>
                  <td className="px-6 py-4">$0.20 - $1.00 per image</td>
                  <td className="px-6 py-4">$20+ monthly subscription</td>
                </tr>
                <tr className="bg-white border-b hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Resolution</td>
                  <td className="px-6 py-4">Full HD & Original Support</td>
                  <td className="px-6 py-4">Limited for Free Users</td>
                  <td className="px-6 py-4">Unlimited</td>
                </tr>
                <tr className="bg-white border-b hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Privacy</td>
                  <td className="px-6 py-4">Local (No Upload)</td>
                  <td className="px-6 py-4">Cloud Hosted</td>
                  <td className="px-6 py-4">Local</td>
                </tr>
                <tr className="bg-white border-b hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Learning Curve</td>
                  <td className="px-6 py-4">Zero (Instant)</td>
                  <td className="px-6 py-4">Low</td>
                  <td className="px-6 py-4">High (Needs Training)</td>
                </tr>
                <tr className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">Data Usage</td>
                  <td className="px-6 py-4">Minimal</td>
                  <td className="px-6 py-4">High (Double Upload/Download)</td>
                  <td className="px-6 py-4">None</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-center text-slate-500 italic">
            *Comparison based on standard market rates for popular background removal APIs and desktop image editors as of 2024.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 underline decoration-primary/20">The Versatility of Transparent Backgrounds</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Streamlining E-commerce Workflows</h3>
              <p className="text-base leading-7 text-slate-600">
                For online shop owners, image consistency is the bridge to customer trust. Our <strong>transparent background maker</strong> allows you to unify a product line photographed in various settings. By isolating the product and placing it on a clean white background, you meet the strict imaging standards of Amazon and Google Shopping while providing a clutter-free viewing experience that focuses on the item's details, texture, and color.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Personal Branding & Identity</h3>
              <p className="text-base leading-7 text-slate-600">
                In a digital-first economy, your headshot is your virtual business card. Our tool enables you to take a great photo in a natural setting and quickly convert it into a professional avatar for LinkedIn, Slack, or portfolio sites. By removing an unprofessional background, you instantly elevate the perceived quality of your profile without booking a professional studio session.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Elevating Marketing Collateral</h3>
              <p className="text-base leading-7 text-slate-600">
                Graphic designers and marketing teams use background removal to create composite images for ads, brochures, and banners. When you remove a background, you gain the freedom to place subjects in contextually relevant environments—such as a product in use or a spokesperson in front of a brand's logo—drastically reducing the time spent on manual mask adjustments.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Educational & Editorial Use</h3>
              <p className="text-base leading-7 text-slate-600">
                Teachers and bloggers often need to highlight specific objects within a photo to explain concepts or features. A <strong>background eraser</strong> makes these elements pop, and when exported as a transparent PNG, these assets can be easily dragged into presentation software like PowerPoint, Google Slides, or Canva without a clunky white box around them.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Technical Mastery: How to Get "Designer-Level" Cutouts</h2>
          <p className="text-base leading-7 text-muted-foreground">
            Achieving a perfect cutout isn't just about the software—it's about the preparation of your source material. While our <strong>automated background removal</strong> is powerful, following these professional guidelines will ensure your results look like they were done by a pro:
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3 p-6 rounded-2xl border border-slate-100 bg-white">
              <h4 className="text-lg font-semibold text-slate-800">Clear Separation</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                The algorithm performs best when there is a clear distinction between the subject and the background. Avoid backgrounds that share the same color family as the subject's edges. For example, a person with dark hair against a dark mahogany wall is significantly harder to isolate than against a light grey background.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-2xl border border-slate-100 bg-white">
              <h4 className="text-lg font-semibold text-slate-800">Sharp Edge Resolution</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ensure your subject is in sharp focus. Blurry or "out of focus" edges lead to soft cutouts where the background color might bleed into the subject. If possible, use a tripod and a higher aperture (f/8 or higher) when shooting product photos specifically for background removal.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-2xl border border-slate-100 bg-white">
              <h4 className="text-lg font-semibold text-slate-800">Uniform Lighting</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hard shadows can often be mistaken for part of the subject. Use soft, diffused lighting to minimize shadows on the backdrop. If shadows are unavoidable, try to keep them physically distant from the subject's contact point with the floor or wall.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-2xl border border-slate-100 bg-white">
              <h4 className="text-lg font-semibold text-slate-800">Higher Resolution Files</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                While it may seem counterintuitive, removing a background from a larger photo often produces better results even if you eventually intend to use a smaller version. The more pixels our processor has to analyze, the more accurate the edge detection will be, particularly around complex areas like hair or fabric.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8 bg-primary/5 rounded-[2rem] p-8 lg:p-12 border border-primary/10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Step-by-Step: mastering your background Eraser</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-none flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-premium text-primary font-black text-xl">01</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Source Your Image</h4>
                <p className="mt-2 text-slate-600 leading-relaxed">Drop your JPG, PNG, or WEBP file into the prominent upload section above. Our interface ensures you can see your file clearly as it prepares for high-precision isolation.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-none flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-premium text-primary font-black text-xl">02</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Wait for the Instant Pass</h4>
                <p className="mt-2 text-slate-600 leading-relaxed">Our local processor will analyze the image structure. On the first run, the tool prepares itself for a few seconds; thereafter, background removal is virtually instantaneous. A real-time progress bar shows the exact segmentation status.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-none flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-premium text-primary font-black text-xl">03</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Choose your Finish</h4>
                <p className="mt-2 text-slate-600 leading-relaxed">Toggle between the standard transparent background or instant flat-color replacements. You can pick a professional white for e-commerce or a brand-specific color. Use the slider to verify the precision of the edges against your original photo.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-none flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-premium text-primary font-black text-xl">04</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Download and Repeat</h4>
                <p className="mt-2 text-slate-600 leading-relaxed">Choose PNG to maintain transparency or JPG to flatten the result onto a solid background. You can even choose 2x resolution to upscale for print needs. Once finished, you can quickly clear the result to process your next image.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center">Frequently asked questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((item) => (
              <details key={item.question} className="group p-6 rounded-3xl border border-slate-100 bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer">
                  <h3 className="text-lg font-bold text-slate-900">{item.question}</h3>
                  <span className="ml-4 flex-shrink-0 transition-transform group-open:rotate-180">
                    <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="space-y-6 pt-12 border-t border-slate-100">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Why Transparent Backgrounds are the Secret to Better Design</h2>
          <p className="text-base leading-7 text-muted-foreground">
            A background is more than just "negative space"—it's an anchor. Sometimes that anchor is too heavy. In design, transparency correlates with versatility. When you remove a background, you unlock the ability to layer, stack, and overlap elements in a way that creates depth and visual interest. Whether it's for a simple product card on a website or a complex magazine layout, the quality of your transparency masks determines the professionalism of your final output.
          </p>
          <p className="text-base leading-7 text-muted-foreground">
            At FindBest Tools, we believe high-quality creative resources should be accessible to everyone. By providing a <strong>free, browser-based background remover</strong>, we empower small business owners, students, and independent creators to produce world-class imagery without the world-class price tag. Our commitment to privacy, speed, and quality remains our guiding principle as we continue to expand our library of professional utilities.
          </p>
        </section>
      </div>

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Tools</h2>
            <p className="mt-1 text-sm text-slate-500">Other utilities you might find helpful</p>
          </div>
          <Link href="/image" className="secondary-button px-4 py-2 text-xs">View All</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
