import type { ExactUtilityTool } from "@/lib/tools/exact-catalog";
import { buildUtilityToolCopy } from "@/lib/tools/exact-copy";

import type { EditorialContent, FaqItem } from "./common";
import { ensureFaqCount, ensureLongEnough, normalizeEditorialContent } from "./common";

function familyNotes(tool: ExactUtilityTool) {
  if (tool.family === "code") {
    return {
      context:
        "Code utilities are usually used under time pressure: during debugging, cleanup, migration, review, or handoff. The value of a browser-side formatter, minifier, or validator is speed and focus, not blind trust. You still want to inspect the output in the context where the code will be used next.",
      workflow:
        "A practical workflow is to paste the smallest meaningful snippet, run the action, inspect the result, and then move back into your project with a cleaner input or clearer error state. That is often faster than opening a full codebase just to answer one formatting or syntax question.",
      review:
        "Review should focus on semantics, embedded templates, quotes, comments, and whether the tool was applied to a complete valid snippet. Formatters improve structure, validators confirm syntax, and minifiers reduce size, but none of those actions guarantee that runtime behavior stays correct in every context.",
      limits:
        "The biggest edge case is partial or context-dependent code. A snippet may be valid only inside a larger file, build step, framework compiler, or templating environment. When that happens, treat the result as a strong hint rather than the last word.",
      extras: [
        {
          question: "Will this fix broken logic automatically?",
          answer:
            "No. These tools help with formatting, compaction, and syntax checking. They do not understand your business logic well enough to repair broken code paths or framework-specific behavior.",
        },
        {
          question: "Can I use partial snippets instead of full files?",
          answer:
            "Usually yes, but the result depends on whether the snippet is valid on its own. Complete, self-contained input gives more reliable validation and cleaner formatting.",
        },
        {
          question: "Should I compare the output with the original after minifying or prettifying?",
          answer:
            "Yes. A quick comparison catches copied placeholders, malformed templates, or framework-specific syntax that may need manual handling before the code goes back into a project.",
        },
        {
          question: "Is this enough for production deployment checks?",
          answer:
            "No. Treat it as a focused pre-check. You should still run your normal build, test, lint, or runtime validation pipeline in the real project before shipping changes.",
        },
      ] satisfies FaqItem[],
    };
  }

  return {
    context:
      "Random generators are useful when you need plausible values quickly for testing, prototyping, demos, or lightweight workflow tasks. The point is not to create one perfect answer. It is to reduce friction so you can generate, inspect, and regenerate until the value fits the immediate job.",
    workflow:
      "In practice, these pages are used during QA, form testing, placeholder creation, sample-data seeding, or small content decisions. They work best when you know the rough shape you need and want a browser-side way to keep moving instead of hand-making every temporary value.",
    review:
      "Review matters because random output can be technically valid and still wrong for the immediate context. A password may not match an internal policy, a number may not suit the test range, or a generated string may not be representative enough for a particular edge case.",
    limits:
      "The key limitation is intent. Randomness gives you variation, not judgment. If the next system has compliance, cryptographic, accessibility, or business-specific requirements, you should verify those rules separately.",
    extras: [
      {
        question: "Can I rerun the generator until I get a better result?",
        answer:
          "Yes. That is the normal workflow for random utility pages. Generate again until the value matches the shape, range, or feel you need for the current task.",
      },
      {
        question: "Are these values meant for testing or for permanent production use?",
        answer:
          "They are best suited to testing, prototyping, demos, and convenience workflows. For production-grade security or policy-sensitive systems, you should still follow your own reviewed standards.",
      },
      {
        question: "Why should I review a random output before copying it?",
        answer:
          "Because random does not mean context-aware. A value may be valid in general but still wrong for your field length, policy rules, sample realism, or range assumptions.",
      },
      {
        question: "Can one generator cover every edge case I might need?",
        answer:
          "No. These pages are intentionally narrow. They help produce useful sample values quickly, but domain-specific constraints still need domain-specific review.",
      },
    ] satisfies FaqItem[],
  };
}

