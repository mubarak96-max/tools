import { EXACT_TEXT_TOOLS, type ExactTextTool } from "@/lib/tools/exact-catalog";

export type TextSeoFaq = {
  question: string;
  answer: string;
};

export type TextSeoSection = {
  heading: string;
  paragraphs: string[];
};

export type ExactTextSeoContent = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  learnTitle: string;
  introParagraphs: string[];
  sections: TextSeoSection[];
  faqs: TextSeoFaq[];
};

function familyNotes(tool: ExactTextTool) {
  switch (tool.family) {
    case "cleaner":
      return {
        useCase: "cleanup, normalization, and imported-text repair",
        caution:
          "These operations are often intentionally destructive, so the right workflow is to keep the original text nearby and validate one representative output before reusing the result more broadly.",
      };
    case "line":
      return {
        useCase: "list cleanup, row handling, sorting, and repeated line transformations",
        caution:
          "Line operations can change order, separators, or visible structure, so the destination still matters even when the result looks tidy in a textarea.",
      };
    case "align":
      return {
        useCase: "monospace formatting, column alignment, and fixed-width display work",
        caution:
          "Alignment only stays reliable when the destination uses compatible fonts and spacing behavior, so previewing the copied text once in the real target is still worth doing.",
      };
    case "extractor":
    case "regex":
      return {
        useCase: "pattern matching, value extraction, and selective text cleanup",
        caution:
          "Pattern-driven tools are powerful, but broad matches can collect more than you intended. A sample-first check keeps the extraction or replacement honest.",
      };
    case "stats":
      return {
        useCase: "editorial review, SEO checking, readability, and content diagnostics",
        caution:
          "Metrics are decision aids rather than verdicts. They help you spot patterns, but they do not replace judgment about audience, meaning, or publishing goals.",
      };
    case "transform":
      return {
        useCase: "format switching between writing, slugs, inline lists, and structured text",
        caution:
          "Transformations can look harmless while still affecting separators, list semantics, or downstream parsing behavior, so review the result where it will actually be used.",
      };
    case "generator":
      return {
        useCase: "placeholder text generation and draft scaffolding",
        caution:
          "Generated placeholder content is useful for layout and workflow testing, but it should not be mistaken for final copy or domain-accurate content.",
      };
    case "compare":
      return {
        useCase: "revision review, copy comparison, and quick change inspection",
        caution:
          "A diff view is only helpful when the compared texts are the right versions in the first place, so source control and basic version awareness still matter.",
      };
    case "unicode":
      return {
        useCase: "decorative text, Unicode styling, invisible characters, and novelty formatting",
        caution:
          "Unicode transformations can affect accessibility, readability, search behavior, and rendering consistency across apps, so the copied result should always be previewed once in the destination.",
      };
    case "reference":
      return {
        useCase: "character lookup, encoding diagnosis, and exact symbol identification",
        caution:
          "Character problems are often invisible rather than dramatic, so precise identification matters more than appearance when you are debugging copied text.",
      };
  }
}

