import Link from "next/link";
import type { Metadata } from "next";
import InstagramResizer from "@/app/image/resize-photo-instagram-online/components/InstagramResizer";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { Instagram, Smartphone, Layout, Minimize2, CheckCircle2, ShieldCheck, Heart, Zap, History, Target } from "lucide-react";

export const revalidate = 43200;

const PAGE_PATH = "/image/resize-photo-instagram-online";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the correct image size for Instagram posts in 2026?",
    answer: "The standard Instagram post size is 1080 x 1080 px for square, 1080 x 1350 px for portrait (4:5), and 1080 x 566 px for landscape (1.91:1). Instagram displays all feed images at a maximum width of 1080px, so uploading anything larger just gives Instagram more to compress. Uploading at exactly 1080px wide gives you the sharpest result."
  },
  {
    question: "Does resizing reduce my photo quality?",
    answer: "Resizing down from a high-resolution original causes minimal quality loss, especially at the dimensions Instagram uses. The bigger quality risk is uploading the wrong size and letting Instagram resize it for you — that process is less careful than a dedicated resizing tool. Our tool exports at 95% JPEG quality, which is well above Instagram's internal compression threshold."
  },
  {
    question: "What's the best Instagram post size to get more engagement?",
    answer: "The 4:5 portrait format (1080 x 1350 px) consistently earns more engagement than square or landscape because it takes up more vertical space in the feed, giving it more screen time per scroll. If you're actively trying to grow your account, sizing your photos for Instagram in portrait orientation is one of the easiest, lowest-effort improvements you can make."
  },
  {
    question: "Can I resize a photo for Instagram without cropping it?",
    answer: "Yes — this is exactly what our tool does. Rather than cropping your image to fit the target dimensions, we fit your photo within the frame and fill the remaining space with a background color or blur of your choice. This is called letterboxing or pillarboxing, and it's a common technique used by photographers who don't want to lose any part of their original composition."
  },
  {
    question: "Is my photo uploaded to a server when I use this tool?",
    answer: "No. All processing happens entirely in your browser using the Canvas API. Your image is never sent to any server, which means it's completely private. This also makes the tool instant — there's no upload time, no queue, and no waiting."
  },
  {
    question: "What file formats can I upload?",
    answer: "You can upload JPG, PNG, WebP, and HEIC files. The tool exports as a high-quality JPEG, which is the format Instagram recommends for photos. PNG uploads are supported but will be converted to JPEG on export, as Instagram converts them anyway."
  },
  {
    question: "What's the minimum image size Instagram accepts?",
    answer: "Instagram requires a minimum width of 320px for feed posts. Anything below this will be rejected or heavily upscaled. For best results, always work with source images that are at least 1080px wide before resizing."
  }
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Resize Photo for Instagram 2026 | Free Online Tool (No Crop)",
    description:
      "Instantly resize any image for Instagram Square, Portrait, Story and Profile formats. Prevent compression, avoid cropping and maintain full quality. 100% Free.",
    path: PAGE_PATH,
  }),
  keywords: [
    "resize photo for instagram",
    "instagram photo resizer",
    "crop image instagram",
    "instagram image size 2026",
    "instagram post size",
    "instagram pic size",
    "square photo maker",
    "no crop instagram online",
    "instagram story resizer"
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Instagram Photo Resizer",
    url: PAGE_URL,
    applicationCategory: "ImageManipulationApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: "Instant browser-based photo resizer for Instagram Square, Portrait, Story, and Profile formats. supports Fit (no crop) and Fill (crop) modes.",
  };
}

