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
  // Slug-specific copy — unique content for each tool
  switch (tool.slug) {
    case "trim-text-lines":
      return {
        heading: "How to trim leading and trailing whitespace from text lines",
        paragraphs: [
          "Trimming whitespace from text lines removes the invisible spaces and tabs that accumulate at the start and end of each line when text is copied from PDFs, spreadsheets, chat apps, or code editors. These characters are harmless to read but cause problems when the text is used in databases, APIs, spreadsheets, or code — where a value like `  hello  ` is treated as different from `hello`.",
          "This tool applies the trim operation to every line simultaneously. Paste your text, and each line is processed independently: leading whitespace (spaces and tabs before the first visible character) and trailing whitespace (spaces and tabs after the last visible character) are removed. The content of each line and the line order remain unchanged.",
          "The most common sources of unwanted whitespace are: copying from PDFs where the extraction process adds padding, copying from spreadsheet cells that have been formatted with leading spaces, copying from chat messages or emails where indentation was added for visual formatting, and copying from code where indentation is meaningful but not needed in the output.",
          "Trimming is often the first step in a data cleaning pipeline. After trimming, you can sort, deduplicate, or import the text with confidence that whitespace differences will not cause false mismatches.",
        ],
        faqs: [
          { question: "What is the difference between trimming and removing all whitespace?", answer: "Trimming only removes whitespace at the very start and end of each line. It preserves spaces between words and any intentional indentation within the line content. Removing all whitespace strips every space character from the entire text, which is a much more aggressive operation." },
          { question: "Will this affect blank lines?", answer: "Blank lines (lines containing only whitespace) will become empty lines after trimming. If you also want to remove blank lines entirely, use the Empty Line Remover tool after trimming." },
          { question: "Does this work on tab characters as well as spaces?", answer: "Yes. The trim operation removes both space characters and tab characters from the start and end of each line." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser. Your text never leaves your device." },
        ],
      };

    case "empty-line-remover":
      return {
        heading: "How to remove blank lines from text",
        paragraphs: [
          "Empty lines accumulate in text for many reasons: copy-pasting from documents that use blank lines for visual spacing, exporting from tools that add separator lines, or editing text manually and leaving gaps. When you need clean, compact output — for a list, a data import, a prompt, or a code block — those blank lines get in the way.",
          "This tool removes every blank line from your input. A blank line is any line that contains no visible characters — it may be completely empty or contain only whitespace. Lines with actual content are preserved exactly as they are, including their order.",
          "Common use cases include: cleaning up keyword lists before importing them into an SEO tool, removing separator lines from exported data, compacting a list of URLs or email addresses, and preparing text for a language model prompt where blank lines waste tokens.",
          "If you want to remove blank lines and also trim whitespace from the remaining lines, run the Trim Text Lines tool first, then the Empty Line Remover. This combination handles the most common text cleanup scenarios.",
        ],
        faqs: [
          { question: "What counts as a blank line?", answer: "Any line that contains no visible characters. This includes completely empty lines and lines that contain only spaces or tabs." },
          { question: "Will this remove intentional paragraph breaks?", answer: "Yes. The tool removes all blank lines regardless of intent. If you need to preserve paragraph structure, consider using a different approach — for example, replacing double line breaks with a placeholder before removing single blank lines." },
          { question: "Can I remove only consecutive blank lines while keeping single ones?", answer: "This tool removes all blank lines. For more selective blank line handling, use the regex replacement tool with a pattern that matches multiple consecutive blank lines." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "extra-whitespaces-remover":
      return {
        heading: "How to collapse extra spaces and tabs in text",
        paragraphs: [
          "Extra whitespace — multiple consecutive spaces or tabs between words — is a common artifact of copying text from PDFs, HTML pages, formatted documents, and code. It looks invisible in most contexts but causes problems in databases, search indexes, and any system that treats `hello  world` differently from `hello world`.",
          "This tool collapses any sequence of two or more consecutive spaces or tabs into a single space. It does not remove single spaces between words, and it does not affect line breaks. The result is text where every word is separated by exactly one space.",
          "This is different from trimming (which handles the start and end of lines) and from removing all whitespace (which removes every space). Collapsing extra spaces is the right operation when you want clean, readable text with normal word spacing.",
          "Typical sources of extra whitespace include: PDF text extraction which often adds spaces between characters, HTML source code where multiple spaces are used for visual indentation, copy-pasting from formatted documents, and text that has been processed by tools that add padding.",
        ],
        faqs: [
          { question: "Does this remove single spaces between words?", answer: "No. It only collapses sequences of two or more consecutive spaces into one. Single spaces between words are preserved." },
          { question: "Does it affect line breaks?", answer: "No. Line breaks are preserved. Only horizontal whitespace (spaces and tabs) within lines is collapsed." },
          { question: "What is the difference between this and trimming?", answer: "Trimming removes whitespace at the start and end of each line. This tool collapses extra whitespace within lines. For thorough cleanup, use both: trim first, then collapse extra spaces." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "all-whitespaces-remover":
      return {
        heading: "How to remove all whitespace from text",
        paragraphs: [
          "Removing all whitespace strips every space, tab, and line break from your text, leaving only the visible characters. This is a more aggressive operation than trimming or collapsing spaces — it produces a single continuous string with no gaps.",
          "This is useful for specific technical tasks: generating compact identifiers from phrases, removing all formatting from a string before hashing or comparing it, stripping whitespace from code tokens, and preparing text for systems that cannot handle any whitespace in their input.",
          "Be careful with this tool — it removes spaces between words, which makes the output unreadable as natural language. It is intended for technical use cases where the whitespace-free string is the actual goal, not for general text cleanup.",
          "If you only want to remove extra whitespace while keeping single spaces between words, use the Extra Whitespaces Remover instead. If you only want to remove whitespace at the start and end of lines, use the Trim Text Lines tool.",
        ],
        faqs: [
          { question: "Will this make my text unreadable?", answer: "Yes, for natural language text. All spaces between words are removed, so `hello world` becomes `helloworld`. This tool is for technical use cases where a whitespace-free string is specifically needed." },
          { question: "Does it remove line breaks too?", answer: "Yes. All whitespace characters are removed, including spaces, tabs, and line breaks." },
          { question: "When would I actually need this?", answer: "Common use cases include: generating compact identifiers, normalising strings before comparison or hashing, stripping whitespace from tokens in code processing, and preparing input for systems that reject whitespace." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "punctuation-mark-remover":
      return {
        heading: "How to remove punctuation from text",
        paragraphs: [
          "Punctuation removal strips commas, periods, exclamation marks, question marks, colons, semicolons, quotes, brackets, and other punctuation characters from your text. The words and spaces remain; only the punctuation is removed.",
          "This is useful for text normalisation tasks: preparing text for keyword extraction where punctuation would split words incorrectly, cleaning up scraped content before analysis, normalising text for comparison or deduplication, and preparing input for natural language processing pipelines that handle punctuation separately.",
          "Note that some punctuation serves structural purposes — apostrophes in contractions, hyphens in compound words, and periods in abbreviations. Removing all punctuation will affect these too. Review the output to confirm it meets your needs before using it downstream.",
          "For more selective punctuation handling — for example, removing only specific characters — use the Regex Match Replacer tool with a custom pattern.",
        ],
        faqs: [
          { question: "Which punctuation characters are removed?", answer: "Standard punctuation marks including periods, commas, exclamation marks, question marks, colons, semicolons, quotes (single and double), brackets, parentheses, hyphens, underscores, and similar characters. The exact set depends on the Unicode punctuation category." },
          { question: "Does it remove apostrophes in contractions like \"don't\"?", answer: "Yes. Apostrophes are punctuation and will be removed, turning `don't` into `dont`. If you need to preserve contractions, use a regex replacement tool with a more selective pattern." },
          { question: "Will numbers be affected?", answer: "No. Digits are not punctuation and will be preserved." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "character-accent-remover":
      return {
        heading: "How to remove accents and diacritics from text",
        paragraphs: [
          "Accent removal converts accented characters (like é, ü, ñ, ç, ø) into their base Latin equivalents (e, u, n, c, o). The process is called Unicode normalisation followed by diacritic stripping — the accented character is decomposed into its base character plus a combining mark, and then the combining mark is removed.",
          "This is useful for generating URL slugs from titles in multiple languages, normalising text for search indexing where accent-insensitive matching is needed, preparing text for systems that only support ASCII, and deduplicating lists where the same word appears with and without accents.",
          "The conversion is one-way — you cannot recover the original accents from the stripped output. Always keep a copy of the original text if you need to preserve the accented forms.",
          "Note that some characters do not have a simple base Latin equivalent. Characters from non-Latin scripts (Cyrillic, Arabic, Chinese, etc.) are not affected by this tool — it only strips diacritics from Latin-based characters.",
        ],
        faqs: [
          { question: "What is a diacritic?", answer: "A diacritic is a mark added to a letter to indicate a different pronunciation or to distinguish it from another letter. Examples include the acute accent (é), umlaut (ü), tilde (ñ), cedilla (ç), and circumflex (â)." },
          { question: "Will this affect non-Latin scripts like Chinese or Arabic?", answer: "No. This tool only strips diacritics from Latin-based characters. Non-Latin scripts are not affected." },
          { question: "Is the conversion reversible?", answer: "No. Once accents are removed, the original accented forms cannot be recovered from the output. Keep a copy of the original if you need to preserve the accented text." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "backslash-remover":
      return {
        heading: "How to remove backslashes from text",
        paragraphs: [
          "Backslashes appear in text for several reasons: they are used as escape characters in programming languages (so `\\n` represents a newline, `\\\"` represents a quote), they appear in Windows file paths, and they sometimes get added when text is serialised to JSON or other formats and then copied out.",
          "When you copy a JSON string value, a database export, or a code snippet, you often end up with backslashes that were part of the encoding but are not part of the actual content. This tool removes them so you get the clean underlying text.",
          "Common scenarios: copying a JSON string that contains escaped quotes (`\\\"`) and wanting the plain text with regular quotes, copying a Windows file path and wanting to convert it to a forward-slash format, and cleaning up text that was double-escaped during processing.",
          "If you want to add backslashes instead of removing them — for example, to escape a string for use in JSON or a programming language — use the Backslash Adder tool.",
        ],
        faqs: [
          { question: "Will this remove backslashes from file paths?", answer: "Yes. All backslash characters are removed. If you want to convert Windows paths to forward-slash format, you would need to replace backslashes with forward slashes rather than removing them — use the regex replacement tool for that." },
          { question: "What about escaped sequences like \\n or \\t?", answer: "The backslash is removed, leaving just the `n` or `t`. If you want to convert escape sequences to their actual characters (newline, tab), that requires a different operation." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "backslash-adder":
      return {
        heading: "How to add backslashes to text for escaping",
        paragraphs: [
          "Adding backslashes escapes special characters in your text so it can be safely used in programming languages, JSON strings, SQL queries, and other contexts where certain characters have special meaning.",
          "The most common use case is preparing a string for inclusion in a JSON value or a programming language string literal. In these contexts, double quotes inside the string must be escaped as `\\\"`, and backslashes themselves must be escaped as `\\\\`.",
          "This tool adds backslashes before double quotes and existing backslashes in your text. The result is a string that can be safely embedded in a JSON value or a quoted string in most programming languages.",
          "If you have a string that already has backslashes and you want to remove them, use the Backslash Remover tool instead.",
        ],
        faqs: [
          { question: "Which characters get backslashes added before them?", answer: "Double quotes and existing backslashes. These are the characters that most commonly need escaping in JSON and programming language string literals." },
          { question: "Will this make my text valid JSON?", answer: "It will escape the characters that need escaping inside a JSON string value. You still need to wrap the result in double quotes to make it a valid JSON string." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "text-line-reverser":
      return {
        heading: "How to reverse the order of lines in text",
        paragraphs: [
          "Reversing line order flips a multiline text block so the last line becomes the first and the first becomes the last. The content of each individual line is unchanged — only the sequence of lines is reversed.",
          "This is useful for: reversing chronological logs so the most recent entry appears first, flipping a ranked list to show the lowest-ranked items first, reversing the order of a numbered list, and any situation where you have a list in the wrong order and need to flip it quickly.",
          "The reversal is applied to the entire input as a single operation. If you need to reverse only part of a text block, extract that section first, reverse it, then recombine.",
        ],
        faqs: [
          { question: "Does this reverse the characters within each line?", answer: "No. Only the order of lines is reversed. The content of each line remains exactly as it was." },
          { question: "What happens to blank lines?", answer: "Blank lines are treated as lines and included in the reversal. They will appear in their reversed position in the output." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "add-line-numbers":
      return {
        heading: "How to add line numbers to text",
        paragraphs: [
          "Adding line numbers prepends a sequential number to the start of each line in your text. This makes it easy to reference specific lines when reviewing, quoting, or discussing the content with others.",
          "Line numbers are useful for: code reviews where you need to reference specific lines, reviewing long documents where you want to annotate specific sections, creating numbered lists from plain text, and preparing text for discussion where line references are needed.",
          "The numbering starts at 1 by default and increments by 1 for each line. Blank lines are also numbered. The number is separated from the line content by a tab or space depending on the tool's settings.",
        ],
        faqs: [
          { question: "Can I start numbering from a number other than 1?", answer: "Check the tool's settings for a start number option. Starting from a different number is useful when the text is a continuation of a larger document." },
          { question: "Are blank lines numbered?", answer: "Yes. Every line, including blank lines, receives a number." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "alphabetic-text-sorter":
      return {
        heading: "How to sort text lines alphabetically",
        paragraphs: [
          "Alphabetic sorting arranges the lines of your text in A-to-Z or Z-to-A order based on the first character of each line. This is the most common type of text sorting and works well for lists of names, keywords, items, and any text where alphabetical order is meaningful.",
          "The sort is case-sensitive by default — uppercase letters sort before lowercase in standard ASCII order. If you need case-insensitive sorting, check the tool's settings.",
          "Alphabetic sorting treats numbers as text, which means `10` sorts before `2` because `1` comes before `2` in character order. If you need to sort numbers in numeric order, use the Numeric Text Sorter instead.",
          "Common use cases: sorting a list of names, organising keywords for an SEO campaign, alphabetising a glossary or reference list, and deduplicating a list after sorting (duplicates will be adjacent after sorting, making them easy to spot).",
        ],
        faqs: [
          { question: "Is the sort case-sensitive?", answer: "By default, uppercase letters sort before lowercase (A before a). Check the tool settings for a case-insensitive option if you need all letters treated equally regardless of case." },
          { question: "How does it handle numbers?", answer: "Numbers are sorted as text, so `10` comes before `2` because `1` < `2` in character order. Use the Numeric Text Sorter for numeric ordering." },
          { question: "Can I sort in reverse (Z to A)?", answer: "Yes. Toggle the reverse order option to sort from Z to A." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "numeric-text-sorter":
      return {
        heading: "How to sort text lines numerically",
        paragraphs: [
          "Numeric sorting arranges lines by their numeric value rather than their character order. This means `10` correctly sorts after `9`, unlike alphabetic sorting where `10` would come before `9` because `1` < `9` in character order.",
          "This is essential when sorting lists that contain numbers: rankings, scores, prices, quantities, IDs, and any other numeric data where the mathematical value determines the correct order.",
          "Lines that do not start with a number are typically sorted to the end of the list or treated as having a value of 0, depending on the tool's implementation. Check the output to confirm non-numeric lines are handled as expected.",
          "For mixed lists where some lines start with numbers and others do not, consider cleaning the list first to ensure consistent formatting before sorting.",
        ],
        faqs: [
          { question: "What is the difference between numeric and alphabetic sorting?", answer: "Alphabetic sorting treats all characters as text, so `10` sorts before `2`. Numeric sorting extracts the numeric value from each line, so `10` correctly sorts after `2`." },
          { question: "Does it handle decimal numbers?", answer: "Yes. Decimal values like `3.14` or `99.9` are sorted by their numeric value." },
          { question: "What happens to lines that don't start with a number?", answer: "Non-numeric lines are typically sorted to the end of the list. Review the output to confirm the handling matches your expectations." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "email-extractor":
      return {
        heading: "How to extract email addresses from text",
        paragraphs: [
          "Email extraction scans your text and returns every email address it finds as a clean list. This is useful when you have a document, email thread, web page source, or exported data that contains email addresses mixed with other content, and you need just the addresses.",
          "The extractor uses a pattern that matches standard email address formats: one or more characters before the `@` sign, followed by a domain name with at least one dot. It handles common variations including addresses with dots, hyphens, and plus signs in the local part.",
          "Common use cases: extracting contact emails from a scraped web page, pulling email addresses from a long email thread, collecting addresses from a CSV export that mixes emails with other data, and building a clean list from a document that mentions email addresses in prose.",
          "The output is one email address per line, making it easy to copy into a spreadsheet, import into a CRM, or use as input for another tool. Duplicate addresses are included — use the duplicate line remover if you need a unique list.",
        ],
        faqs: [
          { question: "What email formats does this recognise?", answer: "Standard email formats including addresses with dots, hyphens, plus signs, and underscores in the local part, and standard domain formats. Very unusual or malformed addresses may not be detected." },
          { question: "Will it find emails inside HTML source code?", answer: "Yes. The extractor works on any text, including HTML source. It will find email addresses regardless of the surrounding markup." },
          { question: "Does it remove duplicates?", answer: "No. All found addresses are returned, including duplicates. Use the duplicate line remover tool if you need a unique list." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "url-extractor":
      return {
        heading: "How to extract URLs from text",
        paragraphs: [
          "URL extraction finds every web address in your text and returns them as a clean list. This is useful when you have a document, email, web page source, or log file that contains URLs mixed with other content.",
          "The extractor recognises URLs starting with `http://`, `https://`, and sometimes bare domain patterns. It handles URLs with paths, query parameters, and fragments.",
          "Common use cases: extracting links from a scraped web page, pulling URLs from a log file, collecting links from an email thread, and building a list of URLs from a document that mentions them in prose.",
          "Long URLs with complex query strings are extracted in full. Review the output to confirm that URLs were not truncated by line breaks in the source text.",
        ],
        faqs: [
          { question: "Does it find URLs without http:// prefix?", answer: "The extractor primarily looks for URLs with `http://` or `https://` prefixes. Bare domain names without a protocol prefix may not be detected reliably." },
          { question: "Will it extract URLs from HTML source code?", answer: "Yes. It works on any text including HTML. It will find URLs in href attributes, src attributes, and plain text." },
          { question: "Does it remove duplicates?", answer: "No. All found URLs are returned. Use the duplicate line remover if you need a unique list." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "number-extractor":
      return {
        heading: "How to extract numbers from text",
        paragraphs: [
          "Number extraction finds every numeric value in your text and returns them as a clean list. This is useful when you have a document, report, or data export that contains numbers mixed with text, and you need just the numeric values.",
          "The extractor recognises integers, decimal numbers, and signed values (positive and negative). It handles numbers in various contexts: prices, measurements, scores, IDs, and any other numeric data embedded in prose or structured text.",
          "Common use cases: extracting prices from a product description, pulling scores from a report, collecting measurements from a specification document, and building a list of numeric values from text that mixes numbers with labels.",
          "Review the output to confirm that the extracted numbers are the ones you wanted. The extractor may pick up version numbers, phone numbers, dates, and other numeric patterns alongside the values you are looking for.",
        ],
        faqs: [
          { question: "Does it extract decimal numbers?", answer: "Yes. Decimal values like `3.14`, `99.9`, and `-0.5` are extracted." },
          { question: "Will it extract phone numbers and dates?", answer: "It extracts numeric sequences, which may include phone numbers, dates, and other formatted numbers. Review the output to filter out values you do not need." },
          { question: "Does it remove duplicates?", answer: "No. All found numbers are returned. Use the duplicate line remover if you need a unique list." },
          { question: "Is my text sent to a server?", answer: "No. All processing happens in your browser." },
        ],
      };

    case "lorem-ipsum-generator":
      return {
        heading: "How to generate Lorem Ipsum placeholder text",
        paragraphs: [
          "Lorem Ipsum is the standard placeholder text used in design, publishing, and web development. It has been used since the 1500s when an unknown printer scrambled a passage of Latin text to create a type specimen book. The standard Lorem Ipsum passage begins: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'",
          "Placeholder text serves an important purpose in design workflows: it lets you evaluate layout, typography, and spacing without being distracted by the actual content. When you see real words, your brain reads them and evaluates their meaning rather than the visual design. Lorem Ipsum prevents this by using text that looks like Latin but is not meaningful.",
          "This generator lets you choose how much placeholder text to generate — by paragraphs, sentences, or words — so you can match the amount of text to the space you are designing. Generate just enough to fill the layout without overwhelming it.",
          "Lorem Ipsum is appropriate for mockups, wireframes, design reviews, CMS demos, and any situation where you need realistic-looking text before the real content is ready. Replace it before publishing — Lorem Ipsum on a live page is a sign of an unfinished product.",
        ],
        faqs: [
          { question: "What does Lorem Ipsum mean?", answer: "Lorem Ipsum is derived from a passage in Cicero's 'de Finibus Bonorum et Malorum' (On the Ends of Good and Evil), written in 45 BC. The standard Lorem Ipsum text is a scrambled and altered version of this passage. It is not meaningful Latin." },
          { question: "Can I generate different amounts of text?", answer: "Yes. Choose paragraphs for longer blocks, sentences for medium amounts, or words for short snippets. This lets you match the placeholder text to the space you are filling." },
          { question: "Should I use Lorem Ipsum on a live website?", answer: "No. Lorem Ipsum is for design and development only. Replace all placeholder text with real content before publishing." },
          { question: "Is my text sent to a server?", answer: "No. The text is generated entirely in your browser." },
        ],
      };

    case "text-difference-checker":
      return {
        heading: "How to compare two text blocks and find differences",
        paragraphs: [
          "Text comparison (diffing) shows you exactly what changed between two versions of a text. Added lines are highlighted in one colour, removed lines in another, and unchanged lines are shown as context. This makes it easy to review edits without reading every line manually.",
          "This is the same technique used by version control systems like Git to show what changed between commits. The difference is that this tool works on any text you paste — you do not need a Git repository or any technical setup.",
          "Common use cases: reviewing edits to a document before accepting them, comparing two versions of a contract or legal text, checking what an AI rewrote in a piece of content, verifying that a configuration file was changed correctly, and auditing changes to any text-based content.",
          "The comparison is line-based: a line is either unchanged, added, or removed. If a line was modified (some words changed but the line is otherwise the same), it typically appears as a removed line followed by an added line. This is the standard diff format used in software development.",
        ],
        faqs: [
          { question: "Does this compare word by word or line by line?", answer: "The comparison is line-based. A line is either unchanged, added, or removed. Modified lines appear as a removed line followed by an added line." },
          { question: "Can I use this to compare code?", answer: "Yes. The tool works on any text, including code. It is useful for reviewing code changes when you do not have access to a version control diff." },
          { question: "Is there a size limit?", answer: "No practical limit for typical use cases. Very large texts may take a moment to process." },
          { question: "Is my text sent to a server?", answer: "No. All comparison happens in your browser." },
        ],
      };

    default:
      // Fall through to family-based copy for tools without specific copy
      break;
  }

  // Family-based fallback copy
  switch (tool.family) {
    case "cleaner":
      return {
        heading: `How to use the ${tool.name}`,
        paragraphs: [
          `${tool.description} This is most useful when you have pasted content from chat apps, spreadsheets, PDFs, CMS editors, or code snippets and need one cleanup step without manually editing every line.`,
          "The tool is designed for quick before-and-after cleanup. Paste the source text, review the transformed output, and copy only when the result matches what you need in your document, sheet, prompt, or code block.",
          "Text cleanup tools like this one save significant time in content workflows. When you copy text from a PDF, a web page, a spreadsheet, or a chat application, the formatting rarely survives intact. Extra spaces appear between words, line breaks end up in the wrong places, tabs get mixed with spaces, and special characters sneak in. Fixing these issues manually in a word processor is tedious and error-prone — especially when the same problem repeats across dozens or hundreds of lines.",
          "This tool applies a single, focused transformation to your entire input at once. Rather than using find-and-replace in a text editor (which requires knowing the exact character to search for), you simply paste your text and the tool handles the detection and correction automatically. The result is a clean output you can copy directly into your next destination — whether that is a CMS, a spreadsheet, a code file, or a prompt.",
          "The most common use cases for text cleaning tools include: preparing data for import into a database or spreadsheet, cleaning up AI-generated content before publishing, normalising text copied from PDFs where formatting artifacts are common, preparing prompts for language models where extra whitespace can affect token count, and cleaning up code snippets copied from documentation or Stack Overflow.",
        ],
        faqs: [
          {
            question: `What exactly does the ${tool.name} change in my text?`,
            answer: `${tool.description} The transformation is applied to every line in your input simultaneously. The original line order and content stay intact — only the specific formatting issue targeted by this tool is changed.`,
          },
          {
            question: "When should I use this instead of editing by hand?",
            answer: "Use it whenever the same formatting issue appears across multiple lines or throughout a long block of text. Manual editing is fine for one or two instances, but when the same problem repeats across dozens of lines, a dedicated tool is faster and more reliable. It also eliminates the risk of accidentally missing an instance or introducing new errors while editing.",
          },
          {
            question: "Will this rewrite my wording or change the meaning of my text?",
            answer: "No. This tool only applies the specific text-cleanup rule it is designed for. It does not rephrase sentences, change vocabulary, or alter the meaning of your content in any way. The transformation is purely structural — it changes formatting, not substance.",
          },
          {
            question: "What should I check before copying the result?",
            answer: "Review names, codes, escaped characters, and spacing-sensitive content. Some cleanup actions are intentionally aggressive — for example, a whitespace remover will strip all spaces, which may not be what you want for certain types of content. Always do a quick visual scan of the output before using it in a production context.",
          },
          {
            question: "Can I use this on very long text blocks?",
            answer: "Yes. The tool processes the entire input at once regardless of length. There is no line limit. For very large inputs, the processing happens entirely in your browser, so performance depends on your device rather than a server.",
          },
          {
            question: "Does this tool store or transmit my text?",
            answer: "No. All processing happens locally in your browser. Your text is never sent to any server. This makes it safe to use with sensitive content such as internal documents, client data, or confidential drafts.",
          },
        ],
      };
    case "line":
      return {
        heading: `How to use the ${tool.name}`,
        paragraphs: [
          `${tool.description} These line-based tools are best for lists, logs, copied spreadsheet columns, prompts, and batch text edits where each line should be treated as a separate item.`,
          "Use them when you need to reshape a multiline block without manually touching every row. They are especially useful for bulk line numbering, sorting, joining, trimming, prefixing, filtering, and other list operations.",
          "Line-based text operations are among the most common tasks in content and data workflows. Whether you are preparing a list of keywords for an SEO campaign, cleaning up a CSV export, formatting a prompt for a language model, or organising a set of URLs for a redirect map, the ability to apply a consistent transformation to every line at once is a significant time saver.",
          "The key advantage of a dedicated line tool over a general text editor is precision. In a text editor, you might use find-and-replace or a macro, but these approaches require knowing the exact pattern to match and can easily produce unintended results. A focused line tool applies exactly one well-defined operation — sort, number, prefix, filter, join, or truncate — with no ambiguity about what will change.",
          "These tools work best when your input is already structured as one item per line. If your source text is a paragraph or a comma-separated list, consider converting it to a line-per-item format first using a text-to-list converter, then applying the line operation you need.",
        ],
        faqs: [
          {
            question: `What kind of input works best with the ${tool.name}?`,
            answer: "Any multiline text where each line represents a separate item. Examples include keyword lists, product names, URLs, log entries, CSV fragments, task lists, email addresses, and any other data where one item per line is the natural structure.",
          },
          {
            question: "Will it preserve my original line order?",
            answer: tool.focus === "sort" || tool.preset.reverseOrder
              ? "This tool intentionally changes the line order based on the selected sorting or reversing rule. That is its primary purpose."
              : "Yes. The original line order is preserved unless the specific operation you are using is designed to change it (such as sorting or reversing). For operations like numbering, prefixing, filtering, and joining, the order stays exactly as you entered it.",
          },
          {
            question: "Can I use this on hundreds or thousands of lines at once?",
            answer: "Yes. The tool is designed for bulk line operations and processes the entire input simultaneously. There is no practical line limit for typical use cases. Very large inputs (tens of thousands of lines) may take a moment to process depending on your device.",
          },
          {
            question: "What should I verify before copying the output?",
            answer: "Check delimiters, prefixes, suffixes, and filtered results if your text has spacing-sensitive or duplicate-looking lines. For sorting operations, verify that the sort order matches your expectation — alphabetic sorting treats numbers as text, which can produce unexpected results for numeric lists.",
          },
          {
            question: "Does this tool work with non-English text?",
            answer: "Yes. The tool works with Unicode text including non-Latin scripts. Alphabetic sorting uses Unicode code point order, which may not match locale-specific alphabetical order for all languages.",
          },
          {
            question: "Is my text stored or sent anywhere?",
            answer: "No. All processing happens in your browser. Your text never leaves your device.",
          },
        ],
      };
    case "align":
      return {
        heading: `How to use the ${tool.name}`,
        paragraphs: [
          `${tool.description} Alignment tools are useful when you need fixed-width text for plain-text layouts, code comments, terminal output, sample data, or formatted notes.`,
          "They help standardize line width quickly without having to count spaces by hand. Paste the text, set the width, and copy the aligned version once it looks right.",
          "Text alignment is a surprisingly common need in technical writing, documentation, and data presentation. When you are writing code comments that need to line up neatly, preparing a plain-text table for a README, formatting terminal output for a blog post, or creating sample data for a presentation, having each line padded to a consistent width makes the result look intentional and professional.",
          "The challenge with manual alignment is that it requires counting characters precisely — a tedious and error-prone process, especially when lines vary significantly in length. This tool automates that counting and applies the padding consistently across every line in your input.",
          "Alignment tools work best in monospaced environments where every character occupies the same horizontal space. Code editors, terminals, preformatted HTML blocks, and plain-text files all render monospaced text correctly. In proportional fonts (like those used in word processors and most web pages), the visual alignment may not be perfect even when the character counts are correct.",
        ],
        faqs: [
          {
            question: `What is the ${tool.name} most useful for?`,
            answer: "It is most useful for fixed-width formatting in technical contexts: code comments, README tables, terminal output, plain-text reports, sample payloads, and any workflow where consistent line width makes the content easier to read and more professional-looking.",
          },
          {
            question: "Does it change the actual text content?",
            answer: "No. It only adds padding characters (spaces) to adjust the visual width of each line. The underlying words, numbers, and punctuation remain exactly as you entered them.",
          },
          {
            question: "Why does alignment look better in monospaced fonts?",
            answer: "In monospaced fonts, every character — including spaces — occupies exactly the same horizontal width. This means padding with spaces produces perfectly aligned columns. In proportional fonts, characters have different widths, so space-padded text may not align visually even when the character counts are correct.",
          },
          {
            question: "What happens to lines that are already longer than my target width?",
            answer: "Lines that exceed the target width are left unchanged — the tool does not truncate content. Only lines shorter than the target width receive padding.",
          },
          {
            question: "Can I use this for right-aligning numbers in a table?",
            answer: "Yes. Right-padding (or left-padding for right-alignment) is particularly useful for numeric columns in plain-text tables where you want numbers to line up on their decimal points or right edges.",
          },
        ],
      };
    case "extractor":
      return {
        heading: `How to use the ${tool.name}`,
        paragraphs: [
          `${tool.description} This is useful when the data you need is buried inside logs, emails, notes, raw exports, or scraped text and you only want the matching values back.`,
          "Instead of scanning a long block manually, you can paste the source text, extract the matching values, and copy just the cleaned list for your next step.",
          "Data extraction from unstructured text is one of the most common tasks in content operations, data analysis, and developer workflows. When you receive a long email thread and need to pull out all the email addresses, or when you have a log file and need to extract all the URLs, or when you have a document full of numbers and need just the numeric values — doing this manually is slow and error-prone.",
          "This tool uses pattern matching to find all instances of the target data type in your input and returns them as a clean list. Each match appears on its own line, making the output immediately usable for further processing — pasting into a spreadsheet, importing into a tool, or using as input for another text operation.",
          "The extraction is non-destructive: your original input is not modified. The tool simply identifies and returns the matching values. If you need to remove the extracted values from the original text rather than just collecting them, use a regex replacement tool instead.",
        ],
        faqs: [
          {
            question: `What does the ${tool.name} look for in my text?`,
            answer: `${tool.description} The tool scans your entire input and returns every match as a separate line in the output. Duplicates are included unless you specifically filter them out.`,
          },
          {
            question: "Can I use it on messy or unstructured text?",
            answer: "Yes. That is exactly what it is designed for. It works well on email threads, notes, log files, exports, scraped web content, and any mixed-content document where the values you need are not already cleanly separated.",
          },
          {
            question: "Will it change the original text around the matches?",
            answer: "No. The tool only returns the extracted values. The surrounding text is ignored in the output. Your original input is not modified.",
          },
          {
            question: "What should I verify after extraction?",
            answer: "Check for partial matches, duplicates, and formatting noise. Some patterns can match more broadly than expected — for example, a number extractor might pick up version numbers, phone numbers, and prices alongside the values you actually wanted. A quick review of the output list helps confirm it contains only what you need.",
          },
          {
            question: "What if I need to extract a custom pattern not covered by this tool?",
            answer: "Use the Regex Match Extractor tool, which lets you define your own regular expression pattern. This gives you full control over what gets extracted.",
          },
          {
            question: "Is there a limit to how much text I can process?",
            answer: "No practical limit for typical use cases. The tool processes the entire input in your browser without sending data to a server.",
          },
        ],
      };
    case "regex":
      return {
        heading: `How to use the ${tool.name}`,
        paragraphs: [
          `${tool.description} Regex tools are useful when simple search-and-replace is not enough and you need pattern-based matching across a larger text block.`,
          "You can test expressions directly in the browser, review the matched or replaced output, and refine the pattern before using it in code, data cleanup, or content workflows.",
          "Regular expressions (regex) are one of the most powerful tools for text processing, but they can be intimidating to write and test. This tool provides a safe, interactive environment where you can build and refine your pattern against real input before committing it to code or a production workflow.",
          "The most common use cases for regex tools include: extracting specific data patterns from logs or exports, replacing formatted values with a different format (such as reformatting dates or phone numbers), validating that text matches an expected pattern, cleaning up content by removing or replacing specific character sequences, and transforming structured text from one format to another.",
          "Regex patterns are composed of literal characters and special metacharacters. Common metacharacters include `.` (any character), `*` (zero or more), `+` (one or more), `?` (zero or one), `^` (start of line), `$` (end of line), `\\d` (digit), `\\w` (word character), and `\\s` (whitespace). Grouping with `()` and alternation with `|` allow complex patterns to be built from simpler components.",
          "Flags modify how the pattern is applied. The `g` (global) flag finds all matches rather than just the first. The `i` (case-insensitive) flag makes the pattern match regardless of letter case. The `m` (multiline) flag makes `^` and `$` match the start and end of each line rather than the entire string.",
        ],
        faqs: [
          {
            question: "Who is this regex tool most useful for?",
            answer: "Anyone who needs to process text with repeatable patterns: developers cleaning data, analysts extracting values from exports, SEO teams processing URL lists, editors normalising formatting, and operations teams working with logs or copied exports.",
          },
          {
            question: "What happens if my regex pattern is invalid?",
            answer: "The tool shows a clear error message instead of silently returning wrong results. This lets you fix the pattern or flags before copying anything. Common mistakes include unescaped special characters, unmatched parentheses, and invalid flag combinations.",
          },
          {
            question: "Can I use flags like global (g) or case-insensitive (i)?",
            answer: "Yes. You can combine flags to control how broadly the pattern matches. The `g` flag is almost always needed when you want to find all matches rather than just the first one. The `i` flag is useful when the case of the text is inconsistent.",
          },
          {
            question: "Why should I review regex output before using it?",
            answer: "Regex patterns can match more broadly than intended. A pattern designed to match phone numbers might also match version numbers or ZIP codes. A replacement pattern might accidentally modify content you wanted to preserve. Always review the output against a representative sample of your real data before applying it at scale.",
          },
          {
            question: "What is the difference between the extract and replace modes?",
            answer: "Extract mode returns only the text that matches your pattern — useful for pulling specific values out of a larger block. Replace mode substitutes matched text with a replacement string — useful for reformatting, normalising, or removing specific patterns.",
          },
          {
            question: "Can I use capture groups in my pattern?",
            answer: "Yes. Capture groups (parentheses in the pattern) let you reference specific parts of a match in the replacement string using `$1`, `$2`, etc. This is useful for reformatting — for example, converting `YYYY-MM-DD` dates to `DD/MM/YYYY` by capturing each component separately.",
          },
        ],
      };
    case "stats":
      if (tool.focus === "readability") {
        return {
          heading: `How the ${tool.name} Works`,
          paragraphs: [
            "The Flesch-Kincaid readability tests are the gold standard for assessing how easy or difficult a piece of writing is to understand. Originally developed for the US Navy in 1975 by J. Peter Kincaid, the formula evaluates two key metrics: average sentence length and average syllables per word. By combining these, it provides a Reading Ease score (0–100) and a Grade Level estimate.",
            "Our tool analyzes your text in real-time, calculating four of the most trusted readability algorithms: Flesch-Kincaid, Gunning Fog, Coleman-Liau, and the Automated Readability Index (ARI). Beyond simple scores, it identifies specific sentences that are 'hard' or 'very hard' to read, allowing you to edit with precision for your target audience.",
            "### Who is this tool for?",
            "- **Content Writers & Editors**: Keep your writing accessible to a wider audience, reducing bounce rates on blog posts, landing pages, and newsletters.",
            "- **SEO Professionals**: Ensure your content matches the reading level of the top-ranking pages in your niche to satisfy user intent and algorithm preferences.",
            "- **Educators & Academics**: Verify that your lesson materials and test questions are reading-level appropriate for your specific grade cohort.",
            "- **Technical Writers**: Simplify complex manuals, release notes, and documentation to maximize comprehension across all reading abilities.",
            "### The Formulas",
            "Understanding the math behind the scores helps in making better editing decisions. Here are the core equations used by this calculator:",
            "**Flesch Reading Ease:** 206.835 − 1.015 × (words / sentences) − 84.6 × (syllables / words)",
            "**FK Grade Level:** 0.39 × (words / sentences) + 11.8 × (syllables / words) − 15.59",
            "Higher Reading Ease scores indicate text that is easier to read, while higher Grade Levels indicate more complex material suited for academic or professional audiences.",
          ],
          faqs: [
            {
              question: "What is a good Flesch-Kincaid score for blog posts?",
              answer: "For most online content, aim for a Reading Ease score between 60 and 70 (Standard) and a Grade Level of 8 or 9. This ensures your writing is accessible to the broadest possible audience without losing professional clarity.",
            },
            {
              question: "What is the difference between Reading Ease and Grade Level?",
              answer: "Reading Ease is a scale from 0 to 100 where higher numbers mean easier reading. Grade Level (e.g., Grade 8) estimates the years of education required to understand the text. They use similar inputs but different weightings to provide two perspectives on complexity.",
            },
            {
              question: "How can I lower my Flesch-Kincaid grade level?",
              answer: "The fastest way to lower your grade level is to split long sentences into two and swap multisyllabic words for simpler synonyms. Our sentence highligher will show you exactly which sentences are dragging your score down.",
            },
            {
              question: "When should I use Gunning Fog or SMOG instead?",
              answer: "Gunning Fog is excellent for business and technical writing, while SMOG (Simple Measure of Gobbledygook) is often preferred for healthcare and consumer education. We provide a consensus view so you can see if your text is consistently rated across all major algorithms.",
            },
            {
              question: "Are there limitations to readability scores?",
              answer: "Yes. Formulas cannot measure context, reader interest, or the 'quality' of your ideas. A high score doesn't mean the writing is good—it only means it is structurally simple. Use these scores as a guide, not a final verdict.",
            },
          ],
        };
      }

      if (tool.focus === "characters") {
        return {
          heading: `About ${tool.name.toLowerCase()}`,
          paragraphs: [
            `${tool.description} This is useful when you want to inspect repeated characters, hidden spacing, punctuation noise, or symbol-heavy patterns that are hard to notice by eye in a long block of text.`,
            "Paste the source text to see which characters dominate, how often they appear, and whether spaces, tabs, or repeated symbols are affecting the result. That makes it useful for cleanup, debugging, and text QA.",
          ],
          faqs: [
            {
              question: "What can a character frequency map reveal?",
              answer: "It can reveal repeated punctuation, hidden whitespace, unusual symbols, accidental separators, and character-level patterns that are easy to miss in a quick scan.",
            },
            {
              question: "Is this useful for data cleanup and prompt QA?",
              answer: "Yes. It is useful for copied exports, prompts, scraped text, logs, and any content where small repeated characters can change how the text is parsed or displayed.",
            },
            {
              question: "Why would I include whitespace in the count?",
              answer: "Whitespace counts help you detect extra spaces, tabs, or line-break-heavy input that may affect formatting or parser behavior.",
            },
            {
              question: "Why should I review characters instead of only words?",
              answer: "Some problems are not word-level. Repeated separators, quote marks, invisible characters, or punctuation patterns only become obvious when you inspect characters directly.",
            },
          ],
        };
      }

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
    case "transform":
      if (tool.mode === "list") {
        return {
          heading: `About ${tool.name.toLowerCase()}`,
          paragraphs: [
            `${tool.description} This is useful when you need to move between comma-separated text and one-item-per-line lists without manually editing every separator.`,
            "It works well for keyword sets, tags, product names, prompt ingredients, spreadsheet fragments, and any small text batch that needs to switch between inline and vertical list formats.",
          ],
          faqs: [
            {
              question: "When should I use text to list or list to text?",
              answer: "Use it when you need to split a pasted inline string into separate rows, or join a multiline list back into one reusable value for a form, prompt, or export.",
            },
            {
              question: "Can I use delimiters other than commas?",
              answer: "Yes. You can change the delimiter to split or join text with semicolons, pipes, tabs, or another custom separator.",
            },
            {
              question: "Will it trim spaces around each item?",
              answer: "Yes, if you keep trimming enabled. That helps clean up copied lists with uneven spacing around separators.",
            },
            {
              question: "Why should I still review the final list?",
              answer: "A quick review helps you catch values that already contain the delimiter, blank rows, or items that should not have been split in the first place.",
            },
          ],
        };
      }

      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} This is useful when you need a clean slug for a URL, filename, CMS field, or SEO draft without manually deleting punctuation and replacing spaces one piece at a time.`,
          "Paste a phrase or several lines, review the normalized output, and copy the result once it matches the separator style you want to use in your route, page title, or content system.",
        ],
        faqs: [
          {
            question: `What does ${tool.name.toLowerCase()} remove or change?`,
            answer: "It strips punctuation, normalizes spacing, and converts the text into a URL-friendly format. It is designed to give you a cleaner slug, not preserve decorative characters.",
          },
          {
            question: "Can I use underscores or a custom separator?",
            answer: "Yes. You can change the separator if your naming convention does not use standard hyphens.",
          },
          {
            question: "Will it work for headings with accents or special characters?",
            answer: "Yes. It normalizes accented characters into simpler Latin equivalents where possible before building the slug output.",
          },
          {
            question: "Why should I still check the final slug?",
            answer: "A quick review helps you catch edge cases such as abbreviations, brand names, and desired casing before the slug is used publicly.",
          },
        ],
      };
    case "generator":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Placeholder text generators are useful when you need layout-fill copy for wireframes, prototypes, design reviews, CMS demos, or content templates before the real writing is ready.`,
          "Use it to generate just enough paragraphs, sentences, or words for the space you are designing, then copy the result into mockups, landing-page drafts, forms, or product previews.",
        ],
        faqs: [
          {
            question: "When should I use lorem ipsum instead of real content?",
            answer: "Use it during layout, spacing, and UI review work when final copy is not ready yet. It helps you test visual rhythm without blocking on content production.",
          },
          {
            question: "Can I generate paragraphs, sentences, or words only?",
            answer: "Yes. The generator lets you choose the output unit so you can match the amount of placeholder copy to the design you are building.",
          },
          {
            question: "Should placeholder text go live on a real page?",
            answer: "No. It is meant for drafts, mockups, and staging work. Replace it before publishing anything user-facing.",
          },
          {
            question: "Why is this better than copying lorem ipsum from another site?",
            answer: "It keeps the generation step inside the same workspace, lets you control the amount quickly, and makes it easier to regenerate when the layout changes.",
          },
        ],
      };
    case "compare":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Text comparison tools are useful when you need to review edits between two drafts without scanning every paragraph manually.`,
          "Paste the original text and the revised version to see what changed, what stayed the same, and where additions or removals happened. This is useful for content reviews, AI edits, legal copy checks, and revision QA.",
        ],
        faqs: [
          {
            question: "What kinds of changes can this diff tool highlight?",
            answer: "It highlights added lines, removed lines, and changed lines so you can review revisions faster than comparing two drafts by eye.",
          },
          {
            question: "Is this useful for article drafts and AI rewrites?",
            answer: "Yes. It works well for blog posts, landing-page edits, support copy, prompt outputs, documentation revisions, and other draft-to-draft comparisons.",
          },
          {
            question: "Will it tell me which version is better?",
            answer: "No. It shows the differences clearly, but you still decide which changes to keep based on accuracy, tone, and intent.",
          },
          {
            question: "Why review line-by-line changes instead of only counts?",
            answer: "Counts tell you how much changed, but the line-level view shows exactly where the meaning, emphasis, or wording shifted between versions.",
          },
        ],
      };
    case "unicode":
      if (tool.mode === "fancy-font") {
        return {
          heading: `About ${tool.name.toLowerCase()}`,
          paragraphs: [
            `${tool.description} This is useful for bios, social posts, mockups, profile names, and lightweight decorative text where you want pasted output to look styled without relying on CSS.`,
            "Instead of applying visual formatting, the tool swaps standard letters for Unicode alternatives that already look bold, script-like, monospaced, or otherwise stylized in supporting apps.",
          ],
          faqs: [
            {
              question: "Are these real fonts?",
              answer: "No. The output uses Unicode lookalike characters, not installed font files. That means the styling travels with the copied text when the destination app supports those characters.",
            },
            {
              question: "Will every app show the same result?",
              answer: "Not always. Rendering depends on the platform, font fallback, and Unicode support of the app where you paste the text.",
            },
            {
              question: "Can I use this for usernames and profile names?",
              answer: "Yes, but some platforms restrict special Unicode characters in names or handles, so it is worth testing before you rely on one style.",
            },
            {
              question: "Why should I preview the styled output first?",
              answer: "Some variants are easier to read than others, especially with numbers and punctuation. A quick preview helps you avoid unreadable or inconsistent output.",
            },
          ],
        };
      }

      if (tool.mode === "invisible") {
        return {
          heading: `About ${tool.name.toLowerCase()}`,
          paragraphs: [
            `${tool.description} It is useful when you need a copyable invisible character for spacing edge cases, empty-looking profile fields, test inputs, or workflows that treat a truly blank value differently from an invisible one.`,
            "Different invisible characters behave differently. Some are zero-width joiners, some prevent line breaks, and some only appear blank in certain apps, so it is important to choose the right one for the target platform.",
          ],
          faqs: [
            {
              question: "Is invisible text the same as an empty value?",
              answer: "No. The output still contains Unicode characters. It only looks empty or blank in many interfaces.",
            },
            {
              question: "Will every invisible character work the same way everywhere?",
              answer: "No. Some platforms strip zero-width characters, while others allow them. Testing in the destination app is the safest approach.",
            },
            {
              question: "What is the difference between zero-width space and word joiner?",
              answer: "A zero-width space behaves like an invisible break point, while a word joiner prevents breaks. They may both look blank, but they are not interchangeable.",
            },
            {
              question: "Why include the code point label?",
              answer: "It helps you know exactly which invisible character you copied so you can reproduce the same behavior later instead of guessing which blank-looking value worked.",
            },
          ],
        };
      }

      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Unicode text transformations are useful when you want output that looks visually altered after copying, without needing rich text formatting or design software.`,
          "They work best for casual decorative use, mockups, bios, captions, and playful text treatments where readability matters less than visual effect.",
        ],
        faqs: [
          {
            question: `How does ${tool.name.toLowerCase()} work?`,
            answer: "It maps normal characters to Unicode alternatives that create a different visual effect when pasted into supporting apps or websites.",
          },
          {
            question: "Will punctuation and numbers always transform too?",
            answer: "Not always. Unicode coverage is uneven, so some characters may remain unchanged if there is no clean equivalent.",
          },
          {
            question: "Can I use this in messages, captions, and social posts?",
            answer: "Yes. These tools are mainly useful for short-form text where a decorative effect is intentional and acceptable for the audience.",
          },
          {
            question: "Why should I check the pasted result in the target app?",
            answer: "Unicode rendering varies by platform, so a quick paste test helps confirm the result still looks the way you expect.",
          },
        ],
      };
    case "reference":
      return {
        heading: `About ${tool.name.toLowerCase()}`,
        paragraphs: [
          `${tool.description} Reference-style character search tools are useful when you need to identify a symbol, look up a code point, or confirm whether a strange pasted character belongs to ASCII or a broader Unicode range.`,
          "They help with debugging, content cleanup, encoding work, and UI review by making it easier to search by character, decimal code, code point, or descriptive name.",
        ],
        faqs: [
          {
            question: "What can I search for in the character table?",
            answer: "You can search by the visible character itself, its code point, decimal value, category, or descriptive name.",
          },
          {
            question: "Does this only include ASCII?",
            answer: "No. It includes the full ASCII range and a curated set of useful Unicode characters such as invisible characters, combining marks, and common symbols.",
          },
          {
            question: "Why is character lookup useful in practice?",
            answer: "It helps when a pasted value looks wrong, appears blank, breaks formatting, or behaves strangely in code, forms, or content tools.",
          },
          {
            question: "Why include both decimal and code point values?",
            answer: "Different tools and docs refer to characters in different ways. Showing both makes it easier to match what you see in a debugger, spec, or editor.",
          },
        ],
      };
  }
}

export function buildConverterToolCopy(tool: ExactConverterTool): ToolCopy {
  switch (tool.family) {
    case "encoding":
      if (tool.mode === "base64-encode" || tool.mode === "base64-decode") {
        return {
          heading: "What Base64 encoding is used for",
          paragraphs: [
            "Base64 converts bytes into ASCII text so data can travel more safely through systems that expect text rather than raw binary. It is commonly used in APIs, email payloads, JSON transports, debugging workflows, and data URLs for small inline assets.",
            "This page is designed as a practical Base64 utility, not just a one-way encoder. You can switch between encode and decode modes, work with plain text or files, generate data URLs, inspect size overhead, and check whether the decoded output is usable text or a previewable asset.",
            "Base64 is not encryption. It does not protect secrets; it only changes representation. It is also larger than the original data — Base64-encoded content is approximately 33% larger than the original binary — so it should be used intentionally rather than as a default transport format for large files.",
            "The most common use cases for Base64 encoding include: embedding small images directly in HTML or CSS as data URLs (avoiding an extra HTTP request), encoding binary data for inclusion in JSON payloads (since JSON does not support raw binary), encoding email attachments in MIME format, storing binary data in text-based configuration files, and passing binary data through systems that only support ASCII text.",
            "When decoding Base64, the tool attempts to detect whether the decoded content is valid UTF-8 text or binary data. If the decoded content is text, it is displayed directly. If it appears to be binary (such as an image or PDF), the tool may offer a preview or download option depending on the detected MIME type.",
          ],
          faqs: [
            {
              question: "What is Base64 used for?",
              answer: "Base64 is used when binary data needs to be represented as text, such as in JSON payloads, email attachments, browser data URLs, and debugging or transport workflows where raw bytes are inconvenient. It is the standard encoding for embedding images in CSS, sending binary data in REST APIs, and storing binary content in text-based formats.",
            },
            {
              question: "Why is Base64 output larger than the original?",
              answer: "Base64 encodes every 3 bytes of input as 4 ASCII characters, which means the output is approximately 33% larger than the input. This overhead is the trade-off for making binary data safe to transmit through text-only channels.",
            },
            {
              question: "What is the difference between standard Base64 and URL-safe Base64?",
              answer: "Standard Base64 uses `+` and `/` characters, which have special meanings in URLs. URL-safe Base64 replaces these with `-` and `_` respectively, making the encoded string safe to include in URLs and filenames without percent-encoding.",
            },
            {
              question: "Is Base64 the same as encryption?",
              answer: "No. Base64 is an encoding scheme, not encryption. Anyone who receives Base64-encoded data can decode it instantly without a key. It provides no security — it only changes the representation of the data. Never use Base64 to protect sensitive information.",
            },
            {
              question: "What is a data URL and when should I use one?",
              answer: "A data URL is a Base64-encoded file embedded directly in an HTML or CSS attribute, formatted as `data:[MIME type];base64,[encoded data]`. It is useful for small images and icons where you want to avoid an extra HTTP request. For larger files, a regular URL is more efficient because browsers can cache it separately.",
            },
          ],
        };
      }

      // Generic encoding tool copy
      return {
        heading: `How the ${tool.name} works`,
        paragraphs: [
          `${tool.description} Encoding and decoding tools are essential for working with data that needs to be safely transmitted, stored, or displayed in contexts that have restrictions on which characters are allowed.`,
          "Different encoding schemes exist because different systems have different constraints. URLs can only contain certain characters, HTML has reserved characters that must be escaped, and binary data cannot be transmitted through text-only channels without transformation. Each encoding scheme solves a specific compatibility problem.",
          "This tool handles the conversion in your browser without sending your data to any server. This makes it safe to use with sensitive content such as API keys, tokens, passwords, and private data that you need to encode or decode for debugging purposes.",
          "Understanding when to use each encoding scheme is important. URL encoding (percent-encoding) is for query parameters and path segments in URLs. HTML entity encoding is for displaying special characters in HTML without them being interpreted as markup. Base64 is for binary data that needs to travel through text-only channels. ROT13 and ROT47 are simple substitution ciphers used for light obfuscation, not security.",
        ],
        faqs: [
          {
            question: `What is ${tool.name} used for?`,
            answer: `${tool.description} This type of encoding is commonly needed when working with APIs, web development, data processing, and any workflow where text needs to be safely transmitted or stored in a specific format.`,
          },
          {
            question: "Is encoding the same as encryption?",
            answer: "No. Encoding transforms data into a different representation for compatibility purposes. Encryption transforms data to protect it from unauthorised access. Encoded data can be decoded by anyone who knows the encoding scheme. Encrypted data requires a key to decrypt.",
          },
          {
            question: "Will this tool work with non-ASCII characters?",
            answer: "Yes. The tool handles Unicode text including non-Latin scripts. The encoding output will represent these characters according to the rules of the specific encoding scheme.",
          },
          {
            question: "Is my data sent to a server?",
            answer: "No. All encoding and decoding happens locally in your browser. Your data never leaves your device, making this safe for sensitive content.",
          },
          {
            question: "What should I check after encoding or decoding?",
            answer: "Verify that the output looks correct for your use case. For URL encoding, check that special characters are properly percent-encoded. For HTML encoding, check that reserved characters like `<`, `>`, and `&` are correctly escaped. For Base64, check that the decoded output matches the original input.",
          },
        ],
      };

    case "data":
      return {
        heading: `How the ${tool.name} works`,
        paragraphs: [
          `${tool.description} Data format conversion is one of the most common tasks in software development, data analysis, and content operations — different tools, APIs, and systems use different formats, and converting between them is a constant need.`,
          `This tool converts ${tool.from.toUpperCase()} to ${tool.to.toUpperCase()} directly in your browser. Paste your source data, review the converted output, and copy it for use in your next tool or workflow. No server is involved — the conversion happens entirely on your device.`,
          `${tool.from.toUpperCase()} and ${tool.to.toUpperCase()} each have different strengths. ${tool.from.toUpperCase()} is widely used for ${tool.from === "json" ? "APIs and JavaScript applications" : tool.from === "csv" ? "spreadsheets and tabular data" : tool.from === "yaml" ? "configuration files and human-readable data" : tool.from === "xml" ? "enterprise systems and document markup" : tool.from === "html" ? "web content" : tool.from === "markdown" ? "documentation and content writing" : "data exchange"}. ${tool.to.toUpperCase()} is preferred for ${tool.to === "json" ? "APIs and JavaScript applications" : tool.to === "csv" ? "spreadsheets and tabular data" : tool.to === "yaml" ? "configuration files and human-readable data" : tool.to === "xml" ? "enterprise systems and document markup" : tool.to === "html" ? "web content" : tool.to === "markdown" ? "documentation and content writing" : "data exchange"}.`,
          "Data format conversion can sometimes involve information loss or structural changes. Not all data structures map perfectly between formats — for example, JSON supports nested objects and arrays, while CSV is inherently flat. When converting between formats with different structural capabilities, the tool makes reasonable choices about how to represent the data, but you should always review the output to ensure it matches your expectations.",
        ],
        faqs: [
          {
            question: `Why would I need to convert ${tool.from.toUpperCase()} to ${tool.to.toUpperCase()}?`,
            answer: `Different tools and systems expect data in different formats. You might need to convert ${tool.from.toUpperCase()} to ${tool.to.toUpperCase()} when importing data into a tool that only accepts ${tool.to.toUpperCase()}, when sharing data with a team that uses a different stack, or when a downstream API or service requires a specific format.`,
          },
          {
            question: "Will the conversion preserve all my data?",
            answer: `In most cases, yes. However, some format conversions involve structural differences that can affect how data is represented. For example, converting nested JSON to CSV flattens the structure, which may lose some hierarchy. Always review the output to confirm it contains all the data you expect.`,
          },
          {
            question: "What should I do if the conversion produces unexpected output?",
            answer: "Check that your input is valid and well-formed. Invalid or malformed input is the most common cause of unexpected conversion results. Use a validator for your source format first, then retry the conversion.",
          },
          {
            question: "Is there a size limit for the input?",
            answer: "No practical limit for typical use cases. The conversion happens in your browser, so performance depends on your device. Very large files (several megabytes) may take a moment to process.",
          },
          {
            question: "Is my data sent to a server?",
            answer: "No. All conversion happens locally in your browser. Your data never leaves your device.",
          },
        ],
      };

    case "time":
      return {
        heading: `How the ${tool.name} works`,
        paragraphs: [
          `${tool.description} Time format conversion is a frequent need in software development, data analysis, logging, and any workflow that involves timestamps from different systems.`,
          "Different systems represent time in different ways. Unix timestamps (seconds since January 1, 1970 UTC) are compact and easy to compare mathematically, but they are not human-readable. UTC datetime strings are human-readable but harder to do arithmetic on. H:M:S format is intuitive for durations but not for absolute timestamps. This tool converts between these representations instantly.",
          "Understanding time zones is important when working with timestamps. Unix timestamps are always in UTC — they represent an absolute moment in time regardless of time zone. When converting to a human-readable format, the displayed time depends on whether you want UTC or a local time zone. This tool works with UTC by default.",
          "Common use cases for time conversion include: converting log timestamps from Unix format to readable dates for debugging, converting API response timestamps for display in a UI, calculating durations from start and end timestamps, and converting between time representations when integrating systems that use different formats.",
        ],
        faqs: [
          {
            question: `What is the ${tool.name} useful for?`,
            answer: `${tool.description} This is commonly needed when working with APIs, databases, log files, and any system that stores or transmits timestamps in a format different from what you need to display or process.`,
          },
          {
            question: "What is a Unix timestamp?",
            answer: "A Unix timestamp (also called POSIX time or epoch time) is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC. It is a compact, timezone-independent way to represent a specific moment in time. Most programming languages and databases support Unix timestamps natively.",
          },
          {
            question: "Why do Unix timestamps sometimes have 10 digits and sometimes 13?",
            answer: "10-digit Unix timestamps represent seconds since the epoch. 13-digit timestamps represent milliseconds since the epoch (used by JavaScript's `Date.now()` and many modern APIs). When converting, make sure you know which unit your timestamp uses.",
          },
          {
            question: "Does this tool handle time zones?",
            answer: "The tool works with UTC by default. Unix timestamps are inherently UTC. When converting to a human-readable format, the output is in UTC unless otherwise specified.",
          },
          {
            question: "Is my data sent to a server?",
            answer: "No. All conversion happens locally in your browser.",
          },
        ],
      };

    case "unit":
      return {
        heading: `How the ${tool.name} works`,
        paragraphs: [
          `${tool.description} Unit conversion is one of the most common everyday calculations — whether you are working with measurements from a different country, converting data for an API, or checking a recipe from a foreign cookbook.`,
          "This tool performs the conversion instantly as you type, so you can see the result without pressing a button. The conversion formula is applied precisely, giving you an accurate result rather than a rounded approximation.",
          "Unit conversions are deceptively simple to get wrong when done manually. The formula is straightforward, but it is easy to multiply when you should divide, or to forget the offset in temperature conversions (Celsius to Fahrenheit requires both multiplication and addition, not just multiplication). Using a dedicated tool eliminates these errors.",
          "For developers and data professionals, unit conversion often comes up when working with APIs that return values in one unit while your application needs another, when processing sensor data from devices that use different measurement systems, or when displaying measurements to users in their preferred units.",
        ],
        faqs: [
          {
            question: `What is the ${tool.name} useful for?`,
            answer: `${tool.description} This conversion is commonly needed in everyday life, cooking, travel, fitness, science, and software development whenever values need to be expressed in a different unit system.`,
          },
          {
            question: "How accurate is the conversion?",
            answer: "The conversion uses the standard mathematical formula for this unit pair. The result is as accurate as floating-point arithmetic allows, which is sufficient for all practical purposes.",
          },
          {
            question: "Can I convert in the reverse direction?",
            answer: "Yes. There is a separate tool for the reverse conversion. You can find it in the Converter section.",
          },
          {
            question: "Does this tool work offline?",
            answer: "Yes. Once the page has loaded, the conversion works without an internet connection because all calculation happens in your browser.",
          },
          {
            question: "Is my data sent to a server?",
            answer: "No. All conversion happens locally in your browser.",
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
