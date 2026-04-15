import type { ImageTool } from "@/lib/tools/image-catalog";
import { IMAGE_FORMAT_LABELS } from "@/lib/tools/image-format-conversion";

export function buildImageToolCopy(tool: ImageTool) {
  if (tool.conversion) {
    const source = IMAGE_FORMAT_LABELS[tool.conversion.source];
    const target = IMAGE_FORMAT_LABELS[tool.conversion.target];

    return {
      heading: `When converting ${source} to ${target} is useful`,
      paragraphs: [
        `${tool.description} This is useful when the image content is already fine and the real problem is that the destination tool, CMS, or upload workflow expects a different file type.`,
        `A focused converter page keeps that job narrow: upload the source file, export the target format, review the result, and move on without opening a heavier editor for a format-only task.`,
      ],
      faqs: [
        {
          question: `Why would I convert ${source} to ${target}?`,
          answer:
            `${target} may be easier to upload, reuse, or process in the next workflow, even when the visible image content itself does not need to change.`,
        },
        {
          question: `Will the converted ${target} file always behave exactly like the ${source} file?`,
          answer:
            "Not always. File formats differ in compression, transparency support, metadata handling, and editor compatibility, so a quick destination check is still important.",
        },
      ],
    };
  }

  return {
    heading: `How ${tool.name.toLowerCase()} fits into image workflows`,
    paragraphs: [
      `${tool.description} Pages like this are useful when the image needs one clear change and the overhead of opening a full editor would cost more time than the task itself.`,
      "That is the strength of focused browser image tools. They handle one narrow operation quickly while still leaving the final visual review in your hands.",
    ],
    faqs: [
      {
        question: `What is ${tool.name.toLowerCase()} best used for?`,
        answer:
          `${tool.description} It is best used for quick browser-side image tasks where speed and clarity matter more than the full power of a desktop design application.`,
      },
      {
        question: "Should I review the exported image before downloading or publishing it?",
        answer:
          "Yes. Check dimensions, clarity, crop boundaries, file type, and whether the edited image still fits the destination where it will be used next.",
      },
    ],
  };
}