export default function InstagramResizePage() {
  const faqJsonLd = buildFaqJsonLd(faq.map(f => ({ question: f.question, answer: f.answer })));

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Image Tools", path: "/image" },
            { name: "Instagram Resizer", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <div className="space-y-12 sm:space-y-16 pb-16">
        {/* Header Section */}
        <section className="relative overflow-hidden pt-10 sm:pt-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.1]">
              Resize Photo for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-orange-500">Instagram</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
              Instantly adjust your photos for Square, Portrait, or Story formats without losing quality. No sign-up, no watermark.
            </p>
          </div>
        </section>

        {/* Tool Section */}
        <section id="tool" className="px-4">
          <InstagramResizer />
        </section>

        {/* Info & SEO Section */}
        <div className="max-w-4xl mx-auto px-4 space-y-16 sm:space-y-20">
          
          {/* How It Works */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Upload Your Photo",
                icon: <Zap className="w-5 h-5" />,
                body: "Drag and drop any image — JPG, PNG, WebP, or HEIC — directly onto the tool. Your photo never leaves your device. All resizing happens locally in your browser, so your images stay completely private."
              },
              {
                number: "02", 
                title: "Choose Your Format",
                icon: <Target className="w-5 h-5" />,
                body: "Select the format that matches where you're posting. Square posts, portrait photos, landscape images, Stories, Reels, and profile pictures all have different ideal dimensions. Pick one and see an instant live preview."
              },
              {
                number: "03",
                title: "Adjust & Download",
                icon: <History className="w-5 h-5" />,
                body: "Choose a background fill color or blur if your image doesn't fill the frame, then download your resized photo. Your image is exported at full Instagram-ready resolution — no compression artifacts or watermark."
              }
            ].map((step) => (
              <div key={step.number} className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="text-3xl font-black text-indigo-500/20 absolute top-5 right-6">{step.number}</div>
                <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{step.body}</p>
              </div>
            ))}
          </section>

          {/* Size Guide Section */}
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-indigo-500" />
              Instagram Image Size Guide (2025)
            </h2>
            <p className="text-lg">
              Getting the right image size for Instagram matters more than most people realize. 
              Instagram automatically compresses photos that don&apos;t match its preferred dimensions — 
              which means blurry edges, unexpected cropping, and a feed that looks less polished than 
              you intended. Whether you&apos;re a brand, a creator, or just someone who wants their photos 
              to look their best, using the correct Instagram pic size before you upload saves you the 
              frustration of re-posting.
            </p>
            <p>
              Below is the complete breakdown of every format Instagram supports in 2025, including 
              the exact pixel dimensions, aspect ratios, and the maximum file size Instagram will accept.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 font-bold uppercase tracking-widest text-[9px] text-slate-500">
                  <tr>
                    <th className="py-3 px-5 text-left">Format</th>
                    <th className="py-3 px-5 text-left">Dimensions</th>
                    <th className="py-3 px-5 text-left">Aspect Ratio</th>
                    <th className="py-3 px-5 text-left">Max File Size</th>
                    <th className="py-3 px-5 text-left">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 px-5 font-bold">Square Post</td>
                    <td className="py-3 px-5">1080 × 1080 px</td>
                    <td className="py-3 px-5">1:1</td>
                    <td className="py-3 px-5">8 MB</td>
                    <td className="py-3 px-5">Feed posts, product shots</td>
                  </tr>
                  <tr className="bg-indigo-50/20 dark:bg-indigo-500/5">
                    <td className="py-3 px-5 font-bold text-indigo-600">Portrait Post</td>
                    <td className="py-3 px-5">1080 × 1350 px</td>
                    <td className="py-3 px-5">4:5</td>
                    <td className="py-3 px-5">8 MB</td>
                    <td className="py-3 px-5">Max Real Estate, portraits</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-bold">Landscape Post</td>
                    <td className="py-3 px-5">1080 × 566 px</td>
                    <td className="py-3 px-5">1.91:1</td>
                    <td className="py-3 px-5">8 MB</td>
                    <td className="py-3 px-5">Wide shots, panoramas</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-bold">Story</td>
                    <td className="py-3 px-5">1080 × 1920 px</td>
                    <td className="py-3 px-5">9:16</td>
                    <td className="py-3 px-5">30 MB</td>
                    <td className="py-3 px-5">Stories, Reels covers</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-bold">Reel Cover</td>
                    <td className="py-3 px-5">1080 × 1920 px</td>
                    <td className="py-3 px-5">9:16</td>
                    <td className="py-3 px-5">8 MB</td>
                    <td className="py-3 px-5">Reel thumbnail in feed</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-bold">Carousel Slide</td>
                    <td className="py-3 px-5">1080 × 1080 px</td>
                    <td className="py-3 px-5">1:1</td>
                    <td className="py-3 px-5">8 MB</td>
                    <td className="py-3 px-5">Multi-image posts</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-bold">Profile Picture</td>
                    <td className="py-3 px-5">320 × 320 px</td>
                    <td className="py-3 px-5">1:1</td>
                    <td className="py-3 px-5">8 MB</td>
                    <td className="py-3 px-5">Profile display</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-100 text-sm italic">
               <strong>Pro tip:</strong> The 4:5 portrait format (1080 × 1350 px) takes up the most 
               vertical space in someone&apos;s feed, which means more screen time per post. If you&apos;re 
               trying to maximize visibility, sizing a photo for Instagram in portrait orientation 
               is almost always the better choice over square.
            </div>
          </section>

          {/* Compression Section */}
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Why Instagram Compresses Your Photos — And How to Prevent It</h2>
            <p>
              Instagram applies automatic compression to every image uploaded to its platform. 
              This isn&apos;t optional — it happens regardless of whether you upload from your phone 
              or from a desktop browser. The compression is most aggressive when your image 
              dimensions don&apos;t match Instagram&apos;s preferred sizes, or when the file size is too large.
            </p>
            <p>
              When Instagram resizes an image that&apos;s the wrong size, it doesn&apos;t just scale it 
              down — it re-encodes the JPEG, introducing artifacts and softness, especially around 
              text, fine details, and high-contrast edges. You may have noticed photos that looked 
              sharp on your camera roll appearing slightly muddy on your grid. This is why.
            </p>
            <p>
              The fix is straightforward: resize your photo to the exact Instagram post size 
              <em>before</em> uploading. When Instagram receives an image that already matches its 
              preferred dimensions and is under the file size limit, it applies significantly less 
              compression. The result is a noticeably sharper image in your feed.
            </p>
            <p>
              Our tool exports images at 1080px wide — the native resolution Instagram uses 
              internally — which means what you upload is almost exactly what your followers see.
            </p>
          </section>

          {/* Format Selection Guide */}
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Which Instagram Photo Size Should You Use?</h2>
            <p>
              Not every photo suits every format. Here&apos;s a practical guide to matching your 
              content to the right Instagram pic size:
            </p>

            <div className="grid sm:grid-cols-2 gap-12 mt-12 not-prose">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Layout className="w-5 h-5 text-indigo-500" />
                     Square (1:1) — The Safe Default
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    The 1080 × 1080 square is the format most people associate with Instagram. 
                    It works well for anything roughly symmetrical — faces centered in frame, 
                    product flat lays, food photography, and graphic content. It&apos;s also the 
                    most predictable format for carousels, since all slides appear the same size 
                    in the feed preview.
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Target className="w-5 h-5 text-indigo-500" />
                     Portrait (4:5) — Maximum Feed Presence
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    At 1080 × 1350 pixels, the portrait format occupies more of a user&apos;s screen 
                    than any other feed post format. This makes it ideal for travel photography, 
                    fashion, editorial content, and any situation where you want to stop the scroll. 
                    Many professional creators default to 4:5 for every post for this reason alone.
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Minimize2 className="w-5 h-5 text-indigo-500" />
                     Landscape (1.91:1) — Wide Scenes
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Landscape posts at 1080 × 566 are the right choice for wide establishing shots, 
                    architecture, skylines, and group photos where horizontal framing is essential. 
                    Be aware that landscape posts appear smaller in the feed grid compared to square 
                    or portrait, so they may generate slightly less engagement on average.
                  </p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     <Smartphone className="w-5 h-5 text-indigo-500" />
                     Stories and Reels (9:16)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Stories and Reels use a full-screen vertical canvas at 1080 × 1920 pixels. 
                    If you&apos;re repurposing a regular photo, you&apos;ll likely need background fill 
                    or blur to pad out the space. Our tool handles this automatically — just select 
                    the Story format and choose your preferred background treatment.
                  </p>
               </div>
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* FAQ Section */}
          <section id="faq" className="space-y-10 pb-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Questions & Answers</h2>
              <p className="text-slate-500 max-w-lg mx-auto font-medium leading-relaxed text-sm">
                Everything you need to know about Instagram photo dimensions and image quality.
              </p>
            </div>

            <div className="grid gap-4">
              {faq.map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:dark:bg-slate-900 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[10px]">Q</span>
                    {item.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-10 text-sm">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Bottom CTA */}
          <section className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
            <Instagram className="w-16 h-16 text-white/10 absolute -bottom-4 -left-4 rotate-12" />

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">Master Your Instagram Aesthetic</h2>
            <p className="text-indigo-200 mb-10 max-w-lg mx-auto font-medium">Use our suite of free tools to create professional-looking social media content in seconds.</p>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link href="/design/free-social-media-carousel-builder" className="px-8 py-4 bg-white text-indigo-950 font-bold rounded-2xl hover:scale-105 transition-transform">
                Carousel Builder
              </Link>
              <Link href="/image/free-image-background-remover-online" className="px-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:scale-105 transition-transform border border-indigo-400">
                Background Remover
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
