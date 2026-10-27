import type { HubContent } from "./types";

export const seoHub: HubContent = {
  path: "/seo",
  label: "SEO Tools",
  metaTitle: "Free SEO Tools: Keyword Clustering, Hreflang & Snippet Checkers",
  metaDescription:
    "Free SEO tools for keyword clustering, hreflang tag generation, meta description length checks and YouTube title previews. No sign-up, results in seconds.",
  h1: "SEO tools for keyword planning and on-page checks",
  lead:
    "Group keywords into topics, generate valid hreflang tags for international sites, and check that titles and descriptions won't be cut off in search results.",
  intro: [
    "These tools cover the repetitive parts of SEO work that are easy to get wrong by hand. Clustering a few hundred keywords in a spreadsheet takes hours. A single wrong language-region code silently breaks hreflang. A meta description that looks fine in your CMS can be truncated in the results page.",
    "They're aimed at freelancers, in-house marketers and site owners who need a reliable answer quickly, without a monthly SEO-suite subscription.",
  ],
  groups: [
    {
      heading: "Keyword research and planning",
      intro:
        "Turn a raw keyword export into topic clusters you can map to pages, so each page targets one intent and you avoid keyword cannibalisation.",
      hrefs: ["/seo/keyword-clustering"],
    },
    {
      heading: "On-page and snippet checks",
      intro:
        "Preview how titles and descriptions will look on Google and YouTube, with pixel-width and character-length warnings.",
      hrefs: ["/seo/meta-description-checker", "/seo/youtube-title-checker", "/text/readability-flesch-kincaid-calculator"],
    },
    {
      heading: "Technical and international SEO",
      intro:
        "Generate reciprocal hreflang annotations with valid ISO language and region codes, check DNS records, and build tagged URLs for campaign tracking.",
      hrefs: ["/seo/hreflang-generator", "/utility/dns-checker", "/utility/utm-builder"],
    },
  ],
  methodology: {
    heading: "How these SEO tools work",
    points: [
      {
        title: "Based on published guidelines",
        body: "Hreflang output follows Google's documented rules: reciprocal links, a self-reference and x-default, using ISO 639-1 and ISO 3166-1 codes.",
      },
      {
        title: "Pixel-aware previews",
        body: "Search snippets are truncated by width, not just character count, so the checkers estimate rendered width as well.",
      },
      {
        title: "Your data stays private",
        body: "Keyword lists, titles and descriptions are processed in your browser and aren't stored.",
      },
      {
        title: "Export-ready",
        body: "Clusters, tags and URLs can be copied or exported straight into your workflow.",
      },
    ],
  },
  guides: [
    { title: "Keyword clustering vs grouping: the difference", href: "/blog/keyword-clustering-vs-grouping-difference" },
    { title: "SERP vs semantic keyword clustering", href: "/blog/serp-vs-semantic-keyword-clustering" },
    { title: "How to group keywords without a spreadsheet", href: "/blog/how-to-group-keywords-without-spreadsheet" },
    { title: "Build a content strategy from keyword clusters", href: "/blog/how-to-build-content-strategy-from-keyword-cluster" },
    { title: "Free vs paid keyword clustering tools", href: "/blog/free-vs-paid-keyword-clustering-tools" },
  ],
  faqs: [
    {
      question: "What is keyword clustering?",
      answer:
        "Keyword clustering groups search terms that share the same intent, so one page can target the whole group. SERP-based clustering puts keywords together when Google ranks the same URLs for them. Semantic clustering groups them by meaning.",
    },
    {
      question: "How long should a meta description be?",
      answer:
        "Google truncates descriptions by pixel width, which works out to roughly 150–160 characters on desktop and fewer on mobile. Put the most important information in the first 120 characters. Google also rewrites many descriptions, so treat yours as a strong suggestion rather than a guarantee.",
    },
    {
      question: "Do I need an x-default hreflang tag?",
      answer:
        "It isn't required, but it's recommended. x-default tells search engines which URL to show users whose language or region doesn't match any of your listed versions, typically a language selector or your main international page.",
    },
  ],
};
