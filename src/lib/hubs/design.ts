import type { HubContent } from "./types";

export const designHub: HubContent = {
  path: "/design",
  label: "Design Tools",
  metaTitle: "Free Design Tools: Carousel Builder, Image Resizer & Quote Images",
  metaDescription:
    "Free browser-based design tools for social media: a carousel builder for Instagram and LinkedIn, a social image resizer, a quote image generator and an aspect ratio calculator.",
  h1: "Design tools for social media graphics",
  lead:
    "Build carousels, quote cards and correctly sized social images in your browser, with no design-app subscription. Exports are ready to upload.",
  intro: [
    "Most social graphics fail on the basics: the wrong aspect ratio crops the important part of the image, text runs into the platform's UI overlay, or a carousel's slides don't flow into each other. These tools start from each platform's specs so the basics are handled before you start styling.",
    "They're made for creators, small businesses and marketers who post often and want consistent results without learning a full design suite.",
  ],
  groups: [
    {
      heading: "Create",
      intro: "Design multi-slide carousels with continuous backgrounds, and turn quotes into branded image cards.",
      hrefs: ["/design/free-social-media-carousel-builder", "/utility/quote-image-generator-online"],
    },
    {
      heading: "Resize and format",
      intro: "Resize images to each platform's recommended dimensions and work out the dimensions for any aspect ratio.",
      hrefs: [
        "/utility/social-media-image-resizer",
        "/image/resize-photo-instagram-online",
        "/utility/aspect-ratio-calculator",
        "/image/free-image-background-remover-online",
      ],
    },
  ],
  methodology: {
    heading: "Built around platform specs",
    points: [
      {
        title: "Correct dimensions",
        body: "Presets match the published recommended sizes for Instagram, LinkedIn, X, Facebook, TikTok and YouTube.",
      },
      {
        title: "Safe zones",
        body: "Layouts keep key text away from the edges, where platform UI or cropping would hide it.",
      },
      {
        title: "Local rendering",
        body: "Carousels, resized images and background removal are processed in your browser, so your photos never leave your device.",
      },
      {
        title: "No watermark",
        body: "Exports are clean, with no branding added.",
      },
    ],
  },
  guides: [
    { title: "Instagram carousel size guide", href: "/blog/instagram-carousel-size" },
    { title: "How to make a LinkedIn carousel", href: "/blog/how-to-make-a-linkedin-carousel" },
    { title: "How to make a carousel go viral", href: "/blog/how-to-make-a-carousel-go-viral" },
    { title: "Carousel caption guide", href: "/blog/carousel-caption-guide" },
    { title: "Free carousel maker without Canva", href: "/blog/free-carousel-maker-no-canva" },
  ],
  faqs: [
    {
      question: "What size should an Instagram carousel be?",
      answer:
        "Instagram supports 1080 × 1350 px (4:5 portrait), 1080 × 1080 px (1:1 square) and 1080 × 566 px (1.91:1 landscape). Portrait 4:5 takes up the most screen space in the feed. Every slide in a carousel uses the same ratio as the first.",
    },
    {
      question: "How do I upload a LinkedIn carousel?",
      answer:
        "LinkedIn carousels are uploaded as a PDF document post. Export your slides as a PDF, create a post, choose \"Add a document\", and give it a title. Each page of the PDF becomes a swipeable slide.",
    },
    {
      question: "Are the designs I create stored on your servers?",
      answer:
        "Carousels and resized images are built and exported in your browser and aren't uploaded. The quote image generator fetches background images from a server, but the quote text you type isn't stored.",
    },
  ],
};
