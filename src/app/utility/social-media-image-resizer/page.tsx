import type { Metadata } from 'next';
import Link from 'next/link';
import SocialImageResizer from './SocialImageResizer';
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: 'Social Media Image Resizer — Resize Images for Instagram, Twitter, Facebook & LinkedIn',
  description:
    'The best free image resizer for social media. Resize social media images to exact specs: twitter image sizing, instagram image sizing, facebook image sizing, linkedin image sizing. No upload. Instant download.',
  keywords: [
    'image resizer for social media',
    'resize social media images',
    'twitter image sizing',
    'instagram image sizing',
    'facebook image sizing',
    'linkedin image sizing',
    'social media image sizes cheat sheet',
    'free online image resizer',
    'instagram post size',
    'twitter header size',
    'facebook cover photo dimensions',
    'linkedin banner size',
  ].join(', '),
  alternates: {
    canonical: 'https://findbest.tools/utility/social-media-image-resizer',
  },
  openGraph: {
    title: 'Free Social Media Image Resizer for Instagram, X, Facebook & LinkedIn',
    description: 'Resize images to exact platform dimensions instantly. Client-side, private, and free.',
    url: 'https://findbest.tools/utility/social-media-image-resizer',
    siteName: 'FindBest Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Social Media Image Resizer',
    description: 'Perfect twitter image sizing, instagram image sizing & more. No signup required.',
  },
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Social Media Image Resizer',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },

    featureList: [
      'Instagram image sizing presets',
      'Twitter / X image sizing presets',
      'Facebook image sizing presets',
      'LinkedIn image sizing presets',
      'YouTube thumbnail and banner presets',
      'TikTok video frame presets',
      'Pinterest Pin ratio presets',
      'Safe zone overlays',
      'Client-side privacy processing',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Resize Images for Social Media',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Upload Your Image',
        text: 'Drag and drop or click to upload any JPG, PNG, or WebP file from your device.',
      },
      {
        '@type': 'HowToStep',
        name: 'Select Platform & Format',
        text: 'Choose from Instagram, Twitter/X, Facebook, LinkedIn, YouTube, TikTok, or Pinterest. Then pick the exact post type (feed, story, header, etc.).',
      },
      {
        '@type': 'HowToStep',
        name: 'Download Resized Image',
        text: 'Preview the cropped result with safe-zone guides, adjust quality if needed, and download instantly.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best image resizer for social media?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best image resizer for social media is one that offers exact platform presets, maintains aspect ratios, processes images locally for privacy, and outputs web-optimized JPEG, PNG, or WebP files. Our tool covers Instagram, Twitter/X, Facebook, LinkedIn, YouTube, TikTok, and Pinterest with verified dimensions.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the exact Instagram image sizing requirements?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For optimal Instagram image sizing, use 1080×1080 pixels for square feed posts, 1080×1350 pixels for portrait (4:5) posts, 1080×566 pixels for landscape posts, and 1080×1920 pixels for Stories and Reels. Profile pictures should be at least 320×320 pixels.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the correct Twitter image sizing in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The correct twitter image sizing for standard in-feed images is 1200×675 pixels (16:9). Twitter header photos should be 1500×500 pixels, but keep critical text within the middle 1500×350 pixels to avoid mobile cropping. Profile photos are best at 400×400 pixels.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are Facebook cover photo dimensions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Facebook cover photo dimensions are 851×315 pixels for desktop. Facebook feed post images display best at 1200×630 pixels. Event covers should be 1200×628 pixels, and profile pictures render at 170×170 pixels on desktop.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the LinkedIn banner size?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The LinkedIn banner size for personal profiles is 1584×396 pixels. Company page banners are 1128×191 pixels. LinkedIn post images perform best at 1200×627 pixels. Note that mobile devices crop approximately 300 pixels from each side of personal banners, so center your subject.',
        },
      },
    ],
  },
];

