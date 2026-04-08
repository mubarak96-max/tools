import type {
  ExactConverterTool,
  ExactTextTool,
  ExactUtilityTool,
} from "@/lib/tools/exact-catalog";

type ToolCopy = {
  heading: string;
  paragraphs: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export function buildTextToolCopy(tool: ExactTextTool): ToolCopy {
  switch (tool.family) {
    case "cleaner":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} This is most useful when you have pasted content from chat apps, spreadsheets, PDFs, CMS editors, or code snippets and need one cleanup step without manually editing every line.`,
          "The tool is designed for quick before-and-after cleanup. Paste the source text, review the transformed output, and copy only when the result matches what you need in your document, sheet, prompt, or code block.",
        ],
        faqs: [
          {
            question: `What changes does ${tool.name.toLowerCase()} make?`,
            answer: `${tool.description} The original line order stays intact unless the specific cleanup action removes or flattens whitespace.`,
          },
          {
            question: "When should I use this instead of editing by hand?",
            answer: "Use it when the same issue appears across many lines or across a long pasted block. It saves time on repetitive cleanup and reduces copy-paste mistakes.",
          },
          {
            question: "Will this rewrite my wording or only clean formatting?",
            answer: "It only applies the selected text-cleanup rule. It does not rewrite sentences or change the meaning of your content.",
          },
          {
            question: "What should I check before copying the result?",
            answer: "Review names, codes, escaped characters, and spacing-sensitive content. Some cleanup actions are intentionally aggressive, so it is worth checking the output once before using it elsewhere.",
          },
        ],
      };
    case "line":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} These line-based tools are best for lists, logs, copied spreadsheet columns, prompts, and batch text edits where each line should be treated as a separate item.`,
          "Use them when you need to reshape a multiline block without manually touching every row. They are especially useful for bulk line numbering, sorting, joining, trimming, prefixing, filtering, and other list operations.",
        ],
        faqs: [
          {
            question: `What kind of input works best with ${tool.name.toLowerCase()}?`,
            answer: "Any multiline text where each line represents a separate item. Examples include keyword lists, product names, URLs, logs, CSV fragments, and task lists.",
          },
          {
            question: "Will it preserve my line order?",
            answer: tool.focus === "sort" || tool.preset.reverseOrder
              ? "This tool changes the order on purpose, based on the selected sorting or reversing rule."
              : "Yes. It keeps the original line order unless the selected action is meant to sort or reverse the lines.",
          },
          {
            question: "Can I use this on hundreds of lines at once?",
            answer: "Yes. It is intended for bulk line operations, so it is much faster than editing long lists line by line.",
          },
          {
            question: "What should I verify before copying the output?",
            answer: "Check delimiters, prefixes, suffixes, and filtered results if your text has spacing-sensitive or duplicate-looking lines. A quick review helps catch edge cases before you paste the result elsewhere.",
          },
        ],
      };
    case "align":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Alignment tools are useful when you need fixed-width text for plain-text layouts, code comments, terminal output, sample data, or formatted notes.`,
          "They help standardize line width quickly without having to count spaces by hand. Paste the text, set the width, and copy the aligned version once it looks right.",
        ],
        faqs: [
          {
            question: "What is this alignment tool useful for?",
            answer: "It is useful for fixed-width formatting, console snippets, text tables, sample payloads, and any workflow where spacing needs to look intentional in plain text.",
          },
          {
            question: "Does it keep the original text content?",
            answer: "Yes. It changes spacing and layout, not the underlying wording.",
          },
          {
            question: "Will it work best in monospaced text?",
            answer: "Yes. The cleanest visual result appears in monospaced environments such as code editors, terminals, and preformatted text blocks.",
          },
          {
            question: "Why should I still review the output?",
            answer: "Some lines may already be longer than your target width or may contain uneven spacing. A quick review makes sure the final alignment matches your intended layout.",
          },
        ],
      };
    case "extractor":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} This is useful when the data you need is buried inside logs, emails, notes, raw exports, or scraped text and you only want the matching values back.`,
          "Instead of scanning a long block manually, you can paste the source text, extract the matching values, and copy just the cleaned list for your next step.",
        ],
        faqs: [
          {
            question: `What does ${tool.name.toLowerCase()} look for?`,
            answer: `${tool.description} Paste the full source block and the tool will pull out matching values into a simpler result list.`,
          },
          {
            question: "Can I use it on messy copied text?",
            answer: "Yes. It is useful for semi-structured text such as email threads, notes, exports, logs, and mixed-content documents where the values are not already separated cleanly.",
          },
          {
            question: "Will it change the original wording around the matches?",
            answer: "No. It only returns the extracted values. The surrounding text is ignored in the output.",
          },
          {
            question: "What should I verify after extraction?",
            answer: "Check whether your source text contains partial matches, duplicates, or formatting noise. A quick review makes sure the extracted list is ready to use.",
          },
        ],
      };
    case "regex":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Regex tools are useful when simple search-and-replace is not enough and you need pattern-based matching across a larger text block.`,
          "You can test expressions directly in the browser, review the matched or replaced output, and refine the pattern before using it in code, data cleanup, or content workflows.",
        ],
        faqs: [
          {
            question: "Who is this regex tool useful for?",
            answer: "Anyone cleaning text with repeatable patterns, including developers, analysts, SEO teams, editors, and operations teams working with copied exports or logs.",
          },
          {
            question: "What happens if my pattern is invalid?",
            answer: "The tool shows an error instead of silently returning the wrong result, so you can fix the pattern or flags before copying anything.",
          },
          {
            question: "Can I use flags like global or case-insensitive?",
            answer: "Yes. You can test the same pattern with different flags to control how broadly it matches across the input text.",
          },
          {
            question: "Why should I review regex output before using it?",
            answer: "Regex can match more broadly than expected. A quick review helps you catch over-matching or unexpected replacements before the result is used somewhere important.",
          },
        ],
      };
    case "stats":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Statistics tools help you inspect structure and repetition inside a text block instead of guessing what is inside it.`,
          "They are useful for content cleanup, prompt tuning, text QA, quick audits, and finding patterns such as repeated phrases, unusually long lines, or sparse content.",
        ],
        faqs: [
          {
            question: `What can ${tool.name.toLowerCase()} help me find?`,
            answer: `${tool.description} It is useful when you need fast visibility into structure, repetition, and outliers inside pasted text.`,
          },
          {
            question: "When is this more useful than a normal word counter?",
            answer: "Use it when you need more than a single count, such as phrase repetition, longest or shortest lines, or broader text patterns that are easy to miss by eye.",
          },
          {
            question: "Can I use it on drafts, transcripts, or exports?",
            answer: "Yes. It works well on long notes, generated content, transcripts, copied page copy, lists, and exported text blocks.",
          },
          {
            question: "What should I do with the results?",
            answer: "Use the output to identify cleanup opportunities, repeated wording, line-length issues, or sections that need rewriting before you move the text into its final format.",
          },
        ],
      };
  }
}

