import type { ImageTool } from "@/lib/tools/image-catalog";
import { IMAGE_FORMAT_LABELS } from "@/lib/tools/image-format-conversion";
import { buildImageToolCopy } from "@/lib/tools/image-copy";

import type { EditorialContent, FaqItem } from "./common";
import { ensureFaqCount, ensureLongEnough } from "./common";

function fallbackCopy(tool: ImageTool) {
  if (tool.conversion) {
    const sourceLabel = IMAGE_FORMAT_LABELS[tool.conversion.source];
    const targetLabel = IMAGE_FORMAT_LABELS[tool.conversion.target];

    return {
      heading: `When converting ${sourceLabel} to ${targetLabel} is useful`,
      paragraphs: [
        `${tool.description} This is most useful when the image content is already correct and the only real problem is that the destination workflow expects a different file format.`,
        `A focused conversion page reduces friction because it keeps the job narrow: upload the image, export the new format, review the result, and move on without opening a full editor for a format-only change.`,
      ],
      faqs: [] as FaqItem[],
    };
  }

  return {
    heading: `How ${tool.name.toLowerCase()} fits into image workflows`,
    paragraphs: [
      `${tool.description} This kind of page is useful when the image needs one exact adjustment and the overhead of opening a heavier editor would cost more than the edit itself.`,
      "That narrow scope is the point. Fast browser-based image tools are at their best when they remove repetitive steps while still leaving the final visual review in your hands.",
    ],
    faqs: [] as FaqItem[],
  };
}

function buildNotes(tool: ImageTool) {
  if (tool.conversion) {
    const sourceLabel = IMAGE_FORMAT_LABELS[tool.conversion.source];
    const targetLabel = IMAGE_FORMAT_LABELS[tool.conversion.target];

    return {
      context:
        `Format conversion is really about compatibility. ${sourceLabel} and ${targetLabel} can represent the same picture while behaving differently in upload forms, editors, CMS pipelines, print workflows, browser rendering, metadata handling, transparency support, or downstream compression.`,
      workflow:
        `A practical workflow is to convert only when you know what the next system expects. If the destination needs ${targetLabel}, converting once and then reviewing the result there is usually better than chaining multiple exports and slowly degrading the file.`,
      review:
        "Review should focus on visible fidelity, file size, transparency behavior, metadata, and whether the new format solves the original compatibility problem without introducing a new one.",
      limits:
        "The biggest edge cases are lossy compression, flattened transparency, stripped metadata, and color-profile differences. Those are not always visible in a quick glance, which is why the destination check still matters.",
      extras: [
        {
          question: "Why would I convert an image if it already looks fine?",
          answer:
            "Because the problem is often compatibility rather than appearance. A file can look fine and still be rejected by an uploader, create a larger-than-needed payload, or behave badly in an editing or publishing workflow.",
        },
        {
          question: "Should I convert the same file repeatedly across formats?",
          answer:
            "Usually no. Repeated re-exports make it harder to trace quality loss and metadata changes. It is better to keep the original and produce a fresh destination-specific copy when needed.",
        },
        {
          question: "What should I compare first after converting an image?",
          answer:
            "Compare the visible output, then check file size, transparency, and whether the destination system accepts the new file without additional changes.",
        },
        {
          question: "Can a file-format change affect editing flexibility later?",
          answer:
            "Yes. Some formats preserve more image detail, transparency, or editor-friendly behavior than others. Keep the original source when you may need to edit the image again later.",
        },
      ] satisfies FaqItem[],
    };
  }

  switch (tool.kind) {
    case "website-color-palette-extractor":
    case "website-screenshot-tool":
      return {
        context:
          "Website-based image tools sit close to QA, design review, competitive research, and content production. They are less about raw editing and more about turning live web presentation into something you can inspect, capture, or reuse quickly.",
        workflow:
          "The usual workflow is to fetch one real page, review the extracted result, then move the screenshot or palette into notes, design files, tickets, or implementation work. The fastest route is still a review-first route because websites can vary by cookies, scripts, viewport, and loading state.",
        review:
          "Review should focus on whether the page loaded fully, whether dynamic content affected the result, and whether the captured palette or screenshot reflects the state you actually meant to analyze.",
        limits:
          "Live websites introduce variability. Cookies, consent banners, lazy-loaded assets, responsive breakpoints, and time-sensitive content can all change what you see or what the tool extracts from the page.",
        extras: [
          {
            question: "Why might a website screenshot differ from what I saw manually?",
            answer:
              "Rendered pages can change based on viewport, timing, cookie state, location, or scripts. The screenshot should be treated as a captured state, not a universal truth about the page at all times.",
          },
          {
            question: "Does a palette extracted from code always match the visual interface exactly?",
            answer:
              "Not always. Some colors come from images, runtime styles, gradients, or theme logic that a static scan may not capture perfectly.",
          },
          {
            question: "What is the best follow-up after using a website-based image tool?",
            answer:
              "Move the result into the next decision point right away: QA notes, a design system comparison, a moodboard, a bug ticket, or content research, while the context of the captured page is still fresh.",
          },
          {
            question: "Should I save the URL and timestamp with the output?",
            answer:
              "Yes when the result matters. Live pages change, so basic context makes later review much easier.",
          },
        ] satisfies FaqItem[],
      };
    default:
      return {
        context:
          "Most browser-based image tools solve one narrow visual problem at a time: crop, resize, compress, watermark, blur, convert, trim, merge, or generate a quick effect. That narrowness is useful because it turns a small but recurring edit into a focused task that can be finished in seconds.",
        workflow:
          "The practical workflow is to upload one representative file, make the adjustment, review the result at real size, and only then reuse the same settings on more images or move the export into a publishing, support, design, or social workflow.",
        review:
          "Review should focus on dimensions, visual clarity, crop boundaries, output format, legibility of any text, and whether the result still suits the destination slot where the image will be used next.",
        limits:
          "The usual limits are browser memory, source quality, and the fact that some edits are destructive by design. Compression, blur, pixelation, and flattening steps can be exactly what you want, but they still deserve one quick check before you publish the file.",
        extras: [
          {
            question: "What makes a focused image tool useful instead of a full editor?",
            answer:
              "Speed and clarity. If the job is narrow, a dedicated page removes menu hunting and repeated setup while still giving you a preview and a quick path to download the result.",
          },
          {
            question: "What should I verify before downloading an edited image?",
            answer:
              "Check the output at a sensible zoom level, confirm the dimensions and file type, and make sure the visible result still fits the slot or workflow where the image will be used next.",
          },
          {
            question: "When is it worth keeping the original file untouched?",
            answer:
              "Almost always. Original files are useful when you need another export later, want to compare versions, or realize that a destructive edit such as compression or crop should be adjusted.",
          },
          {
            question: "Why do small image tools still need detailed guidance?",
            answer:
              "Because the task may be small, but the downstream effect is often public. Clear guidance reduces the chance of publishing the wrong crop, the wrong file type, or a visually degraded result.",
          },
        ] satisfies FaqItem[],
      };
  }
}

