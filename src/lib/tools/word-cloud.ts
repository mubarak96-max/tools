export interface WordCloudItem {
  word: string;
  count: number;
  weight: number;
}

export interface WordCloudOptions {
  maxWords?: number;
  minLength?: number;
  ignoreStopWords?: boolean;
}

export interface WordCloudResult {
  items: WordCloudItem[];
  totalWords: number;
  uniqueWords: number;
  topWord: string | null;
  topCount: number;
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "if",
  "in",
  "into",
  "is",
  "it",
  "no",
  "not",
  "of",
  "on",
  "or",
  "such",
  "that",
  "the",
  "their",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "was",
  "will",
  "with",
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export function generateWordCloud(text: string, options: WordCloudOptions = {}): WordCloudResult {
  const minLength = Math.max(1, Math.floor(options.minLength ?? 3));
  const maxWords = Math.max(1, Math.floor(options.maxWords ?? 40));

  let words = tokenize(text);

  if (options.ignoreStopWords !== false) {
    words = words.filter((word) => !STOP_WORDS.has(word));
  }

  words = words.filter((word) => word.length >= minLength);

  const counts = new Map<string, number>();

  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  const ranked = Array.from(counts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((left, right) => right.count - left.count || left.word.localeCompare(right.word))
    .slice(0, maxWords);

  const maxCount = ranked[0]?.count ?? 1;
  const minCount = ranked[ranked.length - 1]?.count ?? 1;
  const spread = Math.max(1, maxCount - minCount);

  return {
    items: ranked.map((item) => ({
      ...item,
      weight: 0.35 + ((item.count - minCount) / spread) * 0.65,
    })),
    totalWords: words.length,
    uniqueWords: counts.size,
    topWord: ranked[0]?.word ?? null,
    topCount: ranked[0]?.count ?? 0,
  };
}
