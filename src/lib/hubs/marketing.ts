import type { HubContent } from "./types";

export const marketingHub: HubContent = {
  path: "/marketing",
  label: "Marketing Tools",
  metaTitle: "Free Marketing Tools: UTM Builder, ROI Calculator & Social Counters",
  metaDescription:
    "Free marketing tools for campaign tracking, ROI, social post limits and creative: UTM builder, marketing ROI calculator, character counter, carousel builder and image resizer.",
  h1: "Marketing tools for tracking, measuring and publishing campaigns",
  lead:
    "Plan a campaign, tag every link, check posts fit each platform, then measure whether it paid off. These tools cover the whole loop for small teams and solo marketers.",
  intro: [
    "Campaign reporting is only as good as its tracking. Untagged links show up in GA4 as direct or referral traffic, and inconsistent naming (Facebook vs facebook vs fb) splits one channel into three rows. Start with the UTM builder, use one naming convention, and the ROI calculator then has clean numbers to work with.",
    "For social publishing, the character counter checks the current limits for X, LinkedIn, Instagram, Threads and Bluesky, and the carousel builder and image resizer produce assets at the right dimensions for each platform.",
  ],
  groups: [
    {
      heading: "Tracking and measurement",
      intro: "Tag campaign links for GA4 and calculate return on ad spend, ROI and cost per acquisition.",
      hrefs: ["/utility/utm-builder", "/marketing/marketing-roi-calculator", "/finance/break-even-calculator"],
    },
    {
      heading: "Social media publishing",
      intro: "Write within platform limits and export images and carousels at the correct sizes.",
      hrefs: [
        "/utility/social-media-character-counter",
        "/design/free-social-media-carousel-builder",
        "/utility/social-media-image-resizer",
        "/image/resize-photo-instagram-online",
        "/utility/quote-image-generator-online",
      ],
    },
    {
      heading: "Search and content",
      intro: "Plan content around keyword clusters and make sure your snippets display properly.",
      hrefs: ["/seo/keyword-clustering", "/seo/meta-description-checker", "/seo/youtube-title-checker"],
    },
  ],
  methodology: {
    heading: "Why these tools",
    points: [
      {
        title: "GA4-compatible",
        body: "The UTM builder uses the parameters GA4 reads (source, medium, campaign, term, content) and warns about common mistakes like uppercase values and spaces.",
      },
      {
        title: "Current platform limits",
        body: "Character limits and image sizes follow each platform's published specs, and are updated when the platforms change them.",
      },
      {
        title: "Transparent maths",
        body: "ROI, ROAS and CPA are shown with their formulas so you can reproduce them in a report.",
      },
      {
        title: "No account needed",
        body: "The tracking, ROI and counting tools run in your browser, so client campaign data isn't uploaded.",
      },
    ],
  },
  guides: [
    { title: "What are UTM parameters?", href: "/blog/what-are-utm-parameters" },
    { title: "UTM naming conventions", href: "/blog/utm-naming-conventions" },
    { title: "5 UTM mistakes to avoid", href: "/blog/5-utm-mistakes" },
    { title: "How to read UTM reports in GA4", href: "/blog/read-utm-reports-ga4" },
    { title: "Tracking email campaigns with UTMs", href: "/blog/track-email-campaigns-utm" },
    { title: "Social media UTM tracking", href: "/blog/social-media-utm-tracking" },
    { title: "Shopify UTM tracking", href: "/blog/shopify-utm-tracking" },
    { title: "UTM parameters for paid ads", href: "/blog/utm-ads" },
    { title: "LinkedIn post character limit", href: "/blog/linkedin-post-character-limit" },
    { title: "Instagram caption character limit", href: "/blog/instagram-caption-character-limit" },
    { title: "X character limit with links", href: "/blog/x-character-limit-with-links" },
    { title: "Threads and Bluesky character limits", href: "/blog/threads-bluesky-character-limits" },
  ],
  faqs: [
    {
      question: "Which UTM parameters are required?",
      answer:
        "utm_source, utm_medium and utm_campaign are the three you should always set. utm_term and utm_content are optional: use them to tell keywords or ad variations apart.",
    },
    {
      question: "How do I calculate marketing ROI?",
      answer:
        "Marketing ROI = (revenue attributed to the campaign − campaign cost) ÷ campaign cost × 100. For example, $5,000 in revenue from a $1,000 campaign gives a 400% ROI. Use gross profit instead of revenue if you want ROI after product costs.",
    },
    {
      question: "Should I use UTM tags on internal links?",
      answer:
        "No. UTMs on links between pages of your own site restart the session in analytics and overwrite the original source. Use them only on links that point to your site from somewhere else.",
    },
  ],
};
