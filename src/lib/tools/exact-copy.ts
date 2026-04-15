import type {
  ExactConverterTool,
  ExactUtilityTool,
} from "./exact-catalog";

type ToolCopy = {
  heading: string;
  paragraphs: string[];
  faqs: Array<{ question: string; answer: string }>;
};

function converterFocus(tool: ExactConverterTool) {
  switch (tool.family) {
    case "encoding":
      return {
        angle: "representation and transport safety",
        review:
          "Check reserved characters, byte expectations, Unicode behavior, and whether the destination expects encoded transport text or plain decoded text.",
      };
    case "data":
      return {
        angle: "structure, flattening, and schema compatibility",
        review:
          "Check field names, nesting, arrays, null values, delimiter handling, and whether the destination format can preserve the source structure without lossy flattening.",
      };
    case "time":
      return {
        angle: "units, timezone assumptions, and readable formatting",
        review:
          "Check whether the input is a duration or timestamp, whether the units are seconds or milliseconds, and whether the result is meant for UTC storage or human display.",
      };
    case "unit":
      return {
        angle: "precision, rounding, and destination-friendly formatting",
        review:
          "Check decimal precision, rounding rules, display format, and whether the value is meant for UI, storage, analytics, or design tooling.",
      };
  }
}

export function buildConverterToolCopy(tool: ExactConverterTool): ToolCopy {
  const focus = converterFocus(tool);

  return {
    heading: `How the ${tool.name.toLowerCase()} works`,
    paragraphs: [
      `${tool.description} Pages like this are useful when the source value is already correct and the real job is to make that value acceptable to a different parser, import flow, display layer, or storage format.`,
      `The practical value is speed with clarity. A focused converter removes repetitive reformatting work and keeps the operation local in the browser, but it still leaves the destination-aware review in your hands.`,
      `This specific converter is mostly about ${focus.angle}. That matters because visually similar output can behave very differently once it reaches the real destination environment.`,
      focus.review,
    ],
    faqs: [
      {
        question: `What is ${tool.name.toLowerCase()} used for?`,
        answer:
          `${tool.description} It is useful when you know the format you need next and want a quick, browser-based way to produce it without writing one-off code.`,
      },
      {
        question: "Should I review the destination after converting the value?",
        answer:
          "Yes. The converter can produce technically valid output, but the receiving parser, CMS, import pipeline, or UI still determines whether the representation is correct for that workflow.",
      },
      {
        question: "Can I use this for one-off tasks and repeated checks?",
        answer:
          "Yes. It is fast enough for quick checks and repeatable enough for routine workflow use as long as the source and destination assumptions stay consistent.",
      },
      {
        question: "Is the conversion always perfectly reversible?",
        answer:
          "Not always. Some workflows normalize values, flatten structure, trim unsupported characters, or apply rounding, so reversibility depends on both the input and the destination format.",
      },
    ],
  };
}

function utilityFocus(tool: ExactUtilityTool) {
  if (tool.family === "code") {
    return {
      angle: "syntax, formatting, and compact code inspection",
      review:
        "Check embedded templates, comments, quoting, and whether the snippet is valid on its own rather than only valid inside a larger project context.",
    };
  }

  return {
    angle: "fast sample-value generation for testing and placeholder work",
    review:
      "Check whether the generated value matches the format, range, policy, and realism your next workflow actually expects before you copy it onward.",
  };
}

export function buildUtilityToolCopy(tool: ExactUtilityTool): ToolCopy {
  const focus = utilityFocus(tool);

  return {
    heading: `About ${tool.name.toLowerCase()}`,
    paragraphs: [
      `${tool.description} This kind of page is useful when the task is narrow, repetitive, and too small to justify opening a heavier project or desktop workflow.`,
      `The value is speed without unnecessary ceremony. You paste or generate the value, inspect it, and move on once the output is clearly usable for the next step.`,
      `This tool is mostly about ${focus.angle}. That is why the review step still matters even though the tool itself is intentionally lightweight.`,
      focus.review,
    ],
    faqs: [
      {
        question: `What is ${tool.name.toLowerCase()} best for?`,
        answer:
          `${tool.description} It is best for quick browser-based work where the main goal is to remove friction from one narrow operation rather than replace a full project workflow.`,
      },
      {
        question: "Should I trust the output without checking it?",
        answer:
          "No. Lightweight utilities are most useful when they save repetitive effort, but final context-specific validation still belongs to you and the destination environment.",
      },
      {
        question: "Can I use this for repeated workflow steps?",
        answer:
          "Yes. That is often where tools like this are most useful, provided the input shape and review expectations stay stable.",
      },
      {
        question: "Why do utility pages still need explanatory content?",
        answer:
          "Because narrow tasks are often performed under time pressure. Clear scope, review guidance, and edge-case notes reduce the chance of copying a technically valid but contextually wrong result.",
      },
    ],
  };
}
