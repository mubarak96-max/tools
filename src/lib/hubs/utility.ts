import type { HubContent } from "./types";

export const utilityHub: HubContent = {
  path: "/utility",
  label: "Utility Tools",
  metaTitle: "Free Online Utilities: QR & Barcode Tools, CV Builder, IP & DNS",
  metaDescription:
    "Free everyday utilities: create and scan QR codes and barcodes, build a CV, check your IP and DNS records, test password strength, and calculate GPA, fuel cost and gas mileage.",
  h1: "Everyday utility tools",
  lead:
    "Small tools for jobs that come up all the time: making a QR code that never expires, scanning a barcode without an app, putting a CV together, or checking which IP address and DNS records the world sees.",
  intro: [
    "Each utility does one job without ads covering the result, sign-up walls or expiring links. QR codes are static, so the destination is encoded directly in the code rather than routed through a redirect service that could stop working, and they're yours to use forever.",
    "Scanners use your device camera through the browser and decode on your device. Password checks run locally, so the password you test is never transmitted.",
  ],
  groups: [
    {
      heading: "QR codes and barcodes",
      intro: "Generate static QR codes and UPC, EAN-13 and Code 128 barcodes, or scan them with your camera or an image.",
      hrefs: [
        "/utility/create-qr-code-online",
        "/utility/qr-code-scanner",
        "/utility/barcode-generator",
        "/utility/barcode-scanner",
      ],
    },
    {
      heading: "Network and security",
      intro: "See your public IP address, look up DNS records for any domain, and test how resistant a password is to guessing.",
      hrefs: ["/utility/what-is-my-ip", "/utility/dns-checker", "/utility/password-strength-checker"],
    },
    {
      heading: "Work and study",
      intro: "Build a clean, printable CV and calculate your GPA on a 4.0 scale.",
      hrefs: ["/utility/free-cv-resume-builder", "/utility/gpa-calculator", "/finance/invoice-generator"],
    },
    {
      heading: "Travel and vehicles",
      intro: "Estimate the fuel cost of a trip and work out your car's real-world fuel economy.",
      hrefs: ["/utility/fuel-cost-calculator", "/utility/gas-mileage-calculator", "/finance/car-depreciation-calculator"],
    },
    {
      heading: "Content and social",
      intro: "Tag campaign links, check post lengths, resize images and make quote graphics.",
      hrefs: [
        "/utility/utm-builder",
        "/utility/social-media-character-counter",
        "/utility/social-media-image-resizer",
        "/utility/quote-image-generator-online",
        "/utility/aspect-ratio-calculator",
      ],
    },
    {
      heading: "Sports analytics",
      intro: "Estimate the expected-goals (xG) value of a shot from its distance, angle and situation.",
      hrefs: ["/utility/xg-expected-goals-calculator"],
    },
  ],
  methodology: {
    heading: "How these utilities handle your data",
    points: [
      {
        title: "Local by default",
        body: "QR and barcode generation, scanning, password checks and calculators run entirely in your browser.",
      },
      {
        title: "Server only when needed",
        body: "The IP and DNS tools have to query the network from a server. They return the result to you and don't build a history of your lookups.",
      },
      {
        title: "Static, permanent codes",
        body: "QR codes encode your content directly, with no tracking redirect, so they keep working indefinitely.",
      },
      {
        title: "Printable output",
        body: "Codes download as high-resolution images ready for print, and the CV builder exports a PDF.",
      },
    ],
  },
  guides: [
    { title: "What is xG in football?", href: "/blog/what-is-xg-in-football" },
    { title: "How is xG calculated?", href: "/blog/how-is-xg-calculated" },
    { title: "xG, xGA, npxG and xGOT explained", href: "/blog/difference-between-xg-xga-npxg-xgot" },
    { title: "xG per game benchmarks", href: "/blog/xg-per-game-benchmarks" },
    { title: "xG by position benchmarks", href: "/blog/xg-by-position-benchmarks" },
    { title: "Penalty kick xG explained", href: "/blog/penalty-kick-xg-explained" },
    { title: "FBref vs Understat vs Opta xG", href: "/blog/fbref-vs-understat-vs-opta-xg" },
  ],
  faqs: [
    {
      question: "Do QR codes made here expire?",
      answer:
        "No. They're static QR codes: the URL or text is encoded in the pattern itself, so there's no redirect service that could be switched off. The trade-off is that you can't change the destination after printing, so check the link first.",
    },
    {
      question: "Can I scan a barcode without installing an app?",
      answer:
        "Yes. The scanners use your phone or laptop camera through the browser (you'll be asked for permission), or you can upload a photo of the code instead.",
    },
    {
      question: "Is it safe to type my real password into a strength checker?",
      answer:
        "This checker runs entirely in your browser and never sends the password anywhere. As a general habit, though, test a password with a similar structure rather than the exact password you use.",
    },
  ],
};
