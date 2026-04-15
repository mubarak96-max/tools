import type { TailwindTool } from "@/lib/tools/tailwind-catalog";
import { buildTailwindToolCopy } from "@/lib/tools/tailwind-copy";

import type { EditorialContent, FaqItem } from "./common";
import { ensureFaqCount, ensureLongEnough } from "./common";

function buildNotes(tool: TailwindTool) {
  switch (tool.kind) {
    case "css-to-tailwind":
    case "tailwind-to-css":
      return {
        context:
          "Translation tools are useful when code needs to move across styling systems, handoff boundaries, or debugging contexts. They reduce the friction of understanding what a snippet is doing without pretending every style maps perfectly in both directions.",
        workflow:
          "The practical workflow is to convert a focused snippet, review the unsupported pieces, and then refine the result inside the real component or stylesheet where responsive behavior and project-specific conventions still live.",
        review:
          "Review should focus on unsupported declarations, responsive variants, pseudo states, arbitrary values, and whether the translated output still reflects the intent of the original styling.",
        limits:
          "Not every CSS rule or Tailwind token has a clean one-to-one mapping. Treat the result as a strong starting point for common utilities rather than as a perfect universal compiler.",
        extras: [
          {
            question: "Why are conversion pages best for small snippets instead of whole codebases?",
            answer:
              "Because mapping styling systems works best when the scope is narrow and visible. Full codebases usually need project-aware refactoring, naming decisions, responsive review, and cleanup that go beyond direct translation.",
          },
          {
            question: "What should I review first after translating styles?",
            answer:
              "Review any unsupported rules, then compare layout, spacing, color, and responsive behavior in the real component rather than trusting the translated code at face value.",
          },
          {
            question: "Can a style translation be syntactically correct but still wrong?",
            answer:
              "Yes. It may compile while still missing intent, especially around responsive variants, state classes, or project-specific constraints that the converter cannot infer.",
          },
          {
            question: "Why do conversion tools still need manual cleanup afterward?",
            answer:
              "Because styling decisions are partly structural and partly contextual. The converter helps with the mechanical part, but the project still owns the final semantic and responsive decisions.",
          },
        ] satisfies FaqItem[],
      };
    default:
      return {
        context:
          "Visual Tailwind generators are useful when the friction is in choosing and verifying utilities rather than writing raw markup. They shorten the loop between visual intent and copied class strings, which is especially valuable for repeated UI patterns.",
        workflow:
          "The usual workflow is to configure the preview, compare a few variations, copy the classes or markup, and then finish the component in the real codebase where responsive behavior, states, and accessibility are enforced.",
        review:
          "Review should focus on spacing rhythm, contrast, hover and focus states, responsive behavior, and whether the generated code matches the project conventions rather than just looking acceptable in isolation.",
        limits:
          "Generators are strongest as starting points. They accelerate the repetitive choices, but they cannot know your full design system, naming rules, state logic, or component architecture.",
        extras: [
          {
            question: "What makes a Tailwind generator useful in practice?",
            answer:
              "It removes the repetitive part of testing classes by bringing configuration, preview, and copy actions together. That is valuable when the UI pattern is common and the time sink is iteration rather than invention.",
          },
          {
            question: "What should I check after copying generated Tailwind code?",
            answer:
              "Check how it behaves at your real breakpoints, how it handles long content, and whether the colors, spacing, and interaction states still fit the surrounding design system.",
          },
          {
            question: "Can I treat the generated output as final production code?",
            answer:
              "You can treat it as a strong starting point, but production code still deserves a quick pass for naming, accessibility, responsive behavior, and component-specific cleanup.",
          },
          {
            question: "Why do small Tailwind pages benefit from longer explanatory content?",
            answer:
              "Because the class string is only part of the job. The useful part is understanding when the generator fits the workflow, what tradeoffs it makes, and what to verify before the code lands in a real component.",
          },
        ] satisfies FaqItem[],
      };
  }
}

