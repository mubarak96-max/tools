import type { PdfTool } from "@/lib/tools/pdf-catalog";

export function buildPdfToolCopy(tool: PdfTool) {
  const reviewFaq = {
    question: "Should I review the exported PDF before using it?",
    answer:
      "Yes. Check the page order, page count, and layout after export, especially when you remove or extract pages from a longer document.",
  };

  switch (tool.kind) {
    case "merge-pdf":
      return {
        heading: "When merging PDFs saves time",
        paragraphs: [
          "Merging PDFs is useful when separate invoices, reports, signed pages, or handouts need to become one file before you send or archive them. It is one of the fastest ways to clean up a document workflow without reopening the original files.",
          "This page keeps that task focused: upload the PDFs in the right order, merge them in the browser, and download one combined document immediately.",
        ],
        faqs: [
          {
            question: "Does the merge keep the original page order?",
            answer:
              "Yes. The merged result follows the file order you upload here, so it is worth checking that order before you export the final PDF.",
          },
          {
            question: "Can I merge PDFs without installing desktop software?",
            answer:
              "Yes. This page is designed for quick browser-based merging, which is useful when you only need a simple combined file and do not want to open a heavier PDF app.",
          },
          reviewFaq,
        ],
      };
    case "split-pdf":
      return {
        heading: "Why splitting a PDF is useful",
        paragraphs: [
          "Splitting a PDF is useful when one document contains pages that need to be sent, reviewed, or stored separately. That comes up often with contracts, scanned packets, slides, and exported reports.",
          "This page lets you split every page into its own file or pull out a page range as a smaller PDF, depending on how narrow the result needs to be.",
        ],
        faqs: [
          {
            question: "What is the easiest way to split a PDF?",
            answer:
              "The easiest option is one-page splitting, which exports each page as its own file. If you need a smaller document instead, a page-range split is usually faster.",
          },
          {
            question: "Will splitting change the page design or formatting?",
            answer:
              "No. The exported pages keep the original PDF page content. The main change is that the document becomes smaller files instead of one larger one.",
          },
          reviewFaq,
        ],
      };
    case "remove-pages":
      return {
        heading: "When removing pages from a PDF helps",
        paragraphs: [
          "Removing pages is useful when a PDF includes unwanted covers, blank pages, duplicates, appendices, or sections that should not be shared with the next person.",
          "This page is meant for that cleanup step: choose the pages to remove, export a shorter file, and keep the rest of the document intact.",
        ],
        faqs: [
          {
            question: "How do I choose pages to remove?",
            answer:
              "Use page numbers or simple ranges such as 2,4,7-9. The page numbers should match the PDF order you see in the file, starting from page 1.",
          },
          {
            question: "Does removing pages affect the remaining pages?",
            answer:
              "Only their position in the final file. The remaining pages keep their original content, but the document becomes shorter after the selected pages are removed.",
          },
          reviewFaq,
        ],
      };
    case "extract-pages":
      return {
        heading: "Why extracting pages is different from removing them",
        paragraphs: [
          "Extracting pages is useful when you want a smaller PDF that contains only the important section, without editing the original document directly. It is a cleaner workflow when you need a subset for sharing or review.",
          "This page lets you define the page numbers you want to keep and creates a new PDF that contains only those pages in the chosen order.",
        ],
        faqs: [
          {
            question: "What is the difference between extracting pages and removing pages?",
            answer:
              "Removing pages gives you the original document minus the unwanted pages. Extracting pages gives you a new smaller document that includes only the pages you selected.",
          },
          {
            question: "Can I extract a custom set of non-adjacent pages?",
            answer:
              "Yes. You can use individual page numbers and ranges together, which is useful when the pages you need are spread across the document.",
          },
          reviewFaq,
        ],
      };
    case "rotate-pdf":
      return {
        heading: "When rotating a PDF is the right fix",
        paragraphs: [
          "PDF rotation is useful when scanned pages, sideways exports, or mixed-orientation documents are hard to read. It is one of the simplest document fixes, but it matters immediately when the file is being shared or printed.",
          "This page lets you rotate every page or only the pages that need correction, then export one cleaned PDF without reopening the source in a full editor.",
        ],
        faqs: [
          {
            question: "Can I rotate only certain pages in a PDF?",
            answer:
              "Yes. You can target specific page numbers or ranges when only part of the document is sideways and the rest is already correct.",
          },
          {
            question: "Should I use 90, 180, or 270 degrees?",
            answer:
              "Use 90 or 270 degrees for sideways pages, depending on the direction they need to turn. Use 180 degrees when a page is upside down.",
          },
          reviewFaq,
        ],
      };
    case "add-page-numbers":
      return {
        heading: "Why page numbers help a PDF",
        paragraphs: [
          "Page numbers make longer PDFs easier to review, reference, and discuss. They are especially useful for reports, proposal packs, handouts, and shared drafts where multiple people need to refer to the same pages quickly.",
          "This page adds simple numbering without forcing you into a heavier PDF editor. Choose the start number, the placement, and export the updated file.",
        ],
        faqs: [
          {
            question: "Can I start page numbering from a different number?",
            answer:
              "Yes. That is useful when the PDF is part of a larger packet or when the visible numbering should begin after a cover page or appendix section.",
          },
          {
            question: "What page-number position is easiest to read?",
            answer:
              "Bottom center is the safest default for most documents. Top right is also common when you want the numbers to stay more out of the way of the main content.",
          },
          reviewFaq,
        ],
      };
    case "add-watermark":
      return {
        heading: "When adding a watermark to a PDF helps",
        paragraphs: [
          "A watermark is useful when you need to label a document as draft, confidential, sample, internal, or reviewed before it gets shared more widely.",
          "This page keeps the workflow focused on that one task: choose the watermark text, adjust the placement and opacity, and export the document with the label applied across the pages you choose.",
        ],
        faqs: [
          {
            question: "What kind of watermark text works best?",
            answer:
              "Short labels work best, such as Draft, Confidential, Internal Use, or Sample. They are easier to read and less likely to overwhelm the document content.",
          },
          {
            question: "Should the watermark go across the page or sit in a corner?",
            answer:
              "A diagonal or centered watermark is stronger when the goal is visibility. A corner watermark is cleaner when you just need a light label without drawing too much attention.",
          },
          reviewFaq,
        ],
      };
    case "jpg-to-pdf":
      return {
        heading: "Why turning images into a PDF is useful",
        paragraphs: [
          "Converting JPG files into a PDF is useful when several images need to become one shareable document, especially for scans, receipts, screenshots, forms, and supporting attachments.",
          "This page keeps the process simple: upload the images in order, convert them into one PDF, and download the finished file without needing a separate office app.",
        ],
        faqs: [
          {
            question: "Can I combine multiple images into one PDF?",
            answer:
              "Yes. Each uploaded image becomes its own page in the final PDF, so you can build a simple document from several JPG or PNG files.",
          },
          {
            question: "Does JPG to PDF change the image itself?",
            answer:
              "The visible image content stays the same, but the result is packaged as PDF pages instead of standalone image files, which is usually easier to send or archive as one document.",
          },
          reviewFaq,
        ],
      };
    case "protect-pdf":
      return {
        heading: "When password protection helps a PDF",
        paragraphs: [
          "Protecting a PDF makes sense when the file contains internal notes, client drafts, contracts, or other material that should not open freely if it gets forwarded around.",
          "This page adds a document password in the browser so you can lock the file quickly before you send it, while still keeping the workflow focused on one job.",
        ],
        faqs: [
          {
            question: "What password should I use for a protected PDF?",
            answer:
              "Use a password that is strong enough to share separately from the file itself. A longer passphrase is usually safer and easier to remember than a short random word.",
          },
          {
            question: "Will a protected PDF still look the same after export?",
            answer:
              "Yes. The document content stays the same. The main difference is that the new file asks for a password before it can be opened.",
          },
          reviewFaq,
        ],
      };
    case "unlock-pdf":
      return {
        heading: "Why unlocking a PDF can save time",
        paragraphs: [
          "Unlocking a PDF is useful when you already know the password and need a copy that opens normally for printing, review, or re-upload to another workflow.",
          "This page is designed for that straightforward case: provide the existing password, create an unlocked copy, and keep moving without opening a heavier editor.",
        ],
        faqs: [
          {
            question: "Do I need the current password to unlock a PDF?",
            answer:
              "Yes. This tool is for PDFs you already have permission to open. It uses the password you provide to create a new unlocked copy.",
          },
          {
            question: "Does unlocking a PDF change the page content?",
            answer:
              "No. The pages stay the same. The exported file simply opens without asking for the old password.",
          },
          reviewFaq,
        ],
      };
    case "organize-pdf":
      return {
        heading: "When reorganizing pages makes a PDF clearer",
        paragraphs: [
          "Organizing a PDF helps when the pages are out of order after scanning, combining several files, or exporting a packet that needs a cleaner reading sequence.",
          "This page lets you define the page order directly, export the document again, and end up with a PDF that follows the structure you actually want to share.",
        ],
        faqs: [
          {
            question: "How do I reorder pages in a PDF?",
            answer:
              "Enter the page order you want using page numbers and ranges. For example, 3,1,2,4-6 will move page 3 to the front and keep the rest in that custom sequence.",
          },
          {
            question: "Do I have to include every page?",
            answer:
              "For full page reordering, yes. The safest workflow is to include each page once so the finished PDF stays complete and nothing gets dropped by accident.",
          },
          reviewFaq,
        ],
      };
    case "crop-pdf":
      return {
        heading: "Why cropping a PDF helps with cleaner pages",
        paragraphs: [
          "Cropping a PDF is useful when scans include extra borders, page edges, or white margins that make the document look untidy or waste space on screen.",
          "This page trims those edges without changing the core page content, which is helpful before printing, presenting, or sharing a document that needs a neater layout.",
        ],
        faqs: [
          {
            question: "Does cropping delete the page content forever?",
            answer:
              "Cropping changes the visible page area in the exported copy. It is still worth reviewing the result before sharing, especially if you trim close to the text.",
          },
          {
            question: "Can I crop only certain pages?",
            answer:
              "Yes. Use a page selection when only part of the PDF needs trimming and the rest of the document should stay as-is.",
          },
          reviewFaq,
        ],
      };
    case "sign-pdf":
      return {
        heading: "When a typed PDF signature is enough",
        paragraphs: [
          "A typed signature is useful when you need a fast visible sign-off on a PDF, such as a reviewed draft, a simple approval, or an internal document that does not require certificate-based signing.",
          "This page places a signature label directly on the pages you choose, along with an optional date, so you can export a marked document quickly in the browser.",
        ],
        faqs: [
          {
            question: "Is this the same as a digital certificate signature?",
            answer:
              "No. This tool adds a visible signature mark to the PDF. If you need certificate-backed legal signing, use a dedicated e-signature platform instead.",
          },
          {
            question: "Where should I place the signature on the page?",
            answer:
              "Bottom right is the most common choice for approvals, while bottom left can work better if the document already has notes or stamps on the right side.",
          },
          reviewFaq,
        ],
      };
    case "compress-pdf":
      return {
        heading: "Why compressing a PDF can be worth trying",
        paragraphs: [
          "Compressing a PDF is useful when a file is too large for email, uploads, or document portals. Even a modest reduction can make the difference between a failed upload and a file that goes through cleanly.",
          "This page creates a lighter PDF copy in the browser, which is especially helpful for document-heavy files where you want a quick size reduction before sending.",
        ],
        faqs: [
          {
            question: "Will compression always make a PDF much smaller?",
            answer:
              "Not always. Results depend on the original file. Text-heavy or metadata-heavy PDFs usually shrink more predictably than already-optimized files.",
          },
          {
            question: "Should I check the compressed file before sending it?",
            answer:
              "Yes. Compression is usually safe, but it is still a good idea to confirm the new file opens correctly and the pages still look the way you expect.",
          },
          reviewFaq,
        ],
      };
    case "html-to-pdf":
      return {
        heading: "When HTML to PDF is the right workflow",
        paragraphs: [
          "HTML to PDF is useful when a snippet of markup, a small page section, or a printable template needs to become a stable document that is easier to send, archive, or print.",
          "This page keeps that process focused on one task: paste or edit the HTML, render it as a PDF, and download the result without opening a separate publishing app.",
        ],
        faqs: [
          {
            question: "Can I paste full HTML markup into this tool?",
            answer:
              "Yes. You can paste full markup or a smaller HTML fragment. The export works best when the content already has a simple printable layout.",
          },
          {
            question: "Will CSS styling work in the PDF output?",
            answer:
              "Basic inline and embedded styling usually works well. Very complex layouts can still be worth reviewing after export because printed output may not match a live browser page exactly.",
          },
          reviewFaq,
        ],
      };
    case "compare-pdf":
      return {
        heading: "Why comparing PDFs saves manual checking time",
        paragraphs: [
          "Comparing two PDFs is useful when you need a quick answer about whether the files match in structure before you spend time reading every page manually.",
          "This page highlights practical differences such as page count, file size, page dimensions, and common metadata, which is often enough for version checks and quick document reviews.",
        ],
        faqs: [
          {
            question: "Does this compare the visible text line by line?",
            answer:
              "No. This tool focuses on document-level differences such as size, pages, and layout details. It is useful for fast checks, not full legal redlining.",
          },
          {
            question: "When is PDF comparison most useful?",
            answer:
              "It is useful when two files should be the same version, when a new export seems off, or when you need a quick structural check before sharing a revised document.",
          },
          reviewFaq,
        ],
      };
    case "word-to-pdf":
      return {
        heading: "Why converting Word to PDF is still common",
        paragraphs: [
          "Word to PDF conversion is useful when a document should be easier to print, share, or archive without layout shifts from one device to another.",
          "This page focuses on quick DOCX-to-PDF conversion in the browser, which is helpful when you only need a clean export and do not want to reopen the document in desktop office software.",
        ],
        faqs: [
          {
            question: "What Word files work here?",
            answer:
              "This tool is designed for DOCX files. Older DOC formats usually need to be resaved as DOCX first for the cleanest result.",
          },
          {
            question: "Should I review the PDF after converting a Word file?",
            answer:
              "Yes. It is always worth checking page breaks, headings, and tables after export, especially if the original file had a complex layout.",
          },
          reviewFaq,
        ],
      };
    case "powerpoint-to-pdf":
      return {
        heading: "When PowerPoint to PDF is a better handoff",
        paragraphs: [
          "Converting PowerPoint to PDF is useful when a deck needs to be shared for reading or printing without depending on presentation software on the other side.",
          "This page turns slide content into a browser-generated PDF handout so you can quickly share a simpler version of the deck when that is all you need.",
        ],
        faqs: [
          {
            question: "Will the PDF keep every slide exactly like PowerPoint?",
            answer:
              "Not always. This browser-based export works best for slide text and basic structure. It is worth reviewing the final PDF if the deck depends heavily on complex visuals or animation.",
          },
          {
            question: "When is a PowerPoint PDF most useful?",
            answer:
              "It is useful for review copies, printable handouts, approvals, and quick sharing when the other person does not need the editable PPTX itself.",
          },
          reviewFaq,
        ],
      };
    case "excel-to-pdf":
      return {
        heading: "Why exporting spreadsheet data to PDF helps",
        paragraphs: [
          "Excel to PDF conversion is useful when workbook data needs to be reviewed, sent for approval, or attached to a report in a format that is harder to edit accidentally.",
          "This page exports worksheet content into a readable PDF so you can share a quick static copy without sending the original spreadsheet file itself.",
        ],
        faqs: [
          {
            question: "Does this export every worksheet in the workbook?",
            answer:
              "Yes. Each sheet is included in the PDF output so you can review the workbook content in one shareable document.",
          },
          {
            question: "Should I check wide tables after export?",
            answer:
              "Yes. Wide sheets can wrap differently in a PDF, so it is smart to review large tables and confirm the rows still read clearly.",
          },
          reviewFaq,
        ],
      };
    case "pdf-to-pdfa":
      return {
        heading: "When an archival-style PDF copy is useful",
        paragraphs: [
          "A PDF/A-style copy is useful when you want a cleaner archival export for storage, submission, or internal recordkeeping where long-term readability matters.",
          "This page creates a best-effort archival copy in the browser. It is a practical option for everyday storage workflows, while strict regulated submissions may still need formal PDF/A validation elsewhere.",
        ],
        faqs: [
          {
            question: "Is this guaranteed to pass every formal PDF/A validator?",
            answer:
              "No. This tool creates a best-effort archival-style copy, which is useful for many day-to-day workflows, but formal compliance checks may still require specialist software.",
          },
          {
            question: "When should I still use a validator after exporting?",
            answer:
              "Use a validator when a regulator, archive, or submission portal specifically requires certified PDF/A compliance rather than a practical archival copy.",
          },
          reviewFaq,
        ],
      };
  }
}
