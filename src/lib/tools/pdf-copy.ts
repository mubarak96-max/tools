import type { PdfTool } from "@/lib/tools/pdf-catalog";

export function buildPdfToolCopy(tool: PdfTool) {
  return {
    heading: `How ${tool.name.toLowerCase()} fits into PDF workflows`,
    paragraphs: [
      `${tool.description} Tools like this are useful when the PDF itself needs one focused change before it can be sent, archived, uploaded, reviewed, or printed.`,
      "That makes a browser-based page practical because the task is often narrow: merge, split, reorder, protect, convert, crop, or compress one file without reopening the original authoring workflow.",
      "The main benefit is workflow speed with clear scope. A dedicated PDF page handles the repetitive mechanical step, while the user still verifies the output in the exact context where the document will be used next.",
      "That review step matters because PDF tasks often happen at the end of a process, where a small mistake in order, page selection, access settings, or layout can create disproportionate friction later.",
    ],
    faqs: [
      {
        question: `What is ${tool.name.toLowerCase()} useful for?`,
        answer:
          `${tool.description} It is useful when you need one deliberate PDF operation done quickly in the browser without the overhead of a heavier desktop workflow.`,
      },
      {
        question: "Should I keep the original PDF after using the tool?",
        answer:
          "Yes. Keeping the original makes version comparison easier and gives you a safe recovery point if the exported file needs a different page range, order, or document setting later.",
      },
      {
        question: "What should I review after exporting the PDF?",
        answer:
          "Review the exact change you made: page order, page count, visible layout, file size, watermark position, access behavior, or any conversion-related formatting that matters to the destination workflow.",
      },
      {
        question: "Can a browser PDF tool replace specialist desktop software?",
        answer:
          "Not completely. It is excellent for focused practical tasks, but broader editing, formal compliance work, and advanced publishing still belong in specialized software when the workflow demands it.",
      },
    ],
  };
}