export function buildExactUtilityEditorial(tool: ExactUtilityTool): EditorialContent {
  const seed = buildUtilityToolCopy(tool);
  const notes = familyNotes(tool);

  const content: EditorialContent = {
    introHeading: seed.heading,
    introParagraphs: [
      ...seed.paragraphs,
      notes.context,
      notes.workflow,
    ],
    sections: [
      {
        heading: `Where ${tool.name.toLowerCase()} fits in real work`,
        paragraphs: [
          `${tool.name} is most useful when the work is too small to justify a full project context but still important enough that manual handling is wasteful. ${tool.description} That is a narrow but very real class of task. People hit it during reviews, CMS work, QA, docs updates, debugging, prototyping, and handoff preparation, where the overhead of switching tools can cost more than the operation itself.`,
          `That is why a good utility page should feel operational rather than ornamental. It should tell you what the action does, what it does not do, and what you still need to check before the result goes anywhere important. The page earns trust by making the scope explicit instead of pretending to solve every nearby problem.`,
        ],
      },
      {
        heading: "What to review before you trust the result",
        paragraphs: [
          notes.review,
          `A focused tool is strongest when the output can be checked quickly. For formatting or validation tasks, compare structure, syntax, and any embedded data that could have special meaning in the destination environment. For random outputs, compare policy, realism, range, and shape. In either case the review is not optional overhead. It is the part that converts a fast browser action into a dependable workflow step.`,
        ],
      },
      {
        heading: "Common workflow patterns",
        paragraphs: [
          `The most reliable pattern is to use the page on a representative sample first. If the result looks right, copy it into the next system and verify there before repeating the task more broadly. That approach catches assumptions early and keeps you from applying the wrong action to a larger batch or a more sensitive context.`,
          `Another useful pattern is to pair the tool with a destination-aware follow-up. A formatter should be followed by a lint or runtime check in the real codebase. A random value should be followed by the actual form or policy validation that the production system enforces. A lightweight utility works best when it reduces friction without pretending to replace the destination environment.`,
        ],
      },
      {
        heading: "Limits, edge cases, and practical boundaries",
        paragraphs: [
          notes.limits,
          `That is also why it is worth keeping a copy of the source or recording the settings you used when the output matters. Small tools often feel disposable because the task is small, but the cost of a subtle mistake can still be large if the result ends up in production code, a customer-facing field, or a workflow with downstream automation.`,
        ],
      },
    ],
    faqs: ensureFaqCount(seed.faqs, [
      ...notes.extras,
      {
        question: `What is ${tool.name.toLowerCase()} best for?`,
        answer:
          `${tool.description} It is best for focused, high-friction tasks where opening a heavier workflow would cost more time than the operation itself.`,
      },
      {
        question: "Should I keep the original input after using this page?",
        answer:
          "Yes when the output matters. Keeping the original makes it easy to compare results, rerun the task with different settings, or explain what changed if someone else needs to review the workflow later.",
      },
      {
        question: "Can this page replace the tool I use in my actual project or process?",
        answer:
          "Usually no. It should complement the project or process, not replace it. The page handles a narrow operation quickly; the real environment still owns final validation, policy, and context.",
      },
      {
        question: "Why do focused utility pages still need detailed copy?",
        answer:
          "Because narrow tasks are often performed under deadline pressure. Clear explanations of scope, review steps, and failure modes save time and reduce the chance of copying a technically valid but contextually wrong result.",
      },
    ]),
  };

  return normalizeEditorialContent(ensureLongEnough(content, {
    heading: "Why narrow utility pages remain valuable",
    paragraphs: [
      `A strong utility page respects the fact that the task is small but still meaningful. It should remove the repetitive part, preserve privacy where possible, and provide enough explanation that a user knows what to review next. That is what separates a real working page from a thin wrapper that only looks complete until the first edge case appears.`,
      `That is also where content quality matters. The most useful page is not the one with the flashiest interface. It is the one that answers the operational questions a person has while they are trying to finish something quickly: what this does, what it will not do, what can go wrong, and how to verify the result before it moves downstream.`,
    ],
  }));
}