export function getExactTextSeoContent(tool: ExactTextTool): ExactTextSeoContent {
  const notes = familyNotes(tool);
  const lowerName = tool.name.toLowerCase();

  return {
    metaTitle: `${tool.name} Online | ${tool.name} Tool`,
    metaDescription: `${tool.description} Use ${lowerName} in your browser with practical guidance, review notes, and workflow-focused help.`,
    keywords: [
      tool.name.toLowerCase(),
      tool.slug.replace(/-/g, " "),
      `${tool.name.toLowerCase()} online`,
      `${tool.category.toLowerCase()} tool`,
      `${notes.useCase} tool`,
    ],
    learnTitle: `How to use ${lowerName}`,
    introParagraphs: [
      `${tool.name} is built for a narrow job, but narrow jobs are often the ones that slow people down the most. ${tool.description} Users usually land on pages like this because a real workflow is blocked right now and they do not want to keep fixing the same structure by hand.`,
      `That makes the page useful in a very practical way. It is not trying to be a full editor. It is trying to remove repetitive effort from ${notes.useCase} while keeping the operation local in the browser and keeping the result easy to review before it moves downstream.`,
      `Good utility pages earn trust by being explicit about what changes and what does not. The tool applies one focused operation consistently, which is often exactly what a user needs when the alternative is line-by-line cleanup, repeated find-and-replace passes, or manual reformatting inside a heavier app.`,
      notes.caution,
    ],
    sections: [
      {
        heading: `When ${lowerName} is the right tool`,
        paragraphs: [
          `${tool.name} is most useful when the input already contains the right underlying information and the main problem is formatting, structure, or extraction rather than meaning. That is the sweet spot for browser utilities: take a real working input, apply one deliberate rule, and produce something cleaner or more usable for the next step.`,
          `This is also why dedicated pages perform better than generic catalogs for tasks like this. Search intent is specific. A user looking for ${lowerName} is not looking for a vague text helper. They want one exact operation, a predictable result, and enough explanation to know whether they can trust the output under deadline pressure.`,
        ],
      },
      {
        heading: "How to review the output before copying it onward",
        paragraphs: [
          `The right review depends on the destination. Some users care about exact separators, others care about import readiness, readability, parser behavior, or whether copied text now matches a naming pattern or content requirement. A quick destination-aware check is what turns a fast utility action into a dependable workflow step.`,
          `That review is not wasted effort. It catches the real edge cases: spacing that looked harmless, Unicode that renders differently elsewhere, list semantics that changed, extracted values that matched too broadly, or metrics that are technically correct but not editorially useful without context.`,
        ],
      },
      {
        heading: "Limits, edge cases, and practical boundaries",
        paragraphs: [
          `Focused text tools are strongest when the scope is literal. They do one thing well. That means they also have clear limits. They do not know your business rules, publishing workflow, parser quirks, or domain-specific exceptions. The operation may be right in general while still being wrong for a particular destination.`,
          `Being explicit about those limits improves usability and SEO at the same time. A page with real scope, real edge cases, and practical follow-up guidance is more useful to users and more defensible than a thin wrapper that only exposes an input and output box.`,
        ],
      },
      {
        heading: "Where this page fits in a broader workflow",
        paragraphs: [
          `${tool.name} is usually one step in a chain. The surrounding steps may involve copying from another source, validating the result, publishing the cleaned text, importing it into a system, or moving on to another analysis or formatting tool. That broader workflow framing matters because it tells users when the page is enough on its own and when a second check is still necessary.`,
          `That is also why internal linking matters for these pages. Users often need a follow-up, not just a result. A strong page helps them complete the current operation and then discover the next related tool naturally rather than sending them back to search for the next step from scratch.`,
        ],
      },
    ],
    faqs: [
      {
        question: `What is ${lowerName} useful for?`,
        answer:
          `${tool.description} It is useful when you need one exact text operation done quickly and consistently in the browser instead of editing the same structure manually.`,
      },
      {
        question: "Should I keep the original text before using the tool?",
        answer:
          "Yes. Keeping the original makes it easier to compare results, recover lost formatting, and rerun the operation with different settings if the destination turns out to need something slightly different.",
      },
      {
        question: "Can this page replace a full editor or project workflow?",
        answer:
          "No. It complements the larger workflow by handling one focused task well. Final review, domain context, and destination-specific validation still belong to the broader process.",
      },
      {
        question: "Why do dedicated text utility pages need substantial content?",
        answer:
          "Because the operation may be small, but the user intent is specific and high stakes. Useful guidance about fit, review, and edge cases saves more time than a thin page that only shows a textarea and button.",
      },
    ],
  };
}

export const EXACT_TEXT_SEO_CONTENT = Object.fromEntries(
  EXACT_TEXT_TOOLS.map((tool) => [tool.slug, getExactTextSeoContent(tool)]),
) as Record<ExactTextTool["slug"], ExactTextSeoContent>;
