import type { PdfTool } from "@/lib/tools/pdf-catalog";
import { buildPdfToolCopy } from "@/lib/tools/pdf-copy";

import type { EditorialContent, FaqItem } from "./common";
import { ensureFaqCount, ensureLongEnough } from "./common";

function buildNotes(tool: PdfTool) {
  switch (tool.kind) {
    case "merge-pdf":
    case "split-pdf":
    case "remove-pages":
    case "extract-pages":
    case "organize-pdf":
      return {
        context:
          "Page-level PDF tools are really document-structure tools. They are used when the content of each page is mostly fine, but the file as a package is too large, too small, in the wrong order, or contains the wrong subset for the next person.",
        workflow:
          "The practical workflow is to inspect the page sequence first, make the structural change once, and then review page order and count before sharing the new file onward.",
        review:
          "Review should focus on page order, page count, missing pages, duplicated pages, and whether the new file still tells the same story the destination workflow expects.",
        limits:
          "The biggest risk is usually selection error rather than rendering error. One missed page or one out-of-order page can be more damaging than a formatting issue.",
        extras: [
          {
            question: "What should I check first after changing PDF page structure?",
            answer:
              "Check the page count, then spot-check the beginning, middle, and end of the file to confirm that the order and selection still match the intended document flow.",
          },
          {
            question: "Is it safer to work from a copy of the PDF?",
            answer:
              "Yes. Keeping the original untouched makes it easy to compare versions and recover quickly if the wrong page selection or page order was used.",
          },
          {
            question: "Why are PDF structure tools often used in business workflows?",
            answer:
              "Because document packets, appendices, reports, scans, and submission bundles often need quick structural cleanup before they can be reviewed, approved, archived, or sent out.",
          },
          {
            question: "Can a page-level change affect how someone interprets the document?",
            answer:
              "Yes. A missing appendix, misplaced cover page, or wrong sequence can change the meaning of the packet even if the visible page content itself is unchanged.",
          },
        ] satisfies FaqItem[],
      };
    case "protect-pdf":
    case "unlock-pdf":
    case "sign-pdf":
    case "add-watermark":
      return {
        context:
          "Document control tools are about how a PDF is shared, reviewed, and trusted rather than how it reads on the page. They sit close to workflow policy, approval handling, and document distribution.",
        workflow:
          "The usual workflow is to prepare the file contents first, then add the control layer last: password, watermark, visible signature, or access change. Doing it in that order reduces the chance of needing to repeat the document-control step.",
        review:
          "Review should focus on whether the file still opens the way you expect, whether the label or signature is correctly placed, and whether the document now matches the distribution policy you intended.",
        limits:
          "These tools help with practical workflow control, but they do not replace legal review, enterprise records policy, or certificate-backed signing where those are formally required.",
        extras: [
          {
            question: "Should I add access controls before or after finalizing page edits?",
            answer:
              "After. Finalize the content and page structure first, then add the watermark, password, or visible sign-off once the document itself is in the right state.",
          },
          {
            question: "Does a visible PDF signature mean formal legal e-signing?",
            answer:
              "Not necessarily. A visible signature mark is useful for practical approval workflows, but certificate-backed legal signing still requires the appropriate platform when that standard matters.",
          },
          {
            question: "What is the most important review after protecting or unlocking a PDF?",
            answer:
              "Confirm that the file opens as expected and that the access behavior now matches the policy or sharing scenario you were trying to support.",
          },
          {
            question: "Why do watermark and password tools still need a manual check?",
            answer:
              "Because a PDF can be technically processed while still carrying the wrong label placement, weak sharing setup, or a mismatch between workflow intent and the exported file.",
          },
        ] satisfies FaqItem[],
      };
    default:
      return {
        context:
          "Format, layout, and optimization PDF tools help move content between document states: image to PDF, HTML to PDF, office file to PDF, crop, rotate, compress, or produce an archival-style copy. They are most useful when a document needs a cleaner or more portable final form.",
        workflow:
          "The usual workflow is to convert or optimize one representative file, then review how the new PDF opens, prints, and reads before you rely on the output for a broader batch or a higher-stakes submission.",
        review:
          "Review should focus on page breaks, table wrapping, image clarity, page orientation, file size, and whether the exported PDF solves the original delivery or archive problem without breaking readability.",
        limits:
          "The largest edge cases come from complex source formatting, already-optimized files, and workflows that require stricter standards than a practical browser-side conversion can guarantee by itself.",
        extras: [
          {
            question: "What should I check after converting another format into PDF?",
            answer:
              "Check page breaks, headings, tables, orientation, and any part of the source file that depended on application-specific layout behavior before you share the PDF more broadly.",
          },
          {
            question: "Will PDF compression always produce a much smaller file?",
            answer:
              "Not always. Results depend on the original file. Some PDFs are already optimized, while others still contain images or embedded data that can be reduced meaningfully.",
          },
          {
            question: "Why should I preview a converted PDF even when the export succeeds?",
            answer:
              "Because success only means the file was generated. It does not guarantee that the page layout, print behavior, or long-document readability still match what you need.",
          },
          {
            question: "When is a browser PDF tool enough and when is specialist software still needed?",
            answer:
              "Browser tools are excellent for focused practical workflows. Specialist software is still better when the process depends on formal compliance, advanced editing, or enterprise records requirements.",
          },
        ] satisfies FaqItem[],
      };
  }
}

