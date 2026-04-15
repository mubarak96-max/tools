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
      if (tool.slug === "convert-url-encoder-decoder") {
        return {
          heading: "How URL Encoding and Decoding works",
          paragraphs: [
            "URL encoding, also known as percent-encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI). Characters that are not allowed in a URL must be replaced by a `%` followed by their two-digit hexadecimal equivalent. For example, a space becomes `%20`.",
            "This tool allows you to both encode plain text for safe use in URLs and decode percent-encoded strings back into readable text. It is a critical utility for web developers, SEO professionals, and anyone working with APIs and web addresses.",
            "Beyond standard encoding, this tool supports options like encoding spaces as `+` instead of `%20`. This is commonly used in query strings for forms (application/x-www-form-urlencoded), following RFC 1738 conventions.",
            "All processing happens entirely in your browser. Your data is never sent to a server, ensuring your privacy and security when handling sensitive URL parameters, API keys, or tracking tokens.",
            "Our tool also provides real-time character counters and code snippets for common programming languages like JavaScript, Python, and PHP, making it a powerful developer reference.",
          ],
          faqs: [
            { question: "When should I use URL encoding?", answer: "Use URL encoding whenever you need to include special characters in a URL's query string or path. This includes spaces, ampersands, equal signs, and non-ASCII characters that would otherwise break the URL structure or be misinterpreted by the server." },
            { question: "What is the difference between %20 and + for spaces?", answer: "Both are used to represent spaces. `%20` is the standard percent-encoding used in almost all parts of a URI (RFC 3986). The `+` sign is specifically used in query strings and is the default for HTML form submissions (application/x-www-form-urlencoded)." },
            { question: "Is URL encoding the same as Base64?", answer: "No. URL encoding is designed for safe character transmission in web addresses. Base64 is designed for representing binary data as ASCII text. They use completely different algorithms and serve different technical purposes." },
            { question: "Why are some characters not encoded?", answer: "Certain characters are 'unreserved' and allowed in URLs without encoding. These typically include alphanumeric characters (A-Z, a-z, 0-9) and a few symbols like hyphens, dots, underscores, and tildes." },
            { question: "Is my data safe with this online tool?", answer: "Yes. This tool runs entirely client-side using JavaScript in your browser. Your text never leaves your device, and nothing is uploaded to our servers, making it safe for private information." },
          ],
        };
      }

      if (tool.slug === "convert-html-entity-encoder-decoder") {
        return {
          heading: "Understanding HTML Entity Encoding and Decoding",
          paragraphs: [
            "HTML entity encoding is the process of replacing reserved characters in HTML with corresponding character entities. This is primarily done to prevent the browser from interpreting these characters as actual HTML markup. For example, the less-than sign `<` is encoded as `&lt;` so it can be displayed literally on a page without starting a new tag.",
            "This tool provides a dual-purpose interface for both encoding (escaping) raw text and decoding (unescaping) existing HTML entities. It is an essential utility for web developers, technical writers, and security professionals who need to safely handle HTML fragments, documentation snippets, or user-provided content.",
            "Beyond basic escaping, our encoder supports specialized entity types: **Named Entities** (like `&copy;`), **Decimal Entities** (like `&#169;`), and **Hexadecimal Entities** (like `&#xA9;`). This allows for maximum compatibility across different HTML standards and encoding requirements.",
            "Security is a primary use case for HTML encoding. By escaping characters like `<`, `>`, `&`, and quotes, you can effectively mitigate **Cross-Site Scripting (XSS)** vulnerabilities in your web applications. Our tool processes all data locally on your device, ensuring that sensitive code snippets or private data never leave your browser.",
            "Whether you are preparing a code block for a blog post, cleaning up scraped content, or debugging a complex email template, this platform offers the precision and real-time feedback needed for professional-grade HTML manipulation.",
          ],
          faqs: [
            {
              question: "What are HTML entities and why are they needed?",
              answer: "HTML entities are strings that start with an ampersand (&) and end with a semicolon (;). They are used to represent characters that are either reserved in HTML (like `<` or `&`) or characters that cannot be easily typed on a keyboard (like the copyright symbol `©`).",
            },
            {
              question: "When should I use named entities vs. numeric entities?",
              answer: "Named entities (e.g., `&lt;`) are more human-readable and easier to remember, making them ideal for manual coding. Numeric entities (decimal or hex) are more robust and supported across all platforms, even when a specific named entity might not be defined in the current HTML version.",
            },
            {
              question: "Does this tool protect against XSS attacks?",
              answer: "Yes, encoding user-provided content is one of the most effective ways to prevent XSS. By converting potentially malicious characters like `<script>` into `&lt;script&gt;`, you ensure the code is displayed as text rather than executed by the browser.",
            },
            {
              question: "What is the difference between HTML encoding and URL encoding?",
              answer: "HTML encoding is for safe character display within HTML documents to prevent tag interpretation. URL encoding (percent-encoding) is for making data safe for use in web addresses (URIs). They use completely different replacement rules—for example, a space becomes `&nbsp;` in HTML (for non-breaking) but `%20` in a URL.",
            },
            {
              question: "Is my data sent to your server during encoding?",
              answer: "No. All encoding and decoding logic runs locally in your browser using JavaScript. Your input text is processed entirely on your machine, ensuring complete privacy for your code and data.",
            },
          ],
        };
      }

      if (tool.slug === "convert-base64-encoder-decoder") {
        return {
          heading: "Mastering Base64 Encoding and Decoding",
          paragraphs: [
            "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is most commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with text. This ensures that the data remains intact without modification during transport.",
            "Our Base64 toolkit is designed for both casual users and developers. It supports encoding plain text and local files (images, documents, etc.) into standard Base64, URL-safe Base64, or Data URLs for direct embedding in HTML and CSS. Conversely, the decoder can handle raw Base64 strings or full Data URLs, restoring the original content instantly.",
            "A key characteristic of Base64 is its **33% size overhead**. Because every 3 bytes of data are represented by 4 characters (6 bits per character), the resulting string is approximately one-third larger than the original binary input. This is a deliberate trade-off for making binary data safe for text-only channels like JSON, XML, or email payloads.",
            "The decoder features **smart detection**, automatically identifying if the underlying data is a common internal format (like JSON) or a previewable asset (like a PNG or JPG image). This makes it an invaluable tool for debugging API responses and inspecting embedded assets without leaving the browser.",
            "Security is handled entirely client-side. Whether you are encoding an API token or decoding a private JSON payload, no data is ever sent to our servers. All transformations occur within your browser's local sandbox, providing a fast, secure, and private environment for your development needs.",
          ],
          faqs: [
            {
              question: "What is Base64 used for in web development?",
              answer: "Base64 is primarily used to transmit binary data over text-based protocols. For example, it allows you to embed small images directly in CSS or HTML as Data URLs, send binary attachments in JSON API payloads, and store basic authentication credentials in HTTP headers.",
            },
            {
              question: "Why is the encoded output larger than the input?",
              answer: "Base64 encoding uses 4 characters to represent every 3 bytes of data. This happens because Base64 uses a 64-character alphabet (6 bits per character), whereas raw binary uses 8 bits per byte. This results in a roughly 33% increase in character count compared to the original byte count.",
            },
            {
              question: "What is URL-safe Base64?",
              answer: "Standard Base64 uses `+` and `/` characters, which have special meanings in URLs. URL-safe Base64 replaces these with `-` and `_` respectively, making the encoded string safe to use as a filename or a URL query parameter without additional percent-encoding.",
            },
            {
              question: "Is Base64 considered encryption?",
              answer: "Absolutely not. Base64 is an encoding scheme, not encryption. It provides no security or confidentiality. Anyone can decode a Base64 string instantly without a key. Its purpose is data representation, not data protection.",
            },
            {
              question: "What is a Data URL?",
              answer: "A Data URL is a URI scheme that allows you to embed small files inline in documents. It follows the format `data:[mime type];base64,[data]`. It is commonly used for tiny icons, font snippets, or CSS background images to reduce the number of HTTP requests required to load a page.",
            },
          ],
        };
      }

      if (tool.slug === "convert-rot13-encoder-decoder") {
        return {
          heading: "Understanding ROT13: The Classic Substitution Cipher",
          paragraphs: [
            "ROT13 ('Rotate by 13 places') is a simple substitution cipher that replaces a letter with the 13th letter after it in the Latin alphabet. Because the modern English alphabet has 26 letters, ROT13 is its own inverse—performing the encoding twice on the same string will return the original text.",
            "Historically, ROT13 originated from the Usenet community as a way to hide spoilers, punchlines to jokes, or offensive material from the casual reader's view. It is often described as the digital equivalent of printing an answer upside down in a newspaper puzzle.",
            "A key feature of ROT13 is that it only affects alphabetic characters (A-Z and a-z). Numbers, punctuation, and whitespace remain completely unchanged. This makes it ideal for obfuscating text fragments within a larger document without breaking the formatting or readability of structural elements.",
            "It is crucial to understand that **ROT13 provides no cryptographic security**. It is a form of obfuscation, not encryption. It should never be used to secure passwords, private data, or sensitive information, as it can be 'broken' instantly by anyone with basic knowledge of the scheme.",
            "Our ROT13 tool offers a real-time, browser-based implementation. It allows you to toggle between encoding and decoding instantly, though the process is identical. Like all our tools, processing happens locally on your device, ensuring your text fragments are never transmitted to our server.",
          ],
          faqs: [
            {
              question: "How does the ROT13 cipher work?",
              answer: "ROT13 works by shifting every letter 13 places forward in the alphabet. For example, 'A' becomes 'N', and 'B' becomes 'O'. Once it reaches 'Z', it wraps back around to 'A'.",
            },
            {
              question: "Why is ROT13 called 'self-reciprocal'?",
              answer: "Since the alphabet has 26 letters and 13 is exactly half of that, applying the shift twice (13 + 13 = 26) brings you back to the starting point. This means the same algorithm is used for both encoding and decoding.",
            },
            {
              question: "Is ROT13 secure for hiding secrets?",
              answer: "No. ROT13 is not intended for security. It is a light obfuscation method used to prevent accidental reading (like spoilers). It can be easily deciphered by anyone and offers zero protection against malicious actors.",
            },
            {
              question: "Does ROT13 affect numbers or special characters?",
              answer: "No. ROT13 only shifts the letters A through Z. Any numbers (0-9), punctuation marks, or symbols remain exactly as they were in the original input.",
            },
            {
              question: "Where did ROT13 come from?",
              answer: "ROT13 became popular in the early 1980s on Usenet, an early internet discussion system. It was adopted as a community standard for hiding content that users might not want to see immediately, such as movie spoilers.",
            },
          ],
        };
      }

      if (tool.slug === "convert-binary-encoder-decoder") {
        return {
          heading: "Understanding Binary: The Foundation of Computing",
          paragraphs: [
            "Binary is a base-2 numeral system that uses only two symbols: typically '0' (zero) and '1' (one). In computing, these two symbols represent the 'off' and 'on' states of a transistor. Every piece of digital data—from simple text to complex video—is ultimately stored and processed as a vast sequence of these binary digits, or bits.",
            "This tool allows you to convert human-readable text into its binary representation and vice versa. It typically uses the ASCII or UTF-8 character encoding standards to map each character to a unique 8-bit sequence (a byte). For instance, the letter 'A' is represented in binary as `01000001`.",
            "Encoding text to binary is essential for understanding how computers 'read' your data at the lowest level. It is widely used in computer science education, low-level systems programming, and debugging communication protocols where raw bitstreams need to be inspected.",
            "One common pitfall when working with binary is the distinction between character encoding (like UTF-8) and the binary system itself. While binary is just a way to represent numbers, the encoding standard determines *which* number represents *which* character. Our tool defaults to the industry-standard UTF-8 mapping, ensuring compatibility across modern platforms.",
            "Like all our converters, this binary encoder runs entirely in your browser. This means your text remains private and is never uploaded to any server. Whether you are learning about bits and bytes or debugging an embedded project, you can rely on this tool for fast, local, and secure conversions.",
          ],
          faqs: [
            {
              question: "How does text get converted to binary?",
              answer: "The computer uses an encoding standard like ASCII or UTF-8. Each character (like 'A') is assigned a specific number (65). That number is then converted from our usual base-10 system into the base-2 binary system (01000001).",
            },
            {
              question: "What is a bit and what is a byte?",
              answer: "A 'bit' is the smallest unit of data in computing, representing a single 0 or 1. A 'byte' is a group of 8 bits. In the context of text conversion, one character usually corresponds to one or more bytes.",
            },
            {
              question: "Why does my binary output have spaces?",
              answer: "Spaces are typically added between bytes (every 8 bits) to make the binary string human-readable. Without spaces, a long string of 0s and 1s would be extremely difficult to analyze or debug.",
            },
            {
              question: "Does binary encoding provide any security?",
              answer: "No. Binary is a representation of data, not a form of encryption. Anyone can convert binary back to text instantly. It is used for computer compatibility, not for hiding secrets.",
            },
            {
              question: "Can I convert non-English characters to binary?",
              answer: "Yes. Our tool uses UTF-8 encoding, which supports all Unicode characters including emojis and international scripts. These characters may take up more than 8 bits (multiple bytes) in the binary output.",
            },
          ],
        };
      }
      if (tool.slug === "convert-hex-encoder-decoder") {
        return {
          heading: "Hexadecimal Encoding: The Language of Systems",
          paragraphs: [
            "Hexadecimal (or 'Hex') is a base-16 positional numeral system. It uses sixteen distinct symbols: numbers `0-9` and letters `A-F`. Hex is widely used by programmers because it provides a human-friendly representation of original binary code.",
            "In computing, one hexadecimal digit represents exactly four bits (half a byte). This means a full 8-bit byte can be represented by exactly two hex digits (ranging from `00` to `FF`), making it much easier to read and communicate than long strings of binary ones and zeroes.",
            "Our Hex Encoder/Decoder is an essential utility for developers working in web design, cybersecurity, and data analysis. It allows you to convert plain text into Hex byte sequences and decode those sequences back into readable characters using standard UTF-8 mapping.",
            "Common applications for Hex include defining colors in CSS (hex codes), representing memory addresses in debugging, inspecting data packets in network security, and encoding special characters that might otherwise cause issues in certain protocols.",
            "Privacy is our priority. This tool performs all hexadecimal transformations entirely within your browser's local sandbox. Your data is processed instantly on your device and is never sent to a remote server, ensuring your sensitive development data stays private.",
          ],
          faqs: [
            {
              question: "What is Hexadecimal used for?",
              answer: "Hex is used to simplify how humans read binary data. Because 2 hex characters represent 1 byte, it is the standard for showing memory addresses, color codes (like #FFFFFF), and file contents (hex dumps).",
            },
            {
              question: "How do I read a Hex byte?",
              answer: "Each pair of hex digits represents one 8-bit byte. For example, the Hex value '41' represents the number 65, which corresponds to the capital letter 'A' in the ASCII table.",
            },
            {
              question: "Does Hex case-sensitivity matter?",
              answer: "Generally, no. `A-F` and `a-f` refer to the same values (10-15). Our tool can decode both uppercase and lowercase hexadecimal strings reliably.",
            },
            {
              question: "Why are there different prefixes (like 0x)?",
              answer: "Prefixes like `0x` or `#` tell programming languages or styling systems that the number following them is in Base-16 rather than Base-10.",
            },
            {
              question: "Is hexadecimal encryption?",
              answer: "No. Hex is an encoding method, not encryption. It only changes how data is written, not who can read it. Anyone can decode hex instantly without a key.",
            },
          ],
        };
      }

      if (tool.slug === "convert-octal-encoder-decoder") {
        return {
          heading: "Exploring Octal: The Base-8 Numeral System",
          paragraphs: [
            "Octal is a base-8 numeral system that uses the digits `0` to `7`. Historically, octal was widely used in computing because it could easily represent groups of three bits (since 2³ = 8). While less common today than hexadecimal, it remains an important concept in computer science history and specific system permissions.",
            "In modern systems, octal is most visibly used in Unix-like operating systems for file permissions (e.g., `chmod 755`). Each digit in the three-digit octal permission represents the read, write, and execute permissions for the owner, group, and others.",
            "This tool allows you to convert plain text into its octal representation and decode octal strings back into readable text. It maps each character to its numerical code point and then expresses that number in base-8 notation.",
            "While hexadecimal is more efficient for 8-bit bytes (which map to 2 hex digits), octal requires 3 digits to represent a single byte (up to `377` in octal). This inherent 'misalignment' with 8-bit architecture is part of why hex eventually became more popular for general debugging.",
            "Security is handled entirely client-side. All octal conversions happen locally in your browser, meaning your data never leaves your device. This makes it a safe environment for exploring low-level data representations or debugging legacy system strings.",
          ],
          faqs: [
            {
              question: "What is the Octal system used for today?",
              answer: "Octal is primarily used for setting file permissions in Unix/Linux systems (like 777 or 644) and is occasionally found in legacy mainframe systems or specialized digital displays.",
            },
            {
              question: "How many bits does one octal digit represent?",
              answer: "One octal digit represents exactly 3 bits. This was ideal for older computer architectures that used 12-bit, 24-bit, or 36-bit words (all multiples of 3).",
            },
            {
              question: "Why did Hex replace Octal for most tasks?",
              answer: "Most modern computers use 8-bit bytes. Since 8 bits map perfectly to 2 hex digits (4 bits each), Hex is a more natural fit for modern hardware than Octal (which splits bytes into 3-bit chunks).",
            },
            {
              question: "How do you identify an octal number?",
              answer: "In programming, octal numbers are often prefixed with a zero (e.g., `0755`) or a `q` or `o` suffix in older languages to distinguish them from decimal numbers.",
            },
            {
              question: "Is Octal encoding secure?",
              answer: "No. Like binary and hex, octal is just a different way of writing numbers. It provides no security and can be decoded by anyone instantly.",
            },
          ],
        };
      }

      if (tool.slug === "convert-decimal-encoder-decoder") {
        return {
          heading: "Decimal Character Encoding: User-Friendly Base-10",
          paragraphs: [
            "Decimal (base-10) is the standard system for representing numbers using ten digits: `0` through `9`. In the context of text encoding, decimal refers to the raw numerical code point assigned to each character in the ASCII or Unicode standards.",
            "Every character you see on your screen has an underlying decimal identity. For example, the space character is `32`, while the uppercase letter 'A' is `65`. These decimal values are the primary way programming languages like JavaScript (via `charCodeAt`) interact with individual characters at a numerical level.",
            "This tool provides a bridge between human-readable text and these raw decimal codes. It is particularly useful for web developers debugging HTML character entity issues or programmers who need to filter text based on specific character ranges.",
            "Using decimal representation is often the easiest way for humans to verify character data, as we are naturally wired for base-10 counting. It avoids the complexity of letters in Hex or the long, repetitive sequences found in Binary representation.",
            "Privacy and safety are guaranteed because all conversions are performed locally on your device. We never transmit your text to our servers, making this a secure choice for developers and students working with any type of character data.",
          ],
          faqs: [
            {
              question: "What are decimal character codes?",
              answer: "They are the unique base-10 numbers assigned to every character in the Unicode standard. They are often called 'Code Points' or 'ASCII values' depending on the character set.",
            },
            {
              question: "How do decimal codes relate to HTML entities?",
              answer: "HTML entities like `&#65;` use the decimal code of a character to display it. This is useful for representing symbols that might otherwise break your HTML code.",
            },
            {
              question: "What is the difference between ASCII and Unicode decimal?",
              answer: "ASCII only covers the first 127 characters. Unicode is a massive superset that covers over 140,000 characters (including emojis). However, the first 127 decimal codes are identical in both systems.",
            },
            {
              question: "Why would I use decimal instead of Hex?",
              answer: "Decimal is often more intuitive for humans because it's the system we use every day. It's simpler for quick calculations or when you're manually comparing character values in a simple script.",
            },
            {
              question: "Can I convert large numbers back to text?",
              answer: "Yes, as long as the numbers correspond to valid Unicode code points, the decoder will reconstruct the original characters accurately.",
            },
          ],
        };
      }

      if (tool.slug === "convert-punycode-encoder-decoder") {
        return {
          heading: "Mastering Punycode: Unlocking Non-ASCII Domain Names",
          paragraphs: [
            "Punycode is a specialized encoding syntax used to convert Unicode characters (like emojis or non-Latin alphabets) into an ASCII-compatible string. It was developed to allow Internationalized Domain Names (IDNs) to function within the existing Domain Name System (DNS), which only supports a limited set of ASCII characters.",
            "DNS is restricted to the letters A-Z, digits 0-9, and the hyphen. Without Punycode, a domain name like `bücher.example` or `☕.com` would be unroutable. Punycode translates these 'unsupported' characters into a string starting with the `xn--` prefix, which the DNS can understand.",
            "Our Punycode toolkit is designed for web developers, domain registrars, and system administrators. It can convert internationalized text into its Punycode equivalent (and vice versa), helping you troubleshoot domain resolution issues or prepare domains for registration.",
            "Technically, Punycode uses a 'bootstring' algorithm that separates the ASCII characters from the non-ASCII characters, encoding the latter as a sequence of integers at the end of the string. This ensures that the resulting domain name is compact and safe for the legacy internet infrastructure.",
            "Privacy is a core feature of our platform. All Punycode encoding and decoding are performed locally in your browser. Your domain names and Unicode strings are never sent to our servers, providing a secure and private debugging environment.",
          ],
          faqs: [
            {
              question: "What is the purpose of Punycode?",
              answer: "It allows the internet's naming system (DNS) to handle international characters, emojis, and symbols by converting them into a standard ASCII format that old servers can understand.",
            },
            {
              question: "What does the xn-- prefix mean?",
              answer: "The `xn--` prefix is an 'ACE' (ASCII Compatible Encoding) prefix. It tells browsers and web servers that the following string is a Punycode-encoded representation of international characters.",
            },
            {
              question: "Do I need to use Punycode for my website?",
              answer: "Only if your domain contains special characters (like ñ, ü, or characters from Arabic, Chinese, etc.). Most browsers handle the conversion automatically, but you often need the Punycode version for server config files.",
            },
            {
              question: "Is Punycode a form of compression?",
              answer: "Not traditionally. While it is efficient, its primary goal is character compatibility, ensuring that complex Unicode characters can be represented using a very small 36-character ASCII alphabet.",
            },
            {
              question: "Can Punycode be used for security attacks?",
              answer: "Yes, in a practice known as a 'Homograph Attack.' Attackers can use Punycode to create domains that look identical to a famous site (like replacing a Latin 'a' with a Cyrillic 'а'). Always check the actual Punycode to verify a site's identity.",
            },
          ],
        };
      }

      if (tool.slug === "convert-idn-encoder-decoder") {
        return {
          heading: "IDN Conversion: Bridging Global Languages and DNS",
          paragraphs: [
            "IDN (Internationalized Domain Name) conversion is the process of translating fully localized domain names into the machine-readable format required by the global internet infrastructure. It's the technology that allows the internet to be truly global, supporting scripts beyond the Latin alphabet.",
            "While Punycode handles the character-level encoding, IDN conversion involves additional steps like normalization (ensuring `é` is represented consistently) and case folding. This ensures that different ways of typing the same name always resolve to the same IP address.",
            "This tool allows you to convert between 'U-label' (the human-readable Unicode version) and 'A-label' (the ASCII Punycode version). For example, it can turn the Arabic domain `موقع.com` into its machine-safe equivalent and back.",
            "For developers and SEO specialists, understanding IDN conversion is vital for international expansion. It affects how URLs are indexed by search engines, how email headers are processed, and how SSL certificates are issued for localized websites.",
            "All processing is local. Our IDN converter runs entirely within your browser's sandbox environment. We don't log your queries or send your domain names to our server, making this the safest way to inspect and debug internationalized web addresses.",
          ],
          faqs: [
            {
              question: "What is the difference between Punycode and IDN?",
              answer: "Punycode is the specific encoding algorithm. IDN is the broader standard (IDNA) that uses Punycode along with rules for character normalization to make international domains work globally.",
            },
            {
              question: "Why do browsers sometimes show xn-- in the address bar?",
              answer: "This is a security feature to prevent identity theft. If a domain uses characters from multiple different alphabets, the browser may show the 'A-label' (Punycode) to warn you that the site might be a decoy.",
            },
            {
              question: "Does IDN affect my website's SEO?",
              answer: "Yes. Search engines can index IDNs, but it's important to use the correct canonical tags and ensure your server handles both the Unicode and Punycode versions correctly to avoid duplicate content issues.",
            },
            {
              question: "Can I use emojis in domain names?",
              answer: "Yes. Emojis are Unicode characters and can be converted to Punycode just like letters. However, not all top-level domains (like .com or .org) allow emoji registrations.",
            },
            {
              question: "Is IDN conversion safe to use online?",
              answer: "Our tool is 100% private because it runs locally. Other online converters might log your domains; we ensure all processing stays on your device.",
            },
          ],
        };
      }

      if (tool.slug === "convert-rot47-encoder-decoder") {
        return {
          heading: "ROT47: The Expanded Substitution Cipher",
          paragraphs: [
            "ROT47 is a derivative of the ROT13 cipher that increases the number of characters it can obfuscate. While ROT13 only affects alphabetic letters (A-Z), ROT47 shifts all printable ASCII characters (except space), including numbers, symbols, and punctuation marks.",
            "The shift is 47 positions, which is exactly half of the 94 printable characters available in the ASCII set (from `!` at position 33 to `~` at position 126). This makes ROT47, like its predecessor, self-reciprocal—applying the cipher twice returns the original text.",
            "Since ROT47 includes numbers and symbols, it produces a much more scrambled and 'glitched' appearance than ROT13. It is commonly used for light obfuscation of email addresses, URLs, or segments of code where you want to prevent automated scraping or accidental reading by humans.",
            "It is important to remember that **ROT47 is not encryption**. It provides zero cryptographic security. Its primary purpose is to make text unreadable at a glance, similar to flipping a book upside down. It should never be used for sensitive data, passwords, or private communications.",
            "Our ROT47 tool runs entirely on your local machine. No text is ever transmitted to our servers, ensuring your obfuscated snippets remain private. It’s a fast, secure way to smudge text for forums, documentation, or simple development puzzles.",
          ],
          faqs: [
            {
              question: "How does ROT47 differ from ROT13?",
              answer: "ROT13 only shifts the 26 letters of the alphabet. ROT47 shifts 94 characters, including numbers (0-9) and all common symbols (!, @, #, etc.), making it more comprehensive for obfuscating complex strings like URLs.",
            },
            {
              question: "What is the shift value in ROT47?",
              answer: "The shift value is 47 positions. Since the ASCII printable character range is 94 characters wide, shifting by 47 (half) makes the process self-reversible.",
            },
            {
              question: "Does ROT47 affect spaces?",
              answer: "No. According to the standard implementation, the space character (ASCII 32) is left unchanged. Only characters in the range 33 (!) to 126 (~) are rotated.",
            },
            {
              question: "Is ROT47 secure for passwords?",
              answer: "No. ROT47 is a simple substitution cipher. It is extremely easy to reverse and provides no real protection against anyone who wants to read the data.",
            },
            {
              question: "Why is it called ROT47?",
              answer: "The name stands for 'Rotate by 47'. It refers to the character shift applied to each printable symbol to reach its obfuscated counterpart.",
            },
          ],
        };
      }

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
      if (tool.slug === "convert-json-converter") {
        return {
          heading: "JSON Converter: The Industry Standard for Data Interchange",
          paragraphs: [
            "JSON (JavaScript Object Notation) has become the de-facto standard for exchanging data on the modern web. Its popularity stems from its lightweight nature and the ease with which it can be read by both humans and machines. Whether you're working with REST APIs, configuration files, or NoSQL databases, JSON is likely the format you encounter most.",
            "Our Universal JSON Converter is designed to solve the common challenge of moving data between different systems. It allows you to transform complex, nested JSON objects into structured formats like CSV for spreadsheets, YAML for configuration, or XML for legacy enterprise systems. It also includes a robust validator to ensure your source JSON is perfectly formed before conversion.",
            "When converting JSON to tabular formats like CSV, our tool intelligently flattens nested objects. It uses a dot-notation naming convention (e.g., `user.address.city`) to preserve the hierarchy while ensuring the data fits into a standard rows-and-columns layout that tools like Excel can process.",
            "Choosing the right destination format is key. CSV is best for data analysis and reporting; YAML is ideal for human-readable configuration files; and XML provides a strict, schema-compliant structure often required by older business applications. This tool gives you the flexibility to switch between all of them instantly.",
            "Privacy is paramount for developer tools. This JSON converter operates entirely within your browser's local context. Your data—including sensitive API responses or configuration snippets—is never uploaded to any server. You get professional-grade conversion with the safety of absolute data sovereignty.",
          ],
          faqs: [
            {
              question: "What makes JSON different from other formats?",
              answer: "JSON is specifically designed for data interchange. Unlike XML, it has a very low overhead and map directly to the data structures used in most programming languages (objects and arrays).",
            },
            {
              question: "How does the tool handle nested JSON when converting to CSV?",
              answer: "Since CSV is a flat format, the tool 'flattens' your data. Nested properties are joined with dots. For example, `{ 'a': { 'b': 1 } }` becomes a CSV column titled 'a.b' with the value 1.",
            },
            {
              question: "Can this tool fix invalid JSON?",
              answer: "While it can't automatically rewrite your code, the built-in validator will pinpoint exactly where the syntax error is (like a missing comma or bracket), making it much easier for you to fix manually.",
            },
            {
              question: "Is there a limit to how much JSON I can convert?",
              answer: "The limit is generally determined by your browser's memory. For most standard data files (up to several megabytes), the conversion will be near-instant.",
            },
            {
              question: "Is my JSON data kept private?",
              answer: "Yes. All processing is 100% local. We do not store, log, or transmit any of the data you paste into the converter.",
            },
          ],
        };
      }
      if (tool.slug === "convert-csv-converter") {
        return {
          heading: "CSV Converter: Transforming Spreadsheets to Code",
          paragraphs: [
            "CSV (Comma-Separated Values) is the universal language of spreadsheets and databases. While it is incredibly efficient for storing large amounts of tabular data, it lacks the structural flexibility required by modern web applications and APIs that depend on JSON or XML.",
            "Our professional CSV Converter bridges the gap between data analysis and software development. It allows you to transform flat CSV rows into rich JSON objects or hierarchical XML tags instantly. This is the perfect tool for developers importing legacy spreadsheet data into modern databases.",
            "A common challenge with CSV is handling special characters and formatting. Our converter uses a robust parsing engine that respects double quotes and line breaks within cells, ensuring that your data remains intact and accurate during the transformation process.",
            "Whether you're converting a financial report for a web dashboard or preparing a product catalog for an e-commerce platform, this tool provides the configuration you need. It handles headers automatically and produces clean, minified or indented output based on your requirements.",
            "Security is built-in. Your CSV data never leaves your computer. By performing all parsing and stringify operations locally in the browser, we ensure that sensitive business data and personal spreadsheets stay private and protected.",
          ],
          faqs: [
            {
              question: "How does the tool identify the first row as headers?",
              answer: "The converter automatically assumes the first row of your CSV contains header names (like 'Name', 'Email', etc.) and uses them as the keys in the resulting JSON or XML structure.",
            },
            {
              question: "Can it handle large CSV files?",
              answer: "Yes, it can handle files with thousands of rows. Since it runs in the browser, the speed depends on your device's memory and CPU, but it is typically much faster than server-side alternatives.",
            },
            {
              question: "What if my CSV uses semicolons or tabs instead of commas?",
              answer: "Our parser is designed to auto-detect delimiters. It effectively handles standard Comma-Separated, Semicolon-Separated, and Tab-Separated (TSV) formats.",
            },
            {
              question: "Why should I convert CSV to JSON?",
              answer: "JSON is the standard format for web development. Converting your CSV allows you to easily map your spreadsheet data to JavaScript objects for use in apps, websites, and APIs.",
            },
            {
              question: "Is my data safe with this converter?",
              answer: "Absolutely. Everything happens on your local machine. We do not transmit or store your CSV content on our servers.",
            },
          ],
        };
      }

      if (tool.slug === "convert-xml-converter") {
        return {
          heading: "XML Converter: Simplifying Structured Markup",
          paragraphs: [
            "XML (Extensible Markup Language) is a versatile format used throughout enterprise computing for everything from SOAP APIs to complex document storage. While powerful, its verbose syntax can be difficult to manage in modern web environments that prefer JSON or YAML.",
            "Our XML Converter provides a streamlined way to extract data from markup into more flexible formats. It maps XML nodes and attributes into a clean hierarchical structure, making it easy to see the logical relationships in your data without the clutter of closing tags.",
            "Transforming XML to JSON or CSV is often the first step in a data migration project. This tool handles common XML complexities, including attribute prefixes and text nodes, ensuring that the generated output reflects the semantic meaning of human-authored or system-generated XML.",
            "Whether you're a system administrator debugging config files or a developer integrating with a legacy SOAP service, this tool saves time. It includes an integrated parser that validates your XML on-the-fly, helping you catch syntax errors before they break your workflow.",
            "Your XML data remains private. We treat your markup as sensitive data, performing all transformations inside your browser's local sandbox. No data is sent to external servers, giving you a fast, reliable, and secure way to handle enterprise data.",
          ],
          faqs: [
            {
              question: "How are XML attributes handled during conversion?",
              answer: "Attributes are typically converted into properties with a specific prefix (like '@_') in the resulting JSON, ensuring they are distinct from child element tags.",
            },
            {
              question: "Does this tool support CDATA sections?",
              answer: "Yes. The converter correctly identifies and extracts text from CDATA segments, treating them as string values in the output format.",
            },
            {
              question: "Why convert XML to JSON?",
              answer: "JSON is less verbose than XML and much easier to traverse in JavaScript and other modern programming languages, leading to smaller file sizes and easier coding.",
            },
            {
              question: "Can I convert XML to a spreadsheet format like CSV?",
              answer: "Yes. The tool will attempt to flatten the XML hierarchy into rows. This works best for XML files that represent lists of redundant objects with similar structures.",
            },
            {
              question: "Is there an XML size limit?",
              answer: "Only what your browser's memory can handle. Most XML files (up to several MB) will be converted almost instantly.",
            },
          ],
        };
      }

      if (tool.slug === "convert-yaml-converter") {
        return {
          heading: "YAML Converter: Human-Readable Configs Made Portable",
          paragraphs: [
            "YAML (YAML Ain't Markup Language) is the preferred format for configuration files, from Docker and Kubernetes to CI/CD pipelines. Its clean, indentation-based syntax makes it incredibly easy for humans to read and write, but most machine systems require JSON or XML for processing.",
            "This Universal YAML Converter allows you to bridge the gap between human-centric configuration and machine-centric data formats. It accurately translates YAML's specific features—like block scalars, sequences, and mappings—into standard JSON or XML structures.",
            "Indentation is the most common pitfall in YAML. This tool's integrated validator helps you identify whitespace errors and tab characters that often break YAML parsers. It provides immediate feedback, so you can fix your config files before deploying them to production.",
            "Whether you're converting a `docker-compose.yml` to inspect its structure as JSON or transforming a static site configuration for an API call, this converter provides the precision you need. It handles complex data types including booleans, numbers, and null values with total accuracy.",
            "Privacy and speed are our core focus. All YAML processing happens locally in your browser. We don't log your files or send your configurations to our servers, keeping your sensitive environment variables and server settings safe and private.",
          ],
          faqs: [
            {
              question: "Is YAML better than JSON?",
              answer: "YAML is better for human readability and hand-writing configuration files. JSON is better for data interchange between computers because it is stricter and faster to parse.",
            },
            {
              question: "Can this tool handle multi-document YAML files?",
              answer: "It is optimized for single-document structures common in standard APIs and configs. If you have a multi-doc file (separated by `---`), we recommend converting one document at a time.",
            },
            {
              question: "How do I fix 'mapping values are not allowed here' errors?",
              answer: "This is usually caused by inconsistent spacing or using tabs instead of spaces. Use our tool to find the line number, and replace tabs with two-space increments.",
            },
            {
              question: "Does YAML conversion preserve comments?",
              answer: "No. When converting to JSON or XML, comments are stripped because those formats (specifically JSON) do not officially support comments.",
            },
            {
              question: "Is my data private?",
              answer: "Yes. The conversion is entirely client-side. No data is sent to our servers.",
            },
          ],
        };
      }

      if (tool.slug === "convert-markdown-html-converter") {
        return {
          heading: "Markdown & HTML: The Perfect Content Bridge",
          paragraphs: [
            "Modern content creation often happens in two worlds: the clean, readable world of Markdown and the powerful, structured world of HTML. Markdown is for writing; HTML is for the web. Being able to switch between them effortlessly is essential for writers, developers, and SEO professionals.",
            "Our Markdown & HTML Converter is a high-performance tool that turns clean Markdown syntax into valid, standards-compliant HTML markup instantly. It also works in reverse, allowing you to paste HTML code and get back a clean, readable Markdown file—perfect for migrating blog posts or cleaning up messy web content.",
            "The converter supports GitHub Flavored Markdown (GFM), including features like tables, task lists, and strikethroughs. When converting from HTML, it uses a smart heuristic to remove unnecessary boilerplate tags while preserving important elements like headers, links, and bold text.",
            "Whether you're a developer preparing documentation or a content manager cleaning up imported CMS data, this tool provides a fast, reliable solution. It saves you the trouble of manual reformatting and ensures that your output is always valid and consistent.",
            "Privacy is a standard feature. All Markdown and HTML processing is done locally in your browser. Your text is never sent to a server, providing a secure space to draft, clean, and convert your professional content.",
          ],
          faqs: [
            {
              question: "Does this support GitHub Flavored Markdown?",
              answer: "Yes. It supports tables, task lists, and auto-links, ensuring your content looks the same as it does on platforms like GitHub or GitLab.",
            },
            {
              question: "How do I turn a website into Markdown?",
              answer: "Simply copy the HTML source code of the section you want and paste it here. Our tool will strip away the tags and give you the Markdown equivalent.",
            },
            {
              question: "Is there any data loss when converting to Markdown?",
              answer: "Markdown is simpler than HTML, so complex CSS styles and scripts will be ignored. However, the core content and structure (headings, bold, lists, links) will be accurately preserved.",
            },
            {
              question: "Why use Markdown instead of HTML?",
              answer: "Markdown is much easier for humans to read and write. It's less cluttered than HTML and handles things like focus on content much better than a code-heavy editor.",
            },
            {
              question: "Is my content private?",
              answer: "100%. Everything happens on your device. We never see your text.",
            },
          ],
        };
      }

      return {
        heading: `How the ${tool.name} works`,
        paragraphs: [
          `${tool.description} Data format conversion is one of the most common tasks in software development, data analysis, and content operations — different tools, APIs, and systems use different formats, and converting between them is a constant need.`,
          "This tool handles the conversion in your browser without sending your data to any server. This makes it safe to use with sensitive content such as data schemas, configuration snippets, and private datasets that you need to transform for your next project.",
          "Understanding the strengths of each format is important. JSON is for web APIs; CSV is for spreadsheets; YAML is for configuration; and XML is for enterprise documentation. Our tools provide a seamless way to move between these formats while preserving the data integrity you rely on.",
        ],
        faqs: [
          {
            question: `What is ${tool.name} used for?`,
            answer: `${tool.description} This type of conversion is commonly needed when moving data between different systems, preparing files for analysis, or simply transforming data to match the requirements of a specific programming language or tool.`,
          },
          {
            question: "Is my data sent to a server?",
            answer: "No. All conversion operations happen locally in your browser. Your data never leaves your device, making it safe for private and development data.",
          },
          {
            question: "Will the conversion handle big data?",
            answer: "The tool works efficiently with data files up to several megabytes. For extremely large datasets, your browser's memory and processor speed will determine the performance.",
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