export function buildImageEditorial(tool: ImageTool): EditorialContent {
  const seed = buildImageToolCopy(tool) ?? fallbackCopy(tool);
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
        heading: `When ${tool.name.toLowerCase()} is the right page`,
        paragraphs: [
          `${tool.name} is most useful when the image already exists and the next step is a narrow adjustment rather than a full creative edit. ${tool.description} That distinction matters because most real image tasks are small, urgent, and operational: fix the format, tighten the crop, reduce the file size, capture the page, remove the padding, or create one quick visual effect before the image moves downstream.`,
          "A dedicated page works well for that kind of job because it keeps the controls close to the preview and limits the number of unrelated decisions you have to make. The goal is not to replace a full editor. The goal is to finish the specific task faster and with fewer chances to miss something obvious in the handoff.",
        ],
      },
      {
        heading: "What to review before you use the exported file",
        paragraphs: [
          notes.review,
          "The key is to review with the destination in mind instead of reviewing only for visual appeal in the preview box. A CMS may care about format and size. A design workflow may care about transparency and dimensions. A support workflow may care about readability of a screenshot. A social workflow may care about crop, emphasis, and visual clarity on mobile.",
        ],
      },
      {
        heading: "Typical workflow patterns and practical tradeoffs",
        paragraphs: [
          "The safest pattern is simple: start with one representative file, make the edit, preview it carefully, and then test the result in the real destination if the stakes are higher than a casual download. That pattern catches the issues that matter most in image work, which are usually discovered after the export rather than during the edit.",
          "It also keeps the tool honest about scope. A cropper should not pretend to be a full layout tool. A compressor should not pretend to be a publishing optimizer. A screenshot page should not promise a perfectly reproducible live web state. Good image pages are useful because they solve one clear problem and explain the edge cases clearly enough that users can trust the result.",
        ],
      },
      {
        heading: "Limits, edge cases, and why the last visual check still matters",
        paragraphs: [
          notes.limits,
          "That last check is worth the few seconds it takes because image outputs are consumed visually by people but enforced mechanically by systems. A file can look close enough while still carrying the wrong dimensions, wrong transparency behavior, wrong format, or wrong amount of detail for the workflow it is about to enter.",
        ],
      },
    ],
    faqs: ensureFaqCount(seed.faqs ?? [], [
      ...notes.extras,
      {
        question: `What is ${tool.name.toLowerCase()} best used for?`,
        answer:
          `${tool.description} It is best used when you need one exact image step done quickly in the browser without opening a heavier editor for a small operational task.`,
      },
      {
        question: "Should I keep the original image after using this page?",
        answer:
          "Yes. Keeping the original gives you a clean source for future exports and makes it easier to redo the edit if the destination needs a different crop, format, quality level, or layout later.",
      },
      {
        question: "Can this page replace a full design or photo-editing workflow?",
        answer:
          "No. It handles a narrow task well. Full editing, retouching, layered composition, and extensive layout work still belong in dedicated design software when the job is broader.",
      },
      {
        question: "Why do image utility pages benefit from longer editorial content?",
        answer:
          "Because people usually land on them with a concrete task in progress. Useful guidance about workflow fit, review steps, and edge cases is more valuable than generic filler when the user needs to finish the job correctly the first time.",
      },
    ]),
  };

  return ensureLongEnough(content, {
    heading: "Why dedicated image pages are more useful than catalog placeholders",
    paragraphs: [
      "Image tasks are often deceptively small. Format conversion, compression, padding removal, blur, screenshot capture, or one quick meme effect may take only a minute, but the result still goes into a workflow with real requirements and visible consequences. A thin catalog page rarely explains enough for a user to move confidently.",
      "A dedicated page performs better because it can explain the exact job, the most common failure modes, and the review step that matters before download. That makes the page more useful to the user and more defensible as an indexable landing page over time.",
    ],
  });
}
