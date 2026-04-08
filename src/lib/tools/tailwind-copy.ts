import type { TailwindTool } from "@/lib/tools/tailwind-catalog";

export function buildTailwindToolCopy(tool: TailwindTool) {
  const commonFaqs = {
    review: {
      question: "Should I review the generated code before using it in production?",
      answer:
        "Yes. These generators are built for speed and iteration, but you should still review the final classes or CSS against your design system, responsive breakpoints, and accessibility requirements.",
    },
  };

  switch (tool.kind) {
    case "colors":
      return {
        heading: "How this Tailwind color tool helps",
        paragraphs: [
          "Tailwind's color system is fast once you know the palette, but it is easy to lose time bouncing between docs, shade names, and copied class strings. This page brings the scale, hex values, and utility classes into one working view.",
          "Use it when you need to compare shades, build a palette quickly, or copy exact background, text, and border classes without guessing which step in the scale is the right fit.",
        ],
        faqs: [
          {
            question: "How do I pick the right Tailwind shade?",
            answer:
              "Start by comparing a few steps in the same family. Mid tones like 500 or 600 are useful for primary accents, while 50 to 200 work better for soft backgrounds and 700 to 900 work better for text or strong emphasis.",
          },
          {
            question: "Can I copy both the class name and the hex value?",
            answer:
              "Yes. This page is meant for both workflows: utility-class copy when you are writing Tailwind, and hex copy when you need to hand a color off to plain CSS, Figma, or another tool.",
          },
          commonFaqs.review,
        ],
      };
    case "gradient":
      return {
        heading: "How this gradient generator is useful",
        paragraphs: [
          "Building gradients by hand is repetitive: choose the direction, test the stops, preview the blend, then translate it into classes and CSS. This generator keeps that whole loop in one place.",
          "It is useful for hero backgrounds, cards, buttons, badges, callouts, and any Tailwind UI where you want a quick visual gradient without trial-and-error in the editor.",
        ],
        faqs: [
          {
            question: "Does this generate both Tailwind classes and plain CSS?",
            answer:
              "Yes. You can copy the utility-class version for Tailwind projects and the CSS version for plain stylesheets, design handoff, or debugging.",
          },
          {
            question: "When should I use a two-stop gradient versus a three-stop gradient?",
            answer:
              "Two stops are cleaner and usually better for simple buttons or compact surfaces. Add a middle stop when you want a richer blend or a more noticeable color transition across a larger area.",
          },
          commonFaqs.review,
        ],
      };
    case "shadow":
      return {
        heading: "Why a shadow generator saves time",
        paragraphs: [
          "Shadows are one of those details that are hard to dial in by eye while switching between code and preview. This tool lets you adjust the visual depth first and then copy the matching Tailwind class or CSS value.",
          "It works well for cards, dialogs, dropdowns, buttons, and dashboard surfaces where elevation matters but you still want the result to stay restrained and readable.",
        ],
        faqs: [
          {
            question: "Should I use a preset shadow or a custom shadow?",
            answer:
              "Start with a preset if you want something fast and consistent with common Tailwind usage. Use the custom shadow controls when you need a more specific depth, softer spread, or a brand-colored shadow.",
          },
          {
            question: "Will custom shadows still work in Tailwind?",
            answer:
              "Yes. The tool outputs an arbitrary-value Tailwind class for custom shadows, so you can still keep the result inside a Tailwind workflow.",
          },
          commonFaqs.review,
        ],
      };
    case "button":
      return {
        heading: "What this button generator is for",
        paragraphs: [
          "Buttons are one of the most repeated UI elements in any Tailwind project, so small spacing or radius decisions get repeated everywhere. This generator helps you test those choices quickly before you paste the final class string into your component.",
          "Use it when you need a clean starting point for primary buttons, secondary actions, compact controls, or call-to-action styling without hand-assembling every utility each time.",
        ],
        faqs: [
          {
            question: "Can I use this output directly in a React or Next.js component?",
            answer:
              "Yes. The generated markup is intended to be pasted into a component and then adjusted for your own states, icons, disabled handling, or design-system conventions.",
          },
          {
            question: "Does the preview help with accessibility decisions?",
            answer:
              "It helps visually, but you should still review contrast, focus styles, hover states, and disabled states before shipping the final button.",
          },
          commonFaqs.review,
        ],
      };
    case "flexbox":
      return {
        heading: "Why this flexbox generator matters",
        paragraphs: [
          "Flexbox problems often come down to a few utilities: direction, alignment, wrapping, and gap. This page lets you see those relationships together instead of toggling classes mentally or searching docs while debugging a layout.",
          "It is useful for navigation rows, toolbar layouts, card headers, button groups, and stacked sections where you want a reliable starting point before fine-tuning responsive behavior.",
        ],
        faqs: [
          {
            question: "What is the fastest way to debug a flex layout here?",
            answer:
              "Start with direction, then justify-content, then align-items, then gap. Those four controls usually explain most layout problems in everyday Tailwind flexbox work.",
          },
          {
            question: "Does this output plain CSS too?",
            answer:
              "Yes. You can copy the Tailwind utility string or the equivalent CSS declarations, which is useful when you are comparing approaches or debugging someone else's code.",
          },
          commonFaqs.review,
        ],
      };
    case "grid":
      return {
        heading: "When a grid generator is useful",
        paragraphs: [
          "CSS Grid is powerful, but the combination of columns, gaps, alignment, and item placement can still slow you down when you are testing layout ideas. This page gives you a fast visual loop for common Tailwind grid setups.",
          "Use it for cards, dashboards, galleries, metric blocks, and repeated content layouts where you want a stable grid foundation before you add responsive tweaks.",
        ],
        faqs: [
          {
            question: "What kind of layouts is this best for?",
            answer:
              "It is best for repeated content blocks such as cards, feature grids, stat panels, galleries, and dashboards where a consistent multi-column structure matters more than one-off positioning.",
          },
          {
            question: "Should I still add responsive breakpoints after generating the grid?",
            answer:
              "Yes. This generator gives you a strong base class string, but you should still layer in breakpoint-specific classes for production layouts that need to adapt across mobile and desktop.",
          },
          commonFaqs.review,
        ],
      };
    case "card":
      return {
        heading: "What this card generator helps you decide",
        paragraphs: [
          "Cards look simple, but the feel of a card usually comes from a few small choices: surface color, spacing, radius, accent treatment, and shadow depth. This page puts those decisions in one place so you can iterate visually.",
          "It is useful for product cards, dashboard panels, feature blocks, pricing sections, and content teasers where you want a polished Tailwind card without hand-building the same structure every time.",
        ],
        faqs: [
          {
            question: "Can I use this as a starting point rather than a final design?",
            answer:
              "Yes. The generator is best used as a fast starting block. You can paste the markup into your project and then adapt the content, interactions, and responsive behavior to your own component system.",
          },
          {
            question: "What should I pay attention to in the preview?",
            answer:
              "Look at spacing rhythm, line length, button contrast, shadow depth, and whether the accent color helps the hierarchy or just adds noise. Those are the details that usually decide whether a card feels polished.",
          },
          commonFaqs.review,
        ],
      };
    case "css-to-tailwind":
      return {
        heading: "How this CSS to Tailwind converter should be used",
        paragraphs: [
          "This converter is designed for common CSS declarations, not for every advanced selector or edge case. It is most useful when you want to translate a small block of layout, spacing, color, or typography rules into Tailwind utilities quickly.",
          "Use it as a productivity tool when migrating snippets, prototyping class strings, or translating hand-written CSS into a utility-first starting point. Then review the result before you paste it into production code.",
        ],
        faqs: [
          {
            question: "Will it convert every CSS rule perfectly?",
            answer:
              "No. It focuses on the declarations that map well to Tailwind utilities, such as layout, spacing, gap, colors, alignment, radius, shadow, and a few sizing rules. Unsupported declarations are listed separately instead of being guessed.",
          },
          {
            question: "Is this better for small snippets or full stylesheets?",
            answer:
              "It is better for targeted snippets. Use it on a rule block or a small set of declarations, then review and refine the output by hand.",
          },
          commonFaqs.review,
        ],
      };
    case "tailwind-to-css":
      return {
        heading: "How this Tailwind to CSS converter helps",
        paragraphs: [
          "When you inherit a Tailwind class string or need to explain it to someone working in plain CSS, translating the utilities into readable declarations can save time. This page makes that translation faster for common classes.",
          "It is useful for debugging, code review, design handoff, onboarding, and understanding what a class-heavy snippet is really doing before you refactor it.",
        ],
        faqs: [
          {
            question: "Does this support every Tailwind class?",
            answer:
              "No. It focuses on common layout, spacing, color, shadow, radius, and typography classes. Unsupported tokens are shown separately so you can see exactly what still needs manual handling.",
          },
          {
            question: "Why would I convert Tailwind classes back to CSS?",
            answer:
              "The most common reasons are debugging, documenting styles for teammates, explaining a component in review, or porting a snippet into a non-Tailwind environment.",
          },
          commonFaqs.review,
        ],
      };
  }
}