export function buildPdfEditorial(tool: PdfTool): EditorialContent {
  const seed = buildPdfToolCopy(tool);
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
        heading: `Where ${tool.name.toLowerCase()} fits in document workflows`,
        paragraphs: [
          `${tool.name} is most useful when the problem is with the PDF as a working document rather than with the original authoring app. ${tool.description} That makes it practical for the handoff stage of real document work, where a file needs one focused change before it can be reviewed, sent, archived, uploaded, or printed.`,
          "That narrow scope is why dedicated PDF pages are valuable. Most people reaching a page like this are not editing casually. They are trying to finish a submission, clean up a packet, share a document with fewer barriers, or make a file acceptable to a portal, colleague, or client without reopening a full desktop workflow.",
        ],
      },
      {
        heading: "How to review the exported file before you send it onward",
        paragraphs: [
          notes.review,
          "A practical review step is to open the exported PDF immediately and check the exact dimension of the change you made: page sequence, rotation, watermark position, page count, file size, visible layout, or access behavior. Small PDF mistakes are easy to miss until the file is already in someone else's inbox or in a locked submission flow.",
        ],
      },
      {
        heading: "Common workflow patterns and why they matter",
        paragraphs: [
          "The safest workflow is usually copy-first, change-second, review-third. Keep the original file, produce the new version with one deliberate change, and then confirm the output while the source context is still fresh in your head. That makes it easier to catch a wrong range, wrong order, wrong orientation, or wrong document-control choice.",
          "This approach also keeps the tool honest. A browser-based PDF page is extremely useful for focused operations, but it is not a substitute for a full records system, contract platform, or desktop publishing stack. Its value comes from turning one slow repetitive step into a fast reliable one.",
        ],
      },
      {
        heading: "Limits, edge cases, and why PDF work still needs human review",
        paragraphs: [
          notes.limits,
          "That last human check matters because PDFs often travel into workflows with higher friction than ordinary files: upload limits, audit trails, client review, print runs, regulated submissions, or long-lived archives. A page that explains those boundaries clearly is more useful than one that silently assumes the export alone is enough.",
        ],
      },
    ],
    faqs: ensureFaqCount(seed.faqs, [
      ...notes.extras,
      {
        question: `What is ${tool.name.toLowerCase()} best used for?`,
        answer:
          `${tool.description} It is best used for a focused PDF workflow step that needs to be completed quickly and locally in the browser before the document moves into review, sharing, or storage.`,
      },
      {
        question: "Should I keep the original PDF after creating the new version?",
        answer:
          "Yes. Keeping the source file makes it easy to compare versions, rerun the operation with different settings, and recover from page-selection or export decisions that turn out not to fit the final workflow.",
      },
      {
        question: "Can this page replace full PDF desktop software?",
        answer:
          "No. It replaces one narrow task well. Broader editing, formal compliance work, and advanced document production still belong in specialized tools when the workflow requires them.",
      },
      {
        question: "Why does a PDF utility page need substantial editorial content?",
        answer:
          "Because the operation may be simple, but the downstream workflow usually is not. Strong guidance about review steps, document risks, and workflow fit helps users finish the task correctly instead of only quickly.",
      },
    ]),
  };

  return ensureLongEnough(content, {
    heading: "Why dedicated PDF pages are stronger than thin catalog entries",
    paragraphs: [
      "PDF work often happens at the final stage of a process, which means the stakes are higher than the size of the edit might suggest. Removing one page, rotating one scan, or exporting one archival-style copy can still affect approvals, uploads, print quality, and long-term storage.",
      "That is why a dedicated page should explain more than the button clicks. It should explain when the tool is the right fit, what to review, what can go wrong, and how to validate the result before the file leaves your hands.",
    ],
  });
}
