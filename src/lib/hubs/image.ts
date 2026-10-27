import type { HubContent } from "./types";

export const imageHub: HubContent = {
  path: "/image",
  label: "Image Tools",
  metaTitle: "Free Image Tools: Background Remover, Resizer & Base64 Converter",
  metaDescription:
    "Free image tools that run in your browser: remove backgrounds with AI, resize photos for Instagram and other platforms, convert images to Base64 and extract text from images.",
  h1: "Image tools that run in your browser",
  lead:
    "Remove a background, resize a photo for a specific platform, or encode an image as Base64 for code. Your images are processed on your device and never uploaded.",
  intro: [
    "Many free image sites upload your photo to their servers, add a watermark or limit the export resolution. These tools work differently. Background removal uses an AI model that runs in your browser, and resizing and encoding happen locally, so you can safely use them with personal photos, product shots and client work.",
    "The first visit to the background remover downloads the model, which takes a few seconds. After that it's cached by your browser and later images process much faster.",
  ],
  groups: [
    {
      heading: "Edit and resize",
      intro: "Cut out subjects for product photos and profile pictures, and resize images to each platform's dimensions.",
      hrefs: [
        "/image/free-image-background-remover-online",
        "/image/resize-photo-instagram-online",
        "/utility/social-media-image-resizer",
        "/utility/aspect-ratio-calculator",
      ],
    },
    {
      heading: "Convert and extract",
      intro: "Encode images as Base64 data URIs for HTML, CSS and JSON, or pull editable text out of an image with OCR.",
      hrefs: ["/image/convert-image-to-base64", "/text/scan-text-from-image"],
    },
  ],
  methodology: {
    heading: "Private image processing",
    points: [
      {
        title: "On-device AI",
        body: "Background removal runs a segmentation model in your browser with WebAssembly, so no image is sent to a server.",
      },
      {
        title: "Full resolution",
        body: "Exports keep your original resolution unless you choose to resize them.",
      },
      {
        title: "No watermarks",
        body: "Downloads are clean, with no branding added.",
      },
      {
        title: "Common formats",
        body: "JPG, PNG and WebP are supported for input. Transparent results export as PNG.",
      },
    ],
  },
  faqs: [
    {
      question: "Is the background remover really free with no upload?",
      answer:
        "Yes. The AI model downloads to your browser once and runs locally. Your photo is never uploaded, and there's no credit system or resolution paywall.",
    },
    {
      question: "When should I use Base64 images?",
      answer:
        "Base64 is useful for very small images such as icons, email signatures or a placeholder inlined in CSS, because it saves an HTTP request. For larger images it's a poor choice: Base64 makes files about 33% bigger and the browser can't cache them separately.",
    },
    {
      question: "What's the best image size for an Instagram post?",
      answer:
        "Use 1080 px wide. 1080 × 1350 px (4:5) takes up the most space in the feed, 1080 × 1080 px works for squares, and 1080 × 1920 px (9:16) is for Stories and Reels.",
    },
  ],
};
