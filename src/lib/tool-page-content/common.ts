export type FaqItem = {
  question: string;
  answer: string;
};

export type Section = {
  heading: string;
  paragraphs: string[];
};

export type EditorialContent = {
  introHeading: string;
  introParagraphs: string[];
  sections: Section[];
  faqs: FaqItem[];
};

const MOJIBAKE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Â/g, ""],
  [/â€”/g, "-"],
  [/â€“/g, "-"],
  [/â€œ/g, "\""],
  [/â€/g, "\""],
  [/â€˜/g, "'"],
  [/â€™/g, "'"],
  [/â€¦/g, "..."],
  [/â†’/g, "->"],
  [/â†“/g, "↓"],
  [/â /g, "SPACE"],
  [/âˆ…/g, "NONE"],
];

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function editorialWordCount(content: EditorialContent) {
  return countWords(
    [
      content.introHeading,
      ...content.introParagraphs,
      ...content.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
      ...content.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ].join(" "),
  );
}

export function uniqueFaqs(...groups: FaqItem[][]) {
  const seen = new Set<string>();
  const merged: FaqItem[] = [];

  for (const group of groups) {
    for (const faq of group) {
      const key = faq.question.trim().toLowerCase();
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      merged.push(faq);
    }
  }

  return merged;
}

export function normalizeText(text: string) {
  return MOJIBAKE_REPLACEMENTS.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    text,
  );
}

export function normalizeEditorialContent(content: EditorialContent): EditorialContent {
  return {
    introHeading: normalizeText(content.introHeading),
    introParagraphs: content.introParagraphs.map(normalizeText),
    sections: content.sections.map((section) => ({
      heading: normalizeText(section.heading),
      paragraphs: section.paragraphs.map(normalizeText),
    })),
    faqs: content.faqs.map((faq) => ({
      question: normalizeText(faq.question),
      answer: normalizeText(faq.answer),
    })),
  };
}

export function ensureFaqCount(baseFaqs: FaqItem[], extraFaqs: FaqItem[]) {
  const merged = uniqueFaqs(baseFaqs, extraFaqs, [
    {
      question: "Will this page send my content to a server?",
      answer:
        "No. The tool works locally in the browser after the page loads, so your text, files, or generated output stay on your device unless you choose to copy or download the result yourself.",
    },
    {
      question: "Should I review the result before using it in production?",
      answer:
        "Yes. These tools remove repetitive work, but they do not replace judgment. A quick review catches formatting assumptions, broken separators, precision issues, or context-specific details that an automated conversion cannot infer for you.",
    },
    {
      question: "What should I verify first after using the tool?",
      answer:
        "Verify the output in the exact destination where it will be used next. That could mean checking layout, syntax, encoding, file size, page order, copied classes, or whether the receiving system accepts the result without additional cleanup.",
    },



  ]);

  if (merged.length >= 8) {
    return merged;
  }

  return merged.slice(0, 8);
}

export function ensureLongEnough(content: EditorialContent, fallbackSection: Section) {
  if (editorialWordCount(content) >= 1000) {
    return normalizeEditorialContent(content);
  }

  const withFallback = {
    ...content,
    sections: [...content.sections, fallbackSection],
  };

  if (editorialWordCount(withFallback) >= 1000) {
    return normalizeEditorialContent(withFallback);
  }

  return normalizeEditorialContent({
    ...withFallback,
    sections: [
      ...withFallback.sections,
      {
        heading: "Final review checklist before you copy the result",
        paragraphs: [
          "A useful utility page should reduce repetitive effort, not remove the last mile of verification. Before you copy the result onward, compare it against the real destination and confirm that the next system accepts the format, preserves the meaning you expect, and does not introduce a second hidden transformation during paste, upload, import, or export.",
          "That last check is where reliable tool pages become genuinely useful. It keeps the tool honest about scope, gives the user a practical operating habit, and turns a quick browser action into something dependable enough to reuse under deadline pressure.",
        ],
      },
    ],
  });
}
