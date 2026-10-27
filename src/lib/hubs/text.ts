import type { HubContent } from "./types";

export const textHub: HubContent = {
  path: "/text",
  label: "Text Tools",
  metaTitle: "Free Text Tools: Case Converter, OCR, Readability & Word Counts",
  metaDescription:
    "Free browser-based text tools: convert case, extract text from images (OCR), score readability, find repeated words, build word clouds, and translate binary or Morse code.",
  h1: "Text tools for writers, editors and developers",
  lead:
    "Clean up, analyse and convert text without pasting it into an account-based app. These tools cover the jobs that come up while editing: fixing capitalisation, checking readability, spotting repetition and pulling text out of screenshots.",
  intro: [
    "Writing and editing tasks are usually small but frequent: a heading in the wrong case, a draft that reads too densely, a word repeated three times in a paragraph, a screenshot you need as editable text. Each tool here does one of those jobs well and shows its result instantly.",
    "Text you paste is processed in your browser, and OCR runs locally with Tesseract, so these tools are safe for unpublished drafts, client copy and internal documents. The one exception is the AI humanizer, which has to send your text to a language model to rewrite it.",
  ],
  groups: [
    {
      heading: "Editing and formatting",
      intro:
        "Fix capitalisation for titles, sentences and code identifiers (camelCase, snake_case, kebab-case), and catch repeated words before you publish.",
      hrefs: ["/text/case-converter", "/text/duplicate-word-finder"],
    },
    {
      heading: "Analysis and readability",
      intro:
        "Measure how easy a text is to read with Flesch-Kincaid and related scores, see which words dominate a draft, and turn word frequency into a visual summary.",
      hrefs: [
        "/text/readability-flesch-kincaid-calculator",
        "/text/word-frequency",
        "/text/word-cloud-generator",
        "/utility/social-media-character-counter",
      ],
    },
    {
      heading: "Conversion and extraction",
      intro:
        "Extract editable text from photos and screenshots, or translate text to and from binary and Morse code, with the character-by-character mapping shown.",
      hrefs: ["/text/scan-text-from-image", "/text/binary-code-translator", "/text/morse-code-translator"],
    },
    {
      heading: "AI-assisted rewriting",
      intro: "Rework stiff, machine-sounding drafts into more natural prose, with control over tone and complexity.",
      hrefs: ["/ai/ai-humanizer"],
    },
  ],
  methodology: {
    heading: "What to expect from these tools",
    points: [
      {
        title: "Standard formulas",
        body: "Readability scores use the published Flesch Reading Ease and Flesch-Kincaid Grade Level formulas, so results match other standard tools.",
      },
      {
        title: "Local processing",
        body: "Case conversion, counting and OCR all run in your browser, and nothing you paste into them is uploaded.",
      },
      {
        title: "Built for real edits",
        body: "Outputs are ready to copy back into your document, CMS or code editor without cleanup.",
      },
      {
        title: "Free, no limits",
        body: "No word caps, no daily quotas and no sign-up wall.",
      },
    ],
  },
  guides: [
    { title: "Understanding binary code", href: "/blog/understanding-binary-code" },
    { title: "How to convert text to binary", href: "/blog/how-to-convert-text-to-binary" },
    { title: "Binary code translation for developers", href: "/blog/binary-code-translation-for-developers" },
    { title: "Binary code in cybersecurity", href: "/blog/binary-code-in-cybersecurity" },
  ],
  faqs: [
    {
      question: "What is a good Flesch Reading Ease score?",
      answer:
        "Scores run roughly from 0 to 100, and higher means easier to read. 60–70 is plain English that most adults read comfortably. Web and marketing copy usually aims for 60 or above, while academic and legal text often scores below 30.",
    },
    {
      question: "How accurate is the image-to-text OCR?",
      answer:
        "On clear screenshots and printed documents, accuracy is usually very high. Handwriting, low-resolution photos, unusual fonts and busy backgrounds reduce accuracy, so check the output before you rely on it.",
    },
    {
      question: "Is text I paste into these tools stored anywhere?",
      answer:
        "For the editing, analysis, conversion and OCR tools, no: processing happens in your browser tab and closing the tab clears it. The AI humanizer is different. It sends your text to an AI model to generate the rewrite.",
    },
    {
      question: "What's the difference between title case and sentence case?",
      answer:
        "Title case capitalises the major words in a heading (\"How to Write a Great Headline\"). Sentence case capitalises only the first word and proper nouns (\"How to write a great headline\"). Many style guides and most UI copy now prefer sentence case.",
    },
  ],
};