export function buildConverterToolCopy(tool: ExactConverterTool): ToolCopy {
  switch (tool.family) {
    case "encoding":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Encoding tools are useful when text needs to be converted into a transport-safe, protocol-safe, or system-specific format before you paste it into another app, URL, payload, or config field.`,
          "They are best for quick conversion work where you want to see the result immediately, copy it, and move on without opening a separate dev environment or script.",
        ],
        faqs: [
          {
            question: `When should I use ${tool.name.toLowerCase()}?`,
            answer: `${tool.description} Use it when a platform expects a specific encoding format instead of plain text.`,
          },
          {
            question: "What kind of input should I paste here?",
            answer: "Paste the raw value you want to encode or decode. For binary, hex, octal, decimal, and similar formats, keep separators clean so the parser can read the input reliably.",
          },
          {
            question: "Will this fix broken source data automatically?",
            answer: "No. It converts the input you provide, but malformed or incomplete encoded values may still need cleanup before they decode correctly.",
          },
          {
            question: "Why review the result before copying it?",
            answer: "Encoded output is often used in URLs, code, payloads, or identifiers. A quick check helps you catch missing separators, incorrect casing, or partial input before reuse.",
          },
        ],
      };
    case "data":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Data format converters are useful when the same information needs to move between apps that expect different structures, such as spreadsheets, APIs, CMS exports, or configuration files.`,
          "Paste the source format, convert it, and review the result before exporting it into the next system. This is especially helpful for one-off transformations and debugging structured data quickly.",
        ],
        faqs: [
          {
            question: `What input format does ${tool.name.toLowerCase()} expect?`,
            answer: `It expects valid ${tool.from.toUpperCase()} input and converts it into ${tool.to.toUpperCase()} output. Clean, valid source data gives the most reliable results.`,
          },
          {
            question: "What happens if the source structure is invalid?",
            answer: "The tool will show an error instead of guessing. Fixing the invalid source first is the safest way to get clean converted output.",
          },
          {
            question: "Can I use this for spreadsheet or API data?",
            answer: "Yes. These converters are useful for moving between spreadsheet-friendly formats like CSV and structured formats like JSON, XML, YAML, Markdown, or plain text.",
          },
          {
            question: "What should I review after conversion?",
            answer: "Check field names, nesting, empty values, arrays, and special characters. Structured conversions are only as good as the input data they start with.",
          },
        ],
      };
    case "time":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Time converters are useful when you need to switch between timestamp formats, total-second values, and more readable duration formats for logs, dashboards, APIs, or support work.`,
          "They help you verify values quickly without mental math or custom scripts. Paste the source value, convert it, and copy the output that fits your next tool or report.",
        ],
        faqs: [
          {
            question: `What does ${tool.name.toLowerCase()} convert?`,
            answer: tool.description,
          },
          {
            question: "Who is this useful for?",
            answer: "It is useful for developers, analysts, ops teams, QA, and anyone handling timestamps or durations in logs, dashboards, spreadsheets, or support tickets.",
          },
          {
            question: "Do I need an exact input format?",
            answer: "Yes. Time values are format-sensitive, so you will get the best result when the source timestamp or duration is pasted in the expected format.",
          },
          {
            question: "Why is it worth double-checking the output?",
            answer: "Time values can be easy to misread, especially across time systems and long durations. A quick review helps avoid off-by-one or unit mistakes before reuse.",
          },
        ],
      };
    case "unit":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Unit converters are useful for quick everyday conversions across distance, temperature, angles, weight, and color formats without opening a spreadsheet or calculator.`,
          "They work best for direct one-value conversions where you want an immediate answer and a clean result you can copy into a document, design file, or data field.",
        ],
        faqs: [
          {
            question: `What does ${tool.name.toLowerCase()} convert?`,
            answer: tool.description,
          },
          {
            question: "Is this only for one-off calculations?",
            answer: "It is especially good for one-off conversions, but it also works well when you need to test several values quickly in the same session.",
          },
          {
            question: "Can I use decimal values?",
            answer: "Yes. Decimal input is useful for most unit conversions, especially distance, temperature, weight, and color values.",
          },
          {
            question: "What should I verify before using the result?",
            answer: "Check that the source unit and target unit are the ones you intended. Most conversion mistakes come from choosing the wrong starting format rather than from the calculation itself.",
          },
        ],
      };
  }
}