export default function SocialMediaImageResizerPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HERO + TOOL */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Social Media Image Resizer
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed">
              The fastest way to <strong>resize social media images</strong> to exact platform specifications.
              Get perfect <em>twitter image sizing</em>, <em>instagram image sizing</em>,{' '}
              <em>facebook image sizing</em>, and <em>linkedin image sizing</em> — no signup, no upload to servers, instant download.
            </p>
          </div>
          <SocialImageResizer />
        </div>
      </section>

      {/* CONTENT */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Every Marketer Needs a Dedicated Image Resizer for Social Media</h2>
          <div className="prose prose-slate max-w-none text-slate-700 leading-7">
            <p>
              In the attention economy, a single pixel can be the difference between a scroll-past and a sale. When you <strong>resize social media images</strong> incorrectly, platforms automatically crop, compress, or distort your visuals — often cutting off headlines, faces, or call-to-action buttons. A purpose-built <strong>image resizer for social media</strong> eliminates this risk by mapping your creative assets to the exact dimensional requirements each algorithm expects.
            </p>
            <p>
              Our free tool is engineered for content creators, social media managers, and growth marketers who publish across multiple channels daily. Instead of memorizing conflicting dimension tables or wrestling with heavy design software, you upload once and export perfectly sized assets for Instagram, Twitter/X, Facebook, LinkedIn, YouTube, TikTok, and Pinterest in seconds. Every preset is verified against official platform documentation and updated for 2026 standards.
            </p>
            <p>
              Once the creative is sized correctly, check the copy against our <Link href="/utility/social-media-character-counter" className="font-medium text-primary hover:underline">Social Media Character Counter</Link> so captions, post text, and hashtags fit each network before you publish. Then pair the asset with a tagged campaign URL from our <Link href="/utility/utm-builder" className="font-medium text-primary hover:underline">UTM Builder</Link> so your social posts and paid creatives report cleanly in GA4.
            </p>
          </div>
        </section>

        {/* Cheat Sheet Table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Social Media Image Sizes Cheat Sheet (2026)</h2>
          <p className="text-slate-700 mb-6 leading-7">
            Bookmark this table. These are the exact dimensions our tool uses to <strong>resize social media images</strong> for maximum clarity and engagement.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-900 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Format Type</th>
                  <th className="px-4 py-3">Dimensions (px)</th>
                  <th className="px-4 py-3">Aspect Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr><td className="px-4 py-3 font-semibold">Instagram</td><td className="px-4 py-3">Feed Post (Square)</td><td className="px-4 py-3 font-mono">1080 × 1080</td><td className="px-4 py-3">1:1</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Instagram</td><td className="px-4 py-3">Feed Post (Portrait)</td><td className="px-4 py-3 font-mono">1080 × 1350</td><td className="px-4 py-3">4:5</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Instagram</td><td className="px-4 py-3">Story / Reel</td><td className="px-4 py-3 font-mono">1080 × 1920</td><td className="px-4 py-3">9:16</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Twitter / X</td><td className="px-4 py-3">In-Feed Image</td><td className="px-4 py-3 font-mono">1200 × 675</td><td className="px-4 py-3">16:9</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Twitter / X</td><td className="px-4 py-3">Header Photo</td><td className="px-4 py-3 font-mono">1500 × 500</td><td className="px-4 py-3">3:1</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Facebook</td><td className="px-4 py-3">Feed Post / Link</td><td className="px-4 py-3 font-mono">1200 × 630</td><td className="px-4 py-3">1.91:1</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Facebook</td><td className="px-4 py-3">Cover Photo</td><td className="px-4 py-3 font-mono">851 × 315</td><td className="px-4 py-3">2.7:1</td></tr>
                <tr><td className="px-4 py-3 font-semibold">LinkedIn</td><td className="px-4 py-3">Profile Banner</td><td className="px-4 py-3 font-mono">1584 × 396</td><td className="px-4 py-3">4:1</td></tr>
                <tr><td className="px-4 py-3 font-semibold">LinkedIn</td><td className="px-4 py-3">Post Image</td><td className="px-4 py-3 font-mono">1200 × 627</td><td className="px-4 py-3">1.91:1</td></tr>
                <tr><td className="px-4 py-3 font-semibold">YouTube</td><td className="px-4 py-3">Video Thumbnail</td><td className="px-4 py-3 font-mono">1280 × 720</td><td className="px-4 py-3">16:9</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Pinterest</td><td className="px-4 py-3">Standard Pin</td><td className="px-4 py-3 font-mono">1000 × 1500</td><td className="px-4 py-3">2:3</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Instagram */}
        <section id="instagram-image-sizing">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Instagram Image Sizing: Feed, Stories, and Reels</h2>
          <div className="prose prose-slate max-w-none text-slate-700 leading-7">
            <p>
              <strong>Instagram image sizing</strong> is not one-size-fits-all. The platform algorithmically prioritizes content that fills the screen without awkward letterboxing. For standard feed posts, the classic 1080×1080 pixel square (1:1) remains the safest universal choice. However, if your goal is maximum vertical real estate, the 1080×1350 pixel portrait format (4:5) occupies 34% more screen height than a square, statistically increasing dwell time.
            </p>
            <p>
              For Stories and Reels, <strong>instagram image sizing</strong> demands a strict 1080×1920 pixel canvas (9:16). Anything smaller is upscaled and loses sharpness; anything larger is aggressively compressed. When you resize social media images for Instagram Stories, ensure that all interactive elements — polls, sliders, and link stickers — sit within the central 1080×1420 safe zone to avoid overlap with UI chrome.
            </p>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 my-4 rounded-r-lg">
              <p className="font-semibold text-indigo-900 m-0">Key Takeaway:</p>
              <p className="text-indigo-800 m-0 mt-1">
                Instagram stores the highest-resolution version you upload. Always start with 1080px on the shortest side and let our tool handle the exact crop. JPEG at 85-90% quality offers the best balance of clarity and file size for the Instagram CDN.
              </p>
            </div>
          </div>
        </section>

        {/* Twitter */}
        <section id="twitter-image-sizing">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Twitter / X Image Sizing for Maximum Impressions</h2>
          <div className="prose prose-slate max-w-none text-slate-700 leading-7">
            <p>
              Getting <strong>twitter image sizing</strong> right is critical because Twitter&apos;s timeline is unforgiving. A poorly cropped thumbnail can tank your click-through rate. The gold standard for in-feed photos is 1200×675 pixels, which renders beautifully on both desktop and mobile without black bars. If you are designing a Twitter Card for link previews, use 1200×628 pixels — this ratio triggers the large summary card layout, which occupies the full width of the feed.
            </p>
            <p>
              The most common mistake in <strong>twitter image sizing</strong> involves the header photo. While the documented size is 1500×500 pixels, mobile apps crop approximately 150 pixels from the bottom. Our tool overlays a safe-zone guide so you can position logos and text in the center 1500×350 pixel band, ensuring your branding survives every device format. Profile photos render at 400×400 pixels; uploading exactly this dimension prevents the platform&apos;s heavy downscale algorithm from softening your avatar.
            </p>
          </div>
        </section>

        {/* Facebook */}
        <section id="facebook-image-sizing">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Facebook Image Sizing: Posts, Covers, and Events</h2>
          <div className="prose prose-slate max-w-none text-slate-700 leading-7">
            <p>
              <strong>Facebook image sizing</strong> directly impacts the News Feed algorithm. Images smaller than 600×315 pixels may not generate link preview thumbnails, while the optimal 1200×630 pixel dimension triggers the full large-format preview. When you resize social media images for Facebook, always aim for this 1.91:1 ratio to prevent automatic center-cropping that can amputate critical visual information.
            </p>
            <p>
              Facebook cover photos present unique challenges. The official 851×315 pixel dimension displays correctly on desktop, but mobile devices crop the sides dynamically. We recommend keeping all essential branding within the central 640×315 pixel area. For event covers, 1200×628 pixels aligns perfectly with Facebook&apos;s event discovery layout. Remember that Facebook applies heavier compression than most platforms; exporting your image at 90% quality before upload preserves more detail after Facebook&apos;s secondary compression pass.
            </p>
          </div>
        </section>

        {/* LinkedIn */}
        <section id="linkedin-image-sizing">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">LinkedIn Image Sizing for B2B Professionals</h2>
          <div className="prose prose-slate max-w-none text-slate-700 leading-7">
            <p>
              Professional credibility on LinkedIn starts with pixel-perfect visuals. The standard <strong>linkedin image sizing</strong> for feed updates is 1200×627 pixels, nearly identical to Facebook but with slightly different compression behavior. LinkedIn favors cleaner, high-contrast imagery for document posts and carousel ads, so resizing to these exact dimensions prevents the platform from introducing artifacts.
            </p>
            <p>
              The LinkedIn banner size for personal profiles is 1584×396 pixels. This ultra-wide 4:1 ratio is beautiful on desktop but brutal on mobile, where approximately 300 pixels are cropped from each side. Our safe-zone overlay highlights the center 984×396 pixel region, which remains visible across all devices. Company page banners are even wider and shorter at 1128×191 pixels. For LinkedIn profile photos, 400×400 pixels is the retina-ready standard that renders crisply on high-DPI displays.
            </p>
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 my-4 rounded-r-lg">
              <p className="font-semibold text-emerald-900 m-0">B2B Best Practice:</p>
              <p className="text-emerald-800 m-0 mt-1">
                LinkedIn&apos;s algorithm deprioritizes blurry or off-ratio images. Using a dedicated image resizer for social media ensures your thought leadership content looks as polished as your resume.
              </p>
            </div>
          </div>
        </section>

        {/* Other Platforms */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">YouTube, TikTok & Pinterest Sizing Standards</h2>
          <div className="prose prose-slate max-w-none text-slate-700 leading-7">
            <p>
              YouTube thumbnails are the single highest-CTR lever on the platform. At 1280×720 pixels (16:9), they must be readable at the size of a postage stamp. Our tool crops to this exact dimension so your facial expressions and text overlays remain legible. YouTube channel banners are notoriously complex due to multi-device safe zones (2560×1440 base, with a 1546×423 central safe area); our overlay guides you through this.
            </p>
            <p>
              For TikTok, vertical 1080×1920 pixels is the only ratio that matters. Pinterest rewards verticality — the 1000×1500 pixel standard Pin (2:3) receives disproportionately more distribution than square or horizontal formats. When you resize social media images for Pinterest, never go shorter than a 2:3 ratio if you want algorithmic favor.
            </p>
          </div>
        </section>

        {/* How To Use */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use This Free Social Media Image Resizer</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-700 leading-7">
            <li><strong>Upload your source image.</strong> Drag any JPG, PNG, WebP, or GIF into the upload zone. Processing happens entirely in your browser — your files never touch our servers.</li>
            <li><strong>Select your target platform.</strong> Choose from Instagram, Twitter/X, Facebook, LinkedIn, YouTube, TikTok, or Pinterest. Each platform has pre-loaded exact dimensions verified from official 2026 documentation.</li>
            <li><strong>Pick the format type.</strong> Toggle between feed posts, stories, headers, covers, thumbnails, or profile pictures. The live canvas updates instantly.</li>
            <li><strong>Enable safe zone guides.</strong> For headers and banners, turn on safe-zone overlays to see exactly what mobile devices will crop.</li>
            <li><strong>Adjust quality and format.</strong> Choose JPEG for photography, PNG for graphics with transparency, or WebP for the smallest file size with no quality loss.</li>
            <li><strong>Download and publish.</strong> Click download and receive a web-optimized file ready for immediate upload.</li>
          </ol>
        </section>

        {/* Optimization Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Image Optimization Tips for Higher Engagement</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Choose the Right Format</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use <strong>WebP</strong> when the platform supports it — it reduces file size by 25-35% compared to JPEG without quality loss. Use <strong>PNG</strong> only for logos, screenshots, or images requiring transparency. Use <strong>JPEG</strong> for photographs and complex gradients.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Compress Before Uploading</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every major social network re-compresses your images. By exporting at 85-90% quality with our tool, you control the first compression stage and minimize generational quality loss from the platform&apos;s secondary compression.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Design for Mobile First</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Over 80% of social media consumption happens on mobile devices. Always preview your resized image on a phone screen. If text is unreadable at thumbnail size, redesign it. Our preview canvas simulates the final cropped result, and our <Link href="/utility/social-media-character-counter" className="font-medium text-primary hover:underline">character counter</Link> helps you keep the matching caption inside each platform&apos;s visible range.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2">Maintain Color Consistency</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use sRGB color profile for web images. CMYK or Adobe RGB profiles can cause color shifts when platforms convert your image. Our client-side canvas automatically renders in the browser&apos;s standard sRGB space.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                What is the best free image resizer for social media?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-7">
                The best free <strong>image resizer for social media</strong> combines exact platform presets, client-side privacy, safe-zone guides, and multiple export formats. Our tool is designed specifically for marketers who need to resize social media images daily across Instagram, Twitter/X, Facebook, and LinkedIn without installing software or creating accounts.
              </div>
            </details>

            <details className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                Are my images uploaded to your server?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-7">
                No. This tool uses HTML5 Canvas API to process images entirely inside your web browser. Your files never leave your device, making this tool ideal for sensitive branding assets, unreleased campaigns, and client work covered by NDAs.
              </div>
            </details>

            <details className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                What is the exact Instagram image sizing for Stories?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-7">
                The exact <strong>instagram image sizing</strong> for Stories is 1080 pixels wide by 1920 pixels tall (9:16 aspect ratio). This is also the identical dimension for Reels. Uploading at this native resolution prevents Instagram from applying aggressive upscaling that reduces sharpness on retina displays.
              </div>
            </details>

            <details className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                Why does my Twitter header look cropped on mobile?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-7">
                Twitter headers are displayed at 1500×500 pixels on desktop, but the mobile app crops approximately 150 pixels from the bottom. Our tool includes a safe-zone overlay that highlights the center 1500×350 pixel region, ensuring your text and logos remain visible across all devices.
              </div>
            </details>

            <details className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                What are the Facebook cover photo dimensions for business pages?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-7">
                Facebook cover photo dimensions for both business pages and personal profiles are 851×315 pixels. Event covers are larger at 1200×628 pixels. Always keep critical visual elements within the center 640×315 pixels to avoid mobile side-cropping.
              </div>
            </details>

            <details className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                What is the LinkedIn banner size for personal profiles vs company pages?
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-7">
                The <strong>LinkedIn banner size</strong> for personal profiles is 1584×396 pixels. Company page banners are 1128×191 pixels. Personal banners are heavily cropped on mobile (approximately 300px from each side), so center your subject matter precisely.
              </div>
            </details>
          </div>
        </section>

        {/* EEAT / Trust */}
        <section className="bg-slate-900 text-slate-300 rounded-2xl p-8 lg:p-10">
          <h2 className="text-xl font-bold text-white mb-4">About This Tool & Editorial Methodology</h2>
          <div className="space-y-4 text-sm leading-7">
            <p>
              This <strong>social media image resizer</strong> is maintained by the editorial team at FindBest Tools. All dimension presets are verified against official platform documentation from Instagram Help Center, X (Twitter) Business Help, Facebook Business Help Center, and LinkedIn Marketing Solutions. Dimensions are reviewed quarterly and updated immediately when platforms announce changes.
            </p>
            <p>
              <strong>Privacy First:</strong> Unlike cloud-based image editors, this tool performs all resizing operations locally via your browser&apos;s Canvas API. No image data is transmitted, stored, or logged on our infrastructure. This makes it compliant with strict corporate data policies and suitable for pre-launch marketing assets.
            </p>
            <p>
              <strong>Last Updated:</strong> April 2026. If you notice a platform dimension change that we have not yet reflected, please contact our editorial team through the main site.
            </p>
          </div>
        </section>

        {/* RELATED TOOLS */}
        <div className="mt-20 border-t border-slate-200 py-20 pb-32">
          <RelatedToolsSection
            category="Utility"
            categoryHref="/utility"
            currentPath="/utility/social-media-image-resizer"
          />
        </div>
      </article>
    </main>
  );
}