export function buildTailwindEditorial(tool: TailwindTool): EditorialContent {
  const seed = buildTailwindToolCopy(tool);
  const notes = buildNotes(tool);

  const content: EditorialContent = {
    introHeading: seed.heading,
    introParagraphs: [
      ...seed.paragraphs,
      notes.context,
      notes.workflow,
    ],
    sections: [
      {
        heading: `Where ${tool.name.toLowerCase()} helps most`,
        paragraphs: [
          `${tool.name} is strongest when the pain point is iteration speed rather than raw capability. ${tool.description} That kind of task happens constantly in Tailwind work: choosing a shade, tuning a gradient, assembling a shadow, translating a snippet, or building a clean utility string for a repeated component pattern.`,
          "A dedicated page helps because it keeps the preview and the copied code close together. That tight loop matters more than it sounds. The faster you can see the result, compare a variation, and copy a working class string, the less likely you are to lose time bouncing between docs, browser tabs, design files, and your editor.",
        ],
      },
      {
        heading: "How to review generated Tailwind output before shipping it",
        paragraphs: [
          notes.review,
          "A good rule is to treat the generator output as the first correct draft, not the final answer. That mindset keeps the tool useful without over-trusting it. It also matches real frontend work, where even a good class string still has to survive content changes, responsive pressure, and the standards of the component system around it.",
        ],
      },
      {
        heading: "Common workflow patterns for Tailwind pages",
        paragraphs: [
          "These pages are usually used in one of three ways: to explore a visual option quickly, to accelerate a repetitive component pattern, or to translate code between styling contexts during debugging or handoff. Each of those workflows benefits from speed, but all three still end with review inside the actual project.",
          "That final in-project review is where you confirm whether a color holds up against accessible text, whether a grid still works on mobile, whether a converted class string matches the surrounding conventions, or whether a generated card still behaves correctly once real content replaces the preview.",
        ],
      },
      {
        heading: "Limits, edge cases, and why the component context still matters",
        paragraphs: [
          notes.limits,
          "That is why the best Tailwind generators are explicit about their role. They do not replace component ownership, design review, or accessibility checks. They simply make the narrow, repetitive part faster so you can spend more attention on the decisions that still need human judgment.",
        ],
      },
    ],
    faqs: ensureFaqCount(seed.faqs, [
      ...notes.extras,
      {
        question: `What is ${tool.name.toLowerCase()} best used for?`,
        answer:
          `${tool.description} It is best used to speed up a narrow Tailwind task, generate a strong starting point, and reduce repetitive trial-and-error before the code goes into a real component.`,
      },
      {
        question: "Should I still test the result inside my app after using this page?",
        answer:
          "Yes. The preview gets you close, but the real component context still determines whether the code works with your content, breakpoints, theme tokens, and interaction states.",
      },
      {
        question: "Can these pages replace Tailwind docs entirely?",
        answer:
          "No. They complement the docs by speeding up frequent tasks, but the broader framework reference still matters when you need deeper composition, plugin behavior, or project-specific architecture decisions.",
      },
      {
        question: "Why is unique editorial content important for Tailwind tool pages?",
        answer:
          "Because each page serves a different operational intent. A color browser, grid generator, gradient builder, and CSS translator solve different problems and need different guidance to be genuinely useful and discoverable.",
      },
    ]),
  };

  return ensureLongEnough(content, {
    heading: "Why dedicated Tailwind pages are better than generic generator placeholders",
    paragraphs: [
      "Tailwind users usually search with a concrete job in mind, not just a topic area. They want a color scale, a better shadow, a grid starter, a button pattern, or a translation between CSS and utilities. Pages that respect that narrow intent perform better because they solve the real task directly.",
      "That is also why these pages need authored content instead of a generic wrapper. Strong editorial guidance makes the tool more usable in the moment and gives the page a clearer topical footprint for long-tail search over time.",
    ],
  });
}