export function buildUtilityToolCopy(tool: ExactUtilityTool): ToolCopy {
  switch (tool.family) {
    case "code":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} This is useful when you want to clean up, compress, or validate pasted code quickly before using it in a project, config file, API request, or content block.`,
          "It is designed for quick browser-based checks and transformations. Paste the source, review the result or validation state, and copy the final output only when it looks correct.",
        ],
        faqs: [
          {
            question: `What is ${tool.name.toLowerCase()} best for?`,
            answer: `${tool.description} It is useful for quick formatting, compacting, or syntax checks when you do not want to open a full IDE workflow just for one snippet.`,
          },
          {
            question: "Will it fix broken code automatically?",
            answer: "No. Formatters can improve layout, and validators can point out invalid syntax, but they do not reliably repair broken logic or malformed structure for you.",
          },
          {
            question: "Can I use this on partial snippets?",
            answer: "Yes, but the result depends on whether the pasted snippet is valid for that language and action. Complete, valid input gives the most reliable output.",
          },
          {
            question: "What should I check before copying the result?",
            answer: "Review formatting-sensitive values, embedded templates, comments, and quoting. Minified or reformatted code should still be checked once before production use.",
          },
        ],
      };
    case "random":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Random generators are useful when you need a fast sample value for testing, placeholders, prototyping, QA, content ideas, or lightweight utility work.`,
          "They are designed for quick repeated runs. Generate a value, copy it if it fits, and run it again when you need another output without changing tools.",
        ],
        faqs: [
          {
            question: `What can I use ${tool.name.toLowerCase()} for?`,
            answer: `${tool.description} Common use cases include testing forms, sample data, placeholder values, quick decisions, and lightweight workflow automation.`,
          },
          {
            question: "Can I generate multiple results until I get one I like?",
            answer: "Yes. These tools are built for repeated runs, so you can generate again until the output fits your current task.",
          },
          {
            question: "Is this suitable for production-grade security or compliance use?",
            answer: "Use generated values for convenience, testing, and general-purpose workflows. For security-critical or compliance-sensitive systems, you should still follow your own production standards and review requirements.",
          },
          {
            question: "Why review the output before using it?",
            answer: "Random values can be valid but still not fit your exact format, range, or policy needs. A quick check helps you avoid using a value that is technically random but contextually wrong.",
          },
        ],
      };
  }
}
