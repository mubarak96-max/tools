import type { ExactTextTool } from "@/lib/tools/exact-catalog";
import { getExactTextSeoContent } from "@/lib/tools/exact-text-seo";

import type { EditorialContent, FaqItem } from "./common";
import { ensureFaqCount, ensureLongEnough } from "./common";

function buildExtraFaqs(tool: ExactTextTool): FaqItem[] {
  switch (tool.family) {
    case "cleaner":
      return [
        {
          question: "Should I keep a copy of the original text before cleaning it?",
          answer:
            "Yes. Cleanup tools are often intentionally destructive, so keeping the original makes it easier to compare results or recover formatting details that turned out to matter.",
        },
        {
          question: "What is the safest way to use a text cleaner?",
          answer:
            "Run it on a representative sample first, confirm the output against the destination, and then reuse the same step on the rest of the text only when the result is clearly correct.",
        },
      ];
    case "regex":
      return [
        {
          question: "Why should I test a regex pattern on a small sample first?",
          answer:
            "Because a broad pattern can match far more than you intended. Testing on a sample makes it easier to confirm grouping, flags, and replacement behavior before you run the pattern across a longer document.",
        },
        {
          question: "What usually causes a regex result to look wrong?",
          answer:
            "The most common reasons are greedy matching, missing flags, unescaped special characters, or assuming line-by-line behavior when the pattern is actually running across a larger text block.",
        },
      ];
    case "stats":
      return [
        {
          question: "Do text metrics replace editorial judgment?",
          answer:
            "No. Counts and readability signals are useful review inputs, but they do not decide whether the text is persuasive, accurate, or appropriate for the audience by themselves.",
        },
        {
          question: "What should I do after checking a text metric tool?",
          answer:
            "Use the metric to guide a concrete next step: rewrite repeated wording, shorten dense sentences, refine headings, or compare the output with the reading level or structure your destination actually needs.",
        },
      ];
    case "unicode":
      return [
        {
          question: "Why should I preview Unicode output in the target app?",
          answer:
            "Because Unicode styling and invisible characters can render differently depending on the font, platform, and app. A quick preview catches cases where the copied text behaves differently than it looked here.",
        },
        {
          question: "Can Unicode styling create copy-and-paste problems?",
          answer:
            "Yes. Decorative Unicode text can affect search, validation, sorting, accessibility, and readability, so it is best used deliberately rather than treated as normal plain text.",
        },
      ];
    case "reference":
      return [
        {
          question: "Why is a character table useful when the symbol already looks correct?",
          answer:
            "Because many text problems are not visual. A regular space, no-break space, zero-width space, hyphen, en dash, and em dash can all look similar enough to be confused while behaving very differently in code or copied content.",
        },
        {
          question: "What should I check after identifying a character?",
          answer:
            "Check whether the destination allows it, whether your font supports it, and whether a more basic ASCII alternative would be safer for the parser, validator, or publishing system involved.",
        },
      ];
    default:
      return [
        {
          question: "What makes a focused text tool worth using instead of editing manually?",
          answer:
            "Consistency. A narrow text tool applies one rule across the full input without the small misses that manual editing creates when the document is long or repetitive.",
        },
        {
          question: "How should I verify a text transformation before copying it onward?",
          answer:
            "Check the result against the destination rather than judging it only by how it looks in the output box. The next system may care about separators, hidden whitespace, Unicode handling, or line structure in ways a quick visual scan can miss.",
        },
      ];
  }
}

export function buildExactTextEditorial(tool: ExactTextTool): EditorialContent {
  const seo = getExactTextSeoContent(tool);

  const content: EditorialContent = {
    introHeading: seo.learnTitle,
    introParagraphs: seo.introParagraphs,
    sections: seo.sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs,
    })),
    faqs: ensureFaqCount(seo.faqs, [
      ...buildExtraFaqs(tool),
      {
        question: `What is ${tool.name.toLowerCase()} best used for?`,
        answer:
          `${tool.description} It works best when the transformation itself is clear and the main job is applying it consistently across a full block of pasted text.`,
      },
      {
        question: "Is this page better for quick checks or larger text cleanup jobs?",
        answer:
          "It is useful for both. The page is fast enough for quick spot fixes, but it is also effective on larger blocks when you need a repeatable browser-side step before importing, publishing, or analyzing text elsewhere.",
      },
      {
        question: "What usually goes wrong after a text transformation?",
        answer:
          "The result often looks right in isolation but fails in the next system because of hidden whitespace, separator choices, copied markup, Unicode differences, or assumptions about how the destination parses the content.",
      },
      {
        question: "Why does a single-purpose text page need detailed guidance?",
        answer:
          "Because people usually land on this kind of page while a workflow is blocked. Clear guidance about when to use the tool, what changes, and what to verify next removes more friction than a thin page that only exposes an input and output box.",
      },
    ]),
  };

  return ensureLongEnough(content, {
    heading: "Why dedicated text pages perform better than generic tool wrappers",
    paragraphs: [
      `${tool.name} solves a narrow operational problem, but the search intent around that problem is still specific and high stakes. Users usually are not browsing casually. They are trying to fix formatting, normalize copied content, debug parsing behavior, or finish a content workflow without introducing a subtle mistake on the way out.`,
      "That is why a strong page needs more than a textarea and a button. It should explain the transformation in plain language, show where the operation belongs in a broader workflow, and make the review step explicit enough that a user can trust the result under real working conditions.",
    ],
  });
}
