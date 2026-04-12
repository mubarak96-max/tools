import type { CharacterCounterProps } from "@/app/text/character-counter/components/CharacterCounter";

export const VARIANT_TOOL_PRESETS: Record<string, Partial<CharacterCounterProps>> = {
  default: {
    placeholder: "Paste or type text to count words, characters, sentences, paragraphs, and reading time.",
    guideTitle: "How to use the count",
    guideBody:
      "Use words for draft scope, characters for strict field limits, and reading time when you are pacing sections for readers.",
  },
  essay: {
    emphasizeMetric: "words",
    placeholder: "Paste your essay or outline to track word count, paragraphs, and estimated reading time.",
    guideTitle: "Stay inside the assignment box",
    guideBody:
      "Compare the live word total with your rubric, then use sentences and paragraphs to check whether ideas are grouped cleanly before you revise.",
  },
  seo: {
    emphasizeMetric: "characters",
    placeholder: "Paste a meta title, description, or SERP snippet draft to check character limits and word flow.",
    guideTitle: "Length that fits search results",
    guideBody:
      "Titles and meta descriptions truncate in search. Watch the character total first, then glance at words to keep phrasing tight.",
  },
  students: {
    emphasizeMetric: "words",
    placeholder: "Paste a homework draft, short response, or reflection to verify word count before submitting.",
    guideTitle: "Check length before you turn it in",
    guideBody:
      "Use the word total against your instructions, then scan sentences and paragraphs to see if any section runs long.",
  },
  limit: {
    emphasizeMetric: "words",
    guideTitle: "Track progress toward your target",
    guideBody:
      "The bar compares your current words with the goal. Adjust quotes or examples if you are far over, or develop key points if you are short.",
  },
  reading: {
    emphasizeMetric: "reading",
    placeholder: "Paste an article, newsletter, or script to estimate how long it takes an average reader to finish.",
    guideTitle: "Reading time from live text",
    guideBody:
      "Reading time is an estimate based on words per minute. Pair it with paragraph count when you are pacing speeches or long-form posts.",
  },
  characters: {
    emphasizeMetric: "charactersNoSpaces",
    placeholder: "Paste captions, bios, or ad copy where platforms count characters without spaces.",
    guideTitle: "When character totals matter most",
    guideBody:
      "Some systems exclude spaces from limits. Use characters without spaces alongside the full character count to avoid surprises.",
  },
  sentences: {
    emphasizeMetric: "sentences",
    placeholder: "Paste body copy to count sentences and see whether rhythm feels steady or choppy.",
    guideTitle: "Sentence count as a structure signal",
    guideBody:
      "A high sentence count in a short word total can mean many short sentences; a low count can mean long blocks that may need splitting.",
  },
  paragraphs: {
    emphasizeMetric: "paragraphs",
    placeholder: "Paste a draft to see how many paragraph breaks you are using and whether sections feel balanced.",
    guideTitle: "Paragraphs and visual density",
    guideBody:
      "Online readers skim. Paragraph count helps you spot walls of text before you add headings or break ideas apart.",
  },
  task: {
    emphasizeMetric: "words",
    placeholder: "Paste any text block to measure length, limits, and reading time in one pass.",
    guideTitle: "One paste, every length signal",
    guideBody:
      "Whether you are trimming an essay or checking a form field, the same stats update instantly as you edit.",
  },
  info: {
    emphasizeMetric: "words",
    placeholder: "Paste sample text to compare its word count with the estimates described above.",
    guideTitle: "Connect the estimate to your draft",
    guideBody:
      "Rules of thumb vary by language and formatting. Use the counter on your real text whenever precision matters.",
  },
  audience: {
    emphasizeMetric: "words",
    placeholder: "Paste your working draft to see words, characters, sentences, paragraphs, and reading time.",
    guideTitle: "Shape the draft before the deadline",
    guideBody:
      "Start from the word total your brief requires, then use sentences and paragraphs to check pacing before line edits.",
  },
};
